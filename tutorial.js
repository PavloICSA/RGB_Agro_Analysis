// Tutorial System Module
// Provides an interactive, skippable tutorial for the application

const Tutorial = (function() {
    let currentStep = 0;
    let isActive = false;
    let steps = [];
    
    const tutorialSteps = {
        en: [
            {
                target: '.upload-section',
                title: 'Upload Your RGB Image',
                description: 'Start by uploading an RGB image from any source: satellite imagery, UAV/drone footage, or ground-level camera photos. The system works with any RGB imagery!',
                position: 'bottom',
                action: 'Click here or drag & drop an image file'
            },
            {
                target: '.view-mode-toggle',
                title: 'View Modes',
                description: 'Switch between Normal View (shows original, NGRDI vegetation map, and SOCI soil map) and Comparison View (compare any two indices side-by-side).',
                position: 'bottom',
                action: null
            },
            {
                target: '#metricSelector',
                title: 'Select & Analyze Metrics',
                description: '22 vegetation and soil indices are computed automatically. Select any metric to see its value, agronomic diagnostics, and agricultural context.',
                position: 'bottom',
                action: 'Choose from 22 indices'
            },
            {
                target: '#metricValue',
                title: 'Index Values & Diagnostics',
                description: 'Each index shows its mean value across the analyzed area. The diagnostic panel explains what the values mean for your crop and soil health.',
                position: 'bottom',
                action: null
            },
            {
                target: '#saveResultSection',
                title: 'Save & Archive Results',
                description: 'Logged-in users can save analysis results with a date and optional field group name for historical tracking and trend analysis.',
                position: 'bottom',
                action: 'Available when logged in'
            },
            {
                target: '#archiveBtn',
                title: 'Access Your Archive',
                description: 'View all saved analyses, perform statistical analysis, track trends over time, and export data for further processing.',
                position: 'bottom',
                action: 'View historical data'
            }
        ],
        uk: [
            {
                target: '.upload-section',
                title: 'Завантажте ваше RGB зображення',
                description: 'Почніть із завантаження RGB зображення з будь-якого джерела: супутникової знімки, БПЛА/дрону або наземної камери. Система працює з будь-яким RGB зображенням!',
                position: 'bottom',
                action: 'Клікніть тут або перетягніть файл'
            },
            {
                target: '.view-mode-toggle',
                title: 'Режими перегляду',
                description: 'Перемикайтесь між Нормальним виглядом (показує оригінал, карту рослинності NGRDI та карту грунту SOCI) та Режимом порівняння (порівнюйте будь-які два індекси бік за біком).',
                position: 'bottom',
                action: null
            },
            {
                target: '#metricSelector',
                title: 'Вибір і аналіз показників',
                description: '22 індекси рослинності та грунту обчислюються автоматично. Виберіть будь-який індекс, щоб побачити його значення, агрономічну діагностику та аграрний контекст.',
                position: 'bottom',
                action: 'Виберіть з 22 індексів'
            },
            {
                target: '#metricValue',
                title: 'Значення індексів і діагностика',
                description: 'Кожен індекс показує його середнє значення по аналізованій площі. Діагностична панель пояснює, що означають значення для здоров\'я вашого посіву та грунту.',
                position: 'bottom',
                action: null
            },
            {
                target: '#saveResultSection',
                title: 'Збереження й архівування результатів',
                description: 'Користувачі, які увійшли в систему, можуть зберігати результати аналізу з датою та опціональною назвою групи полів для історичного відстеження та аналізу тенденцій.',
                position: 'bottom',
                action: 'Доступно при входу'
            },
            {
                target: '#archiveBtn',
                title: 'Доступ до вашого архіву',
                description: 'Переглядайте всі збережені аналізи, виконуйте статистичний аналіз, відстежуйте тенденції протягом часу та експортуйте дані для подальшої обробки.',
                position: 'bottom',
                action: 'Переглядайте історичні дані'
            }
        ]
    };
    
    function init() {
        steps = tutorialSteps[i18n.currentLanguage] || tutorialSteps.en;
    }
    
    function createTutorialOverlay() {
        // Create overlay container if it doesn't exist
        let overlay = document.getElementById('tutorialOverlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'tutorialOverlay';
            overlay.className = 'tutorial-overlay hidden';
            document.body.appendChild(overlay);
        }
        return overlay;
    }
    
    function createTutorialTooltip() {
        // Create tooltip container if it doesn't exist
        let tooltip = document.getElementById('tutorialTooltip');
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.id = 'tutorialTooltip';
            tooltip.className = 'tutorial-tooltip hidden';
            document.body.appendChild(tooltip);
        }
        return tooltip;
    }
    
    function positionTooltip(target, position) {
        const tooltip = document.getElementById('tutorialTooltip');
        const targetEl = document.querySelector(target);
        
        if (!targetEl) return;
        
        const rect = targetEl.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        const padding = 20;
        
        let top, left;
        
        switch(position) {
            case 'top':
                top = rect.top - tooltipRect.height - padding;
                left = rect.left + (rect.width - tooltipRect.width) / 2;
                break;
            case 'bottom':
                top = rect.bottom + padding;
                left = rect.left + (rect.width - tooltipRect.width) / 2;
                break;
            case 'left':
                top = rect.top + (rect.height - tooltipRect.height) / 2;
                left = rect.left - tooltipRect.width - padding;
                break;
            case 'right':
                top = rect.top + (rect.height - tooltipRect.height) / 2;
                left = rect.right + padding;
                break;
            default:
                top = rect.bottom + padding;
                left = rect.left + (rect.width - tooltipRect.width) / 2;
        }
        
        // Keep tooltip within viewport
        if (left < 0) left = padding;
        if (left + tooltipRect.width > window.innerWidth) left = window.innerWidth - tooltipRect.width - padding;
        if (top < 0) top = rect.bottom + padding;
        if (top + tooltipRect.height > window.innerHeight) top = rect.top - tooltipRect.height - padding;
        
        tooltip.style.top = Math.max(0, top) + 'px';
        tooltip.style.left = Math.max(0, left) + 'px';
    }
    
    function highlightElement(target) {
        const overlay = createTutorialOverlay();
        const targetEl = document.querySelector(target);
        
        if (!targetEl) {
            overlay.classList.add('hidden');
            return;
        }
        
        const rect = targetEl.getBoundingClientRect();
        const padding = 8;
        
        overlay.style.setProperty('--highlight-top', (rect.top - padding) + 'px');
        overlay.style.setProperty('--highlight-left', (rect.left - padding) + 'px');
        overlay.style.setProperty('--highlight-width', (rect.width + padding * 2) + 'px');
        overlay.style.setProperty('--highlight-height', (rect.height + padding * 2) + 'px');
        
        overlay.classList.remove('hidden');
    }
    
    function showStep(stepIndex) {
        if (stepIndex >= steps.length) {
            endTutorial();
            return;
        }
        
        currentStep = stepIndex;
        const step = steps[stepIndex];
        const tooltip = createTutorialTooltip();
        
        // Highlight element
        highlightElement(step.target);
        
        // Build tooltip content
        let tooltipHTML = `
            <div class="tutorial-tooltip-content">
                <div class="tutorial-tooltip-header">
                    <h3>${step.title}</h3>
                    <button class="tutorial-close-btn" onclick="Tutorial.endTutorial()" title="Skip tutorial">×</button>
                </div>
                <p class="tutorial-description">${step.description}</p>
        `;
        
        if (step.action) {
            tooltipHTML += `<p class="tutorial-action">💡 ${step.action}</p>`;
        }
        
        tooltipHTML += `
                <div class="tutorial-controls">
                    ${currentStep > 0 ? `<button class="tutorial-btn tutorial-btn-secondary" onclick="Tutorial.previousStep()">← ${i18n.get('previous')}</button>` : ''}
                    <div class="tutorial-progress">${currentStep + 1}/${steps.length}</div>
                    ${currentStep < steps.length - 1 ? `<button class="tutorial-btn tutorial-btn-primary" onclick="Tutorial.nextStep()">` + i18n.get('next') + ` →</button>` : `<button class="tutorial-btn tutorial-btn-primary" onclick="Tutorial.endTutorial()">✓ ${i18n.get('tutorialFinish') || 'Done'}</button>`}
                </div>
            </div>
        `;
        
        tooltip.innerHTML = tooltipHTML;
        tooltip.classList.remove('hidden');
        
        // Position tooltip
        positionTooltip(step.target, step.position);
    }
    
    function nextStep() {
        showStep(currentStep + 1);
    }
    
    function previousStep() {
        if (currentStep > 0) {
            showStep(currentStep - 1);
        }
    }
    
    function startTutorial() {
        init();
        isActive = true;
        
        // Make sure main app is visible
        if (document.getElementById('mainApp').classList.contains('hidden')) {
            alert('Please access the application first to start the tutorial.');
            return;
        }
        
        showStep(0);
    }
    
    function endTutorial() {
        isActive = false;
        currentStep = 0;
        
        const overlay = document.getElementById('tutorialOverlay');
        const tooltip = document.getElementById('tutorialTooltip');
        
        if (overlay) overlay.classList.add('hidden');
        if (tooltip) tooltip.classList.add('hidden');
        
        // Reset highlight
        if (overlay) {
            overlay.style.setProperty('--highlight-top', '0');
            overlay.style.setProperty('--highlight-left', '0');
            overlay.style.setProperty('--highlight-width', '0');
            overlay.style.setProperty('--highlight-height', '0');
        }
    }
    
    function updateLanguage() {
        steps = tutorialSteps[i18n.currentLanguage] || tutorialSteps.en;
        if (isActive) {
            showStep(currentStep);
        }
    }
    
    // Public API
    return {
        init: init,
        start: startTutorial,
        end: endTutorial,
        endTutorial: endTutorial,
        nextStep: nextStep,
        previousStep: previousStep,
        updateLanguage: updateLanguage,
        isActive: function() { return isActive; }
    };
})();

// Initialize tutorial when page loads
document.addEventListener('DOMContentLoaded', function() {
    Tutorial.init();
});
