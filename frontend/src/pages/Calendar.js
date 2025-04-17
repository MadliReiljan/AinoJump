import React, { useContext } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { AuthContext } from "../auth/Authentication";
import "../styles/GlobalContainer.scss";
import "../styles/Calendar.scss";

export const Calendar = () => {
  const { fullName } = useContext(AuthContext);

  return (
    <div className="calendar-page">
      <div className="calendar-header">
        <h2>Pane ennast trenni kirja!</h2>
      </div>
      <div className="calendar-content">
        <div className="info-box">
          <h3>Tere{fullName ? `, ${fullName}` : ""}!</h3>
          <h4>Trennid toimuvad:</h4>
          <ul>
            <li>Teisipäeval: 19:00-20:00</li>
            <li>Kolmapäeval: 19:00-20:00</li>
            <li>Pühapäeval: 17:30-18:30</li>
          </ul>
          <p>
            Kui tuled jumpingu trenni, siis võta kaasa trenniriided, hea tuju,
            joogivesi ja higirätik!
          </p>
          <p>Osta endale kuupilet Stebby kaudu!</p>
        </div>
        <div className="calendar-wrapper">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            height={"600px"}
            selectable={true}
            firstDay={1}
            events={[
              { title: "Reservation 1", date: "2025-03-15" },
              { title: "Reservation 2", date: "2025-03-18" },
            ]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            buttonText={{
              today: "Täna",
              month: "Kuu",
              week: "Nädal",
              day: "Päev",
            }}
          />
        </div>
      </div>
    </div>
  );
};