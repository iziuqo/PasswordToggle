// password-toggle.js

/**
 * PasswordToggle - A lightweight, customizable password visibility toggle library
 * @param {Object} config - Configuration options
 * @param {string} config.keyCombo - Key combination (default: 'ctrl+8')
 * @param {string} config.toggleAttribute - Data attribute to identify password fields (default: 'data-pw-toggle')
 */
class PasswordToggle {
  constructor(config = {}) {
    this.config = {
      keyCombo: config.keyCombo || 'ctrl+8',
      toggleAttribute: config.toggleAttribute || 'data-pw-toggle'
    };
    
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.init();
  }

  init() {
    document.addEventListener('keydown', this.handleKeyPress);
    this.setupPasswordFields();
  }

  setupPasswordFields() {
    const fields = document.querySelectorAll(`[${this.config.toggleAttribute}]`);
    fields.forEach(field => {
      if (field.type !== 'password' && field.type !== 'text') {
        console.warn('PasswordToggle: Field must be of type password or text');
        return;
      }
      
      // Add necessary ARIA attributes for accessibility
      field.setAttribute('aria-label', `${field.getAttribute('aria-label') || 'Password'} (Press ${this.config.keyCombo} to toggle visibility)`);
    });
  }

  handleKeyPress(event) {
    const keyCombo = this.config.keyCombo.toLowerCase().split('+');
    const key = keyCombo[1];
    const modifier = keyCombo[0];
    
    if (event[`${modifier}Key`] && event.key === key) {
      event.preventDefault();
      this.togglePasswordVisibility();
    }
  }

  togglePasswordVisibility() {
    const fields = document.querySelectorAll(`[${this.config.toggleAttribute}]`);
    fields.forEach(field => {
      field.type = field.type === 'password' ? 'text' : 'password';
      
      // Update ARIA attributes
      field.setAttribute('aria-pressed', field.type === 'text');
      
      // Dispatch custom event
      field.dispatchEvent(new CustomEvent('passwordToggle', {
        detail: { isVisible: field.type === 'text' }
      }));
    });
  }
  
  destroy() {
    document.removeEventListener('keydown', this.handleKeyPress);
  }
}

// Export for different module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PasswordToggle;
} else if (typeof define === 'function' && define.amd) {
  define([], () => PasswordToggle);
} else {
  window.PasswordToggle = PasswordToggle;
}
