import React, { useState } from "react";

function PatientForm({ onCancel }) {
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await fetch("https://localhost:7193/api/patients", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(patient),
            });
            alert("Pacjent dodany pomyślnie!");
            onCancel();
        } catch (err) {
            console.error("Błąd dodawania pacjenta:", err);
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>Dodaj pacjenta</h2>
            <form onSubmit={handleSubmit}>
                <input
                    name="firstName"
                    placeholder="Imię"
                    onChange={handleChange}
                    required
                />{" "}
                <br />
                <input
                    name="lastName"
                    placeholder="Nazwisko"
                    onChange={handleChange}
                    required
                />{" "}
                <br />
                <input
                    name="pesel"
                    placeholder="PESEL"
                    maxLength="11"
                    minLength="11"
                    onChange={handleChange}
                    required
                />{" "}
                <br />
                <input
                    name="dateOfBirth"
                    type="date"
                    onChange={handleChange}
                    required
                />{" "}
                <br />
                <input
                    name="phoneNumber"
                    maxLength="9"
                    minLength="9"
                    placeholder="Telefon"
                    onChange={handleChange}
                />{" "}
                <br />
                <br />
                <button type="submit">💾 Zapisz</button>
                <button
                    type="button"
                    onClick={onCancel}
                    style={{ marginLeft: "10px" }}
                >
                    ❌ Anuluj
                </button>
            </form>
        </div>
    );
}

export default PatientForm;
