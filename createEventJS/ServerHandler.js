import { mapSelectedItems } from "./HTMLHandler.js";
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getFirestore, collection, addDoc, Timestamp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
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


document.getElementById("create-event").addEventListener('click', async () =>{
    event.preventDefault();

    let title = document.getElementById("eventTitle").value;
    // console.log("this is the title:" + title );
    
    let beneficiary = document.getElementById("beneficiary").value;    
    // console.log("this is the beneficiary:" + beneficiary );
    
    let startDate = document.getElementById("eventDateStart").value;
    // console.log("this is the start date:" + startDate );

    let startTime = document.getElementById("eventTimeStart").value;
    // console.log("This is the start time:" + startTime);
    
    let endDate = document.getElementById("eventDateEnd").value;
    // console.log("This is the end date:" + endDate);

    let endTime = document.getElementById("eventTimeEnd").value;
    // console.log("This is the end time:" + endTime);

    let description = document.getElementById("eventDescription").value;
    // console.log("This is the descritption: " + description);

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
            const docRef = await addDoc(collection(db, "events"), {
              title: title,
              beneficiary: beneficiary,
              start: Timestamp.fromDate(start),
              end: Timestamp.fromDate(end),
              description: description,
              items: Array.from(mapSelectedItems.entries()).map(([key, value]) => ({ key, value })),
            });
            console.log("Document written with ID: ", docRef.id);
          } catch (e) {
            console.error("Error adding document: ", e);
          }
          window.location.href = "index.html";
    }

})


//Helper funtion
function isStringNull(str){
    return str === null || str === undefined || str.trim() === '';
}