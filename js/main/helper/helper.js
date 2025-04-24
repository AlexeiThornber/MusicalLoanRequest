import { clonedUidMap, clonedUidTag } from "../index/event-handler.js";

export class EventHelper{
    //TODO check if the push function is optimal
    static makeRange(a, b){
        const arr = new Array();
        for(let i = a; i <= b; i++){
            arr.push(i);
        }
        return arr;
    }

    static convertDateToDay(date){
        return Math.floor( date.getTime() / (1000 * 60 * 60 * 24));  
    }

    //Helper funtions to convert dates to mm_dd_yyyy format
    static convertDateToString(date){
        return `${date.getDate()}_${date.getMonth() + 1}_${date.getFullYear()}`;
    }

    /**
     * Helper function to find the first day of the month
     * @param {integer} day The day in js format (0-sunday, 6-saturday) 
     * @param {integer} month The month in js format (0-jan, 11-dec)
     * @param {integer} year The year
     */
    static getFirstDayOfMonth(day, month, year){
        let date = new Date(year, month); // first day of the month in GMT

        while(date.getDay() != day){
            date.setDate(date.getDate() + 1);
        }
        
        //Return date adjusts for timezone difference
        return new Date(date.getTime() - date.getTimezoneOffset() * 60000);

    }


    static generateRepeatedEvents(event, currentDate, displayedDates){
        const repeatedEvents = [];

        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        let startDate = EventHelper.getFirstDayOfMonth(event.startDate.getDay(), currentMonth, currentYear);
        let endDate = EventHelper.getFirstDayOfMonth(event.endDate.getDay(), currentMonth, currentYear);

        startDate.setHours(event.startDate.getHours(), event.startDate.getMinutes());
        endDate.setHours(event.endDate.getHours(), event.endDate.getMinutes());

        startDate.setDate(new Date(startDate.getDate() - 7));
        endDate.setDate(new Date(endDate.getDate() - 7));

        do{
            const clonedKey = clonedUidTag + "-" + window.crypto.randomUUID();

            const copiedEvent = { ...event, startDate: new Date(startDate), endDate: new Date(endDate), uid: clonedKey};

            clonedUidMap.set(clonedKey, event.uid);

            repeatedEvents.push(copiedEvent);

            startDate.setDate(startDate.getDate() + 7);
            endDate.setDate(endDate.getDate() + 7);
        }while(displayedDates.has(EventHelper.convertDateToString(startDate)))
        

        return repeatedEvents;
    }

    /**
     * Helper function to check whether the startDate of an event is contained in another event
     * @param {*} eventComparedTo The "parent" event that sets the benchmark
     * @param {*} eventToCheck The event to check
     * If the startDate of the eventToCheck is in the  
     */
    static isEventContainedInAnother(eventComparedTo, eventToCheck){
        return (this.convertDateToDay(eventComparedTo.startDate) <= this.convertDateToDay(eventToCheck.startDate))
        && (this.convertDateToDay(eventComparedTo.endDate) >= this.convertDateToDay(eventToCheck.startDate));
    }
}

export class StringHelper{
    static isStringNull(str){
        return str === null || str === undefined || str.trim() === '';
    }
}