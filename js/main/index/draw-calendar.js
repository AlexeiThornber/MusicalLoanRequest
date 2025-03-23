import { Items } from '../../items/item-list.js';
import { drawEvents } from "./event-handler.js";
import { EventHelper } from '../helper/helper.js';

const monthYearElem = document.getElementById('monthYear');
const datesElem = document.getElementById('dates');
const prevButton = document.getElementById('prevButton');
const nextButton = document.getElementById('nextButton');

export const itemsPerDate = new Map();

let currentDate = new Date();

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
    itemsPerDate.clear();
    const footer = document.querySelector("footer");
    footer.innerHTML = ''; // Clear all elements of the footer

    for (let i = firstDayIndex; i > 0; i--) {
        const prevDate = new Date(currentYear, currentMonth, 0 - i);
        const stringDate = `${prevDate.getDate() + 1}_${prevDate.getMonth() + 1}_${prevDate.getFullYear()}`;

        datesHTML += `<div class = "date date_inactive" id = "${stringDate}">
        <div class = "date_num">${prevDate.getDate() + 1}</div><div class = "date_content"></div></div>`;  

        prevDate.setDate(prevDate.getDate() + 1);
        displayedDates.add(EventHelper.convertDateToString(prevDate));
        itemsPerDate.set(stringDate, Items);
    }

    for (let i = 1; i <= totalDays; i++){
        const date = new Date(currentYear, currentMonth, i);
        const activeClass = date.toDateString() === new Date().toDateString() ? 'active' : '';
        const isSunday = date.getDay() === 0 ? "Sun" : "";
        const stringDate = `${date.getDate()}_${date.getMonth() + 1}_${date.getFullYear()}`;

        datesHTML += `<div class = "date date_${activeClass} ${isSunday}" id = "${stringDate}">
        <div class = "date_num">${i}</div><div class = "date_content"></div></div>`

        itemsPerDate.set(stringDate, Items);
        displayedDates.add(EventHelper.convertDateToString(date));
    }

    for(let i = 1; i <= 7 - lastDayIndex; i++){
        const nextDate = new Date(currentYear, currentMonth + 1, i);
        const isSunday = nextDate.getDay() === 0 ? "Sun" : "";
        const stringDate = `${nextDate.getDate()}_${nextDate.getMonth() + 1}_${nextDate.getFullYear()}`;

        datesHTML += `<div class = "date date_inactive ${isSunday}" id = "${stringDate}">
        <div class = "date_num">${nextDate.getDate()}</div><div class = "date_content"></div></div>`;

        itemsPerDate.set(stringDate, Items);
        displayedDates.add(EventHelper.convertDateToString(nextDate));
    }
    datesElem.innerHTML = datesHTML;
    console.log(itemsPerDate);
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
    window.location.href = "create-event.html";
})