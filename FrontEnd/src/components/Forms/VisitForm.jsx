import React, { useEffect, useState } from "react";
import PatientForm from "./PatientForm";

function VisitForm({ date, onVisitAdded, onCancel, visitToEdit }) {
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
        fetch(`https://localhost:7193/api/patients?sortBy=lastName&page=1&pageSize=0`)
            .then((res) => res.text())
            .then((text) => (text ? JSON.parse(text) : []))
            .then((data) => setPatients(data.items))
            .catch(console.error);

        fetch(`https://localhost:7193/api/employees?sortBy=lastName`)
            .then((res) => res.text())
            .then((text) => (text ? JSON.parse(text) : []))
            .then((data) => setEmployees(data.items))
            .catch(console.error);

        fetch(`https://localhost:7193/api/visittypes`)
            .then((res) => res.text())
            .then((text) => (text ? JSON.parse(text) : []))
            .then(setTypes)
            .catch(console.error);
    }, []);

    useEffect(() => {
        if (visitToEdit) {
            setForm({
                patientId: visitToEdit.patientId,
                employeeId: visitToEdit.employeeId,
                visitTypeId: visitToEdit.visitTypeId,
                startTime: visitToEdit.startTime.substring(11, 16),
                endTime: visitToEdit.endTime.substring(11, 16),
                duration: "",
                comment: visitToEdit.comment || ""
            });
        }
    }, [visitToEdit]);

    const handleAddVisit = async (e) => {
        e.preventDefault();
        const start = `${formattedDate}T${form.startTime}:00`;
        const end = `${formattedDate}T${form.endTime}:00`;

        try {
            const res = await fetch("https://localhost:7193/api/visits", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    patientId: form.patientId,
                    employeeId: form.employeeId,
                    visitTypeId: form.visitTypeId,
                    startTime: start,
                    endTime: end,
                    comment: form.comment,
                }),
            });

            if (!res.ok) throw new Error("Błąd podczas zapisywania wizyty");
            alert("Wizyta została dodana ✅");
            setForm({
                patientId: "",
                employeeId: "",
                visitTypeId: "",
                startTime: "",
                endTime: "",
                comment: "",
            });
            onVisitAdded();
        } catch (err) {
            alert(err.message);
        }
    };

    const handleUpdateVisit = async (e) => {
        e.preventDefault();

        const start = `${formattedDate}T${form.startTime}:00`;
        const end = `${formattedDate}T${form.endTime}:00`;

        try {
            const res = await fetch(`https://localhost:7193/api/visits/${visitToEdit.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: visitToEdit.id,
                    patientId: form.patientId,
                    employeeId: form.employeeId,
                    visitTypeId: form.visitTypeId,
                    startTime: start,
                    endTime: end,
                    comment: form.comment,
                }),
            });

            if (!res.ok) throw new Error("Błąd przy edycji wizyty");

            alert("Wizyta została zaktualizowana ✔️");
            onVisitAdded();
        } catch (err) {
            alert(err.message);
        }
    };


    return (
        <div style={{ borderLeft: "1px solid #ddd", paddingLeft: "20px" }}>
            <h3>{visitToEdit ? "✏️ Edytuj wizytę" : "➕ Dodaj wizytę"}</h3>

            <form onSubmit={visitToEdit ? handleUpdateVisit : handleAddVisit}>

                <label>Pacjent: </label>
                <select
                    value={form.patientId}
                    onChange={(e) => setForm({ ...form, patientId: e.target.value })}
                    required
                >
                    <option value="">-- wybierz pacjenta --</option>
                    {patients.map((p) => (
                        <option key={p.id} value={p.id}>
                            {p.lastName} {p.firstName}
                        </option>
                    ))}
                </select>
                <button type="button" onClick={() => setShowAddPatient(!showAddPatient)} style={{ marginLeft: "10px" }}>
                    ➕ Nowy pacjent
                </button>

                {showAddPatient && (
                    <div style={{ marginTop: "10px", border: "1px solid #ccc", padding: "10px", borderRadius: "8px" }}>
                        <PatientForm
                            onPatientAdded={(addedPatient) => {
                                setPatients(prev => [...prev, addedPatient]);
                                setForm(f => ({ ...f, patientId: addedPatient.id }));
                                setShowAddPatient(false);
                            }}
                            onCancel={() => setShowAddPatient(false)}
                        />
                    </div>
                )}

                <br />
                <label>Pracownik: </label>
                <select
                    value={form.employeeId}
                    onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
                    required
                >
                    <option value="">-- wybierz lekarza --</option>
                    {employees.map((e) => (
                        <option key={e.id} value={e.id}>
                            {e.firstName} {e.lastName}
                        </option>
                    ))}
                </select>

                <br />
                <label>Typ wizyty: </label>
                <select
                    value={form.visitTypeId}
                    onChange={(e) => setForm({ ...form, visitTypeId: e.target.value })}
                    required
                >
                    <option value="">-- wybierz typ --</option>
                    {types.map((t) => (
                        <option key={t.id} value={t.id}>
                            {t.value}
                        </option>
                    ))}
                </select>

                <br />
                <label>Godzina rozpoczęcia: </label>
                <select
                    value={form.startTime}
                    onChange={(e) => {
                        const start = e.target.value;

                        if (form.duration) {
                            const [h, m] = start.split(":").map(Number);
                            const endMinutes = h * 60 + m + Number(form.duration);

                            const endH = String(Math.floor(endMinutes / 60)).padStart(2, "0");
                            const endM = String(endMinutes % 60).padStart(2, "0");

                            setForm({
                                ...form,
                                startTime: start,
                                endTime: `${endH}:${endM}`
                            });
                        } else {
                            setForm({ ...form, startTime: start });
                        }
                    }}
                    required
                >
                    <option value="">-- wybierz godzinę --</option>

                    {Array.from({ length: (20 - 12) * 4 + 1 }).map((_, i) => {
                        const minutes = i * 15;
                        const hour = 12 + Math.floor(minutes / 60);
                        const minute = minutes % 60;

                        const t = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
                        return <option key={t} value={t}>{t}</option>;
                    })}
                </select>

                <br />
                <label>Długość wizyty: </label>
                <select
                    value={form.duration}
                    onChange={(e) => {
                        const duration = e.target.value;

                        if (form.startTime) {
                            const [h, m] = form.startTime.split(":").map(Number);
                            const totalMinutes = h * 60 + m + Number(duration);

                            const endHours = String(Math.floor(totalMinutes / 60)).padStart(2, "0");
                            const endMinutes = String(totalMinutes % 60).padStart(2, "0");

                            setForm({
                                ...form,
                                duration,
                                endTime: `${endHours}:${endMinutes}`
                            });
                        } else {
                            setForm({ ...form, duration });
                        }
                    }}
                    required
                >
                    <option value="">Wybierz czas</option>
                    <option value="15">0:15 </option>
                    <option value="30">0:30 </option>
                    <option value="45">0:45 </option>
                    <option value="60">1:00 </option>
                    <option value="75">1:15 </option>
                    <option value="90">1:30</option>
                    <option value="105">1:45 </option>
                    <option value="120">2:00 </option>
                </select>

                <br />
                <label>Komentarz: </label>
                <input
                    type="text"
                    value={form.comment}
                    onChange={(e) => setForm({ ...form, comment: e.target.value })}
                />
                <br />
                <div>
                    <button type="submit">💾 Zapisz wizytę</button>

                    <button
                        type="button"
                        onClick={() => onCancel?.()}
                    >
                        ✖ Anuluj
                    </button>
                </div>

            </form>
        </div>
    );
}

export default VisitForm;
