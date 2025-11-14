import React, { useEffect, useState } from "react";
import AddPatientModal from "./AddPatientModal";

function AddVisitForm({ date, onVisitAdded }) {
    const [patients, setPatients] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [types, setTypes] = useState([]);
    const [showAddPatient, setShowAddPatient] = useState(false);

    const [form, setForm] = useState({
        patientId: "",
        employeeId: "",
        visitTypeId: "",
        startTime: "",
        endTime: "",
        comment: "",
    });

    const formattedDate = date.toISOString().split("T")[0];

    useEffect(() => {
        fetch(`https://localhost:7193/api/patients?sortBy=lastName&sortByDescending=false&page=1&pageSize=1000`)
            .then((res) => res.text())
            .then((t) => (t ? JSON.parse(t) : []))
            .then(setPatients);

        fetch(`https://localhost:7193/api/employees`)
            .then((res) => res.text())
            .then((t) => (t ? JSON.parse(t) : []))
            .then(setEmployees);

        fetch(`https://localhost:7193/api/visittypes`)
            .then((res) => res.text())
            .then((t) => (t ? JSON.parse(t) : []))
            .then(setTypes);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const start = new Date(`${formattedDate}T${form.startTime}`);
        const end = new Date(`${formattedDate}T${form.endTime}`);

        fetch("https://localhost:7193/api/visits", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...form, startTime: start.toISOString(), endTime: end.toISOString() }),
        })
            .then((res) => res.json())
            .then(() => {
                alert("Wizyta dodana ✅");
                onVisitAdded();
            })
            .catch((err) => alert(err.message));
    };

    return (
        <div style={{ marginTop: "20px", padding: "15px", border: "1px solid #ccc", borderRadius: "8px" }}>
            <h3>Nowa wizyta ({date.toLocaleDateString("pl-PL")})</h3>
            <form onSubmit={handleSubmit}>
                <label>Pacjent:</label>
                <select value={form.patientId} onChange={(e) => setForm({ ...form, patientId: e.target.value })}>
                    <option value="">-- Wybierz pacjenta --</option>
                    {patients.map((p) => (
                        <option key={p.id} value={p.id}>
                            {p.lastName} {p.firstName}
                        </option>
                    ))}
                </select>
                <button type="button" onClick={() => setShowAddPatient(true)} style={{ marginLeft: "10px" }}>➕ Dodaj pacjenta</button>

                <br />
                <label>Pracownik: </label>
                <select value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })}>
                    <option value="">-- Wybierz lekarza --</option>
                    {employees.map((e) => (
                        <option key={e.id} value={e.id}>
                            {e.firstName} {e.lastName}
                        </option>
                    ))}
                </select>

                <br />
                <label>Typ wizyty: </label>
                <select value={form.visitTypeId} onChange={(e) => setForm({ ...form, visitTypeId: e.target.value })}>
                    <option value="">-- Wybierz typ --</option>
                    {types.map((t) => (
                        <option key={t.id} value={t.id}>{t.value}</option>
                    ))}
                </select>

                <br />
                <label>Od: </label>
                <input type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} />
                <label>Do: </label>
                <input type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} />

                <br />
                <label>Komentarz: </label>
                <input type="text" value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} />

                <br />
                <button type="submit">💾 Zapisz</button>
            </form>

            {showAddPatient && (
                <AddPatientModal
                    onClose={() => setShowAddPatient(false)}
                    onAdded={(newPatient) => {
                        setPatients((prev) => [...prev, newPatient].sort((a, b) => a.lastName.localeCompare(b.lastName)));
                        setForm((prev) => ({ ...prev, patientId: newPatient.id }));
                        setShowAddPatient(false);
                    }}
                />
            )}
        </div>
    );
}

export default AddVisitForm;
