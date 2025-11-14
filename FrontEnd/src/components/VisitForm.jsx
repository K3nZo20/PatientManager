import React, { useEffect, useState } from "react";

function VisitForm({ date, onVisitAdded }) {
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

    const [newPatient, setNewPatient] = useState({
        firstName: "",
        lastName: "",
        phoneNumber: "",
        pesel: "",
    });

    const formattedDate = date.toISOString().split("T")[0];

    // 🔹 Pobieranie danych do formularza
    useEffect(() => {
        fetch(`https://localhost:7193/api/patients?sortBy=lastName&page=1&pageSize=1000`)
            .then((res) => res.text())
            .then((text) => (text ? JSON.parse(text) : []))
            .then(setPatients)
            .catch(console.error);

        fetch(`https://localhost:7193/api/employees?sortBy=lastName`)
            .then((res) => res.text())
            .then((text) => (text ? JSON.parse(text) : []))
            .then(setEmployees)
            .catch(console.error);

        fetch(`https://localhost:7193/api/visittypes`)
            .then((res) => res.text())
            .then((text) => (text ? JSON.parse(text) : []))
            .then(setTypes)
            .catch(console.error);
    }, []);

    // 🔹 Dodawanie nowego pacjenta
    const handleAddPatient = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("https://localhost:7193/api/patients", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newPatient),
            });
            if (!res.ok) throw new Error("Błąd przy dodawaniu pacjenta");
            const added = await res.json();
            alert("Pacjent został dodany ✅");
            setPatients((prev) => [...prev, added]);
            setForm((f) => ({ ...f, patientId: added.id }));
            setShowAddPatient(false);
        } catch (err) {
            alert(err.message);
        }
    };

    // 🔹 Dodawanie wizyty
    const handleAddVisit = async (e) => {
        e.preventDefault();
        const start = new Date(`${formattedDate}T${form.startTime}`);
        const end = new Date(`${formattedDate}T${form.endTime}`);

        try {
            const res = await fetch("https://localhost:7193/api/visits", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    patientId: form.patientId,
                    employeeId: form.employeeId,
                    visitTypeId: form.visitTypeId,
                    startTime: start.toISOString(),
                    endTime: end.toISOString(),
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

    return (
        <div style={{ borderLeft: "1px solid #ddd", paddingLeft: "20px" }}>
            <h3>➕ Dodaj wizytę</h3>

            <form onSubmit={handleAddVisit}>
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
                        <h4>Dodaj nowego pacjenta</h4>
                        <input
                            placeholder="Imię"
                            value={newPatient.firstName}
                            onChange={(e) => setNewPatient({ ...newPatient, firstName: e.target.value })}
                            required
                        />
                        <br />
                        <input
                            placeholder="Nazwisko"
                            value={newPatient.lastName}
                            onChange={(e) => setNewPatient({ ...newPatient, lastName: e.target.value })}
                            required
                        />
                        <br />
                        <input
                            placeholder="Telefon"
                            value={newPatient.phoneNumber}
                            onChange={(e) => setNewPatient({ ...newPatient, phoneNumber: e.target.value })}
                        />
                        <br />
                        <input
                            placeholder="PESEL"
                            value={newPatient.pesel}
                            onChange={(e) => setNewPatient({ ...newPatient, pesel: e.target.value })}
                        />
                        <br />
                        <button onClick={handleAddPatient}>💾 Zapisz pacjenta</button>
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
                <input
                    type="time"
                    value={form.startTime}
                    onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                    required
                />
                <br />
                <label>Godzina zakończenia: </label>
                <input
                    type="time"
                    value={form.endTime}
                    onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                    required
                />
                <br />
                <label>Komentarz: </label>
                <input
                    type="text"
                    value={form.comment}
                    onChange={(e) => setForm({ ...form, comment: e.target.value })}
                />
                <br />
                <button type="submit">💾 Zapisz wizytę</button>
            </form>
        </div>
    );
}

export default VisitForm;
