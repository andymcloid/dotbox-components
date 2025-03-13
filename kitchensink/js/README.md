# Dotbox Components Documentation System

This directory contains the scripts for the data-driven documentation system used in the Dotbox Components kitchensink.

## Files

- `documentation-renderer.js`: A web component that renders component documentation from JSON files
- `generate-documentation.js`: A utility script to help generate component documentation JSON files from component JS files
- `component-header.js`: A reusable component header for the kitchensink that displays a title and a link to the source code
- `components-registry.js`: A module that loads and provides access to the components index
- `components-nav.js`: A web component that renders a dynamic navigation menu based on the components index
- `components-list.js`: A web component that renders a dynamic list of components for the home page
- `components-sections.js`: A web component that dynamically generates sections for all components

Note: The JSON schema for validating component documentation files is now located at `/components/base/component-documentation-schema.json`

## How It Works

1. Each component has a corresponding JSON documentation file in its directory (e.g., `components/button/button.json`)
2. The components index file (`components/base/components-index.json`) contains metadata about all available components
3. The documentation renderer component loads and displays component documentation in the kitchensink
4. The documentation generator script can be used to help create or update documentation files
5. The component header provides a consistent header across all component pages with a link to the source code
6. The components registry, nav, list, and sections components provide a data-driven approach to the kitchensink UI

## Usage

### Documentation Renderer

Add the documentation renderer to a kitchensink partial:

```html
<kitchensink-documentation-renderer component="button"></kitchensink-documentation-renderer>
```

### Component Header

Add the component header to a kitchensink partial:

```html
<kitchensink-component-header title="Button Component" component="button"></kitchensink-component-header>
```

The `component` attribute is used to generate the source URL. If you need to update the base GitHub URL, you only need to change it in one place in the `component-header.js` file.

### Components Registry

The components registry provides methods to access component information:

```javascript
import { getAllComponents, getComponent } from './components-registry.js';

// Get all components
const components = await getAllComponents();

// Get a specific component
const button = await getComponent('button');
```

### Components Nav

Add the components nav to the sidebar:

```html
<kitchensink-components-nav></kitchensink-components-nav>
```

### Components List

Add the components list to the home page:

```html
<kitchensink-components-list></kitchensink-components-list>
```

### Components Sections

Add the components sections to the main content:

```html
<kitchensink-components-sections></kitchensink-components-sections>
```

### Documentation Generator

Use the documentation generator in the browser console:

```javascript
// Generate documentation for a component
const buttonDocs = await generateDocumentation('button');

// Copy the generated documentation to clipboard
copy(JSON.stringify(buttonDocs, null, 2));
```

## JSON Documentation Structure

```json
{
  "name": "dotbox-component-name",
  "description": "Brief description of the component",
  "properties": [
    {
      "name": "propertyName",
      "type": "String|Boolean|Number|Array|Object",
      "default": "defaultValue",
      "description": "Description of the property"
    }
  ],
  "cssParts": [
    {
      "name": "part-name",
      "description": "Description of the CSS part"
    }
  ],
  "slots": [
    {
      "name": "default",
      "description": "Description of the default slot"
    }
  ],
  "events": [
    {
      "name": "event-name",
      "description": "Description of the event"
    }
  ],
  "examples": [
    {
      "title": "Example Title",
      "code": "<dotbox-component-name>Example code</dotbox-component-name>"
    }
  ]
}
```

## Benefits

- Consistent documentation across all components
- Single source of truth for component API information
- Easy to update when component APIs change
- Can be used to generate other documentation formats in the future 