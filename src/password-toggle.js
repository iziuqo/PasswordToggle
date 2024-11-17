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
    this.keyConfig = this.parseKeyCombo(this.config.keyCombo);
    
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.init();
  }

  /**
   * Parse key combination string into modifier and key
   * @param {string} keyCombo - Key combination string (e.g., 'ctrl+8', 'cmd+8')
   * @returns {Object} Parsed modifier and key
   */
  parseKeyCombo(keyCombo) {
    const parts = keyCombo.toLowerCase().split('+');
    if (parts.length !== 2) {
      throw new Error('Invalid key combination format. Use format like "ctrl+8" or "cmd+8"');
    }
    
    const modifier = parts[0];
    const key = parts[1];
    
    // Map modifiers to their event properties
    const modifierMap = {
      ctrl: 'ctrlKey',
      cmd: 'metaKey',
      command: 'metaKey',
      meta: 'metaKey',
      alt: 'altKey',
      shift: 'shiftKey'
    };

    const modifierKey = modifierMap[modifier];
    if (!modifierKey) {
      throw new Error(`Unsupported modifier key: ${modifier}`);
    }

    return {
      modifier: modifierKey,
      key: key
    };
  }

  init() {
    document.addEventListener('keydown', this.handleKeyPress);
    this.setupPasswordFields();
    
    // Log initialization success
    console.log('PasswordToggle initialized:', {
      platform: this.isMac ? 'Mac' : 'Windows/Linux',
      keyCombo: this.config.keyCombo,
      fields: document.querySelectorAll(`[${this.config.toggleAttribute}]`).length
    });
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
