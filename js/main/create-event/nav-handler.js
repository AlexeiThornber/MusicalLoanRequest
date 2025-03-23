function goBack() {
    window.location.href = "index.html";
}

function openPopup() {
    event.preventDefault();
    document.getElementById('popup').classList.add('active');
    document.getElementById('overlay').classList.add('active');
}

function closePopup() {
    document.getElementById('popup').classList.remove('active');
    document.getElementById('overlay').classList.remove('active')
}
