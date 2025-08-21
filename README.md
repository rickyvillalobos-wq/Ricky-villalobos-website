# Premier Real Estate Website

A modern, responsive website for a real estate agent with a professional design and interactive features.

## Features

- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Modern UI**: Clean, professional design with smooth animations
- **Interactive Elements**: 
  - Mobile-friendly navigation
  - Smooth scrolling
  - Contact form with validation
  - Property cards with hover effects
  - Animated statistics
- **Professional Sections**:
  - Hero section with call-to-action buttons
  - Featured properties showcase
  - About section with company statistics
  - Contact form and information
  - Footer with social links

## File Structure

```
website/
├── index.html          # Main HTML file
├── styles.css          # CSS styles and responsive design
├── script.js           # JavaScript for interactivity
└── README.md           # This file
```

## How to Run Locally

### Option 1: Simple HTTP Server (Recommended)

1. **Open Terminal/Command Prompt**
2. **Navigate to the website directory**:
   ```bash
   cd /path/to/your/website
   ```

3. **Start a local server**:

   **Using Python 3:**
   ```bash
   python3 -m http.server 8000
   ```

   **Using Python 2:**
   ```bash
   python -m SimpleHTTPServer 8000
   ```

   **Using Node.js (if you have it installed):**
   ```bash
   npx http-server -p 8000
   ```

4. **Open your browser** and go to:
   ```
   http://localhost:8000
   ```

### Option 2: Using Live Server (VS Code Extension)

1. **Install the Live Server extension** in VS Code
2. **Right-click on `index.html`** in the file explorer
3. **Select "Open with Live Server"**
4. The website will automatically open in your default browser

### Option 3: Direct File Opening

Simply double-click the `index.html` file to open it in your browser. However, some features might not work properly due to browser security restrictions.

## Customization

### Changing Content

- **Company Name**: Update "Premier Real Estate" in `index.html`
- **Contact Information**: Modify phone, email, and address in the contact section
- **Properties**: Add or modify property listings in the properties section
- **About Section**: Update the company description and statistics

### Styling

- **Colors**: Modify the color scheme in `styles.css` by changing the CSS variables
- **Fonts**: Change the Google Fonts import in `index.html`
- **Layout**: Adjust grid layouts and spacing in `styles.css`

### Adding Real Images

Replace the placeholder elements with actual images:

1. **Hero Image**: Replace the hero placeholder with a background image
2. **Property Images**: Add real property photos to the property cards
3. **About Image**: Add a professional photo of the realtor

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with Flexbox and Grid
- **JavaScript (ES6+)**: Interactive features
- **Font Awesome**: Icons
- **Google Fonts**: Typography

## Performance Features

- Optimized CSS with efficient selectors
- Minimal JavaScript for fast loading
- Responsive images (placeholder system)
- Smooth animations with CSS transitions

## Future Enhancements

- Property search functionality
- Image gallery for properties
- Blog section
- Testimonials carousel
- Integration with real estate APIs
- Admin panel for content management

## Support

If you encounter any issues or have questions about customizing the website, please refer to the code comments or create an issue in the repository.

## License

This project is open source and available under the MIT License.
