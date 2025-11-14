import React, { useState } from "react";
import WeekCalendar from "./components/WeekCalendar";
import PatientList from "./components/PatientList";
import EmployeeList from "./components/EmployeeList";
import SchedulePage from "./components/SchedulePage";

function App() {
    const [activePage, setActivePage] = useState("patients");

    const renderPage = () => {
        switch (activePage) {
            case "patients":
                return <PatientList />;
            case "employees":
                return <EmployeeList />;
            case "calendar":
                return <SchedulePage />;
            case "week":
                return <WeekCalendar />;
            default:
                return <PatientList />;
        }
    };

    return (
        <div style={{ fontFamily: "Arial, sans-serif" }}>
            {/* 🔹 Pasek nawigacji */}
            <nav
                style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "30px",
                    backgroundColor: "#007bff",
                    padding: "12px",
                    color: "white",
                    fontWeight: "bold",
                }}
            >
                <span
                    onClick={() => setActivePage("patients")}
                    style={{
                        cursor: "pointer",
                        textDecoration: activePage === "patients" ? "underline" : "none",
                    }}
                >
                    👩‍⚕️ Pacjenci
                </span>
                <span
                    onClick={() => setActivePage("employees")}
                    style={{
                        cursor: "pointer",
                        textDecoration: activePage === "employees" ? "underline" : "none",
                    }}
                >
                    👨‍🔬 Pracownicy
                </span>
                <span
                    onClick={() => setActivePage("calendar")}
                    style={{
                        cursor: "pointer",
                        textDecoration: activePage === "calendar" ? "underline" : "none",
                    }}
                >
                    🗓️ Kalendarz
                </span>
                <span
                    onClick={() => setActivePage("week")}
                    style={{
                        cursor: "pointer",
                        textDecoration: activePage === "week" ? "underline": "none",
                    }}
                >
                    🗓️ Tydzień
                </span>
            </nav>

            {/* 🔸 Zawartość strony */}
            <div style={{ padding: "20px" }}>{renderPage()}</div>
        </div>
    );
}

export default App;
