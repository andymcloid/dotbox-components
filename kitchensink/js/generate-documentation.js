/**
 * Documentation Generator Script
 * 
 * This script helps generate component documentation JSON files from component JS files.
 * It parses JSDoc comments and static properties to extract component information.
 * 
 * The generated documentation follows the schema defined in:
 * /components/base/component-documentation-schema.json
 * 
 * Usage:
 * 1. Import this script in the browser console
 * 2. Call generateDocumentation('component-name') to generate documentation for a component
 */

/**
 * Generate documentation for a component
 * @param {string} componentName - The name of the component (e.g., 'button', 'checkbox')
 * @returns {Promise<Object>} - The generated documentation object
 */
async function generateDocumentation(componentName) {
  try {
    // Fetch the component JS file
    const response = await fetch(`/components/${componentName}/${componentName}.js`);
    if (!response.ok) {
      throw new Error(`Failed to fetch component: ${componentName}`);
    }
    
    const jsContent = await response.text();
    
    // Parse the component
    const documentation = parseComponent(jsContent, componentName);
    
    // Output the documentation as JSON
    console.log('Generated Documentation:');
    console.log(JSON.stringify(documentation, null, 2));
    
    return documentation;
  } catch (error) {
    console.error(`Error generating documentation for ${componentName}:`, error);
    return null;
  }
}

/**
 * Parse a component JS file to extract documentation
 * @param {string} jsContent - The content of the component JS file
 * @param {string} componentName - The name of the component
 * @returns {Object} - The parsed documentation object
 */
function parseComponent(jsContent, componentName) {
  const documentation = {
    name: `dotbox-${componentName}`,
    description: '',
    properties: [],
    cssParts: [],
    slots: [],
    events: []
  };
  
  // Extract JSDoc comments
  const jsDocRegex = /\/\*\*\s*([\s\S]*?)\s*\*\//g;
  const jsDocMatches = [...jsContent.matchAll(jsDocRegex)];
  
  if (jsDocMatches.length > 0) {
    // Find the main component JSDoc comment (usually the first one)
    const mainJsDoc = jsDocMatches[0][1];
    
    // Extract description
    const descriptionMatch = mainJsDoc.match(/@element\s+[\w-]+\s+(.*?)(?=\s*@|\s*$)/s);
    if (descriptionMatch) {
      documentation.description = descriptionMatch[1].trim();
    }
    
    // Extract properties
    const propMatches = mainJsDoc.matchAll(/@prop\s+{([^}]+)}\s+([^\s]+)\s+-\s+(.*?)(?=\s*@|\s*$)/gs);
    for (const propMatch of propMatches) {
      documentation.properties.push({
        name: propMatch[2].trim(),
        type: propMatch[1].trim(),
        description: propMatch[3].trim()
      });
    }
    
    // Extract CSS parts
    const cssPartMatches = mainJsDoc.matchAll(/@csspart\s+([^\s]+)\s+-\s+(.*?)(?=\s*@|\s*$)/gs);
    for (const cssPartMatch of cssPartMatches) {
      documentation.cssParts.push({
        name: cssPartMatch[1].trim(),
        description: cssPartMatch[2].trim()
      });
    }
    
    // Extract slots
    const slotMatches = mainJsDoc.matchAll(/@slot\s+(?:([^\s]+)\s+)?-\s+(.*?)(?=\s*@|\s*$)/gs);
    for (const slotMatch of slotMatches) {
      documentation.slots.push({
        name: slotMatch[1] ? slotMatch[1].trim() : 'default',
        description: slotMatch[2].trim()
      });
    }
    
    // Extract events
    const eventMatches = mainJsDoc.matchAll(/@fires\s+([^\s]+)\s+-\s+(.*?)(?=\s*@|\s*$)/gs);
    for (const eventMatch of eventMatches) {
      documentation.events.push({
        name: eventMatch[1].trim(),
        description: eventMatch[2].trim()
      });
    }
  }
  
  // Extract default values from static properties
  const staticPropsRegex = /static\s+get\s+properties\s*\(\s*\)\s*{\s*return\s*{([^}]*)}/s;
  const staticPropsMatch = jsContent.match(staticPropsRegex);
  
  if (staticPropsMatch) {
    const propsContent = staticPropsMatch[1];
    
    // For each property, try to find its default value in the constructor
    const constructorRegex = /constructor\s*\(\s*\)\s*{([^}]*)}/s;
    const constructorMatch = jsContent.match(constructorRegex);
    
    if (constructorMatch) {
      const constructorContent = constructorMatch[1];
      
      // Update properties with default values
      for (const prop of documentation.properties) {
        const defaultValueRegex = new RegExp(`this\\.${prop.name}\\s*=\\s*([^;]+)`, 's');
        const defaultValueMatch = constructorContent.match(defaultValueRegex);
        
        if (defaultValueMatch) {
          prop.default = defaultValueMatch[1].trim();
        }
      }
    }
  }
  
  return documentation;
}

// Export the function for use in the browser console
window.generateDocumentation = generateDocumentation; 