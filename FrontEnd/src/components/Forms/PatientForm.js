import React, { useState } from "react";

function PatientForm({ onPatientAdded, onCancel }) {
    const [patient, setPatient] = useState({
        firstName: "",
        lastName: "",
        phoneNumber: "",
        pesel: "",
        dateOfBirth: "",
    });

    const handleChange = (e) => {
        setPatient({ ...patient, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            const res = await fetch("https://localhost:7193/api/patients", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(patient),
            });

            if (!res.ok) throw new Error("Błąd zapisu pacjenta");

            const added = await res.json();

            alert("Pacjent dodany!");

            if (onPatientAdded) onPatientAdded(added);
        } catch (err) {
            console.error("Błąd dodawania pacjenta:", err);
            alert("Nie udało się dodać pacjenta!");
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>Dodaj pacjenta</h2>

            <input
                name="firstName"
                placeholder="Imię"
                onChange={handleChange}
                required
            /><br />

            <input
                name="lastName"
                placeholder="Nazwisko"
                onChange={handleChange}
                required
            /><br />

            <input
                name="pesel"
                placeholder="Pesel"
                maxLength="11"
                minLength="11"
                onChange={handleChange}
                required
            /><br />

            <input
                name="dateOfBirth"
                type="date"
                onChange={handleChange}
                required
            /><br />

            <input
                name="phoneNumber"
                maxLength="9"
                minLength="9"
                placeholder="Telefon"
                onChange={handleChange}
                required
            /><br /><br />

            <button type="button" onClick={handleSubmit}>💾 Zapisz</button>
            <button type="button" onClick={onCancel} style={{ marginLeft: "10px" }}>
                ❌ Anuluj
            </button>
        </div>
    );
}

export default PatientForm;
