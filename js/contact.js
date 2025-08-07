// Form elements
const form = document.getElementById('contact-form');
const nameInput = document.getElementById('name');
const emailAddress = document.getElementById('email-address');
const phoneNumber = document.getElementById('phone-number');
const commentBox = document.getElementById('comment-box');
const successMessage = document.getElementById('success-message');

const fields = [nameInput, emailAddress, phoneNumber, commentBox];

document.addEventListener('DOMContentLoaded', function () {

    // form submission handling
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        let isFormValid = true;
        fields.forEach(field => {
            const isValid = checkInput(field);
            if (!isValid) {
                isFormValid = false;
            }
        });

        if (!isFormValid) {
            console.warn("Form has validation errors.");
            return; // Stop submission
        };

        const inputValues = {
            nameInput: nameInput.value.trim(),
            emailAddress: emailAddress.value.trim(),
            phoneNumber: phoneNumber.value.trim(),
            commentBox: commentBox.value.trim(),
        };

        window.localStorage.setItem('contactData', JSON.stringify(inputValues));
        const contData = JSON.parse(localStorage.getItem('contactData'));
        console.log('contData:', contData);
        successMessage.classList.remove('hide');
        resetForm();
    });

    fields.forEach(field => {
        field.addEventListener('input', () => validationCheck(field));
    })

})

// Check input fiels
const checkInput = (field) => {
    const value = field.value.trim();
    const errorSpan = document.getElementById(`${field.id}-error`);

    if (!value) {
        field.classList.remove('is-valid');
        field.classList.add('is-invalid');
        errorSpan.classList.remove('hide');
        errorSpan.innerText = 'This field is required';
        return false;
    } else {
        field.classList.remove('is-invalid');
        field.classList.add('is-valid');
        errorSpan.classList.add('hide');
        errorSpan.innerText = '';
        return true;
    }
};

// clear inputs
const resetForm = () => {
    fields.forEach(field => {
        field.value = '';
        field.classList.remove('is-valid', 'is-invalid');
        hideMessage();
    })
};

const validationRules = {
    'name': {
        regex: /^[a-zA-Z\s]{2,30}$/,
        clean: /[^a-zA-Z\s]/g, // Remove non-letters/spaces
        error: 'Name must be 2–30 letters only.'
    },
    'email-address': {
        regex: /^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/,
        error: 'Enter a valid email address.'
    },
    'phone-number': {
        regex: /^\d{10,15}$/,
        clean: /[^\d]/g, // Remove non-digits
        error: 'Phone number must be 10–15 digits.'
    },
    'comment-box': {
        regex: /^.{5,300}$/,
        error: 'Comment must be between 5 and 300 characters.'
    }
};

// check validation
const validationCheck = (field) => {
    const rule = validationRules[field.id];
    const errorSpan = document.getElementById(`${field.id}-error`);
    if (!rule) return;

    let value = field.value;

    // Step 1: Clean input (if applicable)
    if (rule.clean) {
        value = value.replace(rule.clean, '');
        field.value = value; // Update input with cleaned value
    }

    // Step 2: Trim and validate
    value = value.trim();

    if (!rule.regex.test(value)) {
        field.classList.remove('is-valid');
        field.classList.add('is-invalid');

        if (errorSpan) {
            errorSpan.classList.remove('hide');
            errorSpan.innerText = rule.error;
        }
    } else {
        field.classList.remove('is-invalid');
        field.classList.add('is-valid');

        if (errorSpan) {
            errorSpan.classList.add('hide');
            errorSpan.innerText = '';
        }
    }
};

// hide success message 
const hideMessage = () => {
    setTimeout(() => {
        successMessage.classList.add('hide');
    }, 4000)
};
