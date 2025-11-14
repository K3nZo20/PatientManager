import React, { useEffect, useState, useCallback } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { pl } from "date-fns/locale";
import AddVisitForm from "./AddVisitForm";
import "react-big-calendar/lib/css/react-big-calendar.css";

// lokalizator dat (polski)
const locales = { pl };
const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
    getDay,
    locales,
});

function WeekCalendar() {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);

    // 🔹 Pobieranie wizyt z backendu
    const fetchVisits = useCallback(async () => {
        try {
            const res = await fetch("https://localhost:7193/api/visits");
            const data = await res.json();

            // mapowanie na format react-big-calendar
            const formatted = data.map((v) => ({
                id: v.id,
                title: `${v.patient?.lastName} ${v.patient?.firstName} (${v.visitType?.value || "wizyta"})`,
                start: new Date(v.startTime),
                end: new Date(v.endTime),
                allDay: false,
                resource: v,
            }));

            setEvents(formatted);
        } catch (err) {
            console.error("Błąd pobierania wizyt:", err);
        }
    }, []);

    useEffect(() => {
        fetchVisits();
    }, [fetchVisits]);

    // 🔹 Obsługa kliknięcia w wizytę
    const handleSelectEvent = (event) => {
        setSelectedEvent(event.resource);
    };

    // 🔹 Obsługa kliknięcia w pusty slot kalendarza (dodanie wizyty)
    const handleSelectSlot = async ({ start, end }) => {
            <AddVisitForm date={start}/>
    };

    return (
        <div style={{ height: "90vh", padding: "20px" }}>
            <h2>📅 Kalendarz tygodniowy wizyt</h2>

            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 700, margin: "20px" }}
                defaultView="week"
                views={["day", "week", "month"]}
                messages={{
                    week: "Tydzień",
                    day: "Dzień",
                    month: "Miesiąc",
                    today: "Dziś",
                    previous: "←",
                    next: "→",
                }}
                selectable
                onSelectEvent={handleSelectEvent}
                onSelectSlot={handleSelectSlot}
            />

            {selectedEvent && (
                <div style={{ marginTop: "20px", padding: "15px", border: "1px solid #ccc", borderRadius: "8px" }}>
                    <h3>Szczegóły wizyty</h3>
                    <p>
                        <strong>Pacjent:</strong> {selectedEvent.patient.firstName} {selectedEvent.patient.lastName}
                    </p>
                    <p>
                        <strong>Typ wizyty:</strong> {selectedEvent.visitType?.value}
                    </p>
                    <p>
                        <strong>Lekarz:</strong> {selectedEvent.employee?.firstName} {selectedEvent.employee?.lastName}
                    </p>
                    <p>
                        <strong>Godzina:</strong>{" "}
                        {format(new Date(selectedEvent.startTime), "HH:mm")} -{" "}
                        {format(new Date(selectedEvent.endTime), "HH:mm")}
                    </p>
                    <p>
                        <strong>Komentarz:</strong> {selectedEvent.comment || "—"}
                    </p>
                </div>
            )}
        </div>
    );
}

export default WeekCalendar;
