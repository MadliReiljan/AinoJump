import React, { useContext, useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { AuthContext } from "../auth/Authentication";
import EventDetailsModal from "../components/DetailsModal";
import EventModal from "../components/Modal";
import ReviewsCarousel from "../components/ReviewsCarousel";
import "../styles/Calendar.scss";
import etLocale from "@fullcalendar/core/locales/et"; 
import baseURL from "../baseURL";

export const Calendar = () => {
  const { fullName, userRole, token } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${baseURL}/events/get_events.php`, {
          headers: {
            'Authorization': token ? `Bearer ${token}` : ''
          }
        });
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data)) {
            setEvents(data);
          } else {
            console.error("Unexpected response format:", data);
            setEvents([]); 
          }
        } else {
          console.error("Failed to fetch events");
          setEvents([]); 
        }
      } catch (error) {
        console.error("Error fetching events:", error);
        setEvents([]); 
      }
    };

    fetchEvents();
  }, [token]);

  const refreshEvents = async () => {
    try {
      const storedToken = localStorage.getItem("token");
      const response = await fetch(`${baseURL}/events/get_events.php`, {
        headers: {
          'Authorization': storedToken ? `Bearer ${storedToken}` : ''
        }
      });
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          setEvents(data);
        } else {
          console.error("Unexpected response format:", data);
          setEvents([]); 
        }
      } else {
        console.error("Failed to fetch events");
        setEvents([]); 
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      setEvents([]); 
    }
  };

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
    refreshEvents(); 
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setSelectedDate(null);
  };

  const handleEventCreated = (newEvent) => {
    if (newEvent) {
      setEvents((prevEvents) => [...prevEvents, newEvent]);
    } else {
      refreshEvents();
    }
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
      text: "Parim treen, mida olen kunagi proovinud!",
      author: "Liisa"
    },
    {
      text: "Jumping pakub korraga nii head treeningut kui ka palju lõbu.",
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
          <p className="booking-instruction">
            <span className="highlight-text2">Selleks, et ennast trenni kirja panna</span>, vali kalendrist sobiv päev ja kellaaeg ning vajuta sellele.
          </p>
          <p className="info-instruction">
            Kui tuled jumpingu trenni, siis võta kaasa trennikaaslased, hea tuju, 
            trenniriided, sisetossud, joogivesi ja higirätik!
          </p>
          
          <h4 className="schedule-heading">Trennid toimuvad täiskasvanutel:</h4>
          <div className="schedule-table">
            <div className="schedule-row">
              <span className="day">Teisipäeval</span>
              <span className="time">19:00–20:00</span>
            </div>
            <div className="schedule-row">
              <span className="day">Neljapäeval</span>
              <span className="time">19:00–20:00</span>
            </div>
            <div className="schedule-row">
              <span className="day">Pühapäeval</span>
              <span className="time">17:30–18:30</span>
            </div>
          </div>
          
          <h4 className="schedule-heading">Trennid toimuvad lastel:</h4>
          <div className="schedule-table">
            <div className="schedule-row">
              <span className="day">Teisipäeval</span>
              <span className="time">18:00–19:00</span>
            </div>
          </div>
          
          <p className="stebby-link">
            Osta endale kuupilet <a href="https://app.stebby.eu/pos/a.k.riided.o." target="_blank" rel="noopener noreferrer">Stebby</a> kaudu!
          </p>
        </div>
        <div className="calendar-wrapper">
        <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        height={"600px"}
        selectable={true}
        firstDay={1}
        locale={etLocale}
        events={events.map((event) => {
          return {
            id: event.id,
            title: event.title,
            start: event.time,
            backgroundColor: event.color || "#4caf50",
            borderColor: event.color || "#4caf50",
            textColor: "#ffffff",
            allDay: false,
            extendedProps: {
              customColor: event.color || "#4caf50"
            }
          };
        })}
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
        eventDidMount={(info) => {
          const color = info.event.extendedProps.customColor || "#4caf50";
          info.el.style.backgroundColor = color;
          info.el.style.borderColor = color;
        }}
        eventContent={(arg) => {
          const customColor = arg.event.extendedProps.customColor || "#4caf50";
          return (
            <div style={{
              backgroundColor: customColor,
              borderColor: customColor,
              color: "#ffffff",
              padding: "2px 4px",
              borderRadius: "3px",
              width: "100%"
            }}>
              <b>{arg.timeText}</b> <span>{arg.event.title}</span>
            </div>
          );
        }}
      />
        </div>
      </div>
      {isDetailsModalOpen && selectedEvent && (
        <EventDetailsModal
          event={selectedEvent}
          onClose={handleCloseDetailsModal}
          onReservationChange={refreshEvents}
        />
      )}
      {isCreateModalOpen && (
        <EventModal
          selectedDate={selectedDate}
          onClose={handleCloseCreateModal}
          onEventCreated={handleEventCreated} 
        />
      )}
      <ReviewsCarousel reviews={reviewsData} />
    </div>
  );
};
