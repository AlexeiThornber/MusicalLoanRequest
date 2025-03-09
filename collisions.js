
import util from 'util';
/*

Timeline:
1 1 3 3
4 2 2
  5 5 5
*/

function log(obj) {
  console.log(util.inspect(obj, {showHidden: false, depth: null, colors: true}));
}

function printTimeline(timeline) {
  console.log('Timeline:');
  for (let row = 0; row < timeline[0].length; row++) {
    let line = '';
    for (let col = 0; col < timeline.length; col++) {
      line += timeline[col][row] + ' ';
    }
    console.log(line);
  }
}

printTimeline([
  [1,4,0],
  [1,2,5],
  [3,2,5],
  [3,0,5]
])

const events = [
  {
    id: "1",
    start: 1,
    end: 2
  }, {
    id: "2",
    start: 2,
    end: 3
  }, {
    id: "3",
    start: 3,
    end: 4
  }, {
    id: "4",
    start: 1,
    end: 1
  },
  {
    id: "5",
    start: 3,
    end: 5
  }
]

const shuffle = (array) => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

// Compute positions of events in a timeline
// So that they don't overlap
// And they are as compact as possible
const computeTimeline = (events) => {
  const sortedEvents = events.sort((a, b) => {
    const aSize = a.end - a.start;
    const bSize = b.end - b.start;
    if (aSize === bSize) {
      return a.start - b.start;
    } else {
      return bSize - aSize;
    }
  });

  const eventsWithRanges = sortedEvents.map(event => {
    return {
      ...event,
      range: [...Array(event.end - event.start + 1).keys()].map(i => i + event.start)
    }
  });

  // Max collision count
  const timelineStart = Math.min(...eventsWithRanges.map(event => event.start));
  const timelineEnd = Math.max(...eventsWithRanges.map(event => event.end));
  const timelineLength = timelineEnd - timelineStart + 1;
  const timeline = [...Array(timelineLength).keys()].map(i => {
    const day = i + timelineStart;
    const collisions = eventsWithRanges.filter(event => event.range.includes(day)).length;
    return {
      day,
      collisions
    }
  });
  const timelineHeight = Math.max(...timeline.map(day => day.collisions));

  const eventTimeline = new Array(timelineLength).fill(0).map(() => new Array(timelineHeight).fill().map(() => 0));

  printTimeline(eventTimeline);
  
  for (const event of eventsWithRanges) {
    const eventStart = event.start - timelineStart;
    const eventEnd = event.end - timelineStart;

    // Compute available timeline index
    let availableTimelinePosition = 0;
    for (let i = eventStart; i <= eventEnd; i++) {
      const index = eventTimeline[i].findIndex(eventId => eventId === 0);
      console.log('temporary index', event.id, index);
      if (index > -1) {
        availableTimelinePosition = Math.max(availableTimelinePosition, index);
      }
    }

    console.log('final index', event.id, availableTimelinePosition);

    for (let i = eventStart; i <= eventEnd; i++) {
      eventTimeline[i][availableTimelinePosition] = event.id;
    }

    printTimeline(eventTimeline);
  }

  printTimeline(eventTimeline);
}

computeTimeline(shuffle(events))