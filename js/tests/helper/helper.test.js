import { EventHelper } from "../../main/helper/helper";

test(('convert date to string'), () => {
    const expected = "30_7_2003";
    const date = new Date("July 30, 2003 08:30:00");
    expect(EventHelper.convertDateToString(date)).toBe(expected);
})