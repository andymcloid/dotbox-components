# Dotbox Components

A reusable web component library with stylish buttons, cards, and more.

## Features

- Modern web components built with Lit
- Stylish buttons with various options (variants, sizes, icons)
- Flexible card components with optional hover effects
- Modal and non-modal dialog components
- Versatile input components with label positioning, icons, and validation
- FontAwesome icon integration
- Fully customizable via CSS parts and properties

## Installation

```bash
npm install dotbox-components
```

## Usage

### ES Modules

```javascript
// Import all components
import 'dotbox-components';

// Or import specific components
import 'dotbox-components/button';
import 'dotbox-components/card';
import 'dotbox-components/dialog';
import 'dotbox-components/input';
```

### HTML

```html
<!-- Button examples -->
<dotbox-button variant="primary">Primary Button</dotbox-button>
<dotbox-button variant="success" icon="fa-check" iconPosition="after">Success</dotbox-button>
<dotbox-button variant="danger" icon="fa-warning" iconPosition="before">Warning</dotbox-button>

<!-- Card examples -->
<dotbox-card variant="primary" title="Card Title" icon="fa-star">
  Card content goes here
</dotbox-card>

<dotbox-card variant="info" title="Card with Footer" icon="fa-info-circle">
  This card has a footer with buttons.
  <div slot="footer">
    <dotbox-button variant="primary" size="small">Save</dotbox-button>
    <dotbox-button variant="danger" size="small">Cancel</dotbox-button>
  </div>
</dotbox-card>

<!-- Dialog examples -->
<dotbox-button id="open-dialog">Open Dialog</dotbox-button>

<dotbox-dialog id="my-dialog" title="Dialog Title" modal="true">
  Dialog content goes here.
  <div slot="footer">
    <dotbox-button variant="primary" size="small" id="close-dialog">Close</dotbox-button>
  </div>
</dotbox-dialog>

<!-- Input examples -->
<dotbox-input label="Username" icon="fa-user" placeholder="Enter username"></dotbox-input>
<dotbox-input label="Password" type="password" icon="fa-lock" placeholder="Enter password"></dotbox-input>
<dotbox-input label="Description" multiline="true" rows="4" placeholder="Enter description"></dotbox-input>

<script>
  document.getElementById('open-dialog').addEventListener('click', () => {
    document.getElementById('my-dialog').show();
  });
  
  document.getElementById('close-dialog').addEventListener('click', () => {
    document.getElementById('my-dialog').close();
  });
</script>
```

## CSS Styling

### Production Bundle

For production use, you can include the bundled CSS file:

```html
<link rel="stylesheet" href="node_modules/dotbox-components/dist/dotbox-components.bundled.css">
```

### Individual Component CSS

For more granular control, you can include CSS for specific components:

```html
<link rel="stylesheet" href="node_modules/dotbox-components/dist/css/base/base-styles.css">
<link rel="stylesheet" href="node_modules/dotbox-components/dist/css/button/button.css">
<link rel="stylesheet" href="node_modules/dotbox-components/dist/css/card/card.css">
<link rel="stylesheet" href="node_modules/dotbox-components/dist/css/dialog/dialog.css">
<link rel="stylesheet" href="node_modules/dotbox-components/dist/css/input/input.css">
```

## Development

### Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/dotbox-components.git
cd dotbox-components

# Install dependencies
npm install

# Start development server
npm start
```

### Build

```bash
# Build for development
npm run build

# Build for production (minified with bundled CSS)
npm run build:prod
```

### Project Structure

```
dotbox-components/
├── components/           # Source components
│   ├── base/             # Base component and styles
│   ├── button/           # Button component
│   ├── card/             # Card component
│   ├── dialog/           # Dialog component
│   ├── input/            # Input component
│   └── index.js          # Main entry point
├── dist/                 # Built files
│   ├── css/              # Individual CSS files
│   ├── dotbox-components.bundled.js     # Bundled JS
│   └── dotbox-components.bundled.css    # Bundled CSS
├── kitchensink/          # Component showcase
│   ├── partials/         # Component partial HTML files
│   │   ├── home.html     # Home page content
│   │   ├── button.html   # Button component content
│   │   ├── card.html     # Card component content
│   │   ├── dialog.html   # Dialog component content
│   │   └── input.html    # Input component content
│   └── index.html        # Main kitchensink page with dynamic loading
├── examples/             # Usage examples
├── server.js             # Development server
├── rollup.config.js      # Development build config
└── rollup.prod.config.js # Production build config
```

## Kitchensink

The kitchensink is a showcase of all available components and their variations. It provides:

- A sidebar navigation for easy access to different components
- Dynamic loading of component content for better performance
- Code examples for each component variation
- API documentation for each component

To view the kitchensink:

1. Start the development server: `npm start`
2. Open your browser to: `http://localhost:3000/`

The kitchensink uses a dynamic loading approach where component content is loaded on demand, which:
- Prevents reloading of Lit, FontAwesome, and Bootstrap for each component
- Maintains consistent styling across all components
- Simplifies the addition of new components in the future
- Enhances performance by only loading necessary components

## License

MIT 