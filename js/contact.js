// Form elements
const form = document.getElementById('contact-form');
const nameInput = document.getElementById('name');
const emailAddress = document.getElementById('email-address');
const phoneNumber = document.getElementById('phone-number');
const commentBox = document.getElementById('comment-box');
const messageBox = document.getElementById('message-box');
const innerMessage = document.getElementById('inner-message');
const loader = document.getElementById('spinner-img');
const submitButton = document.getElementById('submit-form');

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
        hideToggleHandle(submitButton, loader)
        updateSheet(contData);
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
        messageBox.classList.add('hide');
    }, 4000)
};

// manage hide toggles
const hideToggleHandle = (elem1, elem2) => {
    elem1.classList.add('hide');
    elem2.classList.remove('hide');
};

// Call API to save data in excel sheet
const updateSheet = async (formData) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        formData: formData,
        sheetName: "Shopify Version - 2",
        column: "!E5:I5"
    });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
        controller.abort(); // Abort the request after 30 seconds
    }, 30000);

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
        signal: controller.signal
    };

    try {
        const response = await fetch("https://yomz-pages-data.vercel.app/api/contactUs", requestOptions);
        clearTimeout(timeoutId); // Clear the timeout on success
        const result = await response.json();

        if (result.status === 'SUCCESS') {
            updatedMessage('success');
            hideToggleHandle(loader, submitButton);
            hideMessage();
            resetForm();
        } else {
            console.error("Server returned error:", result.message);
        }
    } catch (error) {
        if (error.name === 'AbortError') {
            console.error("Request timed out after 30 seconds.");
            resetForm();
            hideToggleHandle(loader, submitButton);
            updatedMessage('error');
            hideMessage();
        } else {
            console.warn("Fetch failed:", error);
        }
    }
};

const messageContent = {
    'success': {
        innerText: 'Details sent successfully! We’ll be in touch shortly.',
        backgroundColor: '#499749'
    },
    'error': {
        innerText: 'Please, try again in a while.',
        backgroundColor: '#d43333'
    }
}

const updatedMessage = (type) => {
    messageBox.classList.remove('hide');

    innerMessage.innerText = messageContent[type].innerText;
    innerMessage.style.backgroundColor = messageContent[type].backgroundColor;
}