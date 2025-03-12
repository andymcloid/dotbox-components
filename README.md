# Dotbox Components

A reusable web component library with stylish buttons and more. Built using Web Components standard for maximum compatibility with any framework.

## Installation

```bash
npm install dotbox-components
```

## Usage

### In HTML

```html
<script type="module">
  import 'dotbox-components';
</script>

<dotbox-button variant="primary" icon="fa-arrow-right">Click Me</dotbox-button>
```

### In React

```jsx
import 'dotbox-components';

function App() {
  return (
    <dotbox-button 
      variant="primary" 
      icon="fa-arrow-right" 
      iconPosition="after">
      Click Me
    </dotbox-button>
  );
}
```

### In Vue

```vue
<template>
  <dotbox-button 
    variant="primary" 
    icon="fa-arrow-right" 
    iconPosition="after">
    Click Me
  </dotbox-button>
</template>

<script>
import 'dotbox-components';

export default {
  name: 'App'
}
</script>
```

## Components

### Button Component

The `<dotbox-button>` component provides stylish buttons with various options.

#### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| variant | String | 'primary' | Button variant (primary, success, danger, info, default) |
| size | String | '' | Button size (small, default, large) |
| icon | String | '' | FontAwesome icon name (e.g., 'fa-arrow-right') |
| iconPosition | String | 'after' | Position of the icon (before, after) |
| animated | Boolean | false | Whether the icon should be animated |
| animationType | String | 'spin' | Type of animation (spin, pulse) |
| disabled | Boolean | false | Whether the button is disabled |
| href | String | '' | If provided, renders as an anchor tag |

#### Examples

```html
<!-- Basic button -->
<dotbox-button variant="primary">Primary Button</dotbox-button>

<!-- Button with icon -->
<dotbox-button variant="success" icon="fa-check" iconPosition="after">Success</dotbox-button>

<!-- Button with animated icon -->
<dotbox-button variant="primary" icon="fa-spinner" animated="true">Loading</dotbox-button>

<!-- Disabled button -->
<dotbox-button variant="danger" disabled>Disabled</dotbox-button>

<!-- Link button -->
<dotbox-button variant="info" href="https://example.com">Link Button</dotbox-button>
```

### Card Component

The `<dotbox-card>` component provides stylish cards with various options.

#### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| variant | String | 'default' | Card variant (primary, success, danger, info, default) |
| title | String | '' | Card title |
| icon | String | '' | FontAwesome icon name for the card header (e.g., 'fa-info-circle') |

#### Slots

| Name | Description |
|------|-------------|
| (default) | The main content of the card |
| header | Custom header content |
| footer | Footer content |

#### Examples

```html
<!-- Basic card -->
<dotbox-card title="Default Card">
  This is a basic card with just a title.
</dotbox-card>

<!-- Card with icon -->
<dotbox-card title="Card with Icon" icon="fa-info-circle">
  This card has both a title and an icon in the header.
</dotbox-card>

<!-- Card with custom header -->
<dotbox-card>
  <div slot="header">Custom Header Content</div>
  This card has custom header content using the header slot.
</dotbox-card>

<!-- Card with variant -->
<dotbox-card variant="primary" title="Primary Card" icon="fa-star">
  This is a primary card with a title and icon.
</dotbox-card>

<!-- Card with footer -->
<dotbox-card title="Card with Footer" icon="fa-credit-card">
  This card has a footer with buttons.
  <div slot="footer">
    <dotbox-button variant="primary" size="small">Save</dotbox-button>
    <dotbox-button variant="danger" size="small">Cancel</dotbox-button>
  </div>
</dotbox-card>
```

## Creating Custom Components

You can create your own components by extending the base component:

```js
import { html, css } from 'lit';
import { DotboxBaseComponent } from 'dotbox-components';

export class MyCustomComponent extends DotboxBaseComponent {
  static get properties() {
    return {
      // Your properties here
    };
  }

  static get styles() {
    return [
      super.styles,
      css`
        /* Your styles here */
      `
    ];
  }

  connectedCallback() {
    super.connectedCallback();
    // Load your component styles
    this.loadComponentStyles('./my-component.css');
  }

  render() {
    return html`
      <!-- Your template here -->
    `;
  }
}

customElements.define('my-custom-component', MyCustomComponent);
```

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Browser Support

This library uses Web Components which are supported in all modern browsers.

## License

MIT 