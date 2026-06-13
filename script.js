document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. Theme Toggle Logic
  // ==========================================
  const themeToggle = document.getElementById('theme-toggle');
  const htmlElement = document.documentElement;
  // Load saved theme or default to light
  const currentTheme = localStorage.getItem('theme') || 'light';
  htmlElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon(currentTheme);
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const theme = htmlElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      htmlElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
      updateThemeIcon(theme);
    });
  }
  function updateThemeIcon(theme) {
    if (!themeToggle) return;
    const icon = themeToggle.querySelector('i');
    if (theme === 'dark') {
      icon.className = 'fa-solid fa-sun';
      themeToggle.setAttribute('title', 'Switch to Light Mode');
    } else {
      icon.className = 'fa-solid fa-moon';
      themeToggle.setAttribute('title', 'Switch to Dark Mode');
    }
  }
  // ==========================================
  // 2. Navigation Page Transitions
  // ==========================================
  const authCard = document.getElementById('auth-card');
  const navLinks = [document.getElementById('signup-link'), document.getElementById('login-link')];
  navLinks.forEach(link => {
    if (link) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const destination = link.getAttribute('href');
        
        // Add exit animation class
        if (authCard) {
          authCard.classList.add('exit');
        }
        
        // Navigate after transition completes
        setTimeout(() => {
          window.location.href = destination;
        }, 350); // Matches the CSS transition timeline
      });
    }
  });
  // ==========================================
  // 3. Password Visibility Toggles
  // ==========================================
  function setupPasswordToggle(toggleId, inputId) {
    const toggle = document.getElementById(toggleId);
    const input = document.getElementById(inputId);
    
    if (toggle && input) {
      toggle.addEventListener('click', () => {
        const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
        input.setAttribute('type', type);
        
        // Change icon
        const icon = toggle.querySelector('i');
        if (type === 'text') {
          icon.className = 'fa-regular fa-eye-slash';
        } else {
          icon.className = 'fa-regular fa-eye';
        }
      });
    }
  }
  setupPasswordToggle('password-toggle', 'password');
  setupPasswordToggle('confirm-password-toggle', 'confirm-password');
  // ==========================================
  // 4. Form Selectors
  // ==========================================
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');
  const toastNotification = document.getElementById('toast-notification');
  const toastMessage = document.getElementById('toast-message');
  // Helper: Toast Notifications
  function showToast(message, isSuccess = true) {
    if (toastNotification && toastMessage) {
      toastMessage.textContent = message;
      const icon = toastNotification.querySelector('.toast-icon');
      
      if (isSuccess) {
        icon.style.background = 'var(--success-color)';
        icon.innerHTML = '<i class="fa-solid fa-check"></i>';
      } else {
        icon.style.background = 'var(--error-color)';
        icon.innerHTML = '<i class="fa-solid fa-xmark"></i>';
      }
      
      toastNotification.classList.add('show');
      
      setTimeout(() => {
        toastNotification.classList.remove('show');
      }, 3500);
    }
  }
  // Helper: Input Validation Visual Feedback
  function setFieldValid(inputElement) {
    const formGroup = inputElement.closest('.form-group');
    if (formGroup) {
      formGroup.classList.remove('error');
      formGroup.classList.add('success');
    }
  }
  function setFieldError(inputElement) {
    const formGroup = inputElement.closest('.form-group');
    if (formGroup) {
      formGroup.classList.remove('success');
      formGroup.classList.add('error');
    }
  }
  function clearFieldStatus(inputElement) {
    const formGroup = inputElement.closest('.form-group');
    if (formGroup) {
      formGroup.classList.remove('success', 'error');
    }
  }
  // Helper Validation Rules
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  // ==========================================
  // 5. Login Form Specific Logic
  // ==========================================
  if (loginForm) {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    // Inline validation on input/blur
    emailInput.addEventListener('input', () => {
      if (emailInput.value.trim() === '') {
        clearFieldStatus(emailInput);
      } else if (emailRegex.test(emailInput.value.trim())) {
        setFieldValid(emailInput);
      } else {
        setFieldError(emailInput);
      }
    });
    passwordInput.addEventListener('input', () => {
      if (passwordInput.value !== '') {
        setFieldValid(passwordInput);
      } else {
        clearFieldStatus(passwordInput);
      }
    });
    // Form Submit handling
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      let isFormValid = true;
      
      // Email validation
      if (!emailRegex.test(emailInput.value.trim())) {
        setFieldError(emailInput);
        isFormValid = false;
      } else {
        setFieldValid(emailInput);
      }
      // Password validation
      if (passwordInput.value === '') {
        setFieldError(passwordInput);
        isFormValid = false;
      } else {
        setFieldValid(passwordInput);
      }
      if (isFormValid) {
        const submitBtn = loginForm.querySelector('#submit-btn');
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        // Simulate authentication API call
        setTimeout(() => {
          submitBtn.classList.remove('loading');
          submitBtn.disabled = false;
          showToast('Signed in successfully! Redirecting...', true);
          
          // Clear inputs
          loginForm.reset();
          document.querySelectorAll('.form-group').forEach(g => g.classList.remove('success'));
        }, 1500);
      } else {
        showToast('Please fix the errors in the form.', false);
      }
    });
  }
  // ==========================================
  // 6. Sign Up Form Specific Logic
  // ==========================================
  if (signupForm) {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const termsInput = document.getElementById('terms');
    // Password strength UI elements
    const strengthContainer = document.getElementById('strength-container');
    const strengthText = document.getElementById('strength-text');
    const seg1 = document.getElementById('seg-1');
    const seg2 = document.getElementById('seg-2');
    const seg3 = document.getElementById('seg-3');
    // Name Validation
    nameInput.addEventListener('input', () => {
      if (nameInput.value.trim().length >= 2) {
        setFieldValid(nameInput);
      } else {
        setFieldError(nameInput);
      }
    });
    // Email Validation
    emailInput.addEventListener('input', () => {
      if (emailRegex.test(emailInput.value.trim())) {
        setFieldValid(emailInput);
      } else {
        setFieldError(emailInput);
      }
    });
    // Password Strength & Check Logic
    passwordInput.addEventListener('input', () => {
      const password = passwordInput.value;
      
      if (password.length > 0) {
        strengthContainer.style.display = 'block';
      } else {
        strengthContainer.style.display = 'none';
        clearFieldStatus(passwordInput);
        return;
      }
      const strength = checkPasswordStrength(password);
      updateStrengthUI(strength);
      // Validate overall password requirements
      if (password.length >= 8 && strength.score >= 2) {
        setFieldValid(passwordInput);
      } else {
        setFieldError(passwordInput);
      }
      // Re-trigger confirm password match check if value exists
      if (confirmPasswordInput.value !== '') {
        validatePasswordMatch();
      }
    });
    function checkPasswordStrength(password) {
      let score = 0;
      let feedback = 'Very Weak';
      if (password.length >= 8) score++;
      if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
      if (/[0-9]/.test(password)) score++;
      if (/[^A-Za-z0-9]/.test(password)) score++;
      if (score === 1 || score === 2) {
        feedback = 'Weak';
      } else if (score === 3) {
        feedback = 'Medium';
      } else if (score >= 4) {
        feedback = 'Strong';
      }
      return { score, feedback };
    }
    function updateStrengthUI(strength) {
      // Clear previous classes
      [seg1, seg2, seg3].forEach(seg => {
        seg.className = 'strength-segment';
      });
      strengthText.className = 'strength-text';
      if (strength.feedback === 'Weak') {
        seg1.classList.add('strength-weak-bar');
        strengthText.textContent = 'Weak Password';
        strengthText.classList.add('strength-weak');
      } else if (strength.feedback === 'Medium') {
        seg1.classList.add('strength-medium-bar');
        seg2.classList.add('strength-medium-bar');
        strengthText.textContent = 'Medium Password';
        strengthText.classList.add('strength-medium');
      } else if (strength.feedback === 'Strong') {
        seg1.classList.add('strength-strong-bar');
        seg2.classList.add('strength-strong-bar');
        seg3.classList.add('strength-strong-bar');
        strengthText.textContent = 'Strong Password! Perfect.';
        strengthText.classList.add('strength-strong');
      } else {
        // Very Weak
        seg1.classList.add('strength-weak-bar');
        strengthText.textContent = 'Too Weak (add numbers/symbols)';
        strengthText.classList.add('strength-weak');
      }
    }
    // Confirm Password Validation
    confirmPasswordInput.addEventListener('input', validatePasswordMatch);
    function validatePasswordMatch() {
      if (confirmPasswordInput.value === '') {
        clearFieldStatus(confirmPasswordInput);
        return false;
      }
      if (confirmPasswordInput.value === passwordInput.value) {
        setFieldValid(confirmPasswordInput);
        return true;
      } else {
        setFieldError(confirmPasswordInput);
        return false;
      }
    }
    // Terms checkbox check
    termsInput.addEventListener('change', () => {
      const termsGroup = document.getElementById('terms-group');
      if (termsInput.checked) {
        termsGroup.classList.remove('error');
      } else {
        termsGroup.classList.add('error');
      }
    });
    // Form Submit handling
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      let isFormValid = true;
      // Validate Name
      if (nameInput.value.trim().length < 2) {
        setFieldError(nameInput);
        isFormValid = false;
      } else {
        setFieldValid(nameInput);
      }
      // Validate Email
      if (!emailRegex.test(emailInput.value.trim())) {
        setFieldError(emailInput);
        isFormValid = false;
      } else {
        setFieldValid(emailInput);
      }
      // Validate Password (Length >= 8)
      const strength = checkPasswordStrength(passwordInput.value);
      if (passwordInput.value.length < 8 || strength.score < 2) {
        setFieldError(passwordInput);
        isFormValid = false;
      } else {
        setFieldValid(passwordInput);
      }
      // Validate Confirm Password
      if (!validatePasswordMatch()) {
        isFormValid = false;
      }
      // Validate Terms Checkbox
      const termsGroup = document.getElementById('terms-group');
      if (!termsInput.checked) {
        termsGroup.classList.add('error');
        isFormValid = false;
      } else {
        termsGroup.classList.remove('error');
      }
      if (isFormValid) {
        const submitBtn = signupForm.querySelector('#submit-btn');
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        // Simulate Account Creation API call
        setTimeout(() => {
          submitBtn.classList.remove('loading');
          submitBtn.disabled = false;
          showToast('Account registered successfully!', true);
          
          // Reset Form and Strength Bar
          signupForm.reset();
          strengthContainer.style.display = 'none';
          document.querySelectorAll('.form-group').forEach(g => g.classList.remove('success', 'error'));
        }, 1500);
      } else {
        showToast('Please correct the validation errors.', false);
      }
    });
  }
});
