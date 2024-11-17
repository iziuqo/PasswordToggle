// password-toggle.js

/**
 * PasswordToggle - A lightweight, customizable password visibility toggle library
 * @param {Object} config - Configuration options
 * @param {string} config.keyCombo - Key combination (default: 'ctrl+8' on Windows/Linux, 'cmd+8' on Mac)
 * @param {string} config.toggleAttribute - Data attribute to identify password fields (default: 'data-pw-toggle')
 */
class PasswordToggle {
  constructor(config = {}) {
    // Detect platform
    this.isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    
    this.config = {
      keyCombo: config.keyCombo || (this.isMac ? 'cmd+8' : 'ctrl+8'),
      toggleAttribute: config.toggleAttribute || 'data-pw-toggle'
    };
    
    // Parse key combination
    const [modifier, key] = this.parseKeyCombo(this.config.keyCombo);
    this.keyConfig = { modifier, key };
    
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.init();
  }

  /**
   * Parse key combination string into modifier and key
   * @param {string} keyCombo - Key combination string (e.g., 'ctrl+8', 'cmd+8')
   * @returns {Object} Parsed modifier and key
   */
  parseKeyCombo(keyCombo) {
    const [modifier, key] = keyCombo.toLowerCase().split('+');
    
    // Map modifiers to their event properties
    const modifierMap = {
      ctrl: 'ctrlKey',
      cmd: 'metaKey',
      command: 'metaKey',
      meta: 'metaKey',
      alt: 'altKey',
      shift: 'shiftKey'
    };

    return {
      modifier: modifierMap[modifier] || 'ctrlKey',
      key: key
    };
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
      const modifierDisplay = this.isMac ? '⌘' : 'Ctrl';
      field.setAttribute('aria-label', 
        `${field.getAttribute('aria-label') || 'Password'} (Press ${modifierDisplay}+${this.keyConfig.key} to toggle visibility)`
      );
    });
  }

  handleKeyPress(event) {
    // Check if the pressed modifier key matches the configured one
    if (event[this.keyConfig.modifier] && event.key === this.keyConfig.key) {
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
        detail: { 
          isVisible: field.type === 'text',
          platform: this.isMac ? 'mac' : 'other'
        }
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
