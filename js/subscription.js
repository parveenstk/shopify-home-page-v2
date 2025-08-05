// on key down '/' focus on email Inputs
document.addEventListener('keydown', function (event) {
    if (event.key === '/') {
        event.preventDefault(); // prevent default browser search behavior
        const desktopEmail = document.getElementById('email-address-desktop');
        const mobileEmail = document.getElementById('email-address-mobile');
        (desktopEmail && desktopEmail.focus()) || (mobileEmail && mobileEmail.focus());
    }
});

// toaster Elements
const toaster = document.getElementById('toaster');
const toasterTitle = document.getElementById('toaster-title');
const toasterText = document.getElementById('toaster-text');
const toasterCross = document.getElementById('toaster-cross');
const timerline = document.getElementById('timerline');

const submitBtn = document.getElementById('submit-button');
const spinner = document.getElementById('spinner-button');
const mobileSubmit = document.getElementById('submit-mobile');
const mobileSpinner = document.getElementById('spinner-button-mobile');

// Email inputs submission
document.addEventListener("DOMContentLoaded", function () {
    const desktopEmail = document.getElementById('email-address-desktop');
    const mobileEmail = document.getElementById('email-address-mobile');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Desktop email input
    submitBtn.addEventListener('click', function (event) {
        event.preventDefault();
        const desktopData = desktopEmail.value.trim();

        if (desktopData.length > 0 && emailRegex.test(desktopData)) {
            localStorage.setItem("Saved Email", desktopData);
            saveEmail(desktopData);
            hideToggleHandler(submitBtn, spinner);
            desktopEmail.value = ''; // clear input only here
        } else {
            updateToaster('warning');
            autoHide();
        }
    });

    // Mobile email input
    mobileSubmit.addEventListener('click', function (event) {
        event.preventDefault();
        const mobileData = mobileEmail.value.trim();

        if (mobileData.length > 0 && emailRegex.test(mobileData)) {
            localStorage.setItem("Saved Email", mobileData);
            saveEmail(mobileData);
            hideToggleHandler(mobileSubmit, mobileSpinner);
            mobileEmail.value = ''; // clear input only here
        } else {
            updateToaster('warning');
            autoHide();
        }
    })
});

// API call to save email inputs data in the sheet
const url = 'https://yomz-pages-data.vercel.app/api/data';
const emailInputtName = document.getElementById("email-address-desktop").getAttribute("name");
const desktopEmail = document.getElementById('email-address-desktop').value;
const saveEmail = async (email) => {
    try {
        const response = await fetch(`${url}?email=${email}&sheetName=${emailInputtName}&column=!B5:C5`, {
            method: 'GET'
        });
        const result = await response.json();

        if (result.result === 'SUCCESS') {
            console.log("Sheet Updated Successfully.");
            hideToggleHandler(spinner, submitBtn);
            hideToggleHandler(mobileSpinner, mobileSubmit);
            updateToaster('success');
            autoHide();
        } else {
            console.error("Server Error, Please try to re-submit the email.");
            updateToaster('error');
        }
    } catch (error) {
        console.error("Error calling API:", error);
    }
};

// Function to update toaster dynamically
const updateToaster = (type) => {
    toaster.classList.remove('hide')
    // Toaster Value
    toasterTitle.innerText = toasterContent[type].title;
    toasterText.innerText = toasterContent[type].text;
    toasterCross.children[0].src = toasterContent[type].crossIcon;
    toaster.style.backgroundColor = toasterContent[type].backgroundColor
    toaster.style.color = toasterContent[type].color
    timerline.style.backgroundColor = toasterContent[type].color
}

const autoHide = () => {

    let widthSize = 100; // Start at 100%
    // Set the width initially, ensuring it uses the transition
    timerline.style.width = widthSize + '%';
    // Calculate width change per interval
    const decrement = 500 / 3000 * 100;
    const interval = setInterval(() => {
        widthSize -= decrement; // Reduce width size
        timerline.style.width = widthSize + '%'; // Apply the updated width
        // console.log(widthSize);
    }, 500); // Adjust every 500ms
    // After 3 seconds, hide toaster and clear interval
    setTimeout(() => {
        toaster.classList.add('hide');
        clearInterval(interval);
    }, 3500);
}

// toaster 
const toasterContent = {
    success: {
        title: "Success !",
        text: "Your email is submitted successfully",
        color: "#2c9d45",
        backgroundColor: "#ebfbee",
        crossIcon: "./images/toaster/cross-tost-success.svg",
    },
    warning: {
        title: "Warning",
        text: "Please provide an email address",
        color: "#f18a02",
        backgroundColor: "#fff9dc",
        crossIcon: "./images/toaster/cross-tost-warning.svg",
    },
    error: {
        title: "Something went wrong!",
        text: "Please, try again in a while",
        color: "#bd5254",
        backgroundColor: "#fcefea",
        crossIcon: "./images/toaster/cross-tost-error.svg",
    }
};

// close toaster function
toasterCross.addEventListener('click', () => {
    toaster.classList.add('hide');
})

// Reusable functions to manage hide classes
const hideToggleHandler = (elem1, elem2) => {
    elem1.classList.add('hide');
    elem2.classList.remove('hide');
};