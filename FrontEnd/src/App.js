import React, { useState } from "react";
import DayCalendar from "./components/DayCalendar";
import PatientList from "./components/PatientList";
import EmployeeList from "./components/EmployeeList";
import SchedulePage from "./components/SchedulePage";
import EmployeeDetails from "./components/EmployeeDetails";
import PatientDetails from "./components/PatientDetails";

function App() {
    const [activePage, setActivePage] = useState("dayCalendar");
    const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
    const [selectedPatientId, setSelectedPatientId] = useState(null);
    const [previousPage, setPreviousPage] = useState(null);

    const goToPage = (page) => {
        setPreviousPage(activePage);
        setActivePage(page);
    };


    const renderPage = () => {
        switch (activePage) {
            case "patients":
                return (
                    <PatientList
                        onSelectPatient={(id) => {
                            setSelectedPatientId(id);
                            goToPage("patientDetails");
                        }}
                />
                );
            case "employees":
                return (
                    <EmployeeList
                        onSelectEmployee={(id) => {
                            setSelectedEmployeeId(id);
                            goToPage("employeeDetails");
                        }}
                    />
                );
            case "calendar":
                return (
                    <SchedulePage
                        id={selectedPatientId}
                        onSelectPatient={(id) => {
                            setSelectedPatientId(id);
                            goToPage("patientDetails");
                        }}
                        onSelectEmployee={(id) => {
                            setSelectedEmployeeId(id);
                            goToPage("employeeDetails");
                        }}
                    />
                );
            case "dayCalendar":
                return (
                    <DayCalendar
                        id={selectedPatientId}
                        onSelectPatient={(id) => {
                            setSelectedPatientId(id);
                            goToPage("patientDetails");
                        }}
                        onSelectEmployee={(id) => {
                            setSelectedEmployeeId(id);
                            goToPage("employeeDetails");
                        }}
                    />
                );
            case "employeeDetails":
                return (
                    <EmployeeDetails
                        id={selectedEmployeeId}
                        onBack={() => goToPage(previousPage || "employees")}
                        onSelectPatient={(id) => {
                            setSelectedPatientId(id);
                            goToPage("patientDetails");
                        }}
                    />
                );
            case "patientDetails":
                return (
                    <PatientDetails
                        id={selectedPatientId}
                        onBack={() => goToPage(previousPage || "employees")}
                        onSelectEmployee={(id) => {
                            setSelectedEmployeeId(id);
                            goToPage("employeeDetails");
                        }}
                    />
                );
            default:
                return <DayCalendar />;
        }
    };

    return (
        <div style={{ fontFamily: "Arial, sans-serif" }}>
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
                    onClick={() => setActivePage("dayCalendar")}
                    style={{
                        cursor: "pointer",
                        textDecoration: activePage === "dayCalendar" ? "underline": "none",
                    }}
                >
                    🗓️ Tydzień
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
                    onClick={() => setActivePage("patients")}
                    style={{
                        cursor: "pointer",
                        textDecoration: activePage === "patients" ? "underline" : "none",
                    }}
                >
                    🧍‍ Pacjenci
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
                
                
            </nav>

            <div style={{ padding: "20px" }}>{renderPage()}</div>
        </div>
    );
}

export default App;
