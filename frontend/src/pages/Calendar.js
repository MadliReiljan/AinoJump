import React from 'react'
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import "../styles/GlobalContainer.scss"

import "../styles/Calendar.scss";


export const Calendar = () => {

  return (
    <div className='container'>
      <div className='bg'>
        <div className="calendar-wrapper">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            height={"600px"}
            selectable={true}
            firstDay={1}
            events={[
              { title: "Reservation 1", date: "2025-03-15" },
              { title: "Reservation 2", date: "2025-03-18" }, //Database connection eventually
            ]}
          />
        </div>
      </div>
    </div>
  );
}
