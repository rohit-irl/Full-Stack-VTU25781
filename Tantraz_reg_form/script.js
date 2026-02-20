document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');
    const submitButton = document.querySelector('button[type="submit"]');
    const formElements = form.querySelectorAll('input, select');

    // Add focus/blur animations
    formElements.forEach(element => {
        element.addEventListener('focus', () => {
            element.classList.add('focused');
        });
        element.addEventListener('blur', () => {
            element.classList.remove('focused');
        });
    });

    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent default form submission

        // Basic form validation
        let isValid = true;
        formElements.forEach(element => {
            if (element.hasAttribute('required') && element.value.trim() === '') {
                alert(`Please fill in the ${element.name} field.`);
                isValid = false;
                return;
            }
            if (element.type === 'email') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(element.value)) {
                    alert('Please enter a valid email address.');
                    isValid = false;
                    return;
                }
            }
        });

        if (!isValid) {
            return;
        }

        // Simulate form submission
        submitButton.textContent = 'Submitting...';
        submitButton.disabled = true;

        setTimeout(() => {
            submitButton.textContent = 'Submit';
            submitButton.disabled = false;
            alert('Form submitted successfully!');
        }, 2000);
    });
});
