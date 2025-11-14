import React, { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { pl } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import VisitForm from "./VisitForm";

const locales = { pl };
const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
    getDay,
    locales,
});

function SchedulePage() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [visits, setVisits] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState("");
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);

    // 🧩 Pobranie listy lekarzy
    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const res = await fetch("https://localhost:7193/api/employees");
                const data = await res.json();
                setEmployees(data.items);
            } catch (err) {
                console.error("Błąd pobierania listy lekarzy:", err);
            }
        };
        fetchEmployees();
    }, []);

    // 🩺 Pobranie wizyt dla daty i wybranego lekarza
    const fetchVisits = async (date, employeeId) => {
        setLoading(true);
        const formattedDate = date.toISOString().split("T")[0];
        try {
            let url = `https://localhost:7193/api/visits?date=${formattedDate}`;
            if (employeeId) {
                url = `https://localhost:7193/api/visits/byEmployee?employeeId=${employeeId}&date=${formattedDate}`; // 👈 filtr po lekarzu
            }
            const res = await fetch(url);
            const data = await res.json();
            setVisits(
                data.sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
            );
        } catch (err) {
            console.error("Błąd pobierania wizyt:", err);
        } finally {
            setLoading(false);
        }
    };

    // 🔁 odświeżanie przy zmianie daty lub lekarza
    useEffect(() => {
        fetchVisits(selectedDate, selectedEmployee);
    }, [selectedDate, selectedEmployee]);

    const calendarEvents = visits.map((v) => ({
        id: v.id,
        title: `${v.patient?.firstName || ""} ${v.patient?.lastName || ""} - ${v.visitType?.value || ""}`,
        start: new Date(v.startTime),
        end: new Date(v.endTime),
    }));

    return (
        <div style={{ padding: "20px" }}>
            <h1>🩺 Harmonogram wizyt</h1>

            {/* 🔝 Górny pasek: select lekarza i przycisk dodawania */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "20px",
                }}
            >
                {/* Pole wyboru lekarza */}
                <div style={{ flex: "0 0 60%", textAlign: "center" }}>
                    <form>
                        <label htmlFor="employeeSelect" style={{ marginRight: "10px" }}>
                            Lekarz:
                        </label>
                        <select
                            id="employeeSelect"
                            value={selectedEmployee}
                            onChange={(e) => setSelectedEmployee(e.target.value)}
                            style={{
                                padding: "6px 10px",
                                borderRadius: "6px",
                                border: "1px solid #ccc",
                                minWidth: "250px",
                            }}
                        >
                            <option value="">Wszyscy lekarze</option>
                            {employees.map((e) => (
                                <option key={e.id} value={e.id}>
                                    {e.firstName} {e.lastName}
                                </option>
                            ))}
                        </select>
                    </form>
                </div>

                {/* Przycisk po prawej */}
                <button
                    style={{
                        backgroundColor: "#1976d2",
                        color: "white",
                        border: "none",
                        padding: "10px 20px",
                        borderRadius: "6px",
                    }}
                    onClick={() => setShowForm(!showForm)}
                >
                    ➕ Dodaj wizytę
                </button>
            </div>

            {/* 🧭 Główna zawartość */}
            <div style={{ display: "flex", gap: "20px" }}>
                {/* Lewo - kalendarz */}
                <div style={{ flex: "0 0 30%" }}>
                    <Calendar
                        localizer={localizer}
                        events={[]}
                        date={selectedDate}
                        onNavigate={(date) => setSelectedDate(date)}
                        views={["month"]}
                        style={{ height: "400px", width: "100%" }}
                    />
                </div>

                {/* Środek - lista wizyt */}
                <div style={{ overflowX: "auto", flex: "1 1 50%" }}>
                    <h3>
                        Wizyty w dniu {selectedDate.toLocaleDateString("pl-PL")}
                        {selectedEmployee &&
                            ` (lekarz: ${employees.find((e) => e.id === Number(selectedEmployee))?.firstName || ""
                            } ${employees.find((e) => e.id === Number(selectedEmployee))?.lastName || ""
                            })`}
                    </h3>

                    {loading ? (
                        <p>Ładowanie...</p>
                    ) : visits.length === 0 ? (
                        <p>Brak wizyt w tym dniu.</p>
                    ) : (
                        <div>
                            <table
                                border="1"
                                cellPadding="8"
                                style={{
                                    width: "100%",
                                    borderCollapse: "collapse",
                                    tableLayout: "fixed",
                                }}
                            >
                                <thead style={{ backgroundColor: "#f5f5f5" }}>
                                    <tr>
                                        <th style={{ width: "9%" }}>Godzina</th>
                                        <th style={{ width: "12%" }}>Pacjent</th>
                                        <th style={{ width: "8%" }}>Typ</th>
                                        <th style={{ width: "12%" }}>Lekarz</th>
                                        <th style={{ width: "60%" }}>Komentarz</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {visits.map((v) => (
                                        <tr
                                            key={v.id}
                                            style={{
                                                maxHeight: "30px",
                                                verticalAlign: "middle",
                                            }}
                                        >
                                            <td>
                                                {new Date(v.startTime).toLocaleTimeString("pl-PL", {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}{" "}
                                                -{" "}
                                                {new Date(v.endTime).toLocaleTimeString("pl-PL", {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </td>
                                            <td>
                                                {v.patient?.firstName} {v.patient?.lastName}
                                            </td>
                                            <td>{v.visitType?.value}</td>
                                            <td>
                                                {v.employee?.firstName} {v.employee?.lastName}
                                            </td>
                                            <td
                                                style={{
                                                    maxHeight: "60px",
                                                    overflowY: "auto",
                                                    overflowX: "auto",
                                                    whiteSpace: "pre",
                                                }}
                                            >
                                                {v.comment}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Prawo - formularz */}
                {showForm && (
                    <div style={{ flex: "0 0 25%", transition: "all 0.3s ease" }}>
                        <VisitForm
                            date={selectedDate}
                            onVisitAdded={() => {
                                fetchVisits(selectedDate, selectedEmployee);
                                setShowForm(false);
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

export default SchedulePage;
