const img = document.getElementById('spinner-img');
img.addEventListener('mouseenter', () => {
    img.src = './images/toaster/infinite-loader-purple.svg';
});

img.addEventListener('mouseleave', () => {
    img.src = './images/toaster/infinite-loader-blue.svg';
});