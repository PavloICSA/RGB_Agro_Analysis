// Archive Database Manager
// Handles displaying, filtering, sorting, and exporting analysis results

class ArchiveManager {
    constructor() {
        this.currentPage = 1;
        this.recordsPerPage = 10;
        this.allRecords = [];
        this.filteredRecords = [];
        this.sortColumn = 'analysis_date';
        this.sortDirection = 'DESC';
        this.supabase = window.supabaseClient;
        this.pendingDeleteId = null;
        this.selectedRecordIds = new Set();
        this.isBulkDeleteMode = false;
    }

    /**
     * Open archive modal and load user's analysis records
     */
    async openArchive() {
        const archiveModal = document.getElementById('archiveModal');
        if (!archiveModal) return;

        // Check if user is logged in
        if (!authManager || !authManager.currentUser) {
            alert('You must be logged in to view your archive.');
            return;
        }

        // Additional check: verify user session is still active in Supabase
        try {
            const { data: { session } } = await this.supabase.auth.getSession();
            if (!session) {
                alert('Your session has expired. Please log in again.');
                return;
            }
        } catch (error) {
            console.error('Error verifying session:', error);
            alert('Unable to verify your session. Please refresh and try again.');
            return;
        }

        archiveModal.classList.remove('hidden');
        console.log('Opening archive for user:', authManager.currentUser.id);
        try {
            await this.loadRecords();
        } catch (error) {
            console.error('Error in openArchive:', error);
            this.showError('Failed to load archive');
        }
    }

    /**
     * Close archive modal
     */
    closeArchive() {
        const archiveModal = document.getElementById('archiveModal');
        if (archiveModal) {
            archiveModal.classList.add('hidden');
        }
        this.currentPage = 1;
    }

    /**
     * Load all records from database for current user
     */
    async loadRecords() {
        try {
            // Verify supabase is available
            if (!this.supabase) {
                throw new Error('Supabase client not initialized');
            }

            // Verify user is available
            if (!authManager || !authManager.currentUser) {
                throw new Error('User not authenticated');
            }

            console.log('Loading records for user:', authManager.currentUser.id);

            const { data, error } = await this.supabase
                .from('analysis_results')
                .select('*')
                .eq('user_id', authManager.currentUser.id)
                .order('analysis_date', { ascending: false });

            if (error) {
                console.error('Error loading records:', error);
                this.showError(`Failed to load records: ${error.message}`);
                return;
            }

            console.log('Records loaded:', data ? data.length : 0);

            this.allRecords = data || [];
            this.filteredRecords = [...this.allRecords];
            this.currentPage = 1;
            this.updateStats();
            this.renderTable();
            this.setupEventListeners();
        } catch (error) {
            console.error('Unexpected error loading records:', error);
            this.showError(`An error occurred: ${error.message}`);
        }
    }

    /**
     * Setup search and filter event listeners
     */
    setupEventListeners() {
        const searchInput = document.getElementById('archiveSearch');
        const filterSelect = document.getElementById('archiveFilterIndex');
        const tableBody = document.getElementById('archiveTableBody');

        if (searchInput) {
            searchInput.removeEventListener('input', this.handleSearch);
            searchInput.addEventListener('input', this.handleSearch.bind(this));
        }

        if (filterSelect) {
            filterSelect.removeEventListener('change', this.handleFilter);
            filterSelect.addEventListener('change', this.handleFilter.bind(this));
        }

        // Event delegation for delete buttons
        if (tableBody) {
            tableBody.removeEventListener('click', this.handleTableClick);
            tableBody.addEventListener('click', this.handleTableClick.bind(this));
        }
    }

    /**
     * Handle table click events (delete button)
     */
    handleTableClick(event) {
        if (event.target.classList.contains('delete-btn')) {
            const recordId = event.target.getAttribute('data-record-id');
            if (recordId) {
                this.deleteRecord(recordId);
            }
        }
    }

    /**
     * Handle search input
     */
    handleSearch(event) {
        const searchTerm = event.target.value.toLowerCase();
        this.currentPage = 1;
        this.applyFilters(searchTerm);
    }

    /**
     * Handle filter selection
     */
    handleFilter(event) {
        const searchInput = document.getElementById('archiveSearch');
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        this.currentPage = 1;
        this.applyFilters(searchTerm);
    }

    /**
     * Apply both search and index filter
     */
    applyFilters(searchTerm) {
        const selectedIndex = document.getElementById('archiveFilterIndex').value;

        this.filteredRecords = this.allRecords.filter(record => {
            const matchesSearch = !searchTerm ||
                record.field_group.toLowerCase().includes(searchTerm) ||
                record.index_name.toLowerCase().includes(searchTerm);

            const matchesIndex = !selectedIndex || record.index_name === selectedIndex;

            return matchesSearch && matchesIndex;
        });

        // Pendo Track Event: archive_search_executed
        if (typeof pendo !== 'undefined') {
            pendo.track('archive_search_executed', {
                search_term: (searchTerm || '').substring(0, 100),
                selected_index_filter: selectedIndex || 'all',
                results_count: this.filteredRecords.length,
                total_records_count: this.allRecords.length
            });
        }

        this.renderTable();
    }

    /**
     * Sort records by column
     */
    sortBy(column) {
        if (this.sortColumn === column) {
            this.sortDirection = this.sortDirection === 'ASC' ? 'DESC' : 'ASC';
        } else {
            this.sortColumn = column;
            this.sortDirection = 'ASC';
        }

        this.filteredRecords.sort((a, b) => {
            let aVal = a[column];
            let bVal = b[column];

            // Handle numeric values
            if (column === 'index_value') {
                aVal = parseFloat(aVal);
                bVal = parseFloat(bVal);
            }

            // Handle dates
            if (column === 'analysis_date') {
                aVal = new Date(aVal);
                bVal = new Date(bVal);
            }

            if (aVal < bVal) return this.sortDirection === 'ASC' ? -1 : 1;
            if (aVal > bVal) return this.sortDirection === 'ASC' ? 1 : -1;
            return 0;
        });

        this.currentPage = 1;
        this.renderTable();
    }

    /**
     * Render table with current page of records
     */
    renderTable() {
        const tableBody = document.getElementById('archiveTableBody');
        const emptyState = document.getElementById('archiveEmptyState');
        const selectAllCheckbox = document.getElementById('archiveSelectAll');

        if (!tableBody) return;

        // Clear table
        tableBody.innerHTML = '';

        if (this.filteredRecords.length === 0) {
            emptyState.classList.remove('hidden');
            this.updatePagination();
            this.updateBulkToolbar();
            return;
        }

        emptyState.classList.add('hidden');

        // Calculate pagination
        const totalPages = Math.ceil(this.filteredRecords.length / this.recordsPerPage);
        const startIndex = (this.currentPage - 1) * this.recordsPerPage;
        const endIndex = Math.min(startIndex + this.recordsPerPage, this.filteredRecords.length);
        const pageRecords = this.filteredRecords.slice(startIndex, endIndex);

        // Render rows
        pageRecords.forEach((record, index) => {
            const row = document.createElement('tr');
            row.className = index % 2 === 0 ? 'row-even' : 'row-odd';
            
            // Use localized date formatting
            const dateStr = new Date(record.analysis_date).toLocaleDateString(
                i18n.currentLanguage === 'uk' ? 'uk-UA' : 'en-US'
            );
            const valueStr = parseFloat(record.index_value).toFixed(5);
            const isChecked = this.selectedRecordIds.has(record.id) ? 'checked' : '';

            row.innerHTML = `
                <td class="checkbox-column"><input type="checkbox" class="record-checkbox" data-record-id="${record.id}" ${isChecked}></td>
                <td class="cell-field">${this.escapeHtml(record.field_group)}</td>
                <td class="cell-date">${dateStr}</td>
                <td class="cell-index">${this.escapeHtml(record.index_name)}</td>
                <td class="cell-value">${valueStr}</td>
                <td class="cell-actions">
                    <button class="btn-action delete-btn" data-record-id="${record.id}" title="${i18n.get('deleteRecord')}">🗑️</button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        // Setup checkbox event listeners
        this.setupCheckboxListeners();
        
        // Update select-all checkbox state
        const allPageCheckboxes = tableBody.querySelectorAll('.record-checkbox');
        const checkedCount = Array.from(allPageCheckboxes).filter(cb => cb.checked).length;
        if (selectAllCheckbox) {
            selectAllCheckbox.checked = checkedCount === allPageCheckboxes.length && allPageCheckboxes.length > 0;
        }

        this.updatePagination();
        this.updateBulkToolbar();
    }

    /**
     * Setup checkbox event listeners for bulk selection
     */
    setupCheckboxListeners() {
        const tableBody = document.getElementById('archiveTableBody');
        if (!tableBody) return;

        const checkboxes = tableBody.querySelectorAll('.record-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const recordId = e.target.getAttribute('data-record-id');
                if (e.target.checked) {
                    this.selectedRecordIds.add(recordId);
                } else {
                    this.selectedRecordIds.delete(recordId);
                }
                this.updateBulkToolbar();
            });
        });
    }

    /**
     * Toggle select all checkboxes on current page
     */
    toggleSelectAll() {
        const selectAllCheckbox = document.getElementById('archiveSelectAll');
        const tableBody = document.getElementById('archiveTableBody');
        
        if (!tableBody) return;

        const checkboxes = tableBody.querySelectorAll('.record-checkbox');
        
        checkboxes.forEach(checkbox => {
            const recordId = checkbox.getAttribute('data-record-id');
            if (selectAllCheckbox.checked) {
                checkbox.checked = true;
                this.selectedRecordIds.add(recordId);
            } else {
                checkbox.checked = false;
                this.selectedRecordIds.delete(recordId);
            }
        });

        this.updateBulkToolbar();
    }

    /**
     * Clear all selections
     */
    clearAllSelections() {
        this.selectedRecordIds.clear();
        const selectAllCheckbox = document.getElementById('archiveSelectAll');
        if (selectAllCheckbox) {
            selectAllCheckbox.checked = false;
        }
        this.renderTable();
    }

    /**
     * Update bulk operations toolbar visibility and state
     */
    updateBulkToolbar() {
        const toolbar = document.getElementById('bulkOperationsToolbar');
        const countBadge = document.getElementById('bulkSelectionCount');
        
        if (!toolbar || !countBadge) return;

        const selectionCount = this.selectedRecordIds.size;
        
        if (selectionCount > 0) {
            toolbar.classList.remove('hidden');
            countBadge.textContent = selectionCount;
        } else {
            toolbar.classList.add('hidden');
        }
    }

    /**
     * Update pagination controls
     */
    updatePagination() {
        const totalPages = Math.ceil(this.filteredRecords.length / this.recordsPerPage);
        const pageInfo = document.getElementById('archivePageInfo');
        const prevBtn = document.getElementById('archivePrevBtn');
        const nextBtn = document.getElementById('archiveNextBtn');

        if (pageInfo) {
            pageInfo.textContent = `${i18n.get('page')} ${this.currentPage} ${i18n.currentLanguage === 'en' ? 'of' : 'з'} ${totalPages || 1}`;
        }

        if (prevBtn) {
            prevBtn.disabled = this.currentPage <= 1;
        }

        if (nextBtn) {
            nextBtn.disabled = this.currentPage >= totalPages;
        }
    }

    /**
     * Go to previous page
     */
    previousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.renderTable();
        }
    }

    /**
     * Go to next page
     */
    nextPage() {
        const totalPages = Math.ceil(this.filteredRecords.length / this.recordsPerPage);
        if (this.currentPage < totalPages) {
            this.currentPage++;
            this.renderTable();
        }
    }

    /**
     * Update archive statistics
     */
    updateStats() {
        const recordCount = document.getElementById('archiveRecordCount');
        const dateRange = document.getElementById('archiveDateRange');

        if (this.allRecords.length === 0) {
            if (recordCount) recordCount.textContent = '0';
            if (dateRange) dateRange.textContent = '--';
            return;
        }

        if (recordCount) recordCount.textContent = this.allRecords.length;

        // Calculate date range with proper locale
        const dates = this.allRecords.map(r => new Date(r.analysis_date)).sort((a, b) => a - b);
        const locale = i18n.currentLanguage === 'uk' ? 'uk-UA' : 'en-US';
        const minDate = dates[0].toLocaleDateString(locale);
        const maxDate = dates[dates.length - 1].toLocaleDateString(locale);

        if (dateRange) {
            const separator = i18n.currentLanguage === 'en' ? 'to' : 'по';
            dateRange.textContent = `${minDate} ${separator} ${maxDate}`;
        }
    }

    /**
     * Show delete confirmation modal
     */
    showDeleteConfirm(recordId) {
        this.pendingDeleteId = recordId;
        const modal = document.getElementById('deleteConfirmModal');
        if (modal) {
            modal.classList.remove('hidden');
        }
    }

    /**
     * Cancel delete action
     */
    cancelDelete() {
        this.pendingDeleteId = null;
        const modal = document.getElementById('deleteConfirmModal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    /**
     * Confirm and execute delete
     */
    async confirmDelete() {
        if (!this.pendingDeleteId) return;

        const recordId = this.pendingDeleteId;
        this.cancelDelete();

        try {
            const { data, error } = await this.supabase
                .from('analysis_results')
                .delete()
                .eq('id', recordId)
                .select();

            if (error) {
                console.error('Delete error:', error);
                this.showError('Failed to delete record: ' + error.message);
                return;
            }

            // Pendo Track Event: archive_record_deleted
            if (typeof pendo !== 'undefined') {
                pendo.track('archive_record_deleted', {
                    record_id: recordId,
                    remaining_records_count: this.allRecords.length - 1
                });
            }

            // Remove from local records
            this.allRecords = this.allRecords.filter(r => r.id !== recordId);
            this.filteredRecords = this.filteredRecords.filter(r => r.id !== recordId);

            // Reset to first page if needed
            const totalPages = Math.ceil(this.filteredRecords.length / this.recordsPerPage);
            if (this.currentPage > totalPages && this.currentPage > 1) {
                this.currentPage--;
            }

            this.updateStats();
            this.renderTable();
            this.showDeleteSuccess();
        } catch (error) {
            console.error('Error deleting record:', error);
            this.showError('An error occurred while deleting the record');
        }
    }

    /**
     * Show success message after deletion
     */
    showDeleteSuccess() {
        // Find a visible element to show message
        const tableBody = document.getElementById('archiveTableBody');
        if (tableBody && tableBody.parentElement) {
            const message = document.createElement('div');
            message.className = 'delete-success-message';
            message.innerText = i18n.get('recordDeleted');
            tableBody.parentElement.insertBefore(message, tableBody);
            
            setTimeout(() => {
                message.remove();
            }, 3000);
        }
    }

    /**
     * Show bulk delete confirmation modal
     */
    showBulkDeleteConfirm() {
        if (this.selectedRecordIds.size === 0) {
            alert(i18n.get('noRecordsSelectedForBulk'));
            return;
        }

        this.isBulkDeleteMode = true;
        const modal = document.getElementById('deleteConfirmModal');
        const titleEl = document.getElementById('deleteConfirmTitle');
        const messageEl = document.getElementById('deleteConfirmMessage');
        const btnEl = document.getElementById('deleteConfirmBtn');
        
        if (modal && titleEl && messageEl && btnEl) {
            titleEl.innerText = i18n.get('bulkDeleteConfirm');
            messageEl.innerText = i18n.get('bulkDeleteMessage').replace('{{count}}', this.selectedRecordIds.size);
            btnEl.innerText = i18n.get('deleteSelected');
            modal.classList.remove('hidden');
        }
    }

    /**
     * Confirm and execute bulk delete
     */
    async confirmDelete() {
        if (this.isBulkDeleteMode) {
            // Bulk delete mode
            await this.confirmBulkDelete();
            return;
        }

        // Single delete mode (existing functionality)
        if (!this.pendingDeleteId) return;

        const recordId = this.pendingDeleteId;
        this.cancelDelete();

        try {
            const { data, error } = await this.supabase
                .from('analysis_results')
                .delete()
                .eq('id', recordId)
                .select();

            if (error) {
                console.error('Delete error:', error);
                this.showError('Failed to delete record: ' + error.message);
                return;
            }

            // Pendo Track Event: archive_record_deleted
            if (typeof pendo !== 'undefined') {
                pendo.track('archive_record_deleted', {
                    record_id: recordId,
                    remaining_records_count: this.allRecords.length - 1
                });
            }

            // Remove from local records
            this.allRecords = this.allRecords.filter(r => r.id !== recordId);
            this.filteredRecords = this.filteredRecords.filter(r => r.id !== recordId);

            // Reset to first page if needed
            const totalPages = Math.ceil(this.filteredRecords.length / this.recordsPerPage);
            if (this.currentPage > totalPages && this.currentPage > 1) {
                this.currentPage--;
            }

            this.updateStats();
            this.renderTable();
            this.showDeleteSuccess();
        } catch (error) {
            console.error('Error deleting record:', error);
            this.showError('An error occurred while deleting the record');
        }
    }

    /**
     * Confirm and execute bulk delete
     */
    async confirmBulkDelete() {
        if (this.selectedRecordIds.size === 0) return;

        const recordIds = Array.from(this.selectedRecordIds);
        const deleteCount = recordIds.length;
        this.isBulkDeleteMode = false;
        this.cancelDelete();

        try {
            const { error } = await this.supabase
                .from('analysis_results')
                .delete()
                .in('id', recordIds);

            if (error) {
                console.error('Bulk delete error:', error);
                this.showError('Failed to delete records: ' + error.message);
                return;
            }

            // Pendo Track Event: bulk_records_deleted
            if (typeof pendo !== 'undefined') {
                pendo.track('bulk_records_deleted', {
                    deleted_count: deleteCount,
                    remaining_records_count: this.allRecords.length - deleteCount
                });
            }

            // Remove from local records
            this.allRecords = this.allRecords.filter(r => !recordIds.includes(r.id));
            this.filteredRecords = this.filteredRecords.filter(r => !recordIds.includes(r.id));
            this.selectedRecordIds.clear();

            // Reset to first page if needed
            const totalPages = Math.ceil(this.filteredRecords.length / this.recordsPerPage);
            if (this.currentPage > totalPages && this.currentPage > 1) {
                this.currentPage--;
            }

            this.updateStats();
            this.renderTable();
            this.showBulkDeleteSuccess(deleteCount);
        } catch (error) {
            console.error('Error deleting records:', error);
            this.showError('An error occurred while deleting the records');
        }
    }

    /**
     * Show success message after bulk deletion
     */
    showBulkDeleteSuccess(count) {
        const tableBody = document.getElementById('archiveTableBody');
        if (tableBody && tableBody.parentElement) {
            const message = document.createElement('div');
            message.className = 'delete-success-message';
            message.innerText = i18n.get('recordsDeleted').replace('{{count}}', count);
            tableBody.parentElement.insertBefore(message, tableBody);
            
            setTimeout(() => {
                message.remove();
            }, 3000);
        }
    }

    /**
     * Export selected records to CSV
     */
    bulkExportToCSV() {
        if (this.selectedRecordIds.size === 0) {
            alert(i18n.get('noRecordsSelectedForBulk'));
            return;
        }

        const recordIds = Array.from(this.selectedRecordIds);
        const selectedRecords = this.allRecords.filter(r => recordIds.includes(r.id));

        // Prepare CSV headers
        const headers = [i18n.get('fieldGroup'), i18n.get('date'), i18n.get('indexName'), i18n.get('value')];
        const csvContent = [headers.join(',')];

        // Add data rows
        const locale = i18n.currentLanguage === 'uk' ? 'uk-UA' : 'en-US';
        selectedRecords.forEach(record => {
            const row = [
                `"${record.field_group}"`,
                new Date(record.analysis_date).toLocaleDateString(locale),
                `"${record.index_name}"`,
                parseFloat(record.index_value).toFixed(5)
            ];
            csvContent.push(row.join(','));
        });

        // Create blob and download
        const csv = csvContent.join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        const timestamp = new Date().toISOString().split('T')[0];
        const exportFilename = `analysis_selected_${timestamp}.csv`;
        link.setAttribute('download', exportFilename);
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Pendo Track Event: bulk_records_exported
        if (typeof pendo !== 'undefined') {
            pendo.track('bulk_records_exported', {
                records_count: this.selectedRecordIds.size,
                export_filename: exportFilename,
                locale: i18n.currentLanguage
            });
        }
    }    /**
     * Update archive modal language when language changes
     */
    updateArchiveLanguage() {
        // Update all data-i18n elements in the archive modal
        const archiveModal = document.getElementById('archiveModal');
        if (archiveModal) {
            archiveModal.querySelectorAll('[data-i18n]').forEach(elem => {
                const key = elem.getAttribute('data-i18n');
                const translated = i18n.get(key);
                // For input placeholders
                if (elem.hasAttribute('placeholder')) {
                    elem.setAttribute('placeholder', translated);
                } else if (elem.hasAttribute('title')) {
                    elem.setAttribute('title', translated);
                } else {
                    elem.innerHTML = translated;
                }
            });
        }

        // Update stats labels
        this.updateStats();

        // Re-render table to update delete button titles with current language
        this.renderTable();
        
        // Update pagination text
        this.updatePagination();
    }

    /**
     * Delete a record from database (shows confirmation modal)
     */
    deleteRecord(recordId) {
        this.showDeleteConfirm(recordId);
    }

    /**
     * Export records to CSV
     */
    exportToCSV() {
        if (this.filteredRecords.length === 0) {
            alert(i18n.get('noRecordsExport'));
            return;
        }

        // Prepare CSV headers
        const headers = [i18n.get('fieldGroup'), i18n.get('date'), i18n.get('indexName'), i18n.get('value')];
        const csvContent = [headers.join(',')];

        // Add data rows
        const locale = i18n.currentLanguage === 'uk' ? 'uk-UA' : 'en-US';
        this.filteredRecords.forEach(record => {
            const row = [
                `"${record.field_group}"`,
                new Date(record.analysis_date).toLocaleDateString(locale),
                `"${record.index_name}"`,
                parseFloat(record.index_value).toFixed(5)
            ];
            csvContent.push(row.join(','));
        });

        // Create blob and download
        const csv = csvContent.join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        const exportFilename = `analysis_archive_${new Date().toISOString().split('T')[0]}.csv`;
        link.setAttribute('download', exportFilename);
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Pendo Track Event: archive_exported_csv
        if (typeof pendo !== 'undefined') {
            pendo.track('archive_exported_csv', {
                records_count: this.filteredRecords.length,
                export_filename: exportFilename,
                locale: i18n.currentLanguage
            });
        }
    }

    /**
     * Show error message
     */
    showError(message) {
        const tableBody = document.getElementById('archiveTableBody');
        if (tableBody) {
            tableBody.innerHTML = `<tr class="error-row"><td colspan="5">${message}</td></tr>`;
        }
    }

    /**
     * Escape HTML to prevent XSS
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Switch between tabs
     */
    switchTab(tab) {
        const browseTab = document.getElementById('browseTab');
        const analysisTab = document.getElementById('analysisTab');
        const buttons = document.querySelectorAll('.tab-button');
        
        if (tab === 'browse') {
            browseTab.classList.add('active');
            analysisTab.classList.remove('active');
            buttons[0].classList.add('active');
            buttons[1].classList.remove('active');
        } else {
            browseTab.classList.remove('active');
            analysisTab.classList.add('active');
            buttons[0].classList.remove('active');
            buttons[1].classList.add('active');
            // Safely call analysisManager if it exists
            if (typeof analysisManager !== 'undefined' && analysisManager) {
                analysisManager.updateRecordingsList();
                analysisManager.refreshStatisticsDisplay();
            }
        }
    }
}

// Initialize archive manager
let archiveManager;
let analysisManager;

// Wrapper function to safely open archive with retry
function openArchiveWithRetry() {
    if (typeof archiveManager !== 'undefined' && archiveManager) {
        archiveManager.openArchive();
    } else {
        // Wait a bit and try again
        setTimeout(openArchiveWithRetry, 100);
    }
}

// Ensure function is globally accessible for HTML onclick handlers
window.openArchiveWithRetry = openArchiveWithRetry;

document.addEventListener('DOMContentLoaded', function() {
    const checkSupabase = setInterval(() => {
        if (window.supabaseClient && authManager) {
            clearInterval(checkSupabase);
            archiveManager = new ArchiveManager();
            analysisManager = new AnalysisManager();
        }
    }, 100);
});


// Analysis Manager for Descriptive Statistics and Trend Analysis
class AnalysisManager {
    constructor() {
        this.selectedRecords = [];
        this.currentChart = null;
        this.currentStatistics = null;
        this.currentTrendData = null;
    }

    /**
     * Update list of recordings based on selected index
     */
    updateRecordingsList() {
        const selectedIndex = document.getElementById('analysisIndexFilter').value;
        const recordingsList = document.getElementById('recordingsList');
        recordingsList.innerHTML = '';

        // Clear previous selections when index changes
        this.selectedRecords = [];

        if (!archiveManager || archiveManager.allRecords.length === 0) {
            recordingsList.innerHTML = `<p style="color: #999;">${i18n.get('noRecordsAvailable')}</p>`;
            return;
        }

        // Filter records by index if selected
        const filteredRecords = selectedIndex 
            ? archiveManager.allRecords.filter(r => r.index_name === selectedIndex)
            : archiveManager.allRecords;

        if (filteredRecords.length === 0) {
            recordingsList.innerHTML = `<p style="color: #999;">${i18n.get('noRecordsForIndex')}</p>`;
            return;
        }

        // Create checkboxes for each record
        const list = document.createElement('div');
        list.className = 'checkbox-list';

        filteredRecords.sort((a, b) => new Date(a.analysis_date) - new Date(b.analysis_date)).forEach(record => {
            const label = document.createElement('label');
            label.className = 'recording-item';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'record-checkbox';
            checkbox.value = record.id;
            checkbox.checked = this.selectedRecords.includes(record.id);
            checkbox.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.selectedRecords.push(record.id);
                } else {
                    this.selectedRecords = this.selectedRecords.filter(id => id !== record.id);
                }
            });

            const dateStr = new Date(record.analysis_date).toLocaleDateString(
                i18n.currentLanguage === 'uk' ? 'uk-UA' : 'en-US'
            );
            const valueStr = parseFloat(record.index_value).toFixed(5);
            const isNegative = parseFloat(record.index_value) < 0;
            
            label.appendChild(checkbox);
            
            const fieldNameSpan = document.createElement('span');
            fieldNameSpan.className = 'field-name';
            fieldNameSpan.textContent = record.field_group;
            label.appendChild(fieldNameSpan);
            
            const fieldDateSpan = document.createElement('span');
            fieldDateSpan.className = 'field-date';
            fieldDateSpan.textContent = dateStr;
            label.appendChild(fieldDateSpan);
            
            const fieldValSpan = document.createElement('span');
            fieldValSpan.className = 'field-val' + (isNegative ? ' negative' : '');
            fieldValSpan.textContent = valueStr;
            label.appendChild(fieldValSpan);

            list.appendChild(label);
        });

        recordingsList.appendChild(list);
    }

    /**
     * Show descriptive statistics for selected recordings
     */
    showDescriptiveStatistics() {
        if (this.selectedRecords.length === 0) {
            alert(i18n.get('noRecordingsSelected'));
            return;
        }

        // Get selected records data
        const selectedData = archiveManager.allRecords.filter(r => 
            this.selectedRecords.includes(r.id)
        );

        // Extract values
        const values = selectedData.map(r => parseFloat(r.index_value)).sort((a, b) => a - b);

        // Calculate statistics
        this.currentStatistics = generateDescriptiveStatistics(values);

        // Display results
        this.displayStatisticsTable();

        // Pendo Track Event: descriptive_statistics_generated
        if (typeof pendo !== 'undefined') {
            const outlierCount = (this.currentStatistics.outliers || []).filter(o => o.isOutlier).length;
            pendo.track('descriptive_statistics_generated', {
                selected_records_count: this.selectedRecords.length,
                stat_count: this.currentStatistics.count,
                stat_mean: parseFloat(this.currentStatistics.mean.toFixed(6)),
                stat_std_dev: parseFloat(this.currentStatistics.stdDev.toFixed(6)),
                stat_cv: parseFloat(this.currentStatistics.cv.toFixed(2)),
                outlier_count: outlierCount,
                stat_r_squared: parseFloat(this.currentStatistics.rSquared.toFixed(6))
            });
        }

        // Show results section
        document.getElementById('statisticsResults').classList.remove('hidden');
        document.getElementById('trendResults').classList.add('hidden');
    }

    /**
     * Display statistics in table
     */
    displayStatisticsTable() {
        const tbody = document.getElementById('statisticsTableBody');
        tbody.innerHTML = '';

        const stats = this.currentStatistics;
        if (!stats) return;
        
        const statsToShow = [
            { key: 'count', label: i18n.get('count'), format: 'integer' },
            { key: 'mean', label: i18n.get('mean'), format: 'decimal' },
            { key: 'median', label: i18n.get('median'), format: 'decimal' },
            { key: 'min', label: i18n.get('min'), format: 'decimal' },
            { key: 'max', label: i18n.get('max'), format: 'decimal' },
            { key: 'range', label: i18n.get('range'), format: 'decimal' },
            { key: 'q1', label: i18n.get('q1'), format: 'decimal' },
            { key: 'q3', label: i18n.get('q3'), format: 'decimal' },
            { key: 'iqr', label: i18n.get('iqr'), format: 'decimal' },
            { key: 'stdDev', label: i18n.get('stdDev'), format: 'decimal' },
            { key: 'variance', label: i18n.get('variance'), format: 'decimal' },
            { key: 'cv', label: i18n.get('cv'), format: 'percent' },
            { key: 'skewness', label: i18n.get('skewness'), format: 'decimal' },
            { key: 'kurtosis', label: i18n.get('kurtosis'), format: 'decimal' },
            { key: 'rSquared', label: i18n.get('rSquared'), format: 'decimal' },
            { key: 'trendSlope', label: i18n.get('trendSlope'), format: 'decimal' }
        ];

        statsToShow.forEach(stat => {
            const row = document.createElement('tr');
            const value = stats[stat.key];
            
            // Format value based on type
            let displayValue = 'N/A';
            let isNegative = false;
            if (typeof value === 'number' && isFinite(value)) {
                isNegative = value < 0;
                if (stat.format === 'integer') {
                    displayValue = Math.floor(value).toString();
                } else if (stat.format === 'percent') {
                    displayValue = value.toFixed(2) + '%';
                } else {
                    displayValue = value.toFixed(6);
                }
            }
            
            const valueCell = document.createElement('td');
            valueCell.className = 'value-cell' + (isNegative ? ' text-negative' : '');
            valueCell.textContent = displayValue;
            
            row.appendChild(document.createElement('td'));
            row.firstChild.textContent = stat.label;
            row.appendChild(valueCell);
            tbody.appendChild(row);
        });

        // Add outliers if any
        if (stats.outliers && stats.outliers.some(o => o.isOutlier)) {
            const outlierCount = stats.outliers.filter(o => o.isOutlier).length;
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${i18n.get('outliers')}</td>
                <td class="value-cell">${outlierCount} ${i18n.get('detected')}</td>
            `;
            tbody.appendChild(row);
        }
    }

    /**
     * Analyze trend for selected recordings
     */
    analyzeTrend() {
        if (this.selectedRecords.length < 2) {
            alert('Please select at least 2 recordings for trend analysis');
            return;
        }

        // Get selected records and sort by date
        const selectedData = archiveManager.allRecords
            .filter(r => this.selectedRecords.includes(r.id))
            .sort((a, b) => new Date(a.analysis_date) - new Date(b.analysis_date));

        const values = selectedData.map(r => parseFloat(r.index_value));
        const dates = selectedData.map(r => new Date(r.analysis_date).toLocaleDateString());

        // Calculate trend data
        this.currentTrendData = {
            dates: dates,
            values: values,
            movingAverage: calculateMovingAverage(values, Math.min(5, Math.floor(values.length / 2))),
            trendLine: calculateTrendLinePoints(values)
        };

        // Create chart
        this.createTrendChart();

        // Display trend summary
        this.displayTrendSummary();

        // Pendo Track Event: trend_analysis_completed
        if (typeof pendo !== 'undefined') {
            const trendLineData = linearTrend(values);
            pendo.track('trend_analysis_completed', {
                selected_records_count: this.selectedRecords.length,
                date_range_start: dates[0],
                date_range_end: dates[dates.length - 1],
                moving_average_window: Math.min(5, Math.floor(values.length / 2)),
                trend_slope: parseFloat(trendLineData.slope.toFixed(6)),
                r_squared: parseFloat(generateDescriptiveStatistics(values).rSquared.toFixed(6))
            });
        }

        // Show results section
        document.getElementById('statisticsResults').classList.add('hidden');
        document.getElementById('trendResults').classList.remove('hidden');
    }

    /**
     * Create trend chart with Chart.js
     */
    createTrendChart() {
        const canvas = document.getElementById('trendChart');
        if (!canvas) return;

        // Destroy existing chart
        if (this.currentChart) {
            this.currentChart.destroy();
        }

        const ctx = canvas.getContext('2d');
        const data = this.currentTrendData;
        const maOffset = data.values.length - data.movingAverage.length;

        this.currentChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.dates,
                datasets: [
                    {
                        label: i18n.get('barChart'),
                        data: data.values,
                        backgroundColor: 'rgba(46, 125, 50, 0.5)',
                        borderColor: 'rgba(46, 125, 50, 1)',
                        borderWidth: 1,
                        order: 2
                    },
                    {
                        label: i18n.get('movingAverage'),
                        data: Array(maOffset).fill(null).concat(data.movingAverage),
                        borderColor: 'rgba(255, 152, 0, 1)',
                        borderWidth: 2,
                        fill: false,
                        type: 'line',
                        tension: 0.4,
                        pointRadius: 4,
                        pointBackgroundColor: 'rgba(255, 152, 0, 1)',
                        order: 1
                    },
                    {
                        label: i18n.get('linearTrend'),
                        data: data.trendLine,
                        borderColor: 'rgba(0, 102, 204, 1)',
                        borderWidth: 2,
                        fill: false,
                        type: 'line',
                        tension: 0,
                        pointRadius: 0,
                        order: 0
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    title: {
                        display: true,
                        text: i18n.get('trendAnalysis')
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        title: {
                            display: true,
                            text: i18n.get('value')
                        },
                        grid: {
                            color: (context) => {
                                if (context.tick.value === 0) {
                                    return '#999999';
                                }
                                return 'rgba(0, 0, 0, 0.1)';
                            },
                            lineWidth: (context) => {
                                if (context.tick.value === 0) {
                                    return 2;
                                }
                                return 1;
                            }
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: i18n.get('date')
                        }
                    }
                }
            }
        });
    }

    /**
     * Display trend summary table
     */
    displayTrendSummary() {
        const tbody = document.getElementById('trendSummaryTableBody');
        tbody.innerHTML = '';

        const stats = generateDescriptiveStatistics(this.currentTrendData.values);
        const trendLine = linearTrend(this.currentTrendData.values);

        const summaryStats = [
            { label: i18n.get('count'), value: stats.count },
            { label: i18n.get('mean'), value: stats.mean.toFixed(6) },
            { label: i18n.get('min'), value: stats.min.toFixed(6) },
            { label: i18n.get('max'), value: stats.max.toFixed(6) },
            { label: i18n.get('trendSlope'), value: trendLine.slope.toFixed(6) },
            { label: i18n.get('rSquared'), value: stats.rSquared.toFixed(6) }
        ];

        summaryStats.forEach(stat => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${stat.label}</td>
                <td class="value-cell">${stat.value}</td>
            `;
            tbody.appendChild(row);
        });
    }

    /**
     * Export statistics as CSV
     */
    exportStatistics() {
        if (!this.currentStatistics) return;

        const stats = this.currentStatistics;
        const csvContent = [
            ['Statistic', 'Value'],
            ['Count', stats.count.toString()],
            ['Mean', stats.mean.toFixed(6)],
            ['Median', stats.median.toFixed(6)],
            ['Minimum', stats.min.toFixed(6)],
            ['Maximum', stats.max.toFixed(6)],
            ['Range', stats.range.toFixed(6)],
            ['Q1 (25%)', stats.q1.toFixed(6)],
            ['Q3 (75%)', stats.q3.toFixed(6)],
            ['IQR', stats.iqr.toFixed(6)],
            ['Std Dev (Sample)', stats.stdDev.toFixed(6)],
            ['Variance', stats.variance.toFixed(6)],
            ['Coefficient of Variation', stats.cv.toFixed(2) + '%'],
            ['Skewness', stats.skewness.toFixed(6)],
            ['Kurtosis', stats.kurtosis.toFixed(6)],
            ['R² (Goodness of Fit)', stats.rSquared.toFixed(6)],
            ['Trend Slope', stats.trendSlope.toFixed(6)]
        ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

        // Pendo Track Event: statistics_exported_csv
        if (typeof pendo !== 'undefined') {
            pendo.track('statistics_exported_csv', {
                statistics_count: stats.count,
                export_filename: 'descriptive_statistics.csv'
            });
        }

        this.downloadCSV(csvContent, 'descriptive_statistics.csv');
    }

    /**
     * Export trend analysis results
     */
    exportTrendResults() {
        if (!this.currentTrendData) return;

        const stats = generateDescriptiveStatistics(this.currentTrendData.values);
        const trendLine = linearTrend(this.currentTrendData.values);

        const csvContent = [
            ['Trend Analysis Results'],
            [''],
            ['Date', 'Value', 'Moving Average', 'Trend Line'],
            ...this.currentTrendData.dates.map((date, i) => [
                date,
                this.currentTrendData.values[i].toFixed(6),
                this.currentTrendData.movingAverage[i - (this.currentTrendData.values.length - this.currentTrendData.movingAverage.length)] || '',
                this.currentTrendData.trendLine[i].toFixed(6)
            ]),
            [''],
            ['Summary Statistics'],
            ['Mean', stats.mean.toFixed(6)],
            ['Min', stats.min.toFixed(6)],
            ['Max', stats.max.toFixed(6)],
            ['Trend Slope', trendLine.slope.toFixed(6)],
            ['R²', stats.rSquared.toFixed(6)]
        ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

        // Pendo Track Event: trend_results_exported_csv
        if (typeof pendo !== 'undefined') {
            pendo.track('trend_results_exported_csv', {
                data_points_count: this.currentTrendData.values.length,
                export_filename: 'trend_analysis.csv',
                trend_slope: parseFloat(trendLine.slope.toFixed(6)),
                r_squared: parseFloat(stats.rSquared.toFixed(6))
            });
        }

        this.downloadCSV(csvContent, 'trend_analysis.csv');
    }

    /**
     * Export chart as PNG
     */
    exportChart() {
        if (!this.currentChart) return;

        const canvas = document.getElementById('trendChart');
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        const exportFilename = `trend_chart_${new Date().toISOString().split('T')[0]}.png`;
        link.download = exportFilename;
        link.click();

        // Pendo Track Event: trend_chart_exported_png
        if (typeof pendo !== 'undefined') {
            pendo.track('trend_chart_exported_png', {
                export_filename: exportFilename
            });
        }
    }

    /**
     * Helper to download CSV
     */
    downloadCSV(content, filename) {
        const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    /**
     * Refresh statistics display on language change
     */
    refreshStatisticsDisplay() {
        if (this.currentStatistics) {
            this.displayStatisticsTable();
        }
        if (this.currentTrendData) {
            this.displayTrendSummary();
        }
    }
}
