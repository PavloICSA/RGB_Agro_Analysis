// Internationalization Localization Module
// Supports English (en) and Ukrainian (uk)

const i18n = {
    currentLanguage: 'en',
    
    // English translations
    en: {
        // App title and tagline
        appTitle: 'RGB AgroAnalysis',
        appTagline: 'Precision Analytics of Field and Satellite RGB Imagery',
        landingDescription: 'Advanced RGB imagery analysis for precision agriculture. Get instant insights into crop health and soil conditions using general-purpose and specific RGB indices.',
        
        // Auth buttons
        guestAccess: 'Continue as Guest',
        signIn: 'Sign In',
        createAccount: 'Create Account',
        back: '← Back',
        demoAccount: '🎯 Demo Account',
        signingIn: 'Signing in...',
        creatingAccount: 'Creating account...',
        saving: '⏳ Saving...',
        
        // Auth form labels
        email: 'Email',
        password: 'Password',
        confirmPassword: 'Confirm Password',
        fullName: 'Full Name',
        noAccount: "Don't have an account?",
        registerHere: 'Register here',
        alreadyHaveAccount: 'Already have an account?',
        signInHere: 'Sign in here',
        
        // Features
        features: 'Features:',
        feature1: '22 Vegetation & Soil Indices',
        feature2: 'Precision Analytics',
        feature3: 'Privacy First - Client-Side',
        feature4: 'One-Click Export',
        feature5: 'Supabase Integration',
        feature6: 'Built-In Statistical Powerhouse',
        
        title: 'Precision RGB Imagery Analytics Suite',
        subtitle: 'Analyze Remote Sensing, UAV and Ground-Truth RGB Images',
        uploadPrompt: 'Drop field image here or click to upload using File Browser',
        originalImage: 'Original Image',
        ngrdiMap: 'NGRDI Map (Vegetation)',
        sociMap: 'SOCI Map (Soil Only)',
        inspection: 'Interactive Agronomic Inspection',
        chooseMetric: 'Choose Target Metric:',
        indexMean: 'Index Mean Value:',
        agronomiDiagnostics: 'Agronomic Diagnostics:',
        agriculturalContext: 'Agricultural Context:',
        selectUpload: 'Select or upload field sample imagery to isolate indicators.',
        noData: 'No data parsed.',
        capabilities: 'System Capabilities:',
        capability1: 'Automated non-soil background elimination driven by synchronized ExG matrices.',
        capability2: 'High-throughput localized RGB normalization filtering out illumination variances.',
        capability3: 'On-the-fly computational synthesis of 22 standard agronomic indices.',
        capability4: 'Supabase for safe storage of user data and history of records',
        capability5: 'Powerful mathematical toolkit for descriptive statistics and trend analysis',
        credits: 'Developed by Dr. Pavlo LYKHOVYD, Senior Researcher | Institute of Water Problems and Land Reclamation of NAAS',
        
        // Index interpretations
        interpretations: {
    "NGRDI": "Normalized Green-Red Difference Index. Tracks canopy greenness and vegetative vigor; high values indicate robust chlorophyll absorption and active photosynthetic capacity.",
    "ExG": "Excess Green Index. Maximizes the green spectral signal against bare backgrounds; ideal for early crop emergence detection and canopy development tracing.",
    "ExR": "Excess Red Index. Accentuates background soil reflectance, surface crop residues, or anomalies associated with canopy senescence and dieback.",
    "ExGR": "Excess Green minus Excess Red. Suppresses soil background reflectance to isolate active vegetative tissue structures.",
    "VARI": "Visible Atmospherically Resistant Index. Estimates fractional vegetation cover while mitigating atmospheric scattering effects in the visible spectrum.",
    "GLI": "Green Leaf Index. Discriminates living green biomass from surrounding senescent residue, crop debris, and background soil matrices.",
    "MGRVI": "Modified Green-Red Vegetation Index. Highly sensitive to subtle variations in canopy chlorophyll concentration and early phenological shifts.",
    "RGBVI": "Red-Green-Blue Vegetation Index. Utilized for the non-destructive estimation of above-ground vegetative biomass and volumetric yield profiling.",
    "TGI": "Triangular Greenness Index. Estimates foliar chlorophyll concentration based on the spectral triangle area, minimizing sensitivity to leaf area index (LAI) at canopy closure.",
    "NDYI": "Normalized Difference Yellowness Index. Detects chlorosis, early-stage nitrogen deficiency, or crop flowering phenophases.",
    "CIVE": "Color Index for Vegetation Extraction. A computer vision metric optimized for automated crop-weed spatial segmentation against soil backgrounds.",
    "NPCI": "Normalized Pigment Chlorophyll Index. Monitors the carotenoid-to-chlorophyll ratio, serving as a sensitive indicator for early canopy nitrogen stress.",
    "ExB": "Excess Blue Index. Effective for detecting localized field drainage anomalies, surface waterlogging, or specific crop flowering stages.",
    "RGRI": "Red-Green Ratio Index. Tracks severe physiological plant stress, alterations in canopy pigment composition, and natural senescence.",
    "GBRI": "Green-Blue Ratio Index. Evaluates canopy depth profiles and quantifies structural shading variations within dense crop rows.",
    "IKAW": "Kawashima Index. Calibrated to estimate foliar chlorophyll variations while minimizing sensitivity to leaf orientation and specular reflection angles.",
    "SOCI (Soil)": "Soil Organic Carbon Index. Maps relative organic carbon levels and dark organic matter distributions within exposed topsoil zones.",
    "BI (Soil)": "Soil Brightness Index. Highlights surface mineral exposure, albedo variations, structural crusting, and localized salinization risks.",
    "SCI (Soil)": "Soil Color Index. Differentiates highly weathered, iron-oxide-rich clay horizons from darker, organic-rich topsoil layers.",
    "RI (Soil)": "Soil Redness Index. Quantifies hematite concentrations and advanced pedogenic soil weathering intensities.",
    "HI (Soil)": "Soil Hue Index. Captures variations in the soil matrix hue induced by drainage dynamics and long-term moisture fluctuations.",
    "SI (Soil)": "Soil Saturation Index. Evaluates soil color chroma, indicating iron reduction states and prolonged hydromorphic water saturation profiles."
},
        
        // Diagnostic interpretations
        diagnostics: {
    "NGRDI": "Healthy Vegetation: High chlorophyll absorption indicative of vigorous vegetative growth.",
    "NGRDI_alt": "Sparse Cover / Transition: Mixed soil signature or advanced vegetation stress.",
    "ExG": "High Green Biomass: Accelerated crop emergence and a well-developed canopy architecture.",
    "ExG_alt": "Soil Background: Fallow ground or exposed soil dominating the pixel area.",
    "ExR": "High Substrate Reflectance: Exposed soil background, structural crusting, or crop residue.",
    "ExR_alt": "Dense Canopy: Low red reflectance due to high photosynthetic absorption.",
    "ExGR": "Pure Plant Material: High-confidence vegetation signal with suppressed soil background noise.",
    "ExGR_alt": "Dominant Background: Exposed topsoil profile or senescent crop residue matrix.",
    "VARI": "Robust Crop Fraction: Favorable canopy cover with minimized atmospheric interference.",
    "VARI_alt": "Soil or Degradation: Minimal canopy cover or severe vegetation stress and damage.",
    "GLI": "Photosynthetically Active: Viable green canopy structures exhibiting active photosynthetic performance.",
    "GLI_alt": "Senescent / Non-Plant: Dominancy of senescent crop residue or bare topsoil.",
    "MGRVI": "Optimal Chlorophyll: High upper-canopy chlorophyll activity and robust physiological status.",
    "MGRVI_alt": "Background Dominance: Fallow or open canopy status lacking active photosynthetic components.",
    "RGBVI": "High Biomass Volume: Advanced vegetative growth stage correlated with high yield potential.",
    "RGBVI_alt": "Low Biomass: Fallow ground, early germination phase, or severe crop lodging.",
    "TGI": "High Chlorophyll Density: Elevated foliar nitrogen levels and high pigment concentration.",
    "TGI_alt": "Chlorophyll Deficient: Pronounced physiological stress, nutrient deficiency, or soil background noise.",
    "NDYI": "Advanced Yellowness: Indicative of crop flowering phenophases or vegetative senescence.",
    "NDYI_alt": "Standard Balance: Nominal baseline yellow-to-green pigment ratios.",
    "CIVE": "Automated Crop Extraction: Confirms a high-density presence of green vegetative tissue.",
    "CIVE_alt": "Exposed Substrate: Bare soil surface area or non-vegetated inter-row corridors.",
    "NPCI": "High Carotenoid Ratio: Elevated carotenoid-to-chlorophyll ratio indicating nitrogen deficiency or senescence.",
    "NPCI_alt": "Optimal Nitrogen: High relative chlorophyll concentration indicating robust nutrient status.",
    "ExB": "Reflective Inversion: Potential field waterlogging, surface ponding, or significant flowering changes.",
    "ExB_alt": "Standard Base: Nominal soil moisture conditions devoid of surface water pooling anomalies.",
    "RGRI": "Severe Stress: Elevated red-to-green reflectance ratio indicating acute vegetation stress.",
    "RGRI_alt": "Optimal Health: Dominant green reflectance corresponding to peak photosynthetic capacity.",
    "GBRI": "Dense Row Shading: Pronounced internal canopy shadowing within mature crop rows.",
    "GBRI_alt": "Open Layout: Sparse canopy architecture permitting direct ambient soil surface illumination.",
    "IKAW": "Pure Chlorophyll Shift: Foliar biochemical variance independent of canopy structural noise.",
    "IKAW_alt": "Baseline State: Minimal foliar chlorophyll variation or prominent soil background reflectance.",
    "SOCI (Soil)": "High Carbon Content: Strong organic carbon indicators associated with humic-rich soils.",
    "SOCI (Soil)_alt": "Mineral Dominant: Low organic matter signature characteristic of eroded topsoils.",
    "BI (Soil)": "High Refractive Surface: Elevated soil crusting, low matrix potential, or high salinity risks.",
    "BI (Soil)_alt": "Damp / Organic: Reduced surface reflectance induced by elevated soil moisture or high organic matter.",
    "SCI (Soil)": "Oxide Dominant: Elevated iron oxide concentration (e.g., hematite) typical of highly weathered soils.",
    "SCI (Soil)_alt": "Humic / Gleyed: Suppressed redness index indicating organic-rich or poorly drained hydromorphic soils.",
    "RI (Soil)": "Strong Rubification: Advanced pedogenic weathering characterized by significant iron accumulation.",
    "RI (Soil)_alt": "Subdued Mineralogy: Typical baseline soil profile with low iron oxide concentrations.",
    "HI (Soil)": "Hue Variation: Shifts in dominant soil matrix wavelengths driven by hydration state changes.",
    "HI (Soil)_alt": "Uniform Matrix: Homogeneous soil color distribution indicating stable drainage patterns.",
    "SI (Soil)": "Color Purity Signature: High chroma indicative of distinct iron or mineral compositions.",
    "SI (Soil)_alt": "Reduced Profile: Low chroma indicating hydromorphic conditions and potential iron reduction."
},
        
        // Archive translations
        archive: 'Archive',
        archiveTitle: '📊 Analysis Archive',
        searchPlaceholder: 'Search by field group or index...',
        allIndices: 'All Indices',
        exportCSV: '📥 Export as CSV',
        totalRecords: 'Total Records:',
        dateRange: 'Date Range:',
        fieldGroup: 'Field Group',
        date: 'Date',
        indexName: 'Index Name',
        value: 'Value',
        actions: 'Actions',
        noRecords: '📭 No analysis records found. Start by uploading and analyzing field images!',
        page: 'Page',
        previous: '← Previous',
        next: 'Next →',
        deleteRecord: '🗑️ Delete Record',
        areYouSure: 'Are you sure you want to delete this record?',
        cannotUndo: 'This action cannot be undone.',
        cancel: 'Cancel',
        deleteConfirm: 'Delete Record',
        recordDeleted: '✅ Record deleted successfully',
        noRecordsExport: 'No records to export',
        loading: 'Loading...',
        
        // User greeting
        welcome: 'Welcome,',
        logout: 'Logout',
        
        // Save result section
        analysisDate: 'Analysis Date:',
        fieldGroupName: 'Field Group Name (optional):',
        fieldGroupPlaceholder: 'e.g., Field A, North Plot',
        saveResult: '💾 Save Result',
        
        // Archive button
        archiveBtn: '📊 Archive',
        
        // Descriptive Statistics & Trend Analysis
        descriptiveStatistics: 'Descriptive Statistics',
        analyzeTrend: 'Analyze Trend',
        selectRecordings: 'Select Archive Recordings',
        noRecordingsSelected: 'Please select at least one recording',
        mean: 'Mean',
        median: 'Median',
        min: 'Minimum',
        max: 'Maximum',
        range: 'Range',
        q1: 'Q1 (25%)',
        q3: 'Q3 (75%)',
        iqr: 'Interquartile Range',
        stdDev: 'Standard Deviation',
        variance: 'Variance',
        cv: 'Coefficient of Variation',
        skewness: 'Skewness',
        kurtosis: 'Kurtosis',
        count: 'Count',
        rSquared: 'R² (Goodness of Fit)',
        trendSlope: 'Trend Slope',
        outliers: 'Outliers',
        detected: 'detected',
        trendAnalysis: 'Trend Analysis',
        barChart: 'Value Distribution',
        movingAverage: 'Moving Average (5-period)',
        linearTrend: 'Linear Trend',
        exportResults: '📥 Export Results',
        exportPlot: '📊 Export Plot',
        statisticsResults: 'Statistical Results',
        chart: 'Chart',
        
        // Statistic column headers
        statistic: 'Statistic',
        metric: 'Metric',
        
        // Messages
        resultSaved: '✅ Result saved!',
        noRecordsForIndex: 'No records found for selected index',
        noRecordsAvailable: 'No records available',
        
        // Bulk operations
        recordsSelected: 'records selected',
        clearAll: 'Clear All',
        exportSelected: '📥 Export Selected',
        deleteSelected: '🗑️ Delete Selected',
        bulkDeleteConfirm: '🗑️ Delete Records',
        bulkDeleteMessage: 'Are you sure you want to delete these {{count}} records? This action cannot be undone.',
        recordsDeleted: '✅ {{count}} records deleted successfully',
        noRecordsSelectedForBulk: 'Please select at least one record to perform this action',
        
        // Comparison Mode
        normalView: '📊 Normal View',
        comparisonView: '🔄 Comparison View',
        leftImage: 'Left Image:',
        rightImage: 'Right Image:'
    },
    
    // Ukrainian translations (academic)
    uk: {
        // App title and tagline
        appTitle: 'RGB AgroAnalysis',
        appTagline: 'Деталізована аналітика польових і супутникових RGB знімків',
        landingDescription: 'Розширена аналітика RGB зображень для точного землеробства. Отримуйте миттєві знання про стан посівів і ґрунту завдяки універсальним і специфічним RGB індексам.',
        
        // Auth buttons
        guestAccess: 'Продовжити як гість',
        signIn: 'Вхід',
        createAccount: 'Створити аккаунт',
        back: '← Назад',
        demoAccount: '🎯 Демо-аккаунт',
        signingIn: 'Вхід...',
        creatingAccount: 'Створення аккаунту...',
        saving: '⏳ Збереження...',
        
        // Auth form labels
        email: 'Електронна пошта',
        password: 'Пароль',
        confirmPassword: 'Підтвердіть пароль',
        fullName: 'Повне ім\'я',
        noAccount: 'Не маєте аккаунту?',
        registerHere: 'Зареєструватись тут',
        alreadyHaveAccount: 'Вже маєте аккаунт?',
        signInHere: 'Введіть тут',
        
        // Features
        features: 'Особливості:',
        feature1: '22 індекси рослинності та грунту',
        feature2: 'Високоточна аналітика',
        feature3: 'Приватність і безпека даних - на першому місці',
        feature4: 'Експорт в один клік',
        feature5: 'Інтеграція з Supabase',
        feature6: 'Вбудований статистичний інструментарій',
        
        title: 'Комплекс аналітики RGB знімків для точного землеробства',
        subtitle: 'Аналізуйте суптникові, БПЛА та наземні RGB зображення',
        uploadPrompt: 'Перетягніть зображення сюди або клікніть для завантаження через файлову систему',
        originalImage: 'Вихідне зображення',
        ngrdiMap: 'Карта NGRDI (рослинність)',
        sociMap: 'Карта SOCI (тільки грунт)',
        inspection: 'Інтерактивна агрономічна оцінка',
        chooseMetric: 'Оберіть цільовий індекс:',
        indexMean: 'Середнє значення індексу:',
        agronomiDiagnostics: 'Агрономічна діагностика:',
        agriculturalContext: 'Аграрний контекст:',
        selectUpload: 'Виберіть або завантажте зображення поля для ізоляції індикаторів.',
        noData: 'Дані не проаналізовані.',
        capabilities: 'Можливості системи:',
        capability1: 'Автоматизована елімінація фону позаґрунтових об\'єктів за допомогою синхронізованих матриць ExG.',
        capability2: 'Високопродуктивна локалізована нормалізація RGB з фільтруванням варіацій освітлення.',
        capability3: 'Оперативний обчислювальний синтез 22 стандартних агрономічних індексів.',
        capability4: 'Supabase для безпечного зберігання даних користувача та історії аналізу.',
        capability5: 'Потужний математичний інструментарій для описової статистики та аналізу тренду.',
        credits: 'Розробник: д.с.-г.н.,ст.досл. Павло ЛИХОВИД | Інститут водних проблем і меліорації НААН',
        
        // Index interpretations in Ukrainian
        interpretations: {
    "NGRDI": "Нормалізований диференційний індекс зелені-червоного. Оцінює густоту рослинного покриву та вегетаційну силу; високі значення свідчать про інтенсивне поглинання хлорофілу й активну фотосинтетичну здатність.",
    "ExG": "Індекс надлишкової зелені. Максимізує інтенсивність зеленого спектрального сигналу на фоні відкритого ґрунту; оптимальний для моніторингу ранніх сходів культури та динаміки розвитку рослинного покриву.",
    "ExR": "Індекс надлишкового червоного. Акцентує увагу на фоні відкритого ґрунту, наявності рослинних залишків, структурних змінах ґрунтової кірки або критичних аномаліях відмирання вегетативної маси.",
    "ExGR": "Різниця індексів надлишкової зелені та надлишкового червоного. Мінімізує вплив спектрального відбиття ґрунтового фону для точного виділення життєздатної біомаси.",
    "VARI": "Видимий атмосферно-стійкий індекс. Оцінює частку проекційного покриття живої рослинності, нівелюючи ефекти атмосферного розсіювання у видимому діапазоні спектра.",
    "GLI": "Індекс зеленого листя. Чітко диференціює живу зелену біомасу від сухої соломи, рослинних залишків та фону ґрунтових профілів.",
    "MGRVI": "Модифікований вегетаційний індекс зелені-червоного. Високочутливий до незначних змін концентрації хлорофілу в ярусі деревостану чи травостою та ранніх фенологічних зсувів.",
    "RGBVI": "Вегетаційний індекс червоного-зеленого-синього каналів. Ефективний для неруйнівного оцінювання надземної рослинної біомаси та прогнозування об'ємної врожайності.",
    "TGI": "Трикутний індекс зеленості. Визначає відносну концентрацію хлорофілу в листі на основі площі спектрального трикутника, мінімізуючи чутливість до індексу листкової поверхні (LAI) за умов зімкнутого стеблостою.",
    "NDYI": "Нормалізований диференційний індекс жовтизни. Фіксує прояви хлорозу, ранні стадії азотного дефіциту та специфічні фенологічні фази цвітіння культур.",
    "CIVE": "Колірний індекс для виділення рослинності. Алгоритм комп'ютерного зору, оптимізований для автоматизованої просторової сегментації культурних рослин і бур'янів на фоні ґрунту.",
    "NPCI": "Нормалізований пігментний індекс хлорофілу. Контролює співвідношення каротиноїдів до хлорофілу; є чутливим індикатором для детекції початкових стадій азотного стресу рослин.",
    "ExB": "Індекс надлишкової синяви. Ефективний для картографування локальних порушень дренажу, поверхневого перезволоження ґрунту (затоплення) або інтенсивних фаз цвітіння.",
    "RGRI": "Індекс співвідношення червоного до зеленого. Надійна метрика для моніторингу гострого фізіологічного стресу рослин, трансформації пігментного комплексу та природного старіння (сенесценції).",
    "GBRI": "Індекс співвідношення зеленого до синього. Оцінює вертикальний профіль архітектоніки ценозу та кількісно визначає зміни структурного затінення у щільних міжряддях.",
    "IKAW": "Індекс Кавашими. Спеціально калібрований для оцінювання варіацій вмісту хлорофілу без суттєвого впливу просторової орієнтації листя та кутів дзеркального відбиття.",
    "SOCI (Soil)": "Індекс органічного вуглецю ґрунту. Картографує відносний вміст органічного вуглецю та розподіл гумусових речовин у відкритих верхніх горизонтах ґрунту.",
    "BI (Soil)": "Індекс яскравості ґрунту. Виділяє ділянки з високим альбедо поверхні мінеральних горизонтів, сухої структурної кірки та локальних ризиків вторинного засолення.",
    "SCI (Soil)": "Індекс кольору ґрунту. Диференціює інтенсивно вивітрені глинисті горизонти, збагачені оксидами заліза, від темніших, багатих на органіку шарів.",
    "RI (Soil)": "Індекс червоності ґрунту. Прямо відображає концентрацію гематиту та інтенсивність процесів педогенного вивітрювання ґрунту.",
    "HI (Soil)": "Індекс відтінку ґрунту. Фіксує мікрозміни у спектральних сигнатурах відтінку ґрунтової матриці, зумовлені гідрологічним режимом та тривалим перезволоженням.",
    "SI (Soil)": "Індекс насичення кольору ґрунту. Оцінює чистоту кольору (хрому) ґрунтової матриці, сигналізуючи про інтенсивність процесів рубіфікації або наявність ознак гідроморфізму."
},
        
        // Diagnostic interpretations in Ukrainian
        diagnostics: {
    "NGRDI": "Здорова рослинність: Інтенсивне поглинання в зоні хлорофілу, що відповідає активному вегетативному росту.",
    "NGRDI_alt": "Розріджене покриття / Перехідний стан: Змішана сигнатура ґрунту або високий рівень вегетаційного стресу.",
    "ExG": "Висока зелена біомаса: Дружні сходи культури та добре сформована архітектоніка листкового пологу.",
    "ExG_alt": "Фон ґрунту: Переважання відкритого ґрунту або пару в межах досліджуваного пікселя.",
    "ExR": "Висока відбивна здатність субстрату: Значний вплив ґрунтового фону, утворення кірки або наявність рослинних залишків.",
    "ExR_alt": "Щільний полог: Низьке відбиття в червоній зоні спектра через високе фотосинтетичне поглинання.",
    "ExGR": "Чиста рослинна біомаса: Високодостовірний сигнал вегетації за умови ефективного придушення шуму ґрунту.",
    "ExGR_alt": "Домінування фону: Відкритий ґрунтовий профіль або домінування матриці сухих рослинних залишків.",
    "VARI": "Оптимальна частка покриття: Сприятливий індекс листкової поверхні з мінімізованим впливом атмосферних завад.",
    "VARI_alt": "Деградація або відкритий ґрунт: Відсутність рослинного покриву або критичне пошкодження/стрес рослинності.",
    "GLI": "Фотосинтетично активна біомаса: Підтверджує наявність життєздатних структур зеленого листя з високим рівнем клітинного здоров'я.",
    "GLI_alt": "Сенесцентна / Нерослинна маса: Повне переважання відмерлих решток або відкритого верхнього шару ґрунту.",
    "MGRVI": "Оптимальний вміст хлорофілу: Висока активність хлорофілу у верхньому ярусі та стабільний фізіологічний стан листя.",
    "MGRVI_alt": "Домінування фону: Стан відкритого поля; відсутність активних фотосинтетичних елементів.",
    "RGBVI": "Високий об'єм біомаси: Пізня фаза вегетативного росту, що корелює з високим потенціалом урожайності.",
    "RGBVI_alt": "Низька біомаса: Відкритий ґрунт, початкова фаза геофітної появи сходів або тяжке полягання посівів.",
    "TGI": "Висока щільність хлорофілу: Ознаки належного забезпечення посівів азотом та висока концентрація пігментів.",
    "TGI_alt": "Дефіцит хлорофілу: Виражений фізіологічний стрес, брак поживних речовин або високий рівень шуму відкритого ґрунту.",
    "NDYI": "Інтенсивна жовтизна: Чіткий індикатор фенологічних фаз цвітіння або початку процесів старіння (сенесценції).",
    "NDYI_alt": "Номінальний баланс: Типові базові співвідношення жовтого та зеленого пігментів.",
    "CIVE": "Автоматизоване виділення культури: Підтверджує високу щільність проекційного покриття живої рослинної тканини.",
    "CIVE_alt": "Відкритий субстрат: Чиста поверхня ґрунту або невегетовані міжряддя.",
    "NPCI": "Висока концентрація каротиноїдів: Зсув пігментного балансу внаслідок дефіциту азоту, клітинного стресу або старіння.",
    "NPCI_alt": "Оптимальний рівень азоту: Висока відносна концентрація хлорофілу; належний трофічний статус рослин.",
    "ExB": "Інверсія відбивної здатності: Ознака можливого локального перезволоження, застою води або суттєвої зміни архітектоніки під час цвітіння.",
    "ExB_alt": "Стандартний базис: Номінальний баланс вологи без ознак поверхневого затоплення чи підтоплення.",
    "RGRI": "Гострий стрес: Високе співвідношення відбиття в червоному/зеленому діапазонах, що вказує на пошкодження рослин.",
    "RGRI_alt": "Оптимальний стан: Домінування відбиття в зеленій зоні, що відповідає максимальній фотосинтетичній здатності.",
    "GBRI": "Інтенсивне затінення міжрядь: Виражений ефект внутрішньоценотичного затінення у зрілих посівах.",
    "GBRI_alt": "Відкрита структура: Розріджений рослинний полог, що забезпечує пряме надходження сонячної радіації до поверхні ґрунту.",
    "IKAW": "Чистий зсув хлорофілу: Фіксація варіацій біохімічного складу листя без впливу його просторової орієнтації.",
    "IKAW_alt": "Базовий стан: Мінімальна варіабельність вмісту хлорофілу або сильний вплив фонового відбиття субстрату.",
    "SOCI (Soil)": "Високий вміст вуглецю: Виражені ознаки накопичення гумусових речовин в органічній матриці ґрунту.",
    "SOCI (Soil)_alt": "Переважання мінеральної фази: Низький вміст органічної речовини, характерний для еродованих ґрунтів.",
    "BI (Soil)": "Висока відбивна здатність поверхні: Ознаки утворення щільної ґрунтової кірки, низького матричного потенціалу або ризику засолення.",
    "BI (Soil)_alt": "Вологий / Гумусований стан: Зниження альбедо поверхні під впливом високої вологості або значного вмісту органічного вуглецю.",
    "SCI (Soil)": "Переважання оксидних форм: Підвищений вміст оксидів заліза (зокрема гематиту), властивий сильно вивітреним ґрунтам.",
    "SCI (Soil)_alt": "Гумусований / Глейовий стан: Низькі значення індексу червоності, що вказують на високий вміст органіки або тривале гідроморфне перезволоження.",
    "RI (Soil)": "Виражена рубіфікація: Інтенсивні процеси педогенного вивітрювання з високим рівнем акумуляції заліза.",
    "RI (Soil)_alt": "Слабка диференціація мінерального складу: Стандартний профіль ґрунту з низьким вмістом оксидів заліза.",
    "HI (Soil)": "Варіація відтінку ґрунту: Зміни в домінантних довжинах хвиль спектрального відбиття через коливання рівнів зволоження та незадовільний дренаж.",
    "HI (Soil)_alt": "Однорідна матриця: Стабільний просторовий розподіл кольору ґрунту за відсутності ознак порушення дренажу.",
    "SI (Soil)": "Висока насиченість кольору: Виражена спектральна хроматичність, зумовлена специфікою залізистих чи мінеральних комплексів.",
    "SI (Soil)_alt": "Відновний профіль: Низька насиченість кольору, що свідчить про процеси гідроморфного відновлення заліза."
},
        
        // Archive translations
        archive: 'Архів',
        archiveTitle: '📊 Архів аналізу',
        searchPlaceholder: 'Пошук за групою поля або індексом...',
        allIndices: 'Всі індекси',
        exportCSV: '📥 Експортувати як CSV',
        totalRecords: 'Всього записів:',
        dateRange: 'Діапазон дат:',
        fieldGroup: 'Група полів',
        date: 'Дата',
        indexName: 'Назва індексу',
        value: 'Значення',
        actions: 'Дії',
        noRecords: '📭 Записів про аналіз не знайдено. Почніть з завантаження та аналізу зображень поля!',
        page: 'Сторінка',
        previous: '← Попередня',
        next: 'Далі →',
        deleteRecord: '🗑️ Видалити запис',
        areYouSure: 'Ви впевнені, що хочете видалити цей запис?',
        cannotUndo: 'Цю дію не можна скасувати.',
        cancel: 'Скасувати',
        deleteConfirm: 'Видалити запис',
        recordDeleted: '✅ Запис успішно видалено',
        noRecordsExport: 'Немає записів для експорту',
        loading: 'Завантаження...',
        
        // User greeting
        welcome: 'Ласкаво просимо,',
        logout: 'Вихід',
        
        // Save result section
        analysisDate: 'Дата аналізу:',
        fieldGroupName: 'Назва групи полів (опційно):',
        fieldGroupPlaceholder: 'напр., Поле A, Північна ділянка',
        saveResult: '💾 Зберегти результат',
        
        // Archive button
        archiveBtn: '📊 Архів',
        
        // Descriptive Statistics & Trend Analysis
        descriptiveStatistics: 'Описова статистика',
        analyzeTrend: 'Аналізувати тренд',
        selectRecordings: 'Вибрати записи архіву',
        noRecordingsSelected: 'Будь ласка, виберіть принаймні один запис',
        mean: 'Середнє значення',
        median: 'Медіана',
        min: 'Мінімум',
        max: 'Максимум',
        range: 'Діапазон',
        q1: 'Q1 (25%)',
        q3: 'Q3 (75%)',
        iqr: 'Міжквартильний розмах',
        stdDev: 'Стандартне відхилення',
        variance: 'Дисперсія',
        cv: 'Коефіцієнт варіації',
        skewness: 'Асиметрія',
        kurtosis: 'Ексцес',
        count: 'Кількість',
        rSquared: 'R² (Якість підгону кривої)',
        trendSlope: 'Нахил тренду',
        outliers: 'Викиди',
        detected: 'виявлено',
        trendAnalysis: 'Аналіз тренду',
        barChart: 'Розподіл значень',
        movingAverage: 'Рухоме середнє (5-період)',
        linearTrend: 'Лінійний тренд',
        exportResults: '📥 Експортувати результати',
        exportPlot: '📊 Експортувати графік',
        statisticsResults: 'Результати статистики',
        chart: 'Графік',
        
        // Statistic column headers
        statistic: 'Статистика',
        metric: 'Метрика',
        
        // Messages
        resultSaved: '✅ Результат збережено!',
        noRecordsForIndex: 'Записи для вибраного індексу не знайдені',
        noRecordsAvailable: 'Записи недоступні',
        
        // Bulk operations
        recordsSelected: 'записів вибрано',
        clearAll: 'Очистити все',
        exportSelected: '📥 Експортувати вибрані',
        deleteSelected: '🗑️ Видалити вибрані',
        bulkDeleteConfirm: '🗑️ Видалити записи',
        bulkDeleteMessage: 'Ви впевнені, що хочете видалити ці {{count}} записи? Цю дію не можна скасувати.',
        recordsDeleted: '✅ {{count}} записів успішно видалено',
        noRecordsSelectedForBulk: 'Будь ласка, виберіть принаймні один запис для виконання цієї дії',
        
        // Comparison Mode
        normalView: '📊 Нормальний вид',
        comparisonView: '🔄 Режим порівняння',
        leftImage: 'Ліве зображення:',
        rightImage: 'Праве зображення:'
    },
    
    // Set current language
    setLanguage(lang) {
        if (lang === 'en' || lang === 'uk') {
            this.currentLanguage = lang;
            localStorage.setItem('preferredLanguage', lang);
            this.updatePageLanguage();
        }
    },
    
    // Get translation by key
    get(key) {
        const lang = this[this.currentLanguage];
        
        // Handle nested keys like "interpretations.NGRDI"
        if (key.includes('.')) {
            const [section, subkey] = key.split('.');
            return lang[section]?.[subkey] || key;
        }
        
        return lang[key] || key;
    },
    
    // Get diagnosis based on metric and threshold
    getDiagnosis(metricKey, value, thresholds) {
        const lang = this[this.currentLanguage];
        const diagnostics = lang.diagnostics;
        
        // Select appropriate diagnostic based on metric-specific thresholds
        if (thresholds[metricKey](value)) {
            return diagnostics[metricKey];
        } else {
            return diagnostics[metricKey + '_alt'];
        }
    },
    
    // Update entire page language
    updatePageLanguage() {
        document.documentElement.lang = this.currentLanguage;
        
        // Update title
        document.title = this.get('title');
        
        // Update all text content with data-i18n attributes
        document.querySelectorAll('[data-i18n]').forEach(elem => {
            const key = elem.getAttribute('data-i18n');
            const translated = this.get(key);
            
            // Handle input placeholders
            if (elem.hasAttribute('placeholder')) {
                elem.setAttribute('placeholder', translated);
            }
            // Handle button titles
            else if (elem.hasAttribute('title')) {
                elem.setAttribute('title', translated);
            }
            // Handle innerHTML (for buttons with emoji/HTML content)
            else {
                elem.innerHTML = translated;
            }
        });
        
        // Update select options for metrics
        const selector = document.getElementById('metricSelector');
        if (selector && selector.options.length > 0) {
            // Keep index names unchanged (not translated)
        }
        
        // Update language switcher button
        const langBtn = document.getElementById('langToggle');
        if (langBtn) {
            langBtn.textContent = this.currentLanguage === 'en' ? '🇺🇦 УК' : '🇬🇧 EN';
        }
    },
    
    // Initialize from saved preference
    init() {
        const saved = localStorage.getItem('preferredLanguage');
        if (saved === 'uk') {
            this.setLanguage('uk');
        } else {
            this.setLanguage('en');
        }
    }
};

// Initialize on script load
document.addEventListener('DOMContentLoaded', function() {
    i18n.init();
});
