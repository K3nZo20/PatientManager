import React, { useState, useEffect } from "react";

function VisitTypeForm({ onVisitTypeAdded, onCancel, typeToEdit }) {
    const [visitType, setVisitType] = useState({
        value: "",
        color: "#000000",
    });

    useEffect(() => {
        if (typeToEdit) {
            setVisitType({
                value: typeToEdit.value,
                color: typeToEdit.color,
            });
        }
    }, [typeToEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setVisitType({ ...visitType, [name]: value });
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const url = typeToEdit
            ? `https://localhost:7193/api/visitTypes/${typeToEdit.id}`
            : "https://localhost:7193/api/visitTypes";

        const method = typeToEdit ? "PUT" : "POST";

        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(visitType),
        });

        if (!res.ok) {
            let message = `Błąd serwera ${res.status}`;
            try {
                const error = await res.json();
                message = error?.message || message;
            } catch {}
            alert(message);
            return;
        }

        const text = await res.text();
        let added = null;
        try {
            added = text ? JSON.parse(text) : null;
        } catch {}

        alert(typeToEdit ? "Typ wizyty zaktualizowany!" : "Typ wizyty dodany!");
        if (typeToEdit) onVisitTypeAdded();
        if (onVisitTypeAdded && added) onVisitTypeAdded(added);

    } catch (err) {
        console.error(err);
        alert("Nie udało się zapisać typu wizyty!\n" + err.message);
    }
};



    return (
        <div style={{ padding: "20px" }}>
            <h2>{typeToEdit ? "Edytuj typ wizyty" : "Dodaj typ wizyty"}</h2>
            <form onSubmit={handleSubmit}>
                <input
                    name="value"
                    placeholder="Nazwa typu wizyty"
                    value={visitType.value}
                    onChange={handleChange}
                    required
                /><br />

                <label>
                    Kolor:{" "}
                    <input
                        type="color"
                        name="color"
                        value={visitType.color}
                        onChange={handleChange}
                        required
                    />
                </label>
                <br /><br />

                <button
                    type="submit">
                    💾 Zapisz
                </button>
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

export default VisitTypeForm;
