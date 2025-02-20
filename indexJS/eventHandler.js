import { collection, getDocs } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";
import { displayedDates, convertDateToString } from "./drawCalendar.js";

//Dupliocate code, a bit annoying but okay...
const firebaseConfig = {
    apiKey: "AIzaSyDqdd0AYy50IRT-MFPCzmwR0ZHHJYrl9Z8",
    authDomain: "musicalloanrequests.firebaseapp.com",
    projectId: "musicalloanrequests",
    storageBucket: "musicalloanrequests.firebasestorage.app",
    messagingSenderId: "713902726859",
    appId: "1:713902726859:web:25cde11bb242148cfa054e"
};

const eventNumber = Object.freeze({
    1 : { id : "one"  , color : "rgb(0, 100, 0)"   },
    2 : { id : "two"  ,color : "rgb(0, 120, 0)"   },
    3 : { id : "three",color : "rgb(0, 160, 0)"   },
    4 : { id : "four" ,color : "rgb(0, 200, 0)"   },
    5 : { id : "five" ,color : "rgb(0, 240, 0)"   },
    6 : { id : "six" ,color : "rgb(0, 250, 0)"   },
})

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

//All events loaded from firebase
const listLoadedEvents = [];
let displayedEvents;

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

    //Filter the events that are not displayed
    displayedEvents = listLoadedEvents.filter((event) => isEventContainedOnPage(event));
    displayedEvents = displayedEvents.sort((event1, event2) => event1.startDate - event2.startDate);

    // console.log(displayedEvents);

    let processedEvents = [];   

    displayedEvents.forEach(event => {
        processedEvents.push(event);
        let collisionNum = checkEventCollision(event, processedEvents);

        iterateDates(event.startDate, event.endDate, (date) => {

            let day = date.getDate();
            let month = date.getMonth() + 1;
            let year = date.getFullYear();

            let divId = document.getElementById(day + "_" + month + "_" + year);
            customiseDiv(divId, date, event, collisionNum);
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

function customiseDiv(div, currentDate, event, collisionNum){
    if (div) {
        // console.log('.' + collisionNum);
        let childDiv = div.querySelector('.' + collisionNum.id);
        if (childDiv){
            childDiv.style.backgroundColor = collisionNum.color;
            childDiv.style.zIndex = "10";
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
    return displayedDates.has(convertDateToString(event.startDate)) 
    || displayedDates.has(convertDateToString(event.endDate));
}

/**
 * Helper function to check whether the startDate of an event is contained in another event
 * @param {*} eventComparedTo The "parent" event that sets the benchmark
 * @param {*} eventToCheck The event to check
 * If the startDate of the eventToCheck is in the  
 */
function isEventContainedInAnother(eventComparedTo, eventToCheck){
    return (convertDateToString(eventComparedTo.startDate) <= convertDateToString(eventToCheck.startDate))
    && (convertDateToString(eventComparedTo.endDate)) >= convertDateToString(eventToCheck.startDate);
}

//Helper function to check event conflicts
function checkEventCollision(event, processedEvents){
    let counter = 0;
    console.log(processedEvents);
    processedEvents.forEach((prevEvent) => {
        if(isEventContainedInAnother(prevEvent, event)){
            counter ++;
        }
    })

    // console.log(counter);

    return eventNumber[counter];    
}