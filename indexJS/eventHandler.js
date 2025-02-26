import { collection, getDocs } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";
import { displayedDates, convertDateToString } from "./drawCalendar.js";
import { getItem } from "../itemList.js";

//Duplicate code, a bit annoying but okay...
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
                items: mapItems,
                uid: data.uid
            }

            listLoadedEvents.push(loadedEvent);
        });

        drawEvents();
    } catch (e) {
        console.error("Error fetching documents: ", e);
    }
});


export function drawEvents(){

    //Filter the events that are not displayed (the ones that are not on the current month)
    displayedEvents = listLoadedEvents.filter((event) => isEventContainedOnPage(event));

    //sort the events by ascending order 
    displayedEvents = displayedEvents.sort((event1, event2) => event1.startDate.getTime() - event2.startDate.getTime());


    //CollisionEventsArray is an array contaning array of events of the sort [[event1, event2], [event3]]
    //If two events intersect (such as event1 and event2) they will be placed in the same array.
    let collisionEventsArray = [];
    let collisionEvents = [displayedEvents[0]];

    console.log(collisionEventsArray);

    //We only proceed with the creation of the collisionEventsArray with when there are events displayed
    if(displayedEvents.length !== 0){

        createCollisionArray(displayedEvents, 0, 1, collisionEvents, (arg) => {
            collisionEventsArray.push(arg);
        })

        collisionEventsArray.forEach((collisionEvents) => {
            const dates = findLargestDates(collisionEvents); //this is a tuple

            iterateDates(dates[0], dates[1], (date) => {
                const day = date.getDate();
                const month = date.getMonth() + 1;
                const year = date.getFullYear();
                const divId = document.getElementById(day + "_" + month + "_" + year);
                customiseDiv(divId, date, collisionEvents);
            })

        }) 
    }
}

function createCollisionArray(displayedEvents ,idx1, idx2, collisionEvents, callback){
    if(!(idx2 < displayedEvents.length)){
        callback(collisionEvents);
        return;
    }
    if(isEventContainedInAnother(displayedEvents[idx1], displayedEvents[idx2])){
        collisionEvents.push(displayedEvents[idx2]);
        createCollisionArray(displayedEvents, idx2, idx2 + 1, collisionEvents, callback);
    }else{
        callback(collisionEvents);
        collisionEvents = [displayedEvents[idx2]];
        createCollisionArray(displayedEvents, idx2, idx2 + 1, collisionEvents, callback);
    }
}


function iterateDates(startDate, endDate, callback) {
    let currentDate = convertDateNoHours(new Date(startDate));

    while (currentDate.getTime() <= endDate.getTime()) {
        callback(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }
}

/**
 * Customises the calendar date div with the number of events contained in the date 
 * @param {*} divId The id of the modified calendar div (id = dd/mm/yyyy)
 * @param {*} currentDate The current date of the modified calendar
 * @param {*} events The events that are in collsision date wise
 */
function customiseDiv(divId, currentDate, events){
    if (divId) {
        const childDiv = divId.querySelector(".date_content");
        if(childDiv){
            events.forEach((event, index) => {
                const eventDiv = document.createElement("div");

                eventDiv.setAttribute("id", event.uid);
                eventDiv.setAttribute("class", "events");

                const eventTitle = document.createElement("p");

                eventTitle.textContent = event.title;

                if(currentDate.getTime() < convertDateNoHours(event.startDate).getTime()
                    || currentDate.getTime() > convertDateNoHours(event.endDate).getTime() ){
                    eventDiv.style.visibility = 'hidden';
                }

                if (convertDateToString(currentDate) !== convertDateToString(event.endDate) &&
                    !divId.className.includes("Sun")) {
                    eventDiv.style.width = "110%";
                }

                eventDiv.addEventListener('click', () => {
                    window.location.href = `createEvent.html?id=${event.uid}`
                })

                for(let i = index + 1; i < events.length; i++){
                    if(checkItemCollision(event, events[i]) && event.endDate.getTime() > events[i].startDate.getTime()){
                        eventDiv.style.backgroundColor = "red";
                    }
                }

                eventDiv.append(eventTitle);
                childDiv.append(eventDiv);
                
            })
        }
        childDiv.style.zIndex = "10";
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
    return (convertDateNoHours(eventComparedTo.startDate).getTime() <= convertDateNoHours(eventToCheck.startDate).getTime())
    && (convertDateNoHours(eventComparedTo.endDate).getTime() >= convertDateNoHours(eventToCheck.startDate).getTime());
}


function findLargestDates(collisionEvents){
    let dateS = collisionEvents[0].startDate;
    let dateE = collisionEvents[0].endDate;
    collisionEvents.forEach((event) =>{

        if( event.startDate.getTime() < dateS.getTime()){
            dateS = event.startDate; 
        }
        if(event.endDate.getTime() > dateE.getTime()){
            dateE = event.endDate;
        }
    })
    return [convertDateNoHours(dateS), convertDateNoHours(dateE)];
}

function checkItemCollision(event1, event2){
    const set1 = new Set(event1.items.keys());
    const set2 = new Set(event2.items.keys());

    for (let item of set1) {
        if (set2.has(item)) {
            let maxQuantity = getItem(item).quantity;
            let actualQuantity = parseInt(event1.items.get(item)) + parseInt(event2.items.get(item));
            if(actualQuantity > maxQuantity){
                return true;
            }
        }
    }
    return false;
}


//Helper function to convert Dates and no take into account the hours
function convertDateNoHours(date){
    const newDate = new Date(date.getTime());
    return new Date(newDate.setHours(0,0,0,0));
}