import React from 'react'
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import "./Calendar.scss";


export const Calendar = () => {

  return (
    <div className='bg'>
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      height={"750px"}
      selectable={true}
      events={[
        { title: "Reservation 1", date: "2025-03-15" },
        { title: "Reservation 2", date: "2025-03-18" }, //Database connection eventually
      ]}
    />
    </div>
  );
}
