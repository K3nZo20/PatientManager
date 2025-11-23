import React, { useEffect, useState, useCallback } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { pl } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = { pl };
const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
    getDay,
    locales,
});

const MIN_HOUR = 12;
const MAX_HOUR = 20;

function DayCalendar({ onSelectPatient, onSelectEmployee }) {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [date, setDate] = useState(new Date());
    const [employees, setEmployees] = useState([]);
    const [selectedDoctors, setSelectedDoctors] = useState([]);
    const [showDoctorList, setShowDoctorList] = useState(false);

    const createDayTime = (hour) => {
        const d = new Date(date);
        d.setHours(hour, 0, 0, 0);
        return d;
    };

    const fetchEmployees = useCallback(async () => {
        try {
            const res = await fetch(`https://localhost:7193/api/employees?sortBy=${"lastName"}`);
            const data = await res.json();
            setEmployees(data.items);
        } catch (err) {
            console.error("Błąd pobierania lekarzy:", err);
        }
    }, []);

    const fetchVisits = useCallback(async () => {
        try {
            const queryDate = format(date, "yyyy-MM-dd");

            const params = new URLSearchParams();
            params.append("date", queryDate);
            selectedDoctors.forEach(id => params.append("employeeIds", id));

            const res = await fetch(`https://localhost:7193/api/visits?${params.toString()}`);
            const data = await res.json();

            const formatted = data.map((v) => ({
                id: v.id,
                title: `${v.patient?.lastName} ${v.patient?.firstName}`,
                start: new Date(v.startTime),
                end: new Date(v.endTime),
                allDay: false,
                resourceId: v.employeeId,
                employee: v.employee,
                resource: v,
            }));


            setEvents(formatted);
        } catch (err) {
            console.error("Błąd pobierania wizyt:", err);
        }
    }, [date, selectedDoctors]);

    useEffect(() => {
        fetchEmployees();
    }, [fetchEmployees]);

    useEffect(() => {
        fetchVisits();
    }, [fetchVisits]);

    const handleSelectEvent = (event) => {
        setSelectedEvent(event.resource);
    };

    const toggleDoctor = (id) => {
        setSelectedDoctors((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };


    useEffect(() => {
        const style = document.createElement("style");
        style.innerHTML = `
        .rbc-time-header.rbc-overflowing {
            height: 17px;
            min-height: 17px; !important;
            max-height: 17px; !important;
        }
    `;
        document.head.appendChild(style);

        return () => document.head.removeChild(style);
    }, []);

    useEffect(() => {
        const style = document.createElement("style");
        style.innerHTML = `
        .rbc-events-container {
            position: static !important;
        }
    `;
        document.head.appendChild(style);

        return () => document.head.removeChild(style);
    }, []);


    return (
        <div style={{ height: "100%", padding: "10px", width: "100%"}}>
            <h2>📅 Kalendarz dzienny</h2>

            <div style={{ marginBottom: "10px" }}>
                <button
                    style={{
                        padding: "6px 12px",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                        backgroundColor: "#f0f0f0",
                        cursor: "pointer",
                    }}
                    onClick={() => setShowDoctorList((prev) => !prev)}
                >
                    {showDoctorList ? "Lekarze" : "Lekarze"}
                </button>

                {showDoctorList && (
                    <div
                        style={{
                            marginTop: "8px",
                            padding: "10px",
                            border: "1px solid #ccc",
                            borderRadius: "6px",
                            maxHeight: "150px",
                            overflowY: "auto",
                            backgroundColor: "#fafafa",
                        }}
                    >
                        {employees.map((emp) => (
                            <label
                                key={emp.id}
                                style={{
                                    display: "block",
                                    cursor: "pointer",
                                    marginBottom: "4px",
                                }}
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedDoctors.includes(emp.id)}
                                    onChange={() => toggleDoctor(emp.id)}
                                    style={{ marginRight: "6px" }}
                                />
                                {emp.firstName} {emp.lastName}
                            </label>
                        ))}
                    </div>
                )}
            </div>

            <div style={{ position: "relative" }}>
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    defaultView="day"
                    date={date}
                    onNavigate={(newDate) => setDate(newDate)}
                    step={15}
                    timeslots={1}
                    min={createDayTime(MIN_HOUR)}
                    max={createDayTime(MAX_HOUR)}
                    formats={{
                        timeGutterFormat: "HH:mm",
                        eventTimeRangeFormat: ({ start, end }) =>
                            `${format(start, "HH:mm")} - ${format(end, "HH:mm")}`,
                    }}
                    style={{ height: "70vh", marginBottom: "20px", borderRadius: 8 }}

                    dayPropGetter={(dateValue) => {
                        const isToday =
                            dateValue.toDateString() === new Date().toDateString();
                        const isSelected =
                            dateValue.toDateString() === date.toDateString();
                        return {
                            style: {
                                backgroundColor: isSelected
                                    ? "#d0eaff"
                                    : isToday
                                        ? "#f0f8ff"
                                        : "#fafafa",
                                borderRadius: "6px",
                            },
                        };
                    }}

                    resources={
                        (selectedDoctors.length > 0 ? employees.filter(e => selectedDoctors.includes(e.id)) : employees)
                            .map(e => ({
                                resourceId: e.id,
                                resourceTitle: `${e.firstName} ${e.lastName}`
                            }))
                    }
                    resourceIdAccessor="resourceId"
                    resourceTitleAccessor="resourceTitle"

                    messages={{
                        day: "Dzień",
                        today: "Dziś",
                        previous: "←",
                        next: "→",
                    }}

                    selectable
                    onSelectEvent={handleSelectEvent}

                    eventPropGetter={(event) => {
                        const backgroundColor = event.resource.visitType?.color || "#1976d2";

                        
                        const getContrastColor = (hexColor) => {
                            
                            const r = parseInt(hexColor.substr(1, 2), 16);
                            const g = parseInt(hexColor.substr(3, 2), 16);
                            const b = parseInt(hexColor.substr(5, 2), 16);
                            
                            const luminance = (0.299 * r + 0.587 * g + 0.114 * b);
                            return luminance > 186 ? "#000000" : "#ffffff";
                        };

                        const color = getContrastColor(backgroundColor);

                        return {
                            style: {
                                backgroundColor,
                                color, 
                                padding: "2px 4px",
                                fontSize: "12px",
                                whiteSpace: "normal",
                                borderRadius: "8px",
                                overflow: "hidden",
                                border: "none",
                            },
                        };
                    }}

                    components={{
                        resourceHeader: ({ label }) => (
                            <div
                                style={{
                                    height: 'auto',
                                    lineHeight: '1.2',
                                    padding: '0 2px',
                                    margin: 0,
                                    textAlign: 'center',
                                    fontWeight: 600,
                                    backgroundColor: 'transparent',
                                }}
                            >
                                {label}
                            </div>
                        ),
                        event: ({ event }) => (
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    fontWeight: "600",
                                    lineHeight: "1.3",
                                    overflow: "hidden",
                                }}
                            >
                                <div style={{ fontSize: "15px" }}>
                                    {event.resource.patient.lastName} {event.resource.patient.firstName}
                                </div>
                                <div style={{ fontSize: "13px", opacity: 0.9 }}>
                                    {event.resource.visitType?.value}
                                </div>
                            </div>
                        ),
                        timeSlotWrapper: ({ children, value }) => {
                            const minutes = value.getMinutes();

                            return (
                                <div
                                    style={{
                                        borderTop: minutes === 0 ? "2px solid #000" : "1px solid #ccc",
                                        margin: 0,
                                        padding: 0,
                                        height: "100%",
                                        boxSizing: "border-box",
                                    }}
                                >
                                    {children}
                                </div>
                            );
                        },
                        toolbar: ({ label, onNavigate }) => {
                            const formattedLabel = format(date, "EEEE, d MMMM yyyy", { locale: pl });

                            return (
                                <div style={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "8px", height: "40px" }}>
                                    <div style={{ display: "flex", gap: "4px", position: "absolute", left: 0 }}>
                                        <button onClick={() => onNavigate("PREV")}>←</button>
                                        <button onClick={() => onNavigate("TODAY")}>Dziś</button>
                                        <button onClick={() => onNavigate("NEXT")}>→</button>
                                    </div>
                                    <span style={{ fontWeight: "600", textAlign: "center" }}>{formattedLabel}</span>
                                </div>
                            );
                        }
                    }}
                />
            </div>

            {selectedEvent && (
                <div style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "8px" }}>
                    <h3>Szczegóły wizyty</h3>
                    <p>
                        <strong>Pacjent:</strong>
                        <span
                            onClick={() => onSelectPatient(selectedEvent.patient.id)}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.color = "#0056b3";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.color = "black";
                            }}
                            style={{
                                cursor: "pointer",
                            }}
                        >
                        {selectedEvent.patient.firstName} {selectedEvent.patient.lastName}
                    </span></p>
                    <p><strong>Typ wizyty:</strong> {selectedEvent.visitType?.value}</p>
                    <p>
                        <strong>Lekarz:</strong>
                        <span
                            onClick={() => onSelectEmployee(selectedEvent.employee.id)}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.color = "#0056b3";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.color = "black";
                            }}
                            style={{
                                cursor: "pointer",
                            }}
                        >
                            {selectedEvent.employee?.firstName} {selectedEvent.employee?.lastName}
                        </span></p>
                    <p><strong>Godzina:</strong> {format(new Date(selectedEvent.startTime), "HH:mm")} - {format(new Date(selectedEvent.endTime), "HH:mm")}</p>
                    <p><strong>Komentarz:</strong> {selectedEvent.comment || "—"}</p>
                    <div style={{ marginTop: "auto", textAlign: "right" }}>
                        <button
                            style={{
                                padding: "6px 12px",
                                backgroundColor: "#e53935",
                                color: "white",
                                borderRadius: "6px",
                                cursor: "pointer",
                            }}
                            onClick={async () => {
                                const confirmed = window.confirm("Czy na pewno chcesz usunąć tę wizytę?");
                                if (!confirmed) return;

                                try {
                                    const res = await fetch(`https://localhost:7193/api/visits/${selectedEvent.id}`, {
                                        method: "DELETE",
                                    });
                                    if (!res.ok) throw new Error("Nie udało się usunąć wizyty");

                                    setSelectedEvent(null);
                                    await fetchVisits();
                                } catch (err) {
                                    alert("Błąd podczas usuwania wizyty: " + err.message);
                                }
                            }}
                        >
                        Usuń wizytę
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DayCalendar;
