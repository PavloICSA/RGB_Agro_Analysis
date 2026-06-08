# 🌾 RGB Satellite AgroAnalysis

**Precision Field Analytics in Real-Time**

An advanced satellite imagery analysis platform for precision agriculture. Get instant insights into crop health, soil conditions, and vegetation indices using real-time remote sensing and a comprehensive pedological matrix suite.

---

## 📋 Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [Usage](#usage)
- [Technical Stack](#technical-stack)
- [Architecture](#architecture)
- [Supported Indices](#supported-indices)
- [API Integration](#api-integration)
- [Archive & Analytics](#archive--analytics)
- [Configuration](#configuration)
- [Development](#development)
- [Credits](#credits)

---

## ✨ Features

### Core Analytics
- **📊 22 Vegetation & Soil Indices** — Comprehensive analysis of vegetation health and soil conditions
- **🚀 Real-Time Analysis** — Instant computation of agronomic metrics from uploaded field imagery
- **🔒 Privacy First** — Client-side processing with no server-side image storage
- **✅ One-Click Export** — Export statistical results and trend charts as CSV/PNG
- **🔄 Comparison Mode** — Side-by-side visualization of any two agronomic indices with real-time statistics and diagnostics

### Data Management
- **📈 Supabase Integration** — Secure cloud storage for analysis records and user data
- **🗂️ Analysis Archive** — Browse, filter, and manage historical field analysis records
- **📊 Built-In Statistical Powerhouse** — Descriptive statistics, outlier detection, trend analysis
- **🎯 Trend Analysis** — Linear regression, moving averages, and forecast modeling

### User Experience
- **🌐 Multi-Language Support** — English & Ukrainian interface
- **📱 Responsive Design** — Works seamlessly on desktop and mobile
- **🔐 Authentication** — Secure sign-in, registration, and guest access
- **♿ Accessible** — WCAG-compliant interface design

---

## 🚀 Quick Start

### Demo Account
1. Click **"Sign In"** on the landing page
2. Use demo credentials:
   - Email: `demo@agroanalysis.com`
   - Password: `DemoAccount`
3. Upload a field image to begin analysis

### Guest Access
- Click **"Continue as Guest"** for immediate analysis without authentication

---

## 📦 Installation

### Prerequisites
- Node.js 14+ and npm
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Supabase account (for data persistence)

### Setup Steps

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd RGB\ Satellite\ AgroAnalysis
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Supabase:**
   - Update `config.js` with your Supabase credentials:
     ```javascript
     const SUPABASE_URL = 'your-supabase-url';
     const SUPABASE_ANON_KEY = 'your-anon-key';
     ```

4. **Create `.env` file** (optional, for local development):
   ```bash
   cp .env.example .env
   ```

5. **Run locally:**
   - Open `index.html` directly in your browser, or
   - Use a local server:
     ```bash
     npx http-server
     ```

---

## 💻 Usage

### Basic Workflow

#### 1. Upload Field Image
- Click the upload area or drag an image onto it
- Supported formats: PNG, JPG, JPEG, WebP
- Recommended: High-resolution RGB satellite/drone imagery

#### 2. View Real-Time Metrics
- **Original Image** — Your uploaded field photo
- **NGRDI Map** — Vegetation density visualization (green areas = healthy vegetation)
- **SOCI Map** — Soil-only visualization (non-vegetation pixels)

#### 3. Interactive Inspection
- Select a specific metric from the dropdown (NGRDI, ExG, VARI, etc.)
- View mean value, agronomic diagnostics, and agricultural context
- Save analysis results with field group name and date

#### 4. Archive & Analytics
- **Browse Tab** — View all historical analyses with filtering and search
- **Statistics Tab** — Perform descriptive statistics on selected recordings
- **Trend Analysis** — Analyze temporal trends with linear regression

#### 5. Comparison Mode (Advanced Analysis)
- Click **"🔄 Comparison View"** button to enter side-by-side comparison mode
- **Select Two Indices** — Choose any two from all 22 available agronomic indices
- **Real-Time Visualization** — Both index heatmaps render instantly with color-coded intensity scales
- **Professional Stat Cards** — Display for each selected index showing:
  - Index name and computed mean value
  - Agronomic diagnostics (e.g., "Healthy vegetation" or "Moderate soil activity")
  - Agricultural context and interpretation
- **Dynamic Index Switching** — Change either index on-the-fly with live computation
- **Back to Normal View** — Click **"📊 Normal View"** to return to standard 3-metric layout
- **Note:** Save Result is only available in Normal View for persistent record storage

---

## 🛠️ Technical Stack

### Frontend
- **HTML5** — Semantic markup
- **CSS3** — Flexbox/Grid, responsive design, CSS custom properties
- **JavaScript (ES6+)** — Vanilla JS (no frameworks for lightweight deployment)

### Libraries & Services
- **Chart.js** — Data visualization (trends, distributions)
- **Supabase** — PostgreSQL backend for data persistence
- **Canvas API** — Real-time image processing and metric visualization

### Architecture
- **Client-Side Processing** — All image analysis happens in the browser
- **Modular Design** — Separated concerns (auth, data, math, UI)
- **RESTful Integration** — Supabase API for user data management

---

## 📚 Architecture

### File Structure
```
├── index.html              # Main HTML template
├── style.css              # Global styles & responsive layout
├── app.js                 # Navigation & UI state management
├── auth.js                # Authentication (Supabase integration)
├── config.js              # Configuration (Supabase credentials)
├── db.js                  # Archive manager & analytics engine
├── math.js                # Statistical & agronomic calculations
├── local.js               # Internationalization (i18n)
├── db.html                # Archive modal template
├── package.json           # Dependencies
├── .gitignore             # Git ignore rules
└── README.md              # This file
```

### Key Modules

**app.js** — Main application controller
- Navigation between landing, auth, and main app
- File upload handling
- Canvas rendering coordination

**auth.js** — Authentication manager
- User sign-up, login, logout
- Session persistence
- Supabase auth integration

**db.js** — Database & analytics manager
- Archive browsing and filtering
- Statistical calculations
- Trend chart generation
- CSV/PNG export

**math.js** — Mathematical utilities
- Descriptive statistics (mean, median, std dev, etc.)
- Outlier detection
- Linear regression & trend analysis
- Coefficient of variation, skewness, kurtosis

**local.js** — Internationalization
- Language switching (EN/UK)
- Translation management

---

## 📊 Supported Indices

### Vegetation Indices (RGB-based)
| Index | Full Name | Purpose |
|-------|-----------|---------|
| **NGRDI** | Normalized Green-Red Difference Index | Overall vegetation vigor |
| **ExG** | Excess Green Index | Enhanced green channel detection |
| **ExR** | Excess Red Index | Red spectral emphasis |
| **ExGR** | Excess Green-Red Difference | Green-red contrast |
| **VARI** | Visible Atmospherically Resistant Index | Atmospheric correction |
| **GLI** | Green Leaf Index | Chlorophyll concentration |
| **MGRVI** | Modified Green-Red Vegetation Index | Improved vegetation detection |
| **RGBVI** | RGB Vegetation Index | Combined channel analysis |
| **TGI** | Triangular Greenness Index | Enhanced chlorophyll estimation |
| **NDYI** | Normalized Difference Yellow Index | Senescence detection |
| **CIVE** | Color Index of Vegetation Extraction | RGB decomposition |
| **NPCI** | Normalized Pigment Chlorophyll Index | Pigment dynamics |

### Soil Indices (Non-Vegetation)
| Index | Full Name | Purpose |
|-------|-----------|---------|
| **SOCI** | Soil-Only Color Index | Soil brightness |
| **BI** | Brightness Index | Overall soil luminance |
| **SCI** | Soil Color Index | Soil type discrimination |
| **RI** | Redness Index | Iron oxide concentration |
| **HI** | Hue Index | Soil color profile |
| **SI** | Saturation Index | Soil pigmentation |

---

## 🔌 API Integration

### Supabase Database Schema

**analyses_table**
```sql
id (UUID, PK)
user_id (UUID, FK)
field_group (TEXT) — Field identifier
index_name (TEXT) — Metric name
index_value (DECIMAL) — Computed value
analysis_date (DATE) — Analysis timestamp
created_at (TIMESTAMP)
```

### Authentication
- Email/password signup and login
- Session tokens stored in browser localStorage
- Optional guest mode (no authentication)

---

## 📈 Archive & Analytics

### Browse Tab
- Paginated table of all analyses
- Filter by index type
- Search by field group name
- Sort by any column
- Delete individual records

### Statistics Tab
- Select target metric and date range
- Multi-select recordings for analysis
- **Descriptive Statistics** output:
  - Count, mean, median, min, max
  - Range, quartiles (Q1, Q3), IQR
  - Standard deviation, variance, CV
  - Skewness, kurtosis, R²
  - Outlier detection

- **Trend Analysis** output:
  - Line chart with actual values
  - Moving average (3-point)
  - Linear regression trend line
  - Trend slope & R² goodness-of-fit

### Export Options
- **CSV Export** — Descriptive statistics table
- **Trend Export** — Time-series data with calculations
- **Chart Export** — Trend chart as PNG image

---

## ⚙️ Configuration

### Environment Variables
Create a `.env` file in the project root:

```env
# Supabase Configuration
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-anon-key

# Application
APP_LANGUAGE=en
DEBUG=false
```

### Supabase Setup
To enable data persistence and use the Archive & Analytics features:
- Create a Supabase project at [supabase.com](https://supabase.com)
- Add your Supabase credentials (`SUPABASE_URL` and `SUPABASE_ANON_KEY`) to `config.js`
- Database schema and RLS policies will be automatically configured on first authentication

---

## 🔨 Development

### Project Scripts
```bash
# No build step required — vanilla JavaScript
# Open index.html directly or run:
npx http-server

# Future: Testing
npm test
```

### Code Style
- Vanilla JavaScript (ES6+)
- No external build tools or transpilers
- Modular function organization
- Inline comments for complex calculations

### Browser Compatibility
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## 🎓 Mathematical Methods

### Descriptive Statistics
- **Mean** — Arithmetic average of values
- **Median** — Middle value (handles skewed distributions)
- **Standard Deviation** — Sample SD (n-1 denominator)
- **Coefficient of Variation** — Relative variability (SD/mean)
- **Skewness** — Distribution asymmetry
- **Kurtosis** — Distribution peakedness
- **Outlier Detection** — IQR method (1.5 × IQR threshold)

### Trend Analysis
- **Linear Regression** — Least-squares line fitting
- **Moving Average** — 3-point smoothing for noise reduction
- **R² Statistic** — Goodness-of-fit measure (0-1 scale)

---

## 👨‍🔬 Credits

**Developed by:** Dr. Pavlo LYKHOVYD, Senior Researcher

**Organization:** Institute of Water Problems and Land Reclamation of NAAS (Ukraine)

**Contributors:**
- Remote sensing methodology
- Agronomic index definitions
- Agricultural domain expertise

---

## 🆘 Support & Troubleshooting

### Common Issues

**Images not processing?**
- Ensure image is RGB format (not grayscale)
- Check image resolution (min. 200×200 px)
- Try a different browser

**Can't save results?**
- Verify Supabase credentials in `config.js`
- Check internet connection
- Ensure you're logged in (or use guest mode)

**Charts not displaying?**
- Clear browser cache
- Check JavaScript console for errors
- Verify Chart.js CDN is accessible

### Getting Help
- Check browser console (F12) for error messages
- Review Supabase dashboard for authentication issues
- Contact: Dr. Pavlo LYKHOVYD or your system administrator

---

## 🔐 Privacy & Security

- **Client-Side Processing** — Images never uploaded to servers
- **No Image Storage** — Only analysis results saved to database
- **Encrypted Connection** — HTTPS/TLS for all network traffic
- **User Data Isolation** — Row-level security on Supabase
- **Optional Authentication** — Guest mode available

---

**Last Updated:** June 2026
