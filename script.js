

// ===== COMPONENT 1: ACCESSIBLE FORM VALIDATION =====

const form = document.querySelector('.accessible-form');
const usernameInput = document.getElementById('username');
const emailInput = document.getElementById('email');

function validateUsername(value) {
  const regex = /^[a-zA-Z0-9]{3,20}$/;
  if (!value) {
    return { valid: false, message: 'Username is required' };
  }
  if (!regex.test(value)) {
    return { 
      valid: false, 
      message: 'Username must be 3-20 characters, letters and numbers only' 
    };
  }
  return { valid: true, message: '' };
}

function validateEmail(value) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!value) {
    return { valid: false, message: 'Email is required' };
  }
  if (!regex.test(value)) {
    return { valid: false, message: 'Please enter a valid email address' };
  }
  return { valid: true, message: '' };
}

function showError(input, message) {
  const errorId = input.getAttribute('aria-describedby').split(' ')[1];
  const errorElement = document.getElementById(errorId);
  
  errorElement.textContent = message;
  input.classList.add('error');
  input.setAttribute('aria-invalid', 'true');
}

function clearError(input) {
  const errorId = input.getAttribute('aria-describedby').split(' ')[1];
  const errorElement = document.getElementById(errorId);
  
  errorElement.textContent = '';
  input.classList.remove('error');
  input.setAttribute('aria-invalid', 'false');
}

usernameInput.addEventListener('blur', function() {
  const result = validateUsername(this.value);
  if (!result.valid) {
    showError(this, result.message);
  } else {
    clearError(this);
  }
});

emailInput.addEventListener('blur', function() {
  const result = validateEmail(this.value);
  if (!result.valid) {
    showError(this, result.message);
  } else {
    clearError(this);
  }
});

usernameInput.addEventListener('input', function() {
  if (this.classList.contains('error')) {
    const result = validateUsername(this.value);
    if (result.valid) {
      clearError(this);
    }
  }
});

emailInput.addEventListener('input', function() {
  if (this.classList.contains('error')) {
    const result = validateEmail(this.value);
    if (result.valid) {
      clearError(this);
    }
  }
});

form.addEventListener('submit', function(e) {
  e.preventDefault();
  
  const usernameResult = validateUsername(usernameInput.value);
  const emailResult = validateEmail(emailInput.value);
  
  let isValid = true;
  
  if (!usernameResult.valid) {
    showError(usernameInput, usernameResult.message);
    isValid = false;
  } else {
    clearError(usernameInput);
  }
  
  if (!emailResult.valid) {
    showError(emailInput, emailResult.message);
    isValid = false;
  } else {
    clearError(emailInput);
  }
  
  if (isValid) {
    alert('✓ Form submitted successfully!\n\nThis demonstrates accessible form validation.');
    form.reset();
  } else {
    if (!usernameResult.valid) {
      usernameInput.focus();
    } else if (!emailResult.valid) {
      emailInput.focus();
    }
  }
});

// ===== COMPONENT 2: KEYBOARD-NAVIGABLE DROPDOWN =====

const dropdown = document.getElementById('country-dropdown');
const dropdownButton = document.getElementById('country-select');
const dropdownList = document.getElementById('dropdown-options');
const dropdownOptions = dropdownList.querySelectorAll('[role="option"]');

let currentFocus = -1;

function openDropdown() {
  dropdownButton.setAttribute('aria-expanded', 'true');
  dropdownList.classList.add('active');
  currentFocus = -1;
}

function closeDropdown() {
  dropdownButton.setAttribute('aria-expanded', 'false');
  dropdownList.classList.remove('active');
  currentFocus = -1;
  // Remove all focused classes
  dropdownOptions.forEach(opt => opt.classList.remove('focused'));
}

function selectOption(option) {
  const value = option.getAttribute('data-value');
  const text = option.textContent;
  
  dropdownButton.textContent = text;
  
  // Update ARIA selected state
  dropdownOptions.forEach(opt => opt.setAttribute('aria-selected', 'false'));
  option.setAttribute('aria-selected', 'true');
  
  closeDropdown();
  dropdownButton.focus();
}

dropdownButton.addEventListener('click', function() {
  if (dropdownButton.getAttribute('aria-expanded') === 'true') {
    closeDropdown();
  } else {
    openDropdown();
  }
});

dropdownButton.addEventListener('keydown', function(e) {
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault();
    openDropdown();
    currentFocus = 0;
    dropdownOptions[0].classList.add('focused');
  } else if (e.key === 'Escape') {
    closeDropdown();
  }
});

dropdownList.addEventListener('keydown', function(e) {
  const optionsArray = Array.from(dropdownOptions);
  
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    currentFocus = (currentFocus + 1) % optionsArray.length;
    updateFocus();
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    currentFocus = (currentFocus - 1 + optionsArray.length) % optionsArray.length;
    updateFocus();
  } else if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    if (currentFocus >= 0) {
      selectOption(optionsArray[currentFocus]);
    }
  } else if (e.key === 'Escape') {
    closeDropdown();
    dropdownButton.focus();
  }
});

function updateFocus() {
  dropdownOptions.forEach((opt, index) => {
    if (index === currentFocus) {
      opt.classList.add('focused');
      opt.scrollIntoView({ block: 'nearest' });
    } else {
      opt.classList.remove('focused');
    }
  });
}

dropdownOptions.forEach((option, index) => {
  option.addEventListener('click', function() {
    selectOption(this);
  });
  
  option.addEventListener('mouseenter', function() {
    currentFocus = index;
    updateFocus();
  });
});

// Close dropdown when clicking outside
document.addEventListener('click', function(e) {
  if (!dropdown.contains(e.target)) {
    closeDropdown();
  }
});

// ===== COMPONENT 3: HIGH-CONTRAST TOGGLE BUTTON =====

const toggleButton = document.getElementById('dark-mode-toggle');
const toggleStatus = document.getElementById('toggle-status');

toggleButton.addEventListener('click', function() {
  const isChecked = this.getAttribute('aria-checked') === 'true';
  
  if (isChecked) {
    this.setAttribute('aria-checked', 'false');
    toggleStatus.textContent = 'Off';
  } else {
    this.setAttribute('aria-checked', 'true');
    toggleStatus.textContent = 'On';
  }
});

// Keyboard support for toggle
toggleButton.addEventListener('keydown', function(e) {
  if (e.key === ' ' || e.key === 'Enter') {
    e.preventDefault();
    this.click();
  }
});

// ===== COMPONENT 5: ACCESSIBLE MODAL DIALOG =====

const openModalBtn = document.getElementById('open-modal');
const modalOverlay = document.getElementById('modal-overlay');
const modalDialog = document.getElementById('modal-dialog');
const closeModalBtn = document.getElementById('close-modal');
const closeModalX = document.getElementById('close-modal-x');
const modalActionBtn = document.getElementById('modal-action');

let lastFocusedElement;
const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

function openModal() {
  lastFocusedElement = document.activeElement;
  
  modalOverlay.classList.add('active');
  modalOverlay.setAttribute('aria-hidden', 'false');
  
  // Lock body scroll
  document.body.style.overflow = 'hidden';
  
  // Focus first element in modal
  setTimeout(() => {
    const firstFocusable = modalDialog.querySelectorAll(focusableElements)[0];
    firstFocusable.focus();
  }, 100);
  
  // Set up focus trap
  setupFocusTrap();
}

function closeModal() {
  modalOverlay.classList.remove('active');
  modalOverlay.setAttribute('aria-hidden', 'true');
  
  // Unlock body scroll
  document.body.style.overflow = '';
  
  // Return focus to trigger button
  if (lastFocusedElement) {
    lastFocusedElement.focus();
  }
}

function setupFocusTrap() {
  const focusableContent = modalDialog.querySelectorAll(focusableElements);
  const firstFocusable = focusableContent[0];
  const lastFocusable = focusableContent[focusableContent.length - 1];
  
  modalDialog.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    }
    
    if (e.key === 'Escape') {
      closeModal();
    }
  });
}

openModalBtn.addEventListener('click', openModal);
closeModalBtn.addEventListener('click', closeModal);
closeModalX.addEventListener('click', closeModal);

modalActionBtn.addEventListener('click', function() {
  alert('Action button clicked!\n\nThis demonstrates modal interactions.');
});

// Close modal when clicking overlay (not the dialog itself)
modalOverlay.addEventListener('click', function(e) {
  if (e.target === modalOverlay) {
    closeModal();
  }
});
