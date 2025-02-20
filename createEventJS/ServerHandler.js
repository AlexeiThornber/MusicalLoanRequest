import { mapSelectedItems } from "./HTMLHandler.js";
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getFirestore, collection, doc, setDoc, Timestamp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";
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


document.getElementById("create-event").addEventListener('click', async () =>{
    event.preventDefault();

    const title = document.getElementById("eventTitle").value;    
    const beneficiary = document.getElementById("beneficiary").value;        
    const startDate = document.getElementById("eventDateStart").value;
    const startTime = document.getElementById("eventTimeStart").value;    
    const endDate = document.getElementById("eventDateEnd").value;
    const endTime = document.getElementById("eventTimeEnd").value;
    const description = document.getElementById("eventDescription").value;
    const uid = window.crypto.randomUUID();

    //Going to have to learn what javascript objects are
    // console.log(Array.from(mapSelectedItems.entries()).map(([key, value]) => ({key, value})));

    if(isStringNull(title) || isStringNull(beneficiary) || 
    isStringNull(startDate) || isStringNull(startTime) || 
    isStringNull(endDate) || isStringNull(endTime) || mapSelectedItems.size === 0){
        alert("You haven't filled out all the necessary fields");
    }else{

        let start = new Date(startDate + "T" + startTime + ":00");
        let end = new Date(endDate + "T" + endTime + ":00"); 

        try {
            const docRef = doc(collection(db, "events"), uid);
            await setDoc(docRef, {
              uid: uid,
              title: title,
              beneficiary: beneficiary,
              start: Timestamp.fromDate(start),
              end: Timestamp.fromDate(end),
              description: description,
              items: Array.from(mapSelectedItems.entries()).map(([key, value]) => ({ key, value })),
            });
            console.log("Document written with ID: ", docRef.id);
            alert("Document added successfully");
            window.location.href = "index.html";
          } catch (e) {
            alert("Error  adding the document:" + e.toString());
            console.error("Error adding document: ", e);
          }
    }

})


//Helper funtion
function isStringNull(str){
    return str === null || str === undefined || str.trim() === '';
}