// Load dependencies dynamically
const loadDependencies = () => {
  // Load Bootstrap
  if (!document.querySelector('link[href*="bootstrap"]')) {
    console.log('Loading Bootstrap...');
    const linkElem = document.createElement('link');
    linkElem.rel = 'stylesheet';
    linkElem.href = 'https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css';
    document.head.appendChild(linkElem);
  }

  // Load FontAwesome
  if (!document.querySelector('link[href*="font-awesome"]')) {
    console.log('Loading FontAwesome...');
    const linkElem = document.createElement('link');
    linkElem.rel = 'stylesheet';
    linkElem.href = 'https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css';
    
    // Add event listeners to check if FontAwesome loaded correctly
    linkElem.addEventListener('load', () => {
      console.log('FontAwesome loaded successfully');
      
      // Test if FontAwesome is actually working
      setTimeout(() => {
        const testElement = document.createElement('i');
        testElement.className = 'fa fa-check';
        testElement.style.visibility = 'hidden';
        document.body.appendChild(testElement);
        
        // Get computed style
        const computedStyle = window.getComputedStyle(testElement);
        const fontFamily = computedStyle.getPropertyValue('font-family');
        console.log('FontAwesome test element font-family:', fontFamily);
        
        // Check if FontAwesome is in the font family
        const hasFontAwesome = fontFamily.includes('FontAwesome');
        console.log('FontAwesome is available after load:', hasFontAwesome);
        
        // Clean up
        document.body.removeChild(testElement);
      }, 500);
    });
    
    linkElem.addEventListener('error', (error) => {
      console.error('Failed to load FontAwesome', error);
      
      // Try alternative CDN
      console.log('Trying alternative FontAwesome CDN...');
      const altLinkElem = document.createElement('link');
      altLinkElem.rel = 'stylesheet';
      altLinkElem.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css';
      
      altLinkElem.addEventListener('load', () => {
        console.log('Alternative FontAwesome loaded successfully');
      });
      
      altLinkElem.addEventListener('error', (altError) => {
        console.error('Failed to load alternative FontAwesome', altError);
      });
      
      document.head.appendChild(altLinkElem);
    });
    
    document.head.appendChild(linkElem);
  }
  
  // Preload all component CSS files
  preloadComponentStyles();
};

/**
 * Preload all component CSS files at once
 * This prevents multiple requests for the same files
 */
const preloadComponentStyles = () => {
  console.log('Preloading all component CSS files...');
  
  // List of all component CSS files with their absolute paths
  const cssFiles = [
    '/components/base/base-styles.css',
    '/components/button/button.css',
    '/components/card/card.css',
    '/components/dialog/dialog.css',
    '/components/input/input.css',
    '/components/notification/notification.css',
    '/components/checkbox/checkbox.css'
  ];
  
  // Load each CSS file as a link element
  cssFiles.forEach(cssFile => {
    // Check if this CSS file is already loaded
    if (document.querySelector(`link[href*="${cssFile}"]`)) {
      console.log(`CSS file already loaded: ${cssFile}`);
      return;
    }
    
    const linkElem = document.createElement('link');
    linkElem.rel = 'stylesheet';
    linkElem.href = cssFile;
    
    linkElem.addEventListener('load', () => {
      console.log(`CSS file loaded successfully: ${cssFile}`);
    });
    
    linkElem.addEventListener('error', (error) => {
      console.error(`Failed to load CSS file: ${cssFile}`, error);
    });
    
    document.head.appendChild(linkElem);
  });
};

// Make component styles available to shadow DOM
export const getComponentStyles = (componentName) => {
  // Create a style element with adoptedStyleSheets when available
  const style = document.createElement('style');
  
  // Get the component's CSS file
  const cssFile = `/components/${componentName}/${componentName}.css`;
  
  // Add a data attribute to identify this style
  style.setAttribute('data-component', componentName);
  
  // Return the style element (will be populated by the component)
  return style;
};

// Load dependencies when the module is imported
loadDependencies();

// Export all components
export { DotboxButton } from './button/button.js';
export { DotboxCard } from './card/card.js';
export { DotboxDialog } from './dialog/dialog.js';
export { DotboxInput } from './input/input.js';
export { DotboxNotification } from './notification/notification.js';
export { DotboxCheckbox } from './checkbox/checkbox.js';
console.log('Components exported: DotboxButton, DotboxCard, DotboxDialog, DotboxInput, DotboxNotification, DotboxCheckbox');

// Export base components for extension
export { DotboxBaseComponent } from './base/base-component.js';

// Add more component exports here as they are created 