import React, { useEffect, useState } from "react";
import { format } from "date-fns"
import VisitForm from "./Forms/VisitForm";

function EmployeeDetails({ id, onBack, onSelectPatient }) {
    const [employee, setEmployee] = useState(null);
    const [visits, setVisits] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [visitToEdit, setVisitToEdit] = useState(null);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        title: "",
        phoneNumber: ""
    });

    useEffect(() => {
        fetch(`https://localhost:7193/api/employees/${id}`)
            .then(res => res.json())
            .then(data => {
                setEmployee(data);
                setFormData({
                    firstName: data.firstName,
                    lastName: data.lastName,
                    title: data.title,
                    phoneNumber: data.phoneNumber
                });
            });

        fetch(`https://localhost:7193/api/visits/byEmployee?employeeId=${id}`)
            .then(res => res.json())
            .then(data => setVisits(data));
    }, [id]);

    if (!employee) return <p>Wczytywanie...</p>;

    const handleDelete = async () => {
        if (!window.confirm(`Czy na pewno chcesz usunąć pracownika ${employee.firstName} ${employee.lastName}?`)) return;

        const res = await fetch(`https://localhost:7193/api/employees/${id}`, {
            method: "DELETE"
        });

        if (res.ok) {
            alert("Pracownik został usunięty");
            onBack();
        } else {
            alert("Błąd podczas usuwania");
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const refreshVisits = async () => {
        const res = await fetch(`https://localhost:7193/api/visits/byEmployee?employeeId=${id}`);
        const data = await res.json();
        setVisits(data);
    };

    const handleSave = async () => {
        const res = await fetch(`https://localhost:7193/api/employees/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        if (!res.ok) {
            alert("Błąd podczas zapisywania");
            return;
        }

        alert("Zapisano zmiany!");

        setIsEditing(false);
    };

    const updateField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div style={{ padding: "20px" }}>
            <button onClick={onBack} style={{ marginBottom: "10px" }}>
                ← Wróć
            </button>

            <h1>👨‍⚕️ {employee.firstName} {employee.lastName}</h1>

            {isEditing ? (
                <div
                    style={{
                        padding: "15px",
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                        background: "#f9f9f9",
                        marginBottom: "20px",
                        width: "400px"
                    }}
                >
                    <h3>✏️ Edycja pracownika</h3>

                    <label>Imię</label>
                    <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => updateField("firstName", e.target.value)}
                        style={inputStyle}
                    />

                    <label>Nazwisko</label>
                    <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => updateField("lastName", e.target.value)}
                        style={inputStyle}
                    />

                    <label>Stanowisko</label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => updateField("title", e.target.value)}
                        style={inputStyle}
                    />

                    <label>Telefon</label>
                    <input
                        type="text"
                        value={formData.phoneNumber}
                        onChange={(e) => updateField("phoneNumber", e.target.value)}
                        style={inputStyle}
                    />

                    <button
                        onClick={handleSave}
                        style={{ marginTop: "10px", padding: "8px", background: "#007bff", color: "white" }}
                    >
                        💾 Zapisz
                    </button>

                    <button
                        onClick={() => setIsEditing(false)}
                        style={{ marginLeft: "10px", padding: "8px" }}
                    >
                        ❌ Anuluj
                    </button>
                </div>
            ) : (
                <>
                    <p><b>Stanowisko:</b> {employee.title}</p>
                    <p><b>Telefon:</b> {employee.phoneNumber}</p>

                    <button
                        style={{ background: "red", color: "white", padding: "8px" }}
                        onClick={handleDelete}
                    >
                        🗑️ Usuń pracownika
                    </button>

                    <button
                        style={{ marginLeft: "10px", padding: "8px" }}
                        onClick={handleEdit}
                    >
                        ✏️ Edytuj dane
                    </button>
                </>
            )}

            <hr />

            <h2>📋 Lista wizyt</h2>

            <div style={{ display: "flex", gap: "20px" }}>
                <div style={{ flex: 1, overflowX: "auto" }}>
                    {visits.length === 0 ? (
                        <p>Brak wizyt</p>
                    ) : (
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr style={{ backgroundColor: "#f2f2f2" }}>
                                    <th style={{ ...style, width: "100px" }}>Data</th>
                                    <th style={{ ...style, width: "80px" }}>Godzina</th>
                                    <th style={{ ...style, width: "170px" }}>Pacjent</th>
                                    <th style={{ ...style, width: "150px" }}>Typ wizyty</th>
                                    <th style={style}>Komentarz</th>
                                    <th style={{ ...style, width: "4%" }}>Akcje</th>
                                </tr>
                            </thead>
                            <tbody>
                                {visits.map((v) => (
                                    <tr key={v.id}>
                                        <td style={style}>{format(v.startTime, "dd-MM-yyyy")}</td>
                                        <td style={style}>{v.startTime.substring(11, 16)}</td>
                                        <td
                                            style={{ ...style, cursor: "pointer", transition: "0.2s" }}
                                            onClick={() => onSelectPatient(v.patient.id)}
                                            onMouseEnter={(e) => (e.currentTarget.style.background = "#f7f7f7")}
                                            onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
                                        >
                                            {v.patient.firstName} {v.patient.lastName}
                                        </td>
                                        <td style={style}>{v.visitType.value}</td>
                                        <td style={style}>{v.comment}</td>
                                        <td style={{ ...style, padding: "2px 5px", textAlign: "center" }}>
                                            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                                                <button
                                                    style={{
                                                        padding: "2px 4px",
                                                        backgroundColor: "#1976d2",
                                                        color: "white",
                                                        border: "none",
                                                        borderRadius: "4px",
                                                        cursor: "pointer",
                                                        fontSize: "12px",
                                                    }}
                                                    onClick={() => {
                                                        setVisitToEdit(v);
                                                        setShowEditForm(true);

                                                        setTimeout(() => {
                                                            window?.scrollTo({ top: 0, behavior: "smooth" });
                                                        }, 50);
                                                    }}
                                                >
                                                    Edytuj
                                                </button>

                                                <button
                                                    style={{
                                                        padding: "2px 4px",
                                                        backgroundColor: "#e53935",
                                                        color: "white",
                                                        border: "none",
                                                        borderRadius: "4px",
                                                        cursor: "pointer",
                                                        fontSize: "12px",
                                                    }}
                                                    onClick={async () => {
                                                        const confirmed = window.confirm("Czy na pewno chcesz usunąć tę wizytę?");
                                                        if (!confirmed) return;

                                                        try {
                                                            const res = await fetch(`https://localhost:7193/api/visits/${v.id}`, {
                                                                method: "DELETE",
                                                            });

                                                            if (!res.ok) throw new Error("Nie udało się usunąć wizyty");

                                                            await refreshVisits();
                                                        } catch (err) {
                                                            alert("Błąd podczas usuwania wizyty: " + err.message);
                                                        }
                                                    }}

                                                >
                                                    Usuń
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
                {showEditForm && visitToEdit && (
                    <div style={{ flex: "0 0 25%", transition: "all 0.3s ease" }}>
                        <VisitForm
                            date={new Date(visitToEdit.startTime)}
                            visitToEdit={visitToEdit}
                            onVisitAdded={async () => {
                                await refreshVisits();
                                setShowEditForm(false);
                                setVisitToEdit(null);
                            }}
                            onCancel={() => {
                                setShowEditForm(false);
                                setVisitToEdit(null);
                            }}
                        />
                    </div>
                )}
            </div>
        </div>

    );
}

const inputStyle = {
    width: "100%",
    padding: "6px",
    marginBottom: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
};

const style = {
    border: "1px solid #ddd",
    padding: "8px",
    textAlign: "left",
};

export default EmployeeDetails;
