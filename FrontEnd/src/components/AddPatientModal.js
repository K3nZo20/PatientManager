import React, { useState } from "react";

function AddPatientModal({ onClose, onAdded }) {
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        phoneNumber: "",
        pesel: "",
        dateOfBirth: "",
    });

    const handleSubmit = () => {
        fetch("https://localhost:7193/api/patients", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        })
            .then((res) => res.json())
            .then(onAdded)
            .catch((err) => alert("Błąd dodawania pacjenta: " + err.message));
    };

    return (
        <div style={{
            position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center"
        }}>
            <div style={{ background: "white", padding: "20px", borderRadius: "8px", minWidth: "300px" }}>
                <h3>Nowy pacjent</h3>
                <input placeholder="Imię" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
                <input placeholder="Nazwisko" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
                <input placeholder="PESEL" value={form.pesel} onChange={(e) => setForm({ ...form, pesel: e.target.value })} />
                <input placeholder="Telefon" value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} />
                <input type="date" value={form.dateOfBirth} onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })} />

                <div style={{ marginTop: "10px" }}>
                    <button onClick={handleSubmit}>💾 Zapisz</button>
                    <button onClick={onClose} style={{ marginLeft: "10px" }}>❌ Anuluj</button>
                </div>
            </div>
        </div>
    );
}

export default AddPatientModal;
