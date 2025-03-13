/**
 * Components Registry
 * 
 * This module loads the components index and provides methods to access component information.
 * It's used by the navigation menu and home page to dynamically display component information.
 */

// Cache for the components data
let componentsData = null;

/**
 * Load the components index from the JSON file
 * @returns {Promise<Array>} - Array of component objects
 */
export async function loadComponents() {
  if (componentsData) {
    return componentsData;
  }
  
  try {
    const response = await fetch('/components/base/components-index.json');
    if (!response.ok) {
      throw new Error('Failed to load components index');
    }
    
    const data = await response.json();
    componentsData = data.components;
    return componentsData;
  } catch (error) {
    console.error('Error loading components index:', error);
    return [];
  }
}

/**
 * Get a component by name
 * @param {string} name - The component name
 * @returns {Promise<Object|null>} - The component object or null if not found
 */
export async function getComponent(name) {
  const components = await loadComponents();
  return components.find(component => component.name === name) || null;
}

/**
 * Get all components
 * @returns {Promise<Array>} - Array of component objects
 */
export async function getAllComponents() {
  return loadComponents();
}

// Export a default object for easier imports
export default {
  loadComponents,
  getComponent,
  getAllComponents
}; 