import React, { useContext, useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { AuthContext } from "../auth/Authentication";
import EventDetailsModal from "../components/DetailsModal";
import EventModal from "../components/Modal";
import ReviewsCarousel from "../components/ReviewsCarousel";
import "../styles/GlobalContainer.scss";
import "../styles/Calendar.scss";
import etLocale from "@fullcalendar/core/locales/et"; 

export const Calendar = () => {
  const { fullName, userRole } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:8000/events/get_events.php");
        if (response.ok) {
          const data = await response.json();
          setEvents(data);
        } else {
          console.error("Failed to fetch events");
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  const handleEventClick = (info) => {
    const clickedEvent = events.find((event) => event.id === parseInt(info.event.id));
    if (clickedEvent) {
      setSelectedEvent(clickedEvent);
      setIsDetailsModalOpen(true);
    }
  };

  const handleDateClick = (info) => {
    if (userRole === "owner") {
      setSelectedDate(info.dateStr);
      setIsCreateModalOpen(true);
    }
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedEvent(null);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setSelectedDate(null);
  };

  const reviewsData = [
    {
      text: "Tund möödub märkamatult ja pärast on nii kerge ja hea tunne kehas.",
      author: "Maarika"
    },
    {
      text: "Ma pole kunagi arvanud, et trenn võib olla nii lõbus. Soovitan soojalt!",
      author: "Anu"
    },
    {
      text: "Jumping on aidanud mul taasavastada liikumisrõõmu, isegi pärast pikka tööpäeva.",
      author: "Annika"
    },
    {
      text: "Parim treening, mida olen kunagi proovinud!",
      author: "Liisa"
    },
    {
      text: "Jumpingus on parim kombinatsioon treenivast koormusest ja lõbust.",
      author: "Kadri"
    }
  ];

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
            locale={etLocale}
            events={events.map((event) => ({
              id: event.id,
              title: event.title,
              start: event.time,
              allDay: false, 
            }))}
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
            eventClick={handleEventClick}
            dateClick={handleDateClick}
            eventContent={(arg) => (
              <div>
                <b>{arg.timeText}</b> <span>{arg.event.title}</span>
              </div>
            )}
          />
        </div>
      </div>
      {isDetailsModalOpen && selectedEvent && (
        <EventDetailsModal
          event={selectedEvent}
          onClose={handleCloseDetailsModal}
        />
      )}
      {isCreateModalOpen && (
        <EventModal
          selectedDate={selectedDate}
          onClose={handleCloseCreateModal}
        />
      )}
      <ReviewsCarousel reviews={reviewsData} />
    </div>
  );
};
