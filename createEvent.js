import { Sonorisation } from './itemList.js';

// const itemOptions = document.getElementById("eventItems")

let options = ''

export function addHTMLOptions() {
    for (let key in Sonorisation) {
        const item = Sonorisation[key];
        console.log(item)
        options += `<option value="${key}">${item.name}</option>`;
    }
    // itemOptions.innerHTML = options;
}

export function goBack() {
    window.location.href = "index.html";
}

addHTMLOptions();

window.addHTMLOptions = addHTMLOptions;
window.goBack = goBack;