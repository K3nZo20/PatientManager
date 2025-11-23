import React, { useState } from "react";

function EmployeeForm({ onEmployeeAdded, onCancel }) {
    const [employee, setEmployee] = useState({
        firstName: "",
        lastName: "",
        title: "",
        phoneNumber: "",
    });

    const handleChange = (e) => {
        setEmployee({ ...employee, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch("https://localhost:7193/api/employees", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(employee),
            });

            if (!res.ok) throw new Error("Błąd zapisu pracownika");

            const added = await res.json();

            alert("Pracownik dodany!");

            if (onEmployeeAdded) onEmployeeAdded(added);
        } catch (err) {
            alert("Nie udało się dodać pracownika!");
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>Dodaj pracownika</h2>

            <form onSubmit={handleSubmit}>
                <input name="firstName" placeholder="Imię" onChange={handleChange} required /><br />
                <input name="lastName" placeholder="Nazwisko" onChange={handleChange} required /><br />
                <input name="title" placeholder="Stanowisko" onChange={handleChange} required /><br />
                <input name="phoneNumber" placeholder="Telefon" maxLength="9" onChange={handleChange} required /><br /><br />

                <button type="submit">💾 Zapisz</button>
                <button type="button" onClick={onCancel} style={{ marginLeft: "10px" }}>
                    ❌ Anuluj
                </button>
            </form>
        </div>
    );
}

export default EmployeeForm;
