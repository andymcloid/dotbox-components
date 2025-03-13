import { LitElement, html, css } from 'lit';

/**
 * @element kitchensink-component-header
 * 
 * A reusable component header for the kitchensink that displays a title and a link to the source code.
 * 
 * @prop {String} title - The title of the component
 * @prop {String} component - The name of the component (used to generate the source URL)
 */
export class KitchensinkComponentHeader extends LitElement {
  static get properties() {
    return {
      title: { type: String },
      component: { type: String }
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
        margin-bottom: 2rem;
      }
      
      .component-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
        border-bottom: 1px solid #eee;
        padding-bottom: 0.5rem;
      }
      
      h1 {
        margin: 0;
        font-size: 2rem;
        font-weight: 500;
      }
      
      .btn {
        display: inline-block;
        font-weight: 400;
        text-align: center;
        white-space: nowrap;
        vertical-align: middle;
        cursor: pointer;
        user-select: none;
        border: 1px solid transparent;
        padding: 0.375rem 0.75rem;
        font-size: 1rem;
        line-height: 1.5;
        border-radius: 0.25rem;
        text-decoration: none;
      }
      
      .btn-outline-secondary {
        color: #6c757d;
        background-color: transparent;
        border-color: #6c757d;
      }
      
      .btn-outline-secondary:hover {
        color: #fff;
        background-color: #6c757d;
        border-color: #6c757d;
      }
    `;
  }

  constructor() {
    super();
    this.title = '';
    this.component = '';
  }

  render() {
    // Base GitHub URL - can be updated in one place
    const baseGitHubUrl = 'https://github.com/andymcloid/dotbox-components/blob/master';
    
    // Generate the source URL based on the component name
    const sourceUrl = this.component ? 
      `${baseGitHubUrl}/components/${this.component}/${this.component}.js` : 
      `${baseGitHubUrl}`;

    return html`
      <div class="component-header">
        <h1>${this.title || 'Component'}</h1>
        <div>
          <a href="${sourceUrl}" class="btn btn-outline-secondary" target="_blank">
            <i class="fa fa-code"></i> View Source
          </a>
        </div>
      </div>
    `;
  }
}

customElements.define('kitchensink-component-header', KitchensinkComponentHeader); 