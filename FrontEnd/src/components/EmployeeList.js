import React, { useEffect, useState } from "react";

function EmployeeList() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch("https://localhost:7193/api/employees")
            .then(async (res) => {
                if (!res.ok) {
                    throw new Error(`Błąd HTTP: ${res.status}`);
                }

                const text = await res.text();
                return text ? JSON.parse(text) : [];
            })
            .then((data) => setEmployees(data))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p>Ładowanie danych...</p>;
    if (error) return <p style={{ color: "red" }}>Błąd: {error}</p>;

    return (
        <div style={{ padding: "20px" }}>
            <h2>Lista pracowników 👩‍⚕️</h2>
            {employees.length === 0 ? (
                <p>Brak pracowników w bazie danych.</p>
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
                            <th style={thStyle}>Stanowisko</th>
                            <th style={thStyle}>Telefon</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map((emp) => (
                            <tr key={emp.id}>
                                <td style={tdStyle}>{emp.firstName}</td>
                                <td style={tdStyle}>{emp.lastName}</td>
                                <td style={tdStyle}>{emp.title}</td>
                                <td style={tdStyle}>{emp.phoneNumber}</td>
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

export default EmployeeList;
