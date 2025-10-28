import React, { useState } from "react";
import PatientList from "./components/PatientList";
import EmployeeList from "./components/EmployeeList";

function App() {
    const [view, setView] = useState("patients"); // "patients" lub "employees"

    return (
        <div style={{ padding: "20px" }}>
            <div style={{ marginBottom: "20px" }}>
                <button onClick={() => setView("patients")}>Pacjenci</button>
                <button onClick={() => setView("employees")}>Pracownicy</button>
            </div>

            {view === "patients" && <PatientList />}
            {view === "employees" && <EmployeeList />}
        </div>
    );
}

export default App;
