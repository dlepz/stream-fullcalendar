import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';

import type { Event } from './types';

window.Webflow ||= [];
window.Webflow.push(() => {
  const calendarElement = document.querySelector<HTMLDivElement>('[data-element="calendar"]');
  if (!calendarElement) return;

  const events = getEvents();
  console.log({ events });

  const calendar = new Calendar(calendarElement, {
    plugins: [dayGridPlugin, timeGridPlugin, listPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,listPlugin',
    },

    events,
    eventContent: function (info) {
      const { event } = info;
      const eventElement = document.createElement('div');
      eventElement.classList.add('fc-content');

      if (event.extendedProps.imageurl) {
        const img = document.createElement('img');
        img.setAttribute('src', event.extendedProps.imageurl);
        img.setAttribute('width', '80');
        img.setAttribute('height', '80');
        eventElement.appendChild(img);
      }

      const timeElement = document.createElement('div');
      timeElement.classList.add('fc-time');
      timeElement.textContent = event.extendedProps.time;
      eventElement.appendChild(timeElement);

      const titleElement = document.createElement('div');
      titleElement.classList.add('fc-title');
      titleElement.textContent = event.title;
      eventElement.appendChild(titleElement);

      return { domNodes: [eventElement] };
    },
    eventClick(data) {
      alert(`User clicked the event ${data.event.title}`);
    },
  });

  calendar.render();
});

const getEvents = (): Event[] => {
  const scripts = document.querySelectorAll<HTMLScriptElement>('[data-element="event-data"]');
  const events = [...scripts].map((script) => {
    const event: Event = JSON.parse(script.textContent!);
    event.start = new Date(event.start);
    event.end = new Date(event.end);

    return event;
  });

  return events;
};
