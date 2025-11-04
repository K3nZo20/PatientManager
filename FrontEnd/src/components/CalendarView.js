import React from "react";

function CalendarView({ onDayClick }) {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const dayNames = ["Nd", "Pn", "Wt", "Śr", "Cz", "Pt", "Sb"];

    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
        days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(i);
    }

    return (
        <div style={{ padding: "20px" }}>
            <h1 style={{ textAlign: "center" }}>
                📅 {today.toLocaleString("pl-PL", { month: "long" })} {year}
            </h1>
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(7, 1fr)",
                    gap: "8px",
                    textAlign: "center",
                }}
            >
                {dayNames.map((d) => (
                    <div key={d} style={{ fontWeight: "bold" }}>
                        {d}
                    </div>
                ))}
                {days.map((day, idx) =>
                    day ? (
                        <button
                            key={idx}
                            onClick={() => {
                                const clickedDate = new Date(year, month, day);
                                onDayClick(clickedDate);
                            }}
                            style={{
                                padding: "15px",
                                borderRadius: "8px",
                                border: "1px solid #ccc",
                                backgroundColor: "#f9f9f9",
                                cursor: "pointer",
                            }}
                        >
                            {day}
                        </button>
                    ) : (
                        <div key={idx}></div>
                    )
                )}
            </div>
        </div>
    );
}

export default CalendarView;
