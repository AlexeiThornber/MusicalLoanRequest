import { collection, getDocs } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";
import { displayedDates, itemsPerDate } from "./draw-calendar.js";
import { keyToCategoryConverter } from "../../items/item-list.js";
import { UnionFind } from "../../modules/union-find.js";
import { EventHelper } from "../helper/helper.js";

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
    displayedEvents = listLoadedEvents.filter((event) => { 
        return displayedDates.has(EventHelper.convertDateToString(event.startDate)) 
        || displayedDates.has(EventHelper.convertDateToString(event.endDate));
    });

    //sort the events by ascending order 
    displayedEvents = displayedEvents.sort((event1, event2) => event1.startDate.getTime() - event2.startDate.getTime());
    const eventMap = new Map(displayedEvents.map((event) => [event.uid, event]));


    //CollisionEventsArray is an array contaning array of events of the sort [[event1, event2], [event3]]
    //If two events intersect (such as event1 and event2) they will be placed in the same array.
    const mainArray = [];
    const collisionArray = [displayedEvents[0]];
    const clusterArray = [];

    //We only proceed with the creation of the collisionEventsArray with when there are events displayed
    if(displayedEvents.length !== 0){

        createCollisionArray(displayedEvents, 0, 1, collisionArray, clusterArray, (clusterArray) => {
            mainArray.push(clusterArray);
        })

        const flattenArray = mainArray.flat() 

        //Convert the main array to only take into account the uids of the events
        //this is to avoid problems with references when dealing with the linkSubarray method
        const uidArray = flattenArray.map((subarray) => subarray.map(elem => elem.uid));

        const linkedUidArrays = linkSubarrays(uidArray);

        for(const linkedUidArray of linkedUidArrays){
            const timeline = computeTimeLine(linkedUidArray, id => eventMap.get(id));
            drawTimeline(timeline, id => eventMap.get(id));
        }

        const collisionMap = new Map();

        const addItemToCollisionNew = (dateString, item) =>  {
                collisionMap.set(dateString, new Set([item]))
        };

        const addItemToCollision = (dateString, item) => {
            let currentSet = collisionMap.get(dateString);
            currentSet.add(item);
            collisionMap.set(dateString, currentSet);
        }

        computeCollisions(
            (dateString, item) => {
                collisionMap.has(dateString) ? addItemToCollision(dateString, item) : addItemToCollisionNew(dateString, item);
            }
        )

        if(collisionMap.size > 0) {
            drawCollisions(collisionMap);
        }
    }
}

function createCollisionArray(displayedEvents ,idx1, idx2, collisionArray, clusterArray, addClusterToMain){
    //Check that i didn't fuck up the indices (should never be called)
    if(idx1 >= idx2){
        console.log("indexes are fucked up");
        return;
    } 
    //If we are in this case, that means that all the remaining events are contained in the 
    //event at idx1, thefore the algorithm terminates and we can return.
    if(!(idx2 < displayedEvents.length)){
        clusterArray.push(collisionArray);
        addClusterToMain(clusterArray);
        return;
    //This means that we are at the end of the cluster because 
    //It is not the end of the displayed events list but we have found a singleton meaning there are no more conflicts
    }else if(!EventHelper.isEventContainedInAnother(displayedEvents[idx1], displayedEvents[idx2]) && collisionArray.length === 1){
        clusterArray.push(collisionArray);
        addClusterToMain(clusterArray);
        idx1 = idx1 + 1;
        idx2 = idx1 + 1;
        collisionArray = [displayedEvents[idx1]];
        clusterArray = [];
        createCollisionArray(displayedEvents, idx1, idx2, collisionArray, clusterArray, addClusterToMain);
    }else if(EventHelper.isEventContainedInAnother(displayedEvents[idx1], displayedEvents[idx2])){
        collisionArray.push(displayedEvents[idx2]);
        createCollisionArray(displayedEvents, idx1, idx2 + 1, collisionArray, clusterArray, addClusterToMain);
    }else{
        clusterArray.push(collisionArray);
        idx1 = idx1 + 1;
        idx2 = idx1 + 1;
        collisionArray = [displayedEvents[idx1]];
        createCollisionArray(displayedEvents, idx1, idx2, collisionArray, clusterArray, addClusterToMain);
    }
}

function computeCollisions(addCollisionItem){

    //items will be a pair of date (items[0] and object describing the inventory (items[1]))
    for(const items of itemsPerDate){
        const dateString = items[0];

        for(const category of Object.entries(items[1])){
            for(const item of Object.entries(category[1])){
                if(item[1].quantity < 0){
                    addCollisionItem(item[0], dateString);
                }
            }
        }
    }
} 

function removeItemsFromDate(items, dateString){
    const currentItems = JSON.parse(JSON.stringify(itemsPerDate.get(dateString)));
    items.forEach((value, key) => {
        let parent = keyToCategoryConverter(key);
        currentItems[parent][key].quantity = 
        currentItems[parent][key].quantity - value;
    });
    itemsPerDate.set(dateString, currentItems);
}

function linkSubarrays(arrays) {
    const uf = new UnionFind();

    // Union elements in the same subarray
    for (const subarray of arrays) {
        for (let i = 1; i < subarray.length; i++) {
            uf.union(subarray[0], subarray[i]);
        }
    }

    // Group elements by their root
    const groups = new Map();
    for (const subarray of arrays) {
        for (const element of subarray) {
            const root = uf.find(element);
            if (!groups.has(root)) {
                groups.set(root, new Set());
            }
            groups.get(root).add(element);
        }
    }

    // Convert sets to arrays
    const result = [];
    for (const group of groups.values()) {
        result.push(Array.from(group));
    }

    return result;
}

function computeTimeLine(eventsUid, getEvent){
    const eventsWithRange = eventsUid.map(eventUid => {
        return {
            uid: eventUid,
            range: EventHelper.makeRange(
                EventHelper.convertDateToDay( getEvent(eventUid).startDate),
                EventHelper.convertDateToDay( getEvent(eventUid).endDate)
            )
        }
    })


    const timeLineStart = Math.min(...eventsWithRange.map(event =>
        EventHelper.convertDateToDay(getEvent(event.uid).startDate)));
    const timeLineEnd = Math.max(...eventsWithRange.map(event => 
        EventHelper.convertDateToDay(getEvent(event.uid).endDate)));
    const timeLineLength = timeLineEnd - timeLineStart + 1;

    const timeline = [...Array(timeLineLength).keys()].map( i => {
        const day = timeLineStart + i;
        const collisions = eventsWithRange.filter(eventUid => eventUid.range.includes(day)).length;
        return{
            day,
            collisions
        }
    })

    const timeLineHeight = Math.max(...timeline.map(day => day.collisions));

    const eventTimeline = new Array(timeLineLength).fill("").map(() => new Array(timeLineHeight).fill(""));

    //Iterate through all the events
    for(const event of eventsWithRange){
        const eventStart = EventHelper.convertDateToDay(getEvent(event.uid).startDate) - timeLineStart;
        const eventEnd = EventHelper.convertDateToDay(getEvent(event.uid).endDate) - timeLineStart;

        let avaidableTimelinePosition = 0;
        for(let i = eventStart; i <= eventEnd; i++){
            const index = eventTimeline[i].findIndex(eventSlot => eventSlot === "");
            if(index > -1){
                avaidableTimelinePosition = Math.max(avaidableTimelinePosition, index);
            }
        }

        for(let i = eventStart; i <= eventEnd; i++){
            eventTimeline[i][avaidableTimelinePosition] = (event.uid);
        }

    
    }
    return eventTimeline;
}

function drawTimeline(timeline, getEvent){
    const nbrDays = timeline.length;
    const rows = timeline[0].length;

    for(let day = 0; day < nbrDays; day++){
        const dateString = EventHelper.convertDateToString(new Date(getEvent(timeline[0][0]).startDate.getTime() + 
        (day * 24 * 60 * 60 * 1000)));
        
        for(let row = 0; row < rows; row++){
            const currentEvent = getEvent(timeline[day][row]);

            drawEvent(currentEvent, dateString);

            //The second condition is to check for edge cases (31 to 1 of the month)
            //If not checked, the program will try to remove items on a date that is not displayed
            if(currentEvent !== undefined && displayedDates.has(dateString)){
                removeItemsFromDate(currentEvent.items, dateString);
            }
        }
    }
}

function drawEvent(event, day){
    const parentDiv = document.getElementById(day);
    if(parentDiv){
        const contentDiv = parentDiv.querySelector(".date_content");
        if(contentDiv){
            const eventDiv = document.createElement("div");

            event === undefined ? eventDiv.setAttribute("id", "") : eventDiv.setAttribute("id", event.uid);
            eventDiv.setAttribute("class", "events");
            const eventTitle = document.createElement("p");
            event === undefined ? eventTitle.textContent = "blank text content" : eventTitle.textContent = event.title;
            event === undefined ? eventDiv.style.visibility = 'hidden' : null;

            eventDiv.addEventListener('click', () => {
                window.location.href = `create-event.html?id=${event.uid}`
            })

            eventDiv.append(eventTitle);
        
            contentDiv.append(eventDiv);
        }
    }
}

function drawCollisions(collisionMap){
    const footer = document.querySelector("footer");
    for(const [itemName, dates] of collisionMap){

        for(const date of dates){
            const eventDivs = document.getElementById(date).querySelector(".date_num");
            eventDivs.style.backgroundColor = 'red';
            eventDivs.style.color = 'white';
        }

        let footerText = document.createElement("p");

        footerText.textContent += `Conflict on item "${itemName}" on dates: [${Array.from(dates).join(" ,  ")}]`
        footer.append(footerText);
    }
}