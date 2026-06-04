    // ==================== NAVIGATION FUNCTIONS ====================
    
    function showLanding() {
        document.getElementById('landingPage').classList.remove('hidden');
        document.getElementById('loginForm').classList.add('hidden');
        document.getElementById('registerForm').classList.add('hidden');
        document.getElementById('mainApp').classList.add('hidden');
    }

    function showLoginForm() {
        document.getElementById('landingPage').classList.add('hidden');
        document.getElementById('loginForm').classList.remove('hidden');
        document.getElementById('registerForm').classList.add('hidden');
        document.getElementById('mainApp').classList.add('hidden');
    }

    /**
     * Continue as Guest - clears any existing user session
     */
    async function continueAsGuest() {
        // Clear any existing user session to prevent showing previous user's data
        if (authManager && authManager.currentUser) {
            // Logout from Supabase to clear the session
            await authManager.logout();
        }
        showApp();
    }

    /**
     * Auto-fill demo account credentials
     * Email: demo@agroanalysis.com
     * Password: DemoAccount
     */
    function autofillDemo() {
        const emailInput = document.getElementById('loginEmail');
        const passwordInput = document.getElementById('loginPassword');
        
        if (emailInput && passwordInput) {
            emailInput.value = 'demo@agroanalysis.com';
            passwordInput.value = 'DemoAccount';
            emailInput.focus();
        }
    }

    function showRegisterForm() {
        document.getElementById('landingPage').classList.add('hidden');
        document.getElementById('loginForm').classList.add('hidden');
        document.getElementById('registerForm').classList.remove('hidden');
        document.getElementById('mainApp').classList.add('hidden');
    }

    function showApp() {
        document.getElementById('landingPage').classList.add('hidden');
        document.getElementById('loginForm').classList.add('hidden');
        document.getElementById('registerForm').classList.add('hidden');
        document.getElementById('mainApp').classList.remove('hidden');
    }

    // Override auth manager UI callbacks
    AuthManager.prototype.updateUIForLoggedIn = function(user) {
        showApp();
        
        // Show save result section
        const saveSection = document.getElementById('saveResultSection');
        if (saveSection) {
            saveSection.style.display = 'block';
        }

        // Show archive button
        const archiveBtn = document.getElementById('archiveBtn');
        if (archiveBtn) {
            archiveBtn.style.display = 'inline-block';
        }
        
        // Set today's date as default
        const analysisDateInput = document.getElementById('analysisDate');
        if (analysisDateInput) {
            const today = new Date().toISOString().split('T')[0];
            analysisDateInput.value = today;
        }

        // Store user greeting in container
        const greetingContainer = document.getElementById('userGreetingContainer');
        if (greetingContainer) {
            greetingContainer.innerHTML = `
                <div class="user-greeting">
                    <span data-i18n="welcome">${i18n.get('welcome')}</span>
                    <strong>${user.email}</strong>
                </div>
                <button onclick="authManager.logout().then(() => location.reload());" class="btn-logout" data-i18n="logout">${i18n.get('logout')}</button>
            `;
        }
    };

    AuthManager.prototype.updateUIForLoggedOut = function() {
        showLanding();
        
        // Hide save result section
        const saveSection = document.getElementById('saveResultSection');
        if (saveSection) {
            saveSection.style.display = 'none';
        }

        // Hide archive button
        const archiveBtn = document.getElementById('archiveBtn');
        if (archiveBtn) {
            archiveBtn.style.display = 'none';
        }

        // Clear greeting container
        const greetingContainer = document.getElementById('userGreetingContainer');
        if (greetingContainer) {
            greetingContainer.innerHTML = '';
        }
    };

    function handleLogin(event) {
        event.preventDefault();
        
        // Check if authManager is ready
        if (!authManager) {
            alert('Authentication system is loading. Please try again.');
            return;
        }
        
        const form = event.target;
        const email = form.querySelector('input[type="email"]').value;
        const password = form.querySelector('input[type="password"]').value;

        // Disable submit button during request
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        const originalText = submitBtn.textContent;
        submitBtn.textContent = i18n.get('signingIn');

        authManager.login(email, password).then(result => {
            submitBtn.disabled = false;
            submitBtn.textContent = i18n.get('signIn');

            if (result.success) {
                form.reset();
                showApp();
            } else {
                alert('Login failed: ' + result.error);
            }
        }).catch(error => {
            submitBtn.disabled = false;
            submitBtn.textContent = i18n.get('signIn');
            alert('Login error: ' + error.message);
        });
    }

    function handleRegister(event) {
        event.preventDefault();
        
        // Check if authManager is ready
        if (!authManager) {
            alert('Authentication system is loading. Please try again.');
            return;
        }
        
        const form = event.target;
        const fullName = form.querySelector('input[type="text"]').value;
        const email = form.querySelector('input[type="email"]').value;
        const password = form.querySelector('input[type="password"]').value;
        const confirmPassword = form.querySelectorAll('input[type="password"]')[1].value;

        // Validate passwords match
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        // Disable submit button during request
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = i18n.get('creatingAccount');

        authManager.register(email, password, fullName).then(result => {
            submitBtn.disabled = false;
            submitBtn.textContent = i18n.get('createAccount');

            if (result.success) {
                form.reset();
                alert(result.message || 'Account created successfully! You can now sign in.');
                showLoginForm();
            } else {
                alert('Registration failed: ' + result.error);
            }
        }).catch(error => {
            submitBtn.disabled = false;
            submitBtn.textContent = i18n.get('createAccount');
            alert('Registration error: ' + error.message);
        });
    }

    // Language toggle handler for landing page
    document.getElementById('langToggleLanding').addEventListener('click', function() {
        const newLang = i18n.currentLanguage === 'en' ? 'uk' : 'en';
        i18n.setLanguage(newLang);
        this.textContent = newLang === 'en' ? '🇺🇦 УК' : '🇬🇧 EN';
    });

    // Setup main language toggle - check if element exists
    const setupMainLanguageToggle = () => {
        const langToggle = document.getElementById('langToggle');
        if (langToggle && !langToggle.hasAttribute('data-language-listener')) {
            langToggle.setAttribute('data-language-listener', 'true');
            langToggle.addEventListener('click', function() {
                const newLang = i18n.currentLanguage === 'en' ? 'uk' : 'en';
                i18n.setLanguage(newLang);
                this.textContent = newLang === 'en' ? '🇺🇦 УК' : '🇬🇧 EN';
                
                // Refresh diagnostics display with new language
                refreshDiagnosticsDisplay();
                
                // Update archive modal if visible
                if (archiveManager && !document.getElementById('archiveModal').classList.contains('hidden')) {
                    archiveManager.updateArchiveLanguage();
                    // Also update analysis display
                    if (typeof analysisManager !== 'undefined' && analysisManager) {
                        analysisManager.refreshStatisticsDisplay();
                    }
                }
                
                // Update save result section labels and placeholders
                updateSaveResultLabels();
                
                // Update welcome/logout text
                updateGreetingText();
            });
        }
    };

    // Update save result section labels when language changes
    const updateSaveResultLabels = () => {
        const dateLabel = document.querySelector('label[for="analysisDate"]');
        if (dateLabel) {
            dateLabel.textContent = i18n.get('analysisDate');
        }

        const groupLabel = document.querySelector('label[for="fieldGroupName"]');
        if (groupLabel) {
            groupLabel.textContent = i18n.get('fieldGroupName');
        }

        const groupInput = document.getElementById('fieldGroupName');
        if (groupInput) {
            groupInput.placeholder = i18n.get('fieldGroupPlaceholder');
        }

        const saveBtn = document.getElementById('saveResultBtn');
        if (saveBtn) {
            saveBtn.innerHTML = i18n.get('saveResult');
        }
    };

    // Update greeting text when language changes
    const updateGreetingText = () => {
        const greetingSpan = document.querySelector('.user-greeting span[data-i18n="welcome"]');
        if (greetingSpan) {
            greetingSpan.textContent = i18n.get('welcome');
        }

        const logoutBtn = document.querySelector('.btn-logout[data-i18n="logout"]');
        if (logoutBtn) {
            logoutBtn.textContent = i18n.get('logout');
        }
        
        // Update archive button
        const archiveBtn = document.getElementById('archiveBtn');
        if (archiveBtn) {
            archiveBtn.innerHTML = i18n.get('archiveBtn');
        }
    };

    // Setup on DOM ready
    setupMainLanguageToggle();

    // Re-setup when archive modal loads (MutationObserver for DOM changes)
    const observer = new MutationObserver(() => {
        setupMainLanguageToggle();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // ==================== ORIGINAL APP FUNCTIONS ====================
    
    const thresholds = {
        "NGRDI": (v) => v > 0.1,
        "ExG": (v) => v > 0.1,
        "ExR": (v) => v > 0.1,
        "ExGR": (v) => v > 0.05,
        "VARI": (v) => v > 0.2,
        "GLI": (v) => v > 0.1,
        "MGRVI": (v) => v > 0.1,
        "RGBVI": (v) => v > 0.15,
        "TGI": (v) => v > 0.08,
        "NDYI": (v) => v > 0.12,
        "CIVE": (v) => v < 18.7,
        "NPCI": (v) => v > 0.0,
        "ExB": (v) => v > 0.05,
        "RGRI": (v) => v > 1.2,
        "GBRI": (v) => v > 0.9,
        "IKAW": (v) => v > 0.05,
        "SOCI (Soil)": (v) => v > 2.5,
        "BI (Soil)": (v) => v > 0.45,
        "SCI (Soil)": (v) => v > 0.0,
        "RI (Soil)": (v) => v > 4.5,
        "HI (Soil)": (v) => v > 0.1,
        "SI (Soil)": (v) => v > 0.05
    };

    // Global tracking storage container
    let globalCalculatedValues = {};
    let globalDiagnostics = {};

    // Helper functions for mathematical clipping constraints
    function clamp(val, min, max) { return Math.max(min, Math.min(max, val)); }

    // Color ramp lookups mimicking LightTerrain (Vegetation index mapping)
    function getLightTerrainColor(v) {
        // Map v from [-1, 1] to [0, 1]
        let norm = (v + 1) / 2;
        if (norm < 0.4) {
            // Earth brown tones
            let r = Math.floor(139 - norm * 100);
            let g = Math.floor(90 - norm * 50);
            let b = 43;
            return [r, g, b];
        } else if (norm < 0.65) {
            // Yellowish Transition/Dry brush
            let r = Math.floor(210 + (norm - 0.4) * 100);
            let g = Math.floor(180 + (norm - 0.4) * 200);
            let b = 100;
            return [clamp(r,0,255), clamp(g,0,255), b];
        } else {
            // Vibrant Canopy Greens
            let r = Math.floor(120 - (norm - 0.65) * 250);
            let g = Math.floor(180 + (norm - 0.65) * 200);
            let b = Math.floor(70 - (norm - 0.65) * 100);
            return [clamp(r,0,255), clamp(g,0,255), clamp(b,0,255)];
        }
    }

    // Color ramp lookups mimicking CoffeeTones (Soil Index mapping)
    function getCoffeeColor(v) {
        // Expected SOCI range roughly [0, 5]
        let norm = clamp(v / 5, 0, 1);
        // Dark premium roast espresso gradient down to lighter clay soils
        let r = Math.floor(40 + norm * 160);
        let g = Math.floor(25 + norm * 120);
        let b = Math.floor(15 + norm * 90);
        return [r, g, b];
    }

    // Setup input routing links
    document.getElementById('fileInput').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(event) {
            const img = new Image();
            img.onload = function() {
                processAgronomyData(img);
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    });

    function processAgronomyData(img) {
        // Target downstream normalization scale (Equivalent to ImageResize to 300 width)
        const targetWidth = 300;
        const targetHeight = Math.round((img.height / img.width) * targetWidth);

        const cOrig = document.getElementById('canvasOrig');
        const cNgrdi = document.getElementById('canvasNgrdi');
        const cSoci = document.getElementById('canvasSoci');

        cOrig.width = cNgrdi.width = cSoci.width = targetWidth;
        cOrig.height = cNgrdi.height = cSoci.height = targetHeight;

        const ctxOrig = cOrig.getContext('2d');
        const ctxNgrdi = cNgrdi.getContext('2d');
        const ctxSoci = cSoci.getContext('2d');

        // Draw downsampled input matrix layer
        ctxOrig.drawImage(img, 0, 0, targetWidth, targetHeight);

        // Extract raw pixel arrays
        const imgDataObj = ctxOrig.getImageData(0, 0, targetWidth, targetHeight);
        const pixels = imgDataObj.data;
        const totalPixels = targetWidth * targetHeight;

        const outDataNgrdi = ctxNgrdi.createImageData(targetWidth, targetHeight);
        const outDataSoci = ctxSoci.createImageData(targetWidth, targetHeight);

        // Set up accumulation registers
        let sums = {
            NGRDI: 0, ExG: 0, ExR: 0, ExGR: 0, VARI: 0, GLI: 0, MGRVI: 0, RGBVI: 0, TGI: 0, NDYI: 0, 
            CIVE: 0, NPCI: 0, ExB: 0, RGRI: 0, GBRI: 0, IKAW: 0, SOCI: 0, BI: 0, SCI: 0, RI: 0, HI: 0, SI: 0
        };
        let soilCount = 0;

        for (let i = 0; i < pixels.length; i += 4) {
            let R = pixels[i];
            let G = pixels[i+1];
            let B = pixels[i+2];

            // Normalize values to match Wolfram matrix bounds [0.0, 1.0]
            let r = R / 255;
            let g = G / 255;
            let b = B / 255;

            // Compute Index Matrix Chains
            let ngrdi = clamp((g - r) / (g + r + 1e-6), -1.0, 1.0);
            let exg   = clamp(2 * g - r - b, -2.0, 2.0);
            let exr   = clamp(1.4 * r - g, -2.0, 2.0);
            let exgr  = clamp(exg - exr, -2.0, 2.0);

            let denomVari = g + r - b;
            if (Math.abs(denomVari) < 1e-5) denomVari = (denomVari >= 0 ? 1 : -1) * 1e-5;
            let vari = clamp((g - r) / denomVari, -1.0, 1.0);

            let gli   = clamp((2 * g - r - b) / (2 * g + r + b + 1e-6), -1.0, 1.0);
            let mgrvi = clamp((g*g - r*r) / (g*g + r*r + 1e-6), -1.0, 1.0);
            let rgbvi = clamp((g*g - b*r) / (g*g + b*r + 1e-6), -1.0, 1.0);
            let tgi   = clamp(g - 0.39 * r - 0.61 * b, -1.0, 1.0);
            let ndyi  = clamp((g - b) / (g + b + 1e-6), -1.0, 1.0);
            let cive  = clamp(0.441 * r - 0.811 * g + 0.385 * b + 18.78745, 0.0, 30.0);
            let npci  = clamp((b - r) / (b + r + 1e-6), -1.0, 1.0);
            let exb   = clamp(1.4 * b - g, -2.0, 2.0);
            let rgri  = clamp(r / (g + 1e-6), 0.0, 10.0);
            let gbri  = clamp(b / (g + 1e-6), 0.0, 10.0);
            let ikaw  = clamp((r - b) / (r + b + 1e-6), -1.0, 1.0);

            // Soil Specific Computations
            let soci = clamp(b / (g * r + 1e-6), 0.0, 10.0);
            let bi   = clamp(Math.sqrt((r*r + g*g) / 2), 0.0, 1.0);
            let sci  = clamp((r - g) / (r + g + 1e-6), -1.0, 1.0);
            let ri   = clamp((r*r) / (b * g*g*g + 1e-6), 0.0, 10.0);

            let denomHi = g - b;
            if (Math.abs(denomHi) < 1e-5) denomHi = (denomHi >= 0 ? 1 : -1) * 1e-5;
            let hi = clamp((2 * r - g - b) / denomHi, -5.0, 5.0);
            let si = clamp((r - b) / (r + b + 1e-6), -1.0, 1.0);

            // Global Accumulators
            sums.NGRDI += ngrdi; sums.ExG += exg; sums.ExR += exr; sums.ExGR += exgr;
            sums.VARI += vari; sums.GLI += gli; sums.MGRVI += mgrvi; sums.RGBVI += rgbvi;
            sums.TGI += tgi; sums.NDYI += ndyi; sums.CIVE += cive; sums.NPCI += npci;
            sums.ExB += exb; sums.RGRI += rgri; sums.GBRI += gbri; sums.IKAW += ikaw;

            // ExG <= 0 determines soil classification mapping threshold mask
            let isSoil = (exg <= 0);
            if (isSoil) {
                soilCount++;
                sums.SOCI += soci; sums.BI += bi; sums.SCI += sci;
                sums.RI += ri; sums.HI += hi; sums.SI += si;
            }

            // Procedural Canvas Color Rendering
            let rgbNgrdi = getLightTerrainColor(ngrdi);
            outDataNgrdi.data[i]   = rgbNgrdi[0];
            outDataNgrdi.data[i+1] = rgbNgrdi[1];
            outDataNgrdi.data[i+2] = rgbNgrdi[2];
            outDataNgrdi.data[i+3] = 255;

            // Soil masking execution logic matching ImageMultiply behavior
            if (isSoil) {
                let rgbSoci = getCoffeeColor(soci);
                outDataSoci.data[i]   = rgbSoci[0];
                outDataSoci.data[i+1] = rgbSoci[1];
                outDataSoci.data[i+2] = rgbSoci[2];
                outDataSoci.data[i+3] = 255;
            } else {
                // Background vegetation blacked out completely inside soil array frame
                outDataSoci.data[i] = outDataSoci.data[i+1] = outDataSoci.data[i+2] = 0;
                outDataSoci.data[i+3] = 255;
            }
        }

        ctxNgrdi.putImageData(outDataNgrdi, 0, 0);
        ctxSoci.putImageData(outDataSoci, 0, 0);

        // Compile finalized statistical summaries
        globalCalculatedValues = {
            "NGRDI": sums.NGRDI / totalPixels, "ExG": sums.ExG / totalPixels,
            "ExR": sums.ExR / totalPixels, "ExGR": sums.ExGR / totalPixels,
            "VARI": sums.VARI / totalPixels, "GLI": sums.GLI / totalPixels,
            "MGRVI": sums.MGRVI / totalPixels, "RGBVI": sums.RGBVI / totalPixels,
            "TGI": sums.TGI / totalPixels, "NDYI": sums.NDYI / totalPixels,
            "CIVE": sums.CIVE / totalPixels, "NPCI": sums.NPCI / totalPixels,
            "ExB": sums.ExB / totalPixels, "RGRI": sums.RGRI / totalPixels,
            "GBRI": sums.GBRI / totalPixels, "IKAW": sums.IKAW / totalPixels,
            "SOCI (Soil)": soilCount > 0 ? sums.SOCI / soilCount : 0,
            "BI (Soil)": soilCount > 0 ? sums.BI / soilCount : 0,
            "SCI (Soil)": soilCount > 0 ? sums.SCI / soilCount : 0,
            "RI (Soil)": soilCount > 0 ? sums.RI / soilCount : 0,
            "HI (Soil)": soilCount > 0 ? sums.HI / soilCount : 0,
            "SI (Soil)": soilCount > 0 ? sums.SI / soilCount : 0
        };

        // Generate diagnostics using i18n system
        globalDiagnostics = {};
        for (const metricKey in globalCalculatedValues) {
            globalDiagnostics[metricKey] = i18n.getDiagnosis(metricKey, globalCalculatedValues[metricKey], thresholds);
        }

        // Unlock selector element and update values
        const selector = document.getElementById('metricSelector');
        selector.disabled = false;
        updateDashboardView(selector.value);
    }

    // Connect selection routing trigger
    document.getElementById('metricSelector').addEventListener('change', function(e) {
        updateDashboardView(e.target.value);
    });

    function updateDashboardView(key) {
        if (!globalCalculatedValues[key] && globalCalculatedValues[key] !== 0) return;

        document.getElementById('metricValue').innerText = globalCalculatedValues[key].toFixed(5);
        
        // Regenerate diagnosis with current language
        globalDiagnostics[key] = i18n.getDiagnosis(key, globalCalculatedValues[key], thresholds);
        document.getElementById('metricDiagnose').innerText = globalDiagnostics[key];
        
        document.getElementById('metricContext').innerText = i18n.get('interpretations.' + key);
    }
    
    /**
     * Refresh diagnostics display when language changes
     */
    function refreshDiagnosticsDisplay() {
        const selector = document.getElementById('metricSelector');
        if (selector && selector.value && globalCalculatedValues[selector.value]) {
            updateDashboardView(selector.value);
        }
    }

    /**
     * Save analysis result to Supabase
     */
    async function saveAnalysisResult() {
        // Check if user is logged in
        if (!authManager || !authManager.currentUser) {
            alert('You must be logged in to save results. Please sign in.');
            return;
        }

        const metricKey = document.getElementById('metricSelector').value;
        const metricValue = globalCalculatedValues[metricKey];
        const fieldGroupName = document.getElementById('fieldGroupName').value || 'Untitled';
        const analysisDate = document.getElementById('analysisDate').value;
        const saveMessageDiv = document.getElementById('saveMessage');

        if (!analysisDate) {
            saveMessageDiv.className = 'save-message error';
            saveMessageDiv.innerText = 'Please select an analysis date.';
            return;
        }

        if (metricValue === undefined || metricValue === null) {
            saveMessageDiv.className = 'save-message error';
            saveMessageDiv.innerText = 'No analysis data to save. Please upload and analyze an image first.';
            return;
        }

        // Show loading state
        const saveBtn = document.getElementById('saveResultBtn');
        saveBtn.disabled = true;
        saveBtn.innerText = i18n.get('saving');

        try {
            const { data, error } = await window.supabaseClient
                .from('analysis_results')
                .insert([
                    {
                        user_id: authManager.currentUser.id,
                        field_group: fieldGroupName,
                        analysis_date: analysisDate,
                        index_name: metricKey,
                        index_value: metricValue
                    }
                ]);

            if (error) {
                throw error;
            }

            // Success
            saveMessageDiv.className = 'save-message success';
            const savedMsg = i18n.get('resultSaved');
            saveMessageDiv.innerText = `${savedMsg} ${metricKey}: ${metricValue.toFixed(5)} on ${analysisDate}`;
            document.getElementById('fieldGroupName').value = '';
            
            setTimeout(() => {
                saveMessageDiv.innerText = '';
            }, 5000);

        } catch (error) {
            console.error('Error saving result:', error);
            saveMessageDiv.className = 'save-message error';
            saveMessageDiv.innerText = `❌ Error saving result: ${error.message}`;
        } finally {
            saveBtn.disabled = false;
            saveBtn.innerHTML = i18n.get('saveResult');
        }
    }