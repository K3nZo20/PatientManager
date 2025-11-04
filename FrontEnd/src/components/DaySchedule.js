import React, { useEffect, useState } from "react";

function DaySchedule({ date, onBack }) {
    const [visits, setVisits] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const formattedDate = date.toISOString().split("T")[0];

        fetch(`https://localhost:7193/api/visits?date=${formattedDate}`)
            .then((res) => {
                if (!res.ok) throw new Error("Błąd sieci");
                return res.json();
            })
            .then((data) => {
                setVisits(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Błąd podczas pobierania wizyt:", err);
                setLoading(false);
            });
    }, [date]);

    return (
        <div style={{ padding: "20px" }}>
            <button onClick={onBack}>⬅️ Wróć do kalendarza</button>
            <h2>📅 Wizyty w dniu {date.toLocaleDateString("pl-PL")}</h2>

            {loading ? (
                <p>Ładowanie wizyt...</p>
            ) : visits.length === 0 ? (
                <p>Brak wizyt w tym dniu.</p>
            ) : (
                <table
                    border="1"
                    cellPadding="8"
                    style={{ borderCollapse: "collapse", width: "100%" }}
                >
                    <thead>
                        <tr>
                            <th>Godzina</th>
                            <th>Pacjent</th>
                            <th>Typ wizyty</th>
                            <th>Lekarz</th>
                        </tr>
                    </thead>
                    <tbody>
                        {visits.map((v) => (
                            <tr key={v.id}>
                                <td>
                                    {new Date(v.visitDate).toLocaleTimeString("pl-PL", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </td>
                                <td>
                                    {v.patient?.firstName} {v.patient?.lastName}
                                </td>
                                <td>{v.visitType?.value || v.visitType?.Value}</td>
                                <td>
                                    {v.employee?.firstName} {v.employee?.lastName}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default DaySchedule;
