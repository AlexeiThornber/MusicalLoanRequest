import { mapSelectedItems, saveSelection } from "./HTMLHandler.js";
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getFirestore, collection, doc, setDoc, getDoc, Timestamp, deleteDoc } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";
import { getItem } from '../itemList.js';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyDqdd0AYy50IRT-MFPCzmwR0ZHHJYrl9Z8",
  authDomain: "musicalloanrequests.firebaseapp.com",
  projectId: "musicalloanrequests",
  storageBucket: "musicalloanrequests.firebasestorage.app",
  messagingSenderId: "713902726859",
  appId: "1:713902726859:web:25cde11bb242148cfa054e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

let eventUID = "";

const itemCategories = ["Sound & Instruments", "Microphones", "Cables"];

document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = Array.from(new URLSearchParams(window.location.search).entries());

  if(urlParams.length != 0){
    modifyToEditEvent();
    eventUID = urlParams[0][1];
    const eventData = loadEventToEdit(eventUID);
    eventData.then(event => showLoadedEvent(event));

  }
  addEditButton();
})

function addEditButton(){
  document.getElementById("create-event").addEventListener('click', async () =>{

    const title = document.getElementById("eventTitle").value;    
    const beneficiary = document.getElementById("beneficiary").value;    
    const startDate = document.getElementById("eventDateStart").value;
    const startTime = document.getElementById("eventTimeStart").value;    
    const endDate = document.getElementById("eventDateEnd").value;
    const endTime = document.getElementById("eventTimeEnd").value;
    const description = document.getElementById("eventDescription").value;
    if(eventUID === ""){
      eventUID = window.crypto.randomUUID();
    }

    let start = new Date(startDate + "T" + startTime + ":00");
    let end = new Date(endDate + "T" + endTime + ":00"); 

  
    if(isStringNull(title) || isStringNull(beneficiary) || 
    isStringNull(startDate) || isStringNull(startTime) || 
    isStringNull(endDate) || isStringNull(endTime) || mapSelectedItems.size === 0){
      alert("You haven't filled out all the necessary fields");
    }else if(start.getTime() > end.getTime()){
      alert("The event can't end before it starts :)")
    }else{
        try {
            const docRef = doc(collection(db, "events"), eventUID);
            await setDoc(docRef, {
              uid: eventUID,
              title: title,
              beneficiary: beneficiary,
              start: Timestamp.fromDate(start),
              end: Timestamp.fromDate(end),
              description: description,
              items: Array.from(mapSelectedItems.entries()).map(([key, value]) => ({ key, value })),
            });
            console.log("Document written with ID: ", docRef.id);
            alert("Document added/updated successfully");
            window.location.href = "index.html";
          } catch (e) {
            alert("Error  adding the document:" + e.toString());
            console.error("Error adding document: ", e);
          }
    }

})
}

//Helper funtion
function isStringNull(str){
    return str === null || str === undefined || str.trim() === '';
}

//TODO put this into another file as this manages the html

async function loadEventToEdit(eventId){
  console.log(eventId);
  const docRef = doc(db, "events", eventId);
  const docSnap = await getDoc(docRef);

  if(docSnap.exists()){
    return docSnap.data();
  }else{
    console.log("No such document");
  }
}

function showLoadedEvent(event){
  console.log(event);
  document.getElementById("eventTitle").value = event.title;
  document.getElementById("beneficiary").value = event.beneficiary;
  document.getElementById("eventDescription").value = event.description;

  // Sanitize the list of items received as JSON into a map
  mapSelectedItems.clear();

  event.items.forEach(item => {
    mapSelectedItems.set(item.key, item.value);

    let convertedSelectedItem = getItem(item.key);

    let list = document.getElementById("item-list");

    const innerHTML = `<li id = "${item.key}">
            <div class = "remove" onclick = "removeItem('${item.key}')">&times;</div>
            <div class = "item-content">${convertedSelectedItem.name}</div>
            <div class = "quantity">x${item.value}</div>
        </li>`

    list.innerHTML += innerHTML; 

  });

  //Convert the timestamps to dates
  const startDate = event.start.toDate();
  const endDate = event.end.toDate();

  document.getElementById("eventDateStart").value = startDate.toLocaleDateString('en-CA');
  document.getElementById("eventTimeStart").value = startDate.toTimeString().split(' ')[0].substring(0, 5);
  document.getElementById("eventDateEnd").value = endDate.toLocaleDateString('en-CA');
  document.getElementById("eventTimeEnd").value = endDate.toTimeString().split(' ')[0].substring(0, 5);

}

function modifyToEditEvent(){
  const pageTitle = document.querySelector("h2");
  pageTitle.textContent = "Edit event"; 
  const saveButton = document.getElementById("create-event");
  saveButton.textContent = "Save Changes";

  //Add a delete button
  addDeleteButton();

}

function addDeleteButton(){
  const bottomButtons = document.querySelector(".bottom-buttons");
  const newButtonDiv = `<div class = "delete-button"><button id = "del-button">Delete Event</button></div>`
  bottomButtons. innerHTML += newButtonDiv;

  document.getElementById("del-button").addEventListener('click', async (e) => {
    await deleteDoc(doc(db, "events", eventUID));
    alert("Succefully deleted document with id: " + eventUID )
    window.location.href = "index.html";
  })
}