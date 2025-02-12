const monthYearElem = document.getElementById('monthYear');
const datesElem = document.getElementById('dates');
const prevButton = document.getElementById('prevButton');
const nextButton = document.getElementById('nextButton');

const dateContent = `<div class = "zero"></div>
        <div class = "four"></div>
        <div class = "eight"></div>
        <div class = "twelve"></div>
        <div class = "sixteen"></div>
        <div class = "twenty"></div>`

let currentDate = new Date(); //this behaves like a global variable

const updateCalendar = () => {
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    const firstDay = new Date(currentYear, currentMonth, 0);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const totalDays = lastDay.getDate();
    const firstDayIndex = firstDay.getDay();
    const lastDayIndex = lastDay.getDay();

    const monthYearString = currentDate.toLocaleString('default', { month: 'long', year: 'numeric'});
    monthYearElem.textContent = monthYearString;

    let datesHTML = '';

    console.log(firstDayIndex);

    for (let i = firstDayIndex; i > 0; i--) {
        const prevDate = new Date(currentYear, currentMonth, 0 - i);
        datesHTML += `<div class = "date date_inactive"><p>${prevDate.getDate()}</p>${dateContent}</div>`;
    }

    for (let i = 1; i <= totalDays; i++){
        const date = new Date(currentYear, currentMonth, i);
        const activeClass = date.toDateString() === new Date().toDateString() ? 'active' : '';
        datesHTML += `<div class = "date date_${activeClass}"><p>${i}</p>${dateContent}</div>`
    }

    for(let i = 1; i <= 7 - lastDayIndex; i++){
        const nextDate = new Date(currentYear, currentMonth + 1, i);
        datesHTML += `<div class = "date date_inactive"><p>${nextDate.getDate()}</p>${dateContent}</div>`;
    }

    datesElem.innerHTML = datesHTML;
}

prevButton.addEventListener('click', () => {
    currentDate = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
    updateCalendar();
});

nextButton.addEventListener('click', () => {
    currentDate = new Date(currentDate.setMonth(currentDate.getMonth() + 1));
    updateCalendar();
});

updateCalendar();

function switchPage(){
    window.location.href = "createEvent.html";
}

