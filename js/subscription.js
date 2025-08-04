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

// Email inputs submission
document.addEventListener("DOMContentLoaded", function () {
    const desktopForm = document.getElementById("subscribe-desktop-form");
    const desktopEmail = document.getElementById('email-address-desktop');
    const mobileForm = document.getElementById("subscribe-mobile-form");
    const mobileEmail = document.getElementById('email-address-mobile');
    // desktop email input
    desktopForm && desktopForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const desktopData = desktopEmail.value;
        if (desktopData.length > 0) {
            localStorage.setItem("Saved Email", desktopData);
            saveEmail(desktopEmail.value);
            updateToaster('success');
            autoHide();
        } else {
            updateToaster('warning');
            autoHide();
        }
        desktopEmail.value = ''; // clear input
    });
    // mobile email input
    mobileForm && mobileForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const mobileData = mobileEmail.value;
        if (mobileData.length > 0) {
            localStorage.setItem("Saved Email", mobileData);
            saveEmail(mobileEmail.value);
            updateToaster('success');
            autoHide();
        } else {
            updateToaster('warning');
            autoHide();
        }
        mobileEmail.value = ''; // clear input
    });
});

// API call to save email inputs data in the sheet
const url = 'https://yomz-pages-data.vercel.app/api/data';
const emailInputtName = document.getElementById("email-address-desktop").getAttribute("name");
const desktopEmail = document.getElementById('email-address-desktop').value;
const saveEmail = async (email) => {
    const response = await fetch(`${url}?email=${email}&sheetName=${emailInputtName}&column=!B5:C5`, {
        method: 'GET'
    }).then(res => res.json());
    console.log("response:", response)
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
    }
};

// close toaster function
toasterCross.addEventListener('click', () => {
    toaster.classList.add('hide');
})