import { drawEvents } from "./eventHandler.js";

const monthYearElem = document.getElementById('monthYear');
const datesElem = document.getElementById('dates');
const prevButton = document.getElementById('prevButton');
const nextButton = document.getElementById('nextButton');


let currentDate = new Date(); //this behaves like a global variable

export const displayedDates = new Set();

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
    monthYearElem.className = `${currentMonth}`;

    let datesHTML = '';

    displayedDates.clear();

    for (let i = firstDayIndex; i > 0; i--) {
        const prevDate = new Date(currentYear, currentMonth, 0 - i);
        datesHTML += `<div class = "date date_inactive" id = "${prevDate.getDate() + 1}_${prevDate.getMonth() + 1}_${prevDate.getFullYear()}">
        <div class = "date_num">${prevDate.getDate() + 1}</div><div class = "date_content"></div></div>`;  
        prevDate.setDate(prevDate.getDate() + 1);
        displayedDates.add( convertDateToInt(prevDate));
    }

    for (let i = 1; i <= totalDays; i++){
        const date = new Date(currentYear, currentMonth, i);
        const activeClass = date.toDateString() === new Date().toDateString() ? 'active' : '';
        const isSunday = date.getDay() === 0 ? "Sun" : "";
        datesHTML += `<div class = "date date_${activeClass} ${isSunday}" id = "${date.getDate()}_${date.getMonth() + 1}_${date.getFullYear()}">
        <div class = "date_num">${i}</div><div class = "date_content"></div></div>`
        displayedDates.add(convertDateToInt(date));
    }

    for(let i = 1; i <= 7 - lastDayIndex; i++){
        const nextDate = new Date(currentYear, currentMonth + 1, i);
        const isSunday = nextDate.getDay() === 0 ? "Sun" : "";
        datesHTML += `<div class = "date date_inactive ${isSunday}" id = "${nextDate.getDate()}_${nextDate.getMonth() + 1}_${nextDate.getFullYear()}">
        <div class = "date_num">${nextDate.getDate()}</div><div class = "date_content"></div></div>`;
        displayedDates.add(convertDateToInt(nextDate));
    }
    datesElem.innerHTML = datesHTML;
}

prevButton.addEventListener('click', () => {
    currentDate = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
    updateCalendar();
    drawEvents();

});

nextButton.addEventListener('click', () => {
    currentDate = new Date(currentDate.setMonth(currentDate.getMonth() + 1));
    updateCalendar();
    drawEvents();
});

updateCalendar();

document.getElementById("switchPage").addEventListener('click', () => {
    window.location.href = "createEvent.html";
})


//Helper funtions to convert dates to mm_dd_yyyy format
export function convertDateToInt(date){
    return `${date.getDate()}_${date.getMonth() + 1}_${date.getFullYear()}`;
}