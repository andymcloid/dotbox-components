# Dotbox Components Documentation System

This directory contains the scripts for the data-driven documentation system used in the Dotbox Components kitchensink.

## Files

- `documentation-renderer.js`: A web component that renders component documentation from JSON files
- `generate-documentation.js`: A utility script to help generate component documentation JSON files from component JS files

Note: The JSON schema for validating component documentation files is now located at `/components/base/component-documentation-schema.json`

## How It Works

1. Each component has a corresponding JSON documentation file in its directory (e.g., `components/button/button.json`)
2. The documentation renderer component loads and displays this documentation in the kitchensink
3. The documentation generator script can be used to help create or update documentation files

## Usage

### Documentation Renderer

Add the documentation renderer to a kitchensink partial:

```html
<kitchensink-documentation-renderer component="button"></kitchensink-documentation-renderer>
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