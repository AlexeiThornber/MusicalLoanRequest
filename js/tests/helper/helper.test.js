import { EventHelper, StringHelper } from "../../main/helper/helper";

test(('convert date to string works'), () => {
    const expected = "30_7_2010";
    const date = new Date("July 30, 2010 08:30:00");
    expect(EventHelper.convertDateToString(date)).toBe(expected);
})

test(('convert date to day works'), () =>{
    const expected = 15242;
    const date = new Date("September 25, 2011 10:00:00"); //day since 1970 = 15242
    expect(EventHelper.convertDateToDay(date)).toBe(expected);
})

test(('is event in another works'), () =>{
    const event1 = {
        startDate: new Date("March 13, 2025 10:00:00"),
        endDate: new Date("March 15, 2025 10:00:00")
    };

    const event2 = {
        startDate: new Date("March 14, 2025 10:00:00"),
        endDate: new Date("March 16, 2025 10:00:00")
    };

    const event3 = {
        startDate: new Date("March 19, 2025 00:00:00"),
        endDate: new Date("March 20, 2025 10:00:00")
    }

    expect(EventHelper.isEventContainedInAnother(event1, event2)).toBe(true);
    expect(EventHelper.isEventContainedInAnother(event1,event3)).toBe(false);
})

test(('string is not null works'), () => {
    const correctString = "hello";
    const nullString = null;
    const undefinedString = undefined;
    const empytString = "";

    expect(StringHelper.isStringNull(correctString)).toBe(false);
    expect(StringHelper.isStringNull(nullString)).toBe(true);
    expect(StringHelper.isStringNull(undefinedString)).toBe(true);
    expect(StringHelper.isStringNull(empytString)).toBe(true);
})