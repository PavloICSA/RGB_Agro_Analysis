    // ==================== NAVIGATION FUNCTIONS ====================
    
    function showLanding() {
        document.getElementById('landingPage').classList.remove('hidden');
        document.getElementById('loginForm').classList.add('hidden');
        document.getElementById('registerForm').classList.add('hidden');
        document.getElementById('mainApp').classList.add('hidden');
        window.location.hash = '#landing';
        if (typeof pendo !== 'undefined') pendo.pageLoad();
    }

    function showLoginForm() {
        document.getElementById('landingPage').classList.add('hidden');
        document.getElementById('loginForm').classList.remove('hidden');
        document.getElementById('registerForm').classList.add('hidden');
        document.getElementById('mainApp').classList.add('hidden');
        window.location.hash = '#login';
        if (typeof pendo !== 'undefined') pendo.pageLoad();
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
        // Ensure guest users have a trackable Pendo identity
        let guestId = localStorage.getItem('pendo_guest_id');
        if (!guestId) {
            guestId = 'guest-' + crypto.randomUUID();
            localStorage.setItem('pendo_guest_id', guestId);
        }
        if (typeof pendo !== 'undefined') {
            pendo.identify({ visitor: { id: guestId }, account: { id: 'guest' } });
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
        window.location.hash = '#register';
        if (typeof pendo !== 'undefined') pendo.pageLoad();
    }

    function showApp() {
        document.getElementById('landingPage').classList.add('hidden');
        document.getElementById('loginForm').classList.add('hidden');
        document.getElementById('registerForm').classList.add('hidden');
        document.getElementById('mainApp').classList.remove('hidden');
        window.location.hash = '#app';
        if (typeof pendo !== 'undefined') pendo.pageLoad();
        
        // Initialize tutorial button text
        const tutorialBtn = document.getElementById('tutorialBtn');
        if (tutorialBtn) {
            tutorialBtn.textContent = i18n.get('tutorialGuide');
        }
    }

    // Re-evaluate Pendo page rules on browser back/forward navigation
    window.addEventListener('hashchange', function() {
        if (typeof pendo !== 'undefined') pendo.pageLoad();
    });

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
        
        // Initialize tutorial button text
        const tutorialBtn = document.getElementById('tutorialBtn');
        if (tutorialBtn) {
            tutorialBtn.textContent = i18n.get('tutorialGuide');
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
                // Pendo Track Event: user_login_completed
                if (typeof pendo !== 'undefined') {
                    pendo.track('user_login_completed', {
                        is_demo_account: email === 'demo@agroanalysis.com',
                        success: true
                    });
                }
                form.reset();
                showApp();
            } else {
                // Pendo Track Event: user_login_completed (failure)
                if (typeof pendo !== 'undefined') {
                    pendo.track('user_login_completed', {
                        is_demo_account: email === 'demo@agroanalysis.com',
                        success: false,
                        error_message: (result.error || '').substring(0, 100)
                    });
                }
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
                // Pendo Track Event: user_registered
                if (typeof pendo !== 'undefined') {
                    pendo.track('user_registered', {
                        registration_method: 'email',
                        has_full_name: !!fullName,
                        success: true
                    });
                }
                form.reset();
                alert(result.message || 'Account created successfully! You can now sign in.');
                showLoginForm();
            } else {
                // Pendo Track Event: user_registered (failure)
                if (typeof pendo !== 'undefined') {
                    pendo.track('user_registered', {
                        registration_method: 'email',
                        has_full_name: !!fullName,
                        success: false,
                        error_message: (result.error || '').substring(0, 100)
                    });
                }
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
        const previousLanguage = i18n.currentLanguage;
        const newLang = previousLanguage === 'en' ? 'uk' : 'en';
        i18n.setLanguage(newLang);
        this.textContent = newLang === 'en' ? '🇺🇦 УК' : '🇬🇧 EN';

        // Pendo Track Event: language_changed
        if (typeof pendo !== 'undefined') {
            pendo.track('language_changed', {
                new_language: newLang,
                previous_language: previousLanguage,
                toggle_location: 'landing'
            });
        }
    });

    // Setup main language toggle - check if element exists
    const setupMainLanguageToggle = () => {
        const langToggle = document.getElementById('langToggle');
        if (langToggle && !langToggle.hasAttribute('data-language-listener')) {
            langToggle.setAttribute('data-language-listener', 'true');
            langToggle.addEventListener('click', function() {
                const previousLanguage = i18n.currentLanguage;
                const newLang = previousLanguage === 'en' ? 'uk' : 'en';
                i18n.setLanguage(newLang);
                this.textContent = newLang === 'en' ? '🇺🇦 УК' : '🇬🇧 EN';

                // Pendo Track Event: language_changed
                if (typeof pendo !== 'undefined') {
                    pendo.track('language_changed', {
                        new_language: newLang,
                        previous_language: previousLanguage,
                        toggle_location: 'main_app'
                    });
                }
                
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
                
                // Update tutorial language
                if (typeof Tutorial !== 'undefined') {
                    Tutorial.updateLanguage();
                }
                
                // Update tutorial button text
                const tutorialBtn = document.getElementById('tutorialBtn');
                if (tutorialBtn) {
                    tutorialBtn.textContent = i18n.get('tutorialGuide');
                }
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
        
        // Update tutorial button
        const tutorialBtn = document.getElementById('tutorialBtn');
        if (tutorialBtn) {
            tutorialBtn.textContent = i18n.get('tutorialGuide');
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

    // Make empty canvas cards act as upload triggers
    document.querySelectorAll('.map-card').forEach(function(card) {
        card.addEventListener('click', function() {
            if (!card.classList.contains('has-image')) {
                document.getElementById('fileInput').click();
            }
        });
    });

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

    // Setup drag-and-drop functionality
    const uploadSection = document.querySelector('.upload-section');
    
    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadSection.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    // Handle drag over styling
    ['dragenter', 'dragover'].forEach(eventName => {
        uploadSection.addEventListener(eventName, function() {
            uploadSection.classList.add('drag-over');
        }, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        uploadSection.addEventListener(eventName, function() {
            uploadSection.classList.remove('drag-over');
        }, false);
    });
    
    // Handle dropped files
    uploadSection.addEventListener('drop', function(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        const file = files[0];
        
        if (!file) return;
        
        // Check if it's an image file
        if (!file.type.startsWith('image/')) {
            alert('Please drop an image file');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(event) {
            const img = new Image();
            img.onload = function() {
                processAgronomyData(img);
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }, false);

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

        // Mark map cards as having image content and stop upload zone animation
        document.querySelectorAll('.map-card').forEach(function(card) {
            card.classList.add('has-image');
        });
        document.querySelector('.upload-section').classList.add('has-image');

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

        // Pendo Track Event: image_analysis_completed
        if (typeof pendo !== 'undefined') {
            pendo.track('image_analysis_completed', {
                image_width: img.width,
                image_height: img.height,
                total_pixels: totalPixels,
                indices_computed_count: Object.keys(globalCalculatedValues).length,
                soil_pixel_count: soilCount,
                vegetation_pixel_count: totalPixels - soilCount
            });
        }

        // Mark image as loaded and enable comparison mode button
        imageLoaded = true;
        document.getElementById('comparisonModeBtn').disabled = false;

        // Unlock selector element and update values
        const selector = document.getElementById('metricSelector');
        selector.disabled = false;
        document.getElementById('metricPrev').disabled = false;
        document.getElementById('metricNext').disabled = false;
        updateDashboardView(selector.value);
    }

    // Connect selection routing trigger
    document.getElementById('metricSelector').addEventListener('change', function(e) {
        updateDashboardView(e.target.value);
    });

    document.getElementById('metricPrev').addEventListener('click', function() {
        const sel = document.getElementById('metricSelector');
        if (sel.selectedIndex > 0) {
            sel.selectedIndex--;
            updateDashboardView(sel.value);
        }
    });
    document.getElementById('metricNext').addEventListener('click', function() {
        const sel = document.getElementById('metricSelector');
        if (sel.selectedIndex < sel.options.length - 1) {
            sel.selectedIndex++;
            updateDashboardView(sel.value);
        }
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

            // Pendo Track Event: analysis_result_saved
            if (typeof pendo !== 'undefined') {
                pendo.track('analysis_result_saved', {
                    index_name: metricKey,
                    index_value: metricValue,
                    field_group: fieldGroupName,
                    analysis_date: analysisDate
                });
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


    // ==================== COMPARISON MODE FUNCTIONS ====================

    // Store reference to current canvas data for comparison
    let comparisonCanvasData = {
        orig: null,
        ngrdi: null,
        soci: null,
        width: 0,
        height: 0
    };

    /**
     * Switch to normal view (3-column layout)
     */
    function switchToNormalMode() {
        const normalContainer = document.getElementById('normalViewContainer');
        const comparisonContainer = document.getElementById('comparisonViewContainer');
        const normalInspection = document.getElementById('normalViewInspection');
        const comparisonInspection = document.getElementById('comparisonViewInspection');
        const normalBtn = document.getElementById('normalModeBtn');
        const comparisonBtn = document.getElementById('comparisonModeBtn');
        const saveResultSection = document.getElementById('saveResultSection');

        normalContainer.classList.remove('hidden');
        comparisonContainer.classList.add('hidden');
        normalInspection.classList.remove('hidden');
        comparisonInspection.classList.add('hidden');
        normalBtn.classList.add('active');
        comparisonBtn.classList.remove('active');
        
        // Show save result section in normal view
        if (saveResultSection && authManager && authManager.currentUser) {
            saveResultSection.style.display = 'block';
        }

        // Track mode switch
        if (typeof pendo !== 'undefined') {
            pendo.track('comparison_mode_switched', {
                new_mode: 'normal',
                previous_mode: 'comparison'
            });
        }
    }

    /**
     * Switch to comparison view (side-by-side layout)
     */
    function switchToComparisonMode() {
        const normalContainer = document.getElementById('normalViewContainer');
        const comparisonContainer = document.getElementById('comparisonViewContainer');
        const normalInspection = document.getElementById('normalViewInspection');
        const comparisonInspection = document.getElementById('comparisonViewInspection');
        const normalBtn = document.getElementById('normalModeBtn');
        const comparisonBtn = document.getElementById('comparisonModeBtn');
        const saveResultSection = document.getElementById('saveResultSection');

        normalContainer.classList.add('hidden');
        comparisonContainer.classList.remove('hidden');
        normalInspection.classList.add('hidden');
        comparisonInspection.classList.remove('hidden');
        normalBtn.classList.remove('active');
        comparisonBtn.classList.add('active');
        
        // Hide save result section in comparison view
        if (saveResultSection) {
            saveResultSection.style.display = 'none';
        }

        // Update comparison canvases on mode switch
        setTimeout(() => {
            updateComparisonView();
        }, 0);

        // Track mode switch
        if (typeof pendo !== 'undefined') {
            pendo.track('comparison_mode_switched', {
                new_mode: 'comparison',
                previous_mode: 'normal'
            });
        }
    }

    // Global storage for generated index canvases
    let generatedIndexCanvases = {};
    let imageLoaded = false;

    /**
     * Generate a canvas visualization for a specific index
     */
    function generateIndexCanvas(indexKey, imageData, width, height) {
        // Check if already generated
        if (generatedIndexCanvases[indexKey]) {
            return generatedIndexCanvases[indexKey].canvas;
        }

        // Create a temporary canvas for this index
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        const outData = ctx.createImageData(width, height);

        // Extract pixel data
        const pixels = imageData.data;

        // Function to get index value based on key
        function getIndexValue(pixelIndex, R, G, B) {
            let r = R / 255;
            let g = G / 255;
            let b = B / 255;

            const indices = {
                ngrdi: clamp((g - r) / (g + r + 1e-6), -1.0, 1.0),
                exg: clamp(2 * g - r - b, -2.0, 2.0),
                exr: clamp(1.4 * r - g, -2.0, 2.0),
                exgr: clamp((clamp(2 * g - r - b, -2.0, 2.0)) - (clamp(1.4 * r - g, -2.0, 2.0)), -2.0, 2.0),
                vari: clamp((g - r) / (Math.abs(g + r - b) < 1e-5 ? 1e-5 : g + r - b), -1.0, 1.0),
                gli: clamp((2 * g - r - b) / (2 * g + r + b + 1e-6), -1.0, 1.0),
                mgrvi: clamp((g*g - r*r) / (g*g + r*r + 1e-6), -1.0, 1.0),
                rgbvi: clamp((g*g - b*r) / (g*g + b*r + 1e-6), -1.0, 1.0),
                tgi: clamp(g - 0.39 * r - 0.61 * b, -1.0, 1.0),
                ndyi: clamp((g - b) / (g + b + 1e-6), -1.0, 1.0),
                cive: clamp(0.441 * r - 0.811 * g + 0.385 * b + 18.78745, 0.0, 30.0),
                npci: clamp((b - r) / (b + r + 1e-6), -1.0, 1.0),
                exb: clamp(1.4 * b - g, -2.0, 2.0),
                rgri: clamp(r / (g + 1e-6), 0.0, 10.0),
                gbri: clamp(b / (g + 1e-6), 0.0, 10.0),
                ikaw: clamp((r - b) / (r + b + 1e-6), -1.0, 1.0),
                soci: clamp(b / (g * r + 1e-6), 0.0, 10.0),
                bi: clamp(Math.sqrt((r*r + g*g) / 2), 0.0, 1.0),
                sci: clamp((r - g) / (r + g + 1e-6), -1.0, 1.0),
                ri: clamp((r*r) / (b * g*g*g + 1e-6), 0.0, 10.0),
                hi: clamp((2 * r - g - b) / (Math.abs(g - b) < 1e-5 ? 1e-5 : g - b), -5.0, 5.0),
                si: clamp((r - b) / (r + b + 1e-6), -1.0, 1.0)
            };

            return indices[indexKey] !== undefined ? indices[indexKey] : 0;
        }

        // Process pixels and apply color mapping
        for (let i = 0; i < pixels.length; i += 4) {
            const pixelIndex = i / 4;
            let R = pixels[i];
            let G = pixels[i+1];
            let B = pixels[i+2];

            // Determine if this is soil (for soil indices)
            let r = R / 255;
            let g = G / 255;
            let exg = clamp(2 * g - r - B / 255, -2.0, 2.0);
            let isSoil = (exg <= 0);

            // Skip soil indices for vegetation pixels
            if (indexKey.includes('(')) { // Soil indices have names like "soci", "bi", etc.
                if (!isSoil) {
                    // Black out non-soil pixels for soil indices
                    outData.data[i] = outData.data[i+1] = outData.data[i+2] = 0;
                    outData.data[i+3] = 255;
                    continue;
                }
            }

            // Get index value
            let indexValue = getIndexValue(indexKey, R, G, B);

            // Determine color based on index type
            let rgb;
            if (indexKey === 'orig') {
                // Original image - just copy RGB
                rgb = [R, G, B];
            } else if (indexKey.startsWith('soci') || indexKey === 'bi' || indexKey === 'sci' || indexKey === 'ri' || indexKey === 'hi' || indexKey === 'si') {
                // Soil indices - use coffee color
                rgb = getCoffeeColor(indexValue);
            } else {
                // Vegetation indices - use light terrain color
                rgb = getLightTerrainColor(indexValue);
            }

            outData.data[i] = rgb[0];
            outData.data[i+1] = rgb[1];
            outData.data[i+2] = rgb[2];
            outData.data[i+3] = 255;
        }

        ctx.putImageData(outData, 0, 0);

        // Cache the generated canvas
        generatedIndexCanvases[indexKey] = { canvas: canvas, imageData: outData };

        return canvas;
    }

    /**
     * Update title based on canvas type or index key
     */
    function updateComparisonTitle(canvasType, titleElement) {
        titleElement.textContent = getIndexDisplayName(canvasType);
    }

    /**
     * Get display name for an index key
     */
    function getIndexDisplayName(key) {
        const names = {
            'orig': 'Original Image',
            'ngrdi': 'NGRDI',
            'exg': 'ExG',
            'exr': 'ExR',
            'exgr': 'ExGR',
            'vari': 'VARI',
            'gli': 'GLI',
            'mgrvi': 'MGRVI',
            'rgbvi': 'RGBVI',
            'tgi': 'TGI',
            'ndyi': 'NDYI',
            'cive': 'CIVE',
            'npci': 'NPCI',
            'exb': 'ExB',
            'rgri': 'RGRI',
            'gbri': 'GBRI',
            'ikaw': 'IKAW',
            'soci': 'SOCI',
            'bi': 'BI',
            'sci': 'SCI',
            'ri': 'RI',
            'hi': 'HI',
            'si': 'SI'
        };
        return names[key] || key;
    }

    /**
     * Convert comparison key to metric name used in i18n and thresholds
     */
    function convertKeyToMetricName(key) {
        const mapping = {
            'orig': 'NGRDI', // Default for original image
            'ngrdi': 'NGRDI',
            'exg': 'ExG',
            'exr': 'ExR',
            'exgr': 'ExGR',
            'vari': 'VARI',
            'gli': 'GLI',
            'mgrvi': 'MGRVI',
            'rgbvi': 'RGBVI',
            'tgi': 'TGI',
            'ndyi': 'NDYI',
            'cive': 'CIVE',
            'npci': 'NPCI',
            'exb': 'ExB',
            'rgri': 'RGRI',
            'gbri': 'GBRI',
            'ikaw': 'IKAW',
            'soci': 'SOCI (Soil)',
            'bi': 'BI (Soil)',
            'sci': 'SCI (Soil)',
            'ri': 'RI (Soil)',
            'hi': 'HI (Soil)',
            'si': 'SI (Soil)'
        };
        return mapping[key] || 'NGRDI';
    }

    /**
     * Update the comparison view based on selected indices
     */
    function updateComparisonView() {
        const leftSelect = document.getElementById('comparisonLeft');
        const rightSelect = document.getElementById('comparisonRight');
        const leftCanvas = document.getElementById('canvasComparisonLeft');
        const rightCanvas = document.getElementById('canvasComparisonRight');
        const leftTitle = document.getElementById('leftTitle');
        const rightTitle = document.getElementById('rightTitle');

        if (!leftSelect || !rightSelect || !leftCanvas || !rightCanvas) return;

        // Check if original canvas has content
        const origCanvas = document.getElementById('canvasOrig');
        if (!origCanvas || !imageLoaded) {
            // No image loaded, clear comparison canvases
            leftCanvas.width = 0;
            rightCanvas.width = 0;
            return;
        }

        const leftValue = leftSelect.value;
        const rightValue = rightSelect.value;

        // Get the image data from original canvas
        const origCtx = origCanvas.getContext('2d');
        const imageData = origCtx.getImageData(0, 0, origCanvas.width, origCanvas.height);

        // Generate or copy canvas for left side
        if (leftValue === 'orig') {
            copyCanvasToComparison('orig', leftCanvas);
        } else {
            const generatedCanvas = generateIndexCanvas(leftValue, imageData, origCanvas.width, origCanvas.height);
            leftCanvas.width = generatedCanvas.width;
            leftCanvas.height = generatedCanvas.height;
            const ctx = leftCanvas.getContext('2d');
            ctx.drawImage(generatedCanvas, 0, 0);
        }

        // Generate or copy canvas for right side
        if (rightValue === 'orig') {
            copyCanvasToComparison('orig', rightCanvas);
        } else {
            const generatedCanvas = generateIndexCanvas(rightValue, imageData, origCanvas.width, origCanvas.height);
            rightCanvas.width = generatedCanvas.width;
            rightCanvas.height = generatedCanvas.height;
            const ctx = rightCanvas.getContext('2d');
            ctx.drawImage(generatedCanvas, 0, 0);
        }

        // Update titles
        updateComparisonTitle(leftValue, leftTitle);
        updateComparisonTitle(rightValue, rightTitle);

        // Mark containers as having image
        const leftContainer = leftCanvas.closest('.comparison-canvas-container');
        const rightContainer = rightCanvas.closest('.comparison-canvas-container');

        if (leftCanvas.width > 0) {
            leftContainer.classList.add('has-image');
        }
        
        if (rightCanvas.width > 0) {
            rightContainer.classList.add('has-image');
        }

        // Update inspection panel with statistics
        updateComparisonInspection();
    }

    /**
     * Copy canvas data from original canvas to comparison canvas
     */
    function copyCanvasToComparison(canvasType, targetCanvas) {
        const sourceCanvasId = {
            'orig': 'canvasOrig',
            'ngrdi': 'canvasNgrdi',
            'soci': 'canvasSoci'
        }[canvasType];

        if (!sourceCanvasId) return;

        const sourceCanvas = document.getElementById(sourceCanvasId);
        if (!sourceCanvas || sourceCanvas.width === 0) return;

        // Set target canvas size to match source
        targetCanvas.width = sourceCanvas.width;
        targetCanvas.height = sourceCanvas.height;

        // Copy image data
        const sourceCtx = sourceCanvas.getContext('2d');
        const targetCtx = targetCanvas.getContext('2d');
        const imageData = sourceCtx.getImageData(0, 0, sourceCanvas.width, sourceCanvas.height);
        targetCtx.putImageData(imageData, 0, 0);
    }

    /**
     * Calculate statistics for a given index based on image data
     */
    function calculateIndexStatistics(indexKey, imageData, width, height) {
        const pixels = imageData.data;
        let values = [];

        for (let i = 0; i < pixels.length; i += 4) {
            let R = pixels[i];
            let G = pixels[i+1];
            let B = pixels[i+2];

            let r = R / 255;
            let g = G / 255;
            let b = B / 255;

            // Calculate the index value
            let indexValue = 0;
            switch(indexKey) {
                case 'orig': indexValue = 0; break;
                case 'ngrdi': indexValue = clamp((g - r) / (g + r + 1e-6), -1.0, 1.0); break;
                case 'exg': indexValue = clamp(2 * g - r - b, -2.0, 2.0); break;
                case 'exr': indexValue = clamp(1.4 * r - g, -2.0, 2.0); break;
                case 'exgr': 
                    let exg = clamp(2 * g - r - b, -2.0, 2.0);
                    let exr = clamp(1.4 * r - g, -2.0, 2.0);
                    indexValue = clamp(exg - exr, -2.0, 2.0);
                    break;
                case 'vari': 
                    let denomVari = g + r - b;
                    if (Math.abs(denomVari) < 1e-5) denomVari = 1e-5;
                    indexValue = clamp((g - r) / denomVari, -1.0, 1.0);
                    break;
                case 'gli': indexValue = clamp((2 * g - r - b) / (2 * g + r + b + 1e-6), -1.0, 1.0); break;
                case 'mgrvi': indexValue = clamp((g*g - r*r) / (g*g + r*r + 1e-6), -1.0, 1.0); break;
                case 'rgbvi': indexValue = clamp((g*g - b*r) / (g*g + b*r + 1e-6), -1.0, 1.0); break;
                case 'tgi': indexValue = clamp(g - 0.39 * r - 0.61 * b, -1.0, 1.0); break;
                case 'ndyi': indexValue = clamp((g - b) / (g + b + 1e-6), -1.0, 1.0); break;
                case 'cive': indexValue = clamp(0.441 * r - 0.811 * g + 0.385 * b + 18.78745, 0.0, 30.0); break;
                case 'npci': indexValue = clamp((b - r) / (b + r + 1e-6), -1.0, 1.0); break;
                case 'exb': indexValue = clamp(1.4 * b - g, -2.0, 2.0); break;
                case 'rgri': indexValue = clamp(r / (g + 1e-6), 0.0, 10.0); break;
                case 'gbri': indexValue = clamp(b / (g + 1e-6), 0.0, 10.0); break;
                case 'ikaw': indexValue = clamp((r - b) / (r + b + 1e-6), -1.0, 1.0); break;
                case 'soci': indexValue = clamp(b / (g * r + 1e-6), 0.0, 10.0); break;
                case 'bi': indexValue = clamp(Math.sqrt((r*r + g*g) / 2), 0.0, 1.0); break;
                case 'sci': indexValue = clamp((r - g) / (r + g + 1e-6), -1.0, 1.0); break;
                case 'ri': indexValue = clamp((r*r) / (b * g*g*g + 1e-6), 0.0, 10.0); break;
                case 'hi': 
                    let denomHi = g - b;
                    if (Math.abs(denomHi) < 1e-5) denomHi = 1e-5;
                    indexValue = clamp((2 * r - g - b) / denomHi, -5.0, 5.0);
                    break;
                case 'si': indexValue = clamp((r - b) / (r + b + 1e-6), -1.0, 1.0); break;
            }

            values.push(indexValue);
        }

        // Calculate mean
        const mean = values.reduce((a, b) => a + b, 0) / values.length;
        return mean;
    }

    /**
     * Update comparison inspection panel with statistics
     */
    function updateComparisonInspection() {
        const leftSelect = document.getElementById('comparisonLeft');
        const rightSelect = document.getElementById('comparisonRight');

        if (!leftSelect || !rightSelect) {
            console.warn('Comparison selects not found');
            return;
        }

        const origCanvas = document.getElementById('canvasOrig');
        if (!origCanvas || !imageLoaded) {
            console.warn('Original canvas not found or empty');
            return;
        }

        const leftKey = leftSelect.value;
        const rightKey = rightSelect.value;

        console.log('Updating comparison inspection for:', leftKey, rightKey);

        // Get image data
        const origCtx = origCanvas.getContext('2d');
        const imageData = origCtx.getImageData(0, 0, origCanvas.width, origCanvas.height);

        // Convert keys to metric names
        const leftMetricName = convertKeyToMetricName(leftKey);
        const rightMetricName = convertKeyToMetricName(rightKey);

        // Calculate statistics for left side
        const leftMean = calculateIndexStatistics(leftKey, imageData, origCanvas.width, origCanvas.height);
        const leftDiagnosis = i18n.getDiagnosis(leftMetricName, leftMean, thresholds);
        const leftContext = i18n.get('interpretations.' + leftMetricName) || 'No context available';

        console.log('Left:', leftMetricName, leftMean, leftDiagnosis);

        // Update left side elements
        const leftNameElem = document.getElementById('compLeftIndexName');
        const leftValueElem = document.getElementById('compLeftValue');
        const leftDiagnoseElem = document.getElementById('compLeftDiagnose');
        const leftContextElem = document.getElementById('compLeftContext');

        if (leftNameElem) leftNameElem.textContent = getIndexDisplayName(leftKey);
        if (leftValueElem) leftValueElem.textContent = leftMean.toFixed(5);
        if (leftDiagnoseElem) leftDiagnoseElem.textContent = leftDiagnosis;
        if (leftContextElem) leftContextElem.textContent = leftContext;

        // Calculate statistics for right side
        const rightMean = calculateIndexStatistics(rightKey, imageData, origCanvas.width, origCanvas.height);
        const rightDiagnosis = i18n.getDiagnosis(rightMetricName, rightMean, thresholds);
        const rightContext = i18n.get('interpretations.' + rightMetricName) || 'No context available';

        console.log('Right:', rightMetricName, rightMean, rightDiagnosis);

        // Update right side elements
        const rightNameElem = document.getElementById('compRightIndexName');
        const rightValueElem = document.getElementById('compRightValue');
        const rightDiagnoseElem = document.getElementById('compRightDiagnose');
        const rightContextElem = document.getElementById('compRightContext');

        if (rightNameElem) rightNameElem.textContent = getIndexDisplayName(rightKey);
        if (rightValueElem) rightValueElem.textContent = rightMean.toFixed(5);
        if (rightDiagnoseElem) rightDiagnoseElem.textContent = rightDiagnosis;
        if (rightContextElem) rightContextElem.textContent = rightContext;
    }

    /**
     * Override the processAgronomyData function to also update comparison view
     * We'll wrap the existing function
     */
    const originalProcessAgronomyData = window.processAgronomyData;
    window.processAgronomyData = function(img) {
        // Clear cached generated index canvases and reset image state
        generatedIndexCanvases = {};
        imageLoaded = false;

        // Call original function
        originalProcessAgronomyData.call(this, img);

        // Image is now loaded after processing
        imageLoaded = true;

        // After processing, update comparison view if in comparison mode
        const comparisonContainer = document.getElementById('comparisonViewContainer');
        if (comparisonContainer && !comparisonContainer.classList.contains('hidden')) {
            setTimeout(() => {
                updateComparisonView();
            }, 0);
        }
    };
