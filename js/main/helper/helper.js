export class IndexHelper{
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

    // //Helper function to convert Dates and no take into account the hours
    // static convertDateNoHours(date){
    //     const newDate = new Date(date.getTime());
    //     return new Date(newDate.setHours(0,0,0,0));
    // }

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