import React, { useEffect, useState } from "react";

function PatientList() {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch("https://localhost:7193/api/patients")
            .then(async (res) => {
                if (!res.ok) {
                    throw new Error(`Błąd HTTP: ${res.status}`);
                }

                const text = await res.text();
                return text ? JSON.parse(text) : [];
            })
            .then((data) => setPatients(data))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p>Ładowanie danych...</p>;
    if (error) return <p style={{ color: "red" }}>Błąd: {error}</p>;

    return (
        <div style={{ padding: "20px" }}>
            <h2>Lista pacjentów 🏥</h2>
            {patients.length === 0 ? (
                <p>Brak pacjentów w bazie danych.</p>
            ) : (
                <table
                    style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        marginTop: "20px",
                    }}
                >
                    <thead>
                        <tr style={{ backgroundColor: "#f2f2f2" }}>
                            <th style={thStyle}>Imię</th>
                            <th style={thStyle}>Nazwisko</th>
                            <th style={thStyle}>Telefon</th>
                            <th style={thStyle}>Pesel</th>
                            <th style={thStyle}>Wizyty</th>
                        </tr>
                    </thead>
                    <tbody>
                        {patients.map((pat) => (
                            <tr key={pat.id}>
                                <td style={tdStyle}>{pat.firstName}</td>
                                <td style={tdStyle}>{pat.lastName}</td>
                                <td style={tdStyle}>{pat.phoneNumber}</td>
                                <td style={tdStyle}>{pat.pesel}</td>
                                <td style={tdStyle}>{pat.Visits}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

const thStyle = {
    border: "1px solid #ddd",
    padding: "8px",
    textAlign: "left",
};

const tdStyle = {
    border: "1px solid #ddd",
    padding: "8px",
};

export default PatientList;
