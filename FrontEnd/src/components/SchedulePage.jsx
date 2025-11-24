import React, { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { pl } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import VisitForm from "./Forms/VisitForm";

const locales = { pl };
const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
    getDay,
    locales,
});

function SchedulePage({ onSelectPatient, onSelectEmployee }) {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [visits, setVisits] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState("");
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [visitToEdit, setVisitToEdit] = useState(null);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const res = await fetch(`https://localhost:7193/api/employees?sortBy=${"lastName"}`);
                const data = await res.json();
                setEmployees(data.items);
            } catch (err) {
                console.error("Błąd pobierania listy lekarzy:", err);
            }
        };
        fetchEmployees();
    }, []);

    const fetchVisits = async (date, employeeId) => {
        setLoading(true);
        const formattedDate = format(date, "yyyy-MM-dd");
        try {
            let url = `https://localhost:7193/api/visits?date=${formattedDate}`;
            if (employeeId) {
                url = `https://localhost:7193/api/visits?employeeIds=${employeeId}&date=${formattedDate}`;
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

    useEffect(() => {
        fetchVisits(selectedDate, selectedEmployee);
    }, [selectedDate, selectedEmployee]);

    return (
        <div style={{ padding: "20px" }}>
            <h1>🩺 Harmonogram wizyt</h1>

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "20px",
                }}
            >
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

            <div style={{ display: "flex", gap: "20px" }}>
                <div style={{ flex: "0 0 30%" }}>
                    <Calendar
                        localizer={localizer}
                        events={[]}
                        date={selectedDate}
                        formats={{
                            monthHeaderFormat: (date) => format(date, "LLLL yyyy", { locale: pl })
                        }}
                        onNavigate={(date) => setSelectedDate(date)}
                        messages={{
                            day: "Dzień",
                            today: "Dziś",
                            previous: "←",
                            next: "→",
                        }}
                        views={["month"]}
                        style={{ height: "400px", width: "100%" }}
                        onSelectSlot={({ start }) => setSelectedDate(start)}
                        selectable
                    />
                </div>

                <div style={{ overflowX: "auto", flex: "1 1 50%" }}>
                    <h3>
                        Wizyty w dniu {selectedDate.toLocaleDateString("pl-PL")}
                        {selectedEmployee &&
                            ` (${employees.find((e) => e.id === selectedEmployee)?.firstName || ""
                            } ${employees.find((e) => e.id === selectedEmployee)?.lastName || ""
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
                                        <th style={{ width: "5%" }}>Akcje</th>

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
                                            <td
                                                style={{ cursor: "pointer", transition: "0.2s" }}
                                                onClick={() => onSelectPatient(v.patient.id)}
                                                onMouseEnter={(e) => (e.currentTarget.style.background = "#f7f7f7")}
                                                onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
                                            >
                                                {v.patient?.firstName} {v.patient?.lastName}
                                            </td>
                                            <td>{v.visitType?.value}</td>
                                            <td
                                                style={{ cursor: "pointer", transition: "0.2s" }}
                                                onClick={() => onSelectEmployee(v.employee.id)}
                                                onMouseEnter={(e) => (e.currentTarget.style.background = "#f7f7f7")}
                                                onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
                                            >
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
                                            <td style={{ padding: "2px 5px", textAlign: "center" }}>
                                            <div style={{ display: "flex", flexDirection: "column", gap: "2px"}}>
                                                    <button
                                                        style={{
                                                            padding: "2px 4px",
                                                            backgroundColor: "#1976d2",
                                                            color: "white",
                                                            border: "none",
                                                            borderRadius: "4px",
                                                            cursor: "pointer",
                                                            fontSize: "12px",
                                                        }}
                                                        onClick={() => {
                                                            setVisitToEdit(v);
                                                            setShowEditForm(true);
                                                            setShowForm(false);

                                                            setTimeout(() => {
                                                                window?.scrollTo({ top: 0, behavior: "smooth" });
                                                            }, 50);
                                                        }}
                                                    >
                                                        Edytuj
                                                    </button>

                                                    <button
                                                        style={{
                                                        padding: "2px 4px",
                                                        backgroundColor: "#e53935",
                                                        color: "white",
                                                        border: "none",
                                                        borderRadius: "4px",
                                                        cursor: "pointer",
                                                        fontSize: "12px",
                                                    }}
                                                        onClick={async () => {
                                                            const confirmed = window.confirm("Czy na pewno chcesz usunąć tę wizytę?");
                                                            if (!confirmed) return;

                                                            try {
                                                                const res = await fetch(`https://localhost:7193/api/visits/${v.id}`, {
                                                                    method: "DELETE",
                                                                });

                                                                if (!res.ok) throw new Error("Nie udało się usunąć wizyty");

                                                                fetchVisits(selectedDate, selectedEmployee);
                                                            } catch (err) {
                                                                alert("Błąd podczas usuwania wizyty: " + err.message);
                                                            }
                                                        }}
                                                    >
                                                        Usuń
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {showForm && (
                    <div style={{ flex: "0 0 25%", transition: "all 0.3s ease" }}>
                        <VisitForm
                            date={selectedDate}
                            onVisitAdded={() => {
                                fetchVisits(selectedDate, selectedEmployee);
                                setShowForm(false);
                            }}
                            onCancel={() => setShowForm(false)}
                        />
                    </div>
                )}

                {showEditForm && visitToEdit && (
                    <div style={{ flex: "0 0 25%", transition: "all 0.3s ease" }}>
                        <VisitForm
                            date={selectedDate}
                            visitToEdit={visitToEdit}
                            onVisitAdded={() => {
                                fetchVisits(selectedDate, selectedEmployee);
                                setShowEditForm(false);
                                setVisitToEdit(null);
                            }}
                            onCancel={() => {
                                setShowEditForm(false);
                                setVisitToEdit(null);
                            }}
                        />
                    </div>
                )}

            </div>
        </div>
    );
}

export default SchedulePage;
