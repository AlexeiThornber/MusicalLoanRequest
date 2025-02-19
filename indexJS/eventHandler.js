import { collection, getDocs } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";
import { displayedDates, convertDateToStringFormat } from "./drawCalendar.js";

//Dupliocate code, a bit annoying but okay...
const firebaseConfig = {
    apiKey: "AIzaSyDqdd0AYy50IRT-MFPCzmwR0ZHHJYrl9Z8",
    authDomain: "musicalloanrequests.firebaseapp.com",
    projectId: "musicalloanrequests",
    storageBucket: "musicalloanrequests.firebasestorage.app",
    messagingSenderId: "713902726859",
    appId: "1:713902726859:web:25cde11bb242148cfa054e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

//All events loaded from firebase
const listLoadedEvents = [];

//Proceed with sanitization
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "events"));
        querySnapshot.forEach((doc) => {
            // You can add code here to display the events on your page

            const data = doc.data();

            const mapItems = new Map();
            data.items.forEach(element => {
                mapItems.set(element.key, element.value)
            })

            const loadedEvent = {
                title: data.title,
                beneficiary: data.beneficiary,
                startDate: new Date(data.start.seconds * 1000), //*1000 to add the missing nanoseconds
                endDate: new Date(data.end.seconds * 1000),
                description: data.description,
                items: mapItems
            }

            listLoadedEvents.push(loadedEvent);
        });

        drawEvents();
    } catch (e) {
        console.error("Error fetching documents: ", e);
    }
});


export function drawEvents(){

    // console.log(listLoadedEvents);
    // console.log(displayedDates);

    //Filter the events that are not displayed
    const displayedEvents = listLoadedEvents.filter((event) => isEventContainedOnPage(event));

    // console.log(currentEvents);

    displayedEvents.forEach(event => {
        // console.log(event);
        // console.log(currentDate);
        // console.log(event.endDate);
        // while(currentDate.getDay() <= event.endDate.getDate()){
        //     let day = currentDate.getDate();
        //     let month = currentDate.getMonth() + 1;
        //     let year = currentDate.getFullYear();
            
        //     let dayDiv = document.getElementById(day + "_" + month + "_" + year);
        //     console.log(day + "_" + month + "_" + year);
        //     customiseDiv(dayDiv, currentDate, event);

        //     currentDate.setDate(currentDate.getDate() + 1);

        // }
        iterateDates(event.startDate, event.endDate, (date) => {
            let day = date.getDate();
            let month = date.getMonth() + 1;
            let year = date.getFullYear();

            let divId = document.getElementById(day + "_" + month + "_" + year);
            customiseDiv(divId, date, event, displayedEvents);
        });
    })
}

function iterateDates(startDate, endDate, callback) {
    let currentDate = new Date(startDate);

    while (currentDate.getDate() <= endDate.getDate()) {
        callback(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }
}

function customiseDiv(div, currentDate, event, displayedEvents){
    if (div) {
        let childDiv = div.querySelector('.one');
        if (childDiv){
            childDiv.style.backgroundColor = "green";
            childDiv.style.zIndex = "10"; // Ensure the div is on a higher z plane
            if ((currentDate.getDate() !== event.endDate.getDate()) &&
                !div.className.includes("Sun")) {
                childDiv.style.width = "110%";
            }
        }
        childDiv.style.bord
    }
}

//Helper funtions to filter events
function isEventContainedOnPage(event) {
    return displayedDates.has(convertDateToStringFormat(event.startDate)) 
    || displayedDates.has(convertDateToStringFormat(event.endDate));
}

//Helper function to check event conflicts
function checkEventCollision(){
    
}