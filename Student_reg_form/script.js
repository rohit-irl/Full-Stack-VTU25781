/* ============================================
   STUDENT REGISTRATION FORM - JAVASCRIPT
   Multi-step Form with Validation & localStorage
   ============================================ */

// ============================================
// STATE MANAGEMENT
// ============================================

let currentStep = 1;
const totalSteps = 3;
let darkModeEnabled = false;

// Form and main elements
const registrationForm = document.getElementById('registrationForm');
const submitBtn = document.getElementById('submitBtn');
const successMessage = document.getElementById('successMessage');

// Multi-step navigation
const formSteps = document.querySelectorAll('.form-step');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');
const progressFill = document.getElementById('progressFill');
const progressSteps = document.querySelectorAll('.progress-step');
const darkModeToggle = document.getElementById('darkModeToggle');

// Input fields
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const genderRadios = document.querySelectorAll('input[name="gender"]');
const courseSelect = document.getElementById('course');
const passwordInput = document.getElementById('password');
const togglePasswordBtn = document.getElementById('togglePasswordBtn');

// Error message elements
const nameError = document.getElementById('nameError');
const emailError = document.getElementById('emailError');
const phoneError = document.getElementById('phoneError');
const genderError = document.getElementById('genderError');
const courseError = document.getElementById('courseError');
const passwordError = document.getElementById('passwordError');

// Password strength elements
const strengthBars = document.querySelectorAll('.strength-bar');
const strengthText = document.getElementById('strengthText');

// ============================================
// REGEX PATTERNS - Validation Rules
// ============================================

// Email validation pattern (valid email format)
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Phone validation (10 digits only)
const PHONE_PATTERN = /^\d{10}$/;

// Password requirements (uppercase, lowercase, number, special char, minimum 8 chars)
const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// ============================================
// EVENT LISTENERS - Initialize validation
// ============================================

/**
 * Initialize all event listeners for form validation
 */
function initializeEventListeners() {
    // Name field validation
    nameInput.addEventListener('blur', validateName);
    nameInput.addEventListener('input', validateName);

    // Email field validation
    emailInput.addEventListener('blur', validateEmail);
    emailInput.addEventListener('input', validateEmail);

    // Phone field validation
    phoneInput.addEventListener('blur', validatePhone);
    phoneInput.addEventListener('input', validatePhone);

    // Gender validation
    genderRadios.forEach((radio) => {
        radio.addEventListener('change', validateGender);
    });

    // Course validation
    courseSelect.addEventListener('blur', validateCourse);
    courseSelect.addEventListener('change', validateCourse);

    // Password validation with strength indicator
    passwordInput.addEventListener('blur', validatePassword);
    passwordInput.addEventListener('input', (e) => {
        validatePassword();
        updatePasswordStrength(e.target.value);
    });

    // Toggle password visibility
    togglePasswordBtn.addEventListener('click', togglePasswordVisibility);

    // Form submission
    registrationForm.addEventListener('submit', handleSubmit);

    // Multi-step navigation
    nextBtn.addEventListener('click', handleNextStep);
    prevBtn.addEventListener('click', handlePreviousStep);

    // Dark mode toggle
    darkModeToggle.addEventListener('click', toggleDarkMode);

    // Save form data on input
    [nameInput, emailInput, phoneInput, courseSelect, passwordInput].forEach((input) => {
        input.addEventListener('change', saveFormDataToLocalStorage);
    });
    genderRadios.forEach((radio) => {
        radio.addEventListener('change', saveFormDataToLocalStorage);
    });
}

// ============================================
// VALIDATION FUNCTIONS - Individual Field Validators
// ============================================

/**
 * Validate Name Field
 * - Check if name is not empty
 * - Check if name contains only letters and spaces
 * - Minimum 3 characters
 */
function validateName() {
    const nameValue = nameInput.value.trim();

    // Check if empty
    if (nameValue === '') {
        showError(nameInput, nameError, 'Name is required');
        return false;
    }

    // Check if name contains only letters and spaces
    if (!/^[a-zA-Z\s]+$/.test(nameValue)) {
        showError(nameInput, nameError, 'Name can only contain letters and spaces');
        return false;
    }

    // Check minimum length
    if (nameValue.length < 3) {
        showError(nameInput, nameError, 'Name must be at least 3 characters long');
        return false;
    }

    // If all checks pass
    showSuccess(nameInput, nameError);
    return true;
}

/**
 * Validate Email Field
 * - Check if email is not empty
 * - Check if email format is valid using regex
 */
function validateEmail() {
    const emailValue = emailInput.value.trim();

    // Check if empty
    if (emailValue === '') {
        showError(emailInput, emailError, 'Email is required');
        return false;
    }

    // Check email format with regex pattern
    if (!EMAIL_PATTERN.test(emailValue)) {
        showError(emailInput, emailError, 'Please enter a valid email address');
        return false;
    }

    // If all checks pass
    showSuccess(emailInput, emailError);
    return true;
}

/**
 * Validate Phone Field
 * - Check if phone is not empty
 * - Check if phone is exactly 10 digits
 * - Check if phone contains only numeric values
 */
function validatePhone() {
    const phoneValue = phoneInput.value.trim();

    // Check if empty
    if (phoneValue === '') {
        showError(phoneInput, phoneError, 'Phone number is required');
        return false;
    }

    // Check if phone is exactly 10 digits
    if (!PHONE_PATTERN.test(phoneValue)) {
        showError(phoneInput, phoneError, 'Phone number must be exactly 10 digits');
        return false;
    }

    // If all checks pass
    showSuccess(phoneInput, phoneError);
    return true;
}

/**
 * Validate Gender Selection
 * - Check if at least one gender is selected
 */
function validateGender() {
    // Check if any gender radio button is selected
    const selectedGender = Array.from(genderRadios).some((radio) => radio.checked);

    if (!selectedGender) {
        showError(null, genderError, 'Please select a gender');
        return false;
    }

    // If valid
    genderError.classList.remove('active');
    return true;
}

/**
 * Validate Course Selection
 * - Check if a course is selected (not empty option)
 */
function validateCourse() {
    const courseValue = courseSelect.value;

    // Check if course is selected
    if (courseValue === '') {
        showError(courseSelect, courseError, 'Please select a course');
        return false;
    }

    // If valid
    showSuccess(courseSelect, courseError);
    return true;
}

/**
 * Validate Password Field
 * - Check if password is not empty
 * - Minimum 8 characters
 * - Must contain uppercase letter
 * - Must contain lowercase letter
 * - Must contain number
 * - Must contain special character (@$!%*?&)
 */
function validatePassword() {
    const passwordValue = passwordInput.value;

    // Check if empty
    if (passwordValue === '') {
        showError(passwordInput, passwordError, 'Password is required');
        return false;
    }

    // Check if password meets all requirements
    if (!PASSWORD_PATTERN.test(passwordValue)) {
        let errorMsg = 'Password must contain:\n';

        if (passwordValue.length < 8) {
            errorMsg += '• At least 8 characters\n';
        }
        if (!/[A-Z]/.test(passwordValue)) {
            errorMsg += '• At least 1 uppercase letter\n';
        }
        if (!/[a-z]/.test(passwordValue)) {
            errorMsg += '• At least 1 lowercase letter\n';
        }
        if (!/\d/.test(passwordValue)) {
            errorMsg += '• At least 1 number\n';
        }
        if (!/[@$!%*?&]/.test(passwordValue)) {
            errorMsg += '• At least 1 special character (@$!%*?&)';
        }

        showError(passwordInput, passwordError, errorMsg.replace(/\n/g, ' • '));
        return false;
    }

    // If all checks pass
    showSuccess(passwordInput, passwordError);
    return true;
}

// ============================================
// PASSWORD STRENGTH INDICATOR
// ============================================

/**
 * Update password strength visual indicator
 * @param {string} password - The password value to evaluate
 */
function updatePasswordStrength(password) {
    // Calculate strength based on criteria
    let strength = 0;

    // Criteria checks
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[@$!%*?&]/.test(password)) strength++;

    // Update visual bars and text
    updateStrengthUI(strength);
}

/**
 * Update the password strength UI elements
 * @param {number} strength - Strength level (0-5)
 */
function updateStrengthUI(strength) {
    // Reset all bars
    strengthBars.forEach((bar) => {
        bar.classList.remove('weak', 'medium', 'strong');
    });

    // Set strength text and colors
    if (strength === 0) {
        strengthText.textContent = 'Password strength';
        strengthText.className = 'strength-text';
    } else if (strength <= 2) {
        // Weak
        for (let i = 0; i < 2; i++) {
            strengthBars[i].classList.add('weak');
        }
        strengthText.textContent = '❌ Weak';
        strengthText.className = 'strength-text weak';
    } else if (strength <= 3) {
        // Medium
        for (let i = 0; i < 3; i++) {
            strengthBars[i].classList.add('medium');
        }
        strengthText.textContent = '⚠️ Medium';
        strengthText.className = 'strength-text medium';
    } else {
        // Strong
        for (let i = 0; i < 4; i++) {
            strengthBars[i].classList.add('strong');
        }
        strengthText.textContent = '✓ Strong';
        strengthText.className = 'strength-text strong';
    }
}

// ============================================
// PASSWORD VISIBILITY TOGGLE
// ============================================

/**
 * Toggle password visibility (show/hide)
 */
function togglePasswordVisibility() {
    const isPasswordVisible = passwordInput.type === 'password';

    // Toggle input type
    passwordInput.type = isPasswordVisible ? 'text' : 'password';

    // Update button icon/text
    togglePasswordBtn.textContent = isPasswordVisible ? '👁‍🗨️' : '👁️';
}

// ============================================
// ERROR AND SUCCESS HANDLERS
// ============================================

/**
 * Show error message and highlight field
 * @param {HTMLElement} inputElement - The input field to highlight
 * @param {HTMLElement} errorElement - The error message element
 * @param {string} message - The error message to display
 */
function showError(inputElement, errorElement, message) {
    // Add invalid class to input (if input provided)
    if (inputElement) {
        inputElement.classList.remove('valid');
        inputElement.classList.add('invalid');
    }

    // Display error message
    errorElement.textContent = message;
    errorElement.classList.add('active');
}

/**
 * Show success state and clear error
 * @param {HTMLElement} inputElement - The input field
 * @param {HTMLElement} errorElement - The error message element
 */
function showSuccess(inputElement, errorElement) {
    // Add valid class to input
    inputElement.classList.remove('invalid');
    inputElement.classList.add('valid');

    // Hide error message
    errorElement.classList.remove('active');
    errorElement.textContent = '';
}

// ============================================
// FORM SUBMISSION HANDLER
// ============================================

/**
 * Handle form submission
 * - Validate all fields
 * - Prevent submission if any field is invalid
 * - Show success message if all fields are valid
 */
function handleSubmit(e) {
    // Prevent default form submission
    e.preventDefault();

    // Validate all fields
    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isPhoneValid = validatePhone();
    const isGenderValid = validateGender();
    const isCourseValid = validateCourse();
    const isPasswordValid = validatePassword();

    // Check if all fields are valid
    const isFormValid = isNameValid && isEmailValid && isPhoneValid && 
                      isGenderValid && isCourseValid && isPasswordValid;

    if (isFormValid) {
        // All fields are valid - show success message
        showSuccessMessage();

        // Optional: Reset form after brief delay
        setTimeout(() => {
            resetForm();
        }, 2000);
    } else {
        // Form has errors - scroll to first error
        scrollToFirstError();
    }
}

/**
 * Show success message animation
 */
function showSuccessMessage() {
    successMessage.classList.add('active');

    // Auto-hide success message after 5 seconds
    setTimeout(() => {
        successMessage.classList.remove('active');
    }, 5000);
}

/**
 * Reset the form to initial state
 */
function resetForm() {
    // Clear all input values
    registrationForm.reset();

    // Clear all validation states
    [nameInput, emailInput, phoneInput, courseSelect, passwordInput].forEach((input) => {
        input.classList.remove('valid', 'invalid');
    });

    // Clear all error messages
    [nameError, emailError, phoneError, genderError, courseError, passwordError].forEach(
        (error) => {
            error.classList.remove('active');
            error.textContent = '';
        }
    );

    // Reset password strength indicator
    strengthBars.forEach((bar) => {
        bar.classList.remove('weak', 'medium', 'strong');
    });
    strengthText.textContent = 'Password strength';
    strengthText.className = 'strength-text';

    // Reset password input type
    passwordInput.type = 'password';
    togglePasswordBtn.textContent = '👁️';

    // Focus on name input
    nameInput.focus();
}

/**
 * Scroll to first invalid field for better UX
 */
function scrollToFirstError() {
    const invalidInputs = [nameInput, emailInput, phoneInput, courseSelect, passwordInput].filter(
        (input) => input.classList.contains('invalid')
    );

    if (invalidInputs.length > 0) {
        invalidInputs[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
        invalidInputs[0].focus();
    }
}

// ============================================
// MULTI-STEP FORM NAVIGATION
// ============================================

/**
 * Get validation function for current step
 * @returns {Array} Array of booleans indicating valid fields
 */
function validateCurrentStep() {
    if (currentStep === 1) {
        // Validate Personal Info (Step 1)
        return [validateName(), validateEmail(), validatePhone()];
    } else if (currentStep === 2) {
        // Validate Academic Info (Step 2)
        return [validateGender(), validateCourse()];
    } else {
        // Validate Security (Step 3)
        return [validatePassword()];
    }
}

/**
 * Handle next step button click
 */
function handleNextStep() {
    // Validate current step before moving forward
    const validations = validateCurrentStep();
    const isStepValid = validations.every((val) => val === true);

    if (!isStepValid) {
        // Show error and scroll to first error
        scrollToFirstError();
        return;
    }

    // Move to next step
    if (currentStep < totalSteps) {
        currentStep++;
        updateFormStep();
        updateProgressBar();
        saveFormDataToLocalStorage();
    }
}

/**
 * Handle previous step button click
 */
function handlePreviousStep() {
    if (currentStep > 1) {
        currentStep--;
        updateFormStep();
        updateProgressBar();
    }
}

/**
 * Update visible form step
 */
function updateFormStep() {
    // Hide all steps
    formSteps.forEach((step) => {
        step.classList.remove('active');
    });

    // Show current step
    formSteps[currentStep - 1].classList.add('active');

    // Update button visibility
    prevBtn.style.display = currentStep === 1 ? 'none' : 'flex';
    nextBtn.style.display = currentStep === totalSteps ? 'none' : 'flex';
    submitBtn.style.display = currentStep === totalSteps ? 'flex' : 'none';

    // Scroll to top of form
    registrationForm.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Auto-focus first input in new step
    const firstInput = formSteps[currentStep - 1].querySelector(
        'input:not([type="radio"]):not([type="hidden"]), select'
    );
    if (firstInput) {
        setTimeout(() => firstInput.focus(), 100);
    }
}

/**
 * Update progress bar and step indicators
 */
function updateProgressBar() {
    // Update progress fill width
    const progressPercentage = (currentStep / totalSteps) * 100;
    progressFill.style.width = progressPercentage + '%';

    // Update step indicators
    progressSteps.forEach((step, index) => {
        const stepNumber = index + 1;
        step.classList.remove('active', 'completed');

        if (stepNumber === currentStep) {
            step.classList.add('active');
        } else if (stepNumber < currentStep) {
            step.classList.add('completed');
        }
    });
}

// ============================================
// DARK MODE FUNCTIONALITY
// ============================================

/**
 * Toggle dark mode on/off
 */
function toggleDarkMode() {
    darkModeEnabled = !darkModeEnabled;
    document.body.classList.toggle('dark-mode');
    darkModeToggle.textContent = darkModeEnabled ? '☀️' : '🌙';

    // Save dark mode preference to localStorage
    localStorage.setItem('darkModeEnabled', darkModeEnabled);
}

/**
 * Load dark mode preference from localStorage
 */
function loadDarkModePreference() {
    const savedDarkMode = localStorage.getItem('darkModeEnabled') === 'true';
    if (savedDarkMode) {
        darkModeEnabled = true;
        document.body.classList.add('dark-mode');
        darkModeToggle.textContent = '☀️';
    }
}

// ============================================
// LOCALSTORAGE FUNCTIONS - Enhanced
// ============================================

/**
 * Save all form data to localStorage
 */
function saveFormDataToLocalStorage() {
    const formData = {
        name: nameInput.value,
        email: emailInput.value,
        phone: phoneInput.value,
        gender: document.querySelector('input[name="gender"]:checked')?.value || '',
        course: courseSelect.value,
        password: passwordInput.value,
        currentStep: currentStep,
    };

    try {
        localStorage.setItem('studentFormData', JSON.stringify(formData));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
}

/**
 * Load form data from localStorage
 */
function loadFormDataFromLocalStorage() {
    try {
        const savedData = localStorage.getItem('studentFormData');
        if (savedData) {
            const formData = JSON.parse(savedData);

            // Populate form fields
            nameInput.value = formData.name || '';
            emailInput.value = formData.email || '';
            phoneInput.value = formData.phone || '';
            courseSelect.value = formData.course || '';
            passwordInput.value = formData.password || '';

            // Set radio button
            if (formData.gender) {
                const genderRadio = document.querySelector(
                    `input[name="gender"][value="${formData.gender}"]`
                );
                if (genderRadio) {
                    genderRadio.checked = true;
                }
            }

            // Restore step position
            if (formData.currentStep && formData.currentStep > 1) {
                currentStep = formData.currentStep;
                updateFormStep();
                updateProgressBar();
            }

            // Update password strength if password exists
            if (formData.password) {
                updatePasswordStrength(formData.password);
            }
        }
    } catch (error) {
        console.error('Error loading from localStorage:', error);
    }
}

// ============================================
// INITIALIZATION
// ============================================

/**
 * Initialize the form when DOM is ready
 */
function initializeForm() {
    // Load dark mode preference
    loadDarkModePreference();

    // Load previously saved form data
    loadFormDataFromLocalStorage();

    // Initialize event listeners
    initializeEventListeners();

    // Update progress bar
    updateProgressBar();

    // Hide previous button on first step
    prevBtn.style.display = 'none';

    // Set initial focus
    const firstInput = formSteps[0].querySelector('input:not([type="radio"]):not([type="hidden"]), select');
    if (firstInput) {
        firstInput.focus();
    }
}

// Run initialization when DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeForm);

// Fallback initialization if DOMContentLoaded already fired
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeForm);
} else {
    initializeForm();
}
