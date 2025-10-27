import React, { useEffect, useState } from "react";

function App() {
    const [patients, setPatients] = useState([]);
    useEffect(() => {
        fetch("https://localhost:7193/api/patients", {
            headers: {
                "Accept": "application/json; charset=utf-8"
            }
        })
            .then(res => res.json())
            .then(data => {
                console.log("Dane z backendu:", data);
                setPatients(data);
            })
            .catch(err => console.error("Błąd podczas pobierania danych:", err));
    }, []);

    return (
        <div style={{ padding: "20px" }}>
            <h1>Lista pacjentów 🏥</h1>
            <ul>
                {patients.map(p => (
                    <li key={p.id}>
                        {p.firstName} {p.lastName}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
