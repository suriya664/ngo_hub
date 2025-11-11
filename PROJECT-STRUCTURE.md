# NGO Template - Project Structure

## 📁 Directory Structure

```
ngo-template/
│
├── 📄 index.html                 # Main homepage
├── 📄 README.md                   # Documentation
├── 📄 PROJECT-STRUCTURE.md        # This file
├── 📄 start-server.bat            # Windows server startup script
├── 📄 start-server.sh             # Linux/Mac server startup script
│
├── 📁 assets/
│   ├── 📁 css/
│   │   └── 📄 style.css          # Main stylesheet
│   ├── 📁 js/
│   │   └── 📄 main.js            # Main JavaScript (loads partials)
│   └── 📁 img/
│       ├── 📄 logo.svg            # Logo file
│       └── 📄 favicon.svg         # Favicon
│
├── 📁 partials/                   # Reusable components
│   ├── 📄 header.html             # Header navigation
│   ├── 📄 footer.html             # Footer content
│   └── 📄 modals.html             # Modal dialogs
│
└── 📁 pages/                      # All page files (19 pages)
    ├── 📄 404.html
    ├── 📄 about.html
    ├── 📄 blog.html
    ├── 📄 blog-details.html
    ├── 📄 campaign-details.html
    ├── 📄 campaigns.html
    ├── 📄 contact.html
    ├── 📄 dashboard.html
    ├── 📄 donate.html
    ├── 📄 events.html
    ├── 📄 impact.html
    ├── 📄 login.html
    ├── 📄 partners.html
    ├── 📄 privacy-policy.html
    ├── 📄 reports.html
    ├── 📄 team.html
    ├── 📄 terms.html
    ├── 📄 thank-you.html
    └── 📄 volunteer.html
```

## ⚠️ Important: Header & Footer Loading

**The header and footer are loaded dynamically using JavaScript Fetch API.**

### Problem:
- **Fetch API does NOT work with `file://` protocol**
- Opening `index.html` directly in browser won't load header/footer
- You need a local web server

### Solution: Use a Local Web Server

#### Option 1: Using Python (Recommended)
```bash
# Windows/Mac/Linux
cd ngo-template
python -m http.server 8000
# Then open: http://localhost:8000
```

#### Option 2: Using Node.js
```bash
# Install http-server globally
npm install -g http-server

# Run server
cd ngo-template
http-server -p 8000
```

#### Option 3: Using VS Code Live Server
1. Install "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

#### Option 4: Using the provided scripts
- **Windows**: Double-click `start-server.bat`
- **Mac/Linux**: Run `bash start-server.sh`

### How It Works:
1. `main.js` detects the current page location
2. Calculates the correct path to `partials/` folder
3. Uses Fetch API to load `header.html` and `footer.html`
4. Inserts them into the placeholder divs
5. Fixes image and link paths automatically

### Path Resolution:
- **From root** (`index.html`): Uses `./partials/header.html`
- **From pages/** (`pages/about.html`): Uses `../partials/header.html`

## ✅ Verification Checklist

- [x] All directories created
- [x] Header partial exists (`partials/header.html`)
- [x] Footer partial exists (`partials/footer.html`)
- [x] Main JavaScript file exists (`assets/js/main.js`)
- [x] All 19 pages created in `pages/` folder
- [x] Server startup scripts created
- [x] Error handling added for missing server

## 🔧 Troubleshooting

### Header/Footer not showing?
1. Check browser console (F12) for errors
2. Make sure you're using a web server (not file://)
3. Verify `partials/header.html` and `partials/footer.html` exist
4. Check that `assets/js/main.js` is loading correctly

### Links not working?
- Header/footer links are automatically fixed based on page location
- If links still broken, check the path fixing logic in `main.js`

### Images not loading?
- Logo path is fixed automatically in `main.js`
- Other images use absolute URLs from Pexels (should work)

## 📝 Next Steps

1. Start a local web server
2. Open `http://localhost:8000/index.html`
3. Verify header and footer load correctly
4. Test navigation between pages
5. Check responsive design on mobile devices

