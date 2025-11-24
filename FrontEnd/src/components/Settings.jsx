import React, { useState, useEffect, useCallback } from "react";
import VisitTypeForm from "./Forms/VisitTypeForm";

export default function SettingsPage() {
    const [visitType, setVisitType] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("value");
    const [sortDesc, setSortDesc] = useState(false);
    const [showVisitTypes, setShowVisitTypes] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [visitTypeToEdit, setVisitTypeToEdit] = useState(null);

    const fetchVisitTypes = useCallback(async () => {
        try {
            const res = await fetch(
                `https://localhost:7193/api/visitTypes?search=${search}&sortBy=${sortBy}&sortByDescending=${sortDesc}&page=${page}&pageSize=${pageSize}`
            );

            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const text = await res.text();
            const data = text ? JSON.parse(text) : [];

            setVisitType(data.items);
            setTotalCount(data.totalCount);
        } catch (err) {
            console.error("Błąd podczas pobierania typów:", err);
        }
    }, [search, sortBy, sortDesc, page, pageSize]);

 
    useEffect(() => {
        if (showVisitTypes) fetchVisitTypes();
    }, [showVisitTypes, fetchVisitTypes]);

    const totalPages = Math.ceil(totalCount / pageSize);

    const handlePageSizeChange = (e) => {
        setPageSize(parseInt(e.target.value));
        setPage(1);
    };

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > totalPages) return;
        setPage(newPage);
    };

    const handleSortAndChangePage = (field, newPage) => {
        if (sortBy === field) setSortDesc(!sortDesc);
        else {
            setSortBy(field);
            setSortDesc(false);
        }
        if (newPage < 1 || newPage > totalPages) return;
        setPage(newPage);
    };

    const renderSortArrow = (field) => {
        const style = { display: "inline-block", width: "1.2em", textAlign: "center" };
        if (sortBy !== field) return <span style={style}> </span>;
        return <span style={style}>{sortDesc ? "🔽" : "🔼"}</span>;
    };

    return (
        <div style={{ display: "flex", height: "100vh" }}>
            <div style={{
                width: "200px",
                backgroundColor: "#f2f2f2",
                padding: "20px",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                gap: "10px"
            }}>
                <button
                    style={{
                        padding: "10px",
                        backgroundColor: "#1976d2",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        fontSize: "16px",
                        cursor: "pointer"
                    }}
                    onClick={() => setShowVisitTypes(!showVisitTypes)}
                >
                    Typy wizyt
                </button>
            </div>

            <div style={{ flex: 1, padding: "20px" }}>
                {showVisitTypes ? (
                    <>
                        <h1>Typy wizyt</h1>

                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                            <input
                                type="text"
                                placeholder="Szukaj typu..."
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setPage(1);
                                }}
                                style={{ marginBottom: "10px", padding: "5px", width: "250px" }}
                            />
                            <button
                                style={{
                                    backgroundColor: "#1976d2",
                                    color: "white",
                                    border: "none",
                                    padding: "10px 20px",
                                    borderRadius: "6px",
                                }}
                                onClick={() => setShowForm(!showForm)}
                            >
                                ➕ Dodaj typ
                            </button>
                        </div>

                        {showForm && (
                            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
                                <div style={{
                                    width: "400px",
                                    background: "white",
                                    padding: "8px",
                                    borderRadius: "8px",
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
                                }}>
                                    <VisitTypeForm
                                        typeToEdit={visitTypeToEdit}
                                        onVisitTypeAdded={async () => {
                                            await fetchVisitTypes();
                                            setShowForm(false);
                                            setVisitTypeToEdit(null);
                                        }}
                                        onCancel={() => {
                                            setShowForm(false);
                                            setVisitTypeToEdit(null);
                                        }}
                                    />
                                </div>
                            </div>
                        )}

                        {visitType.length === 0 ? (
                            <p>Brak typów w bazie danych.</p>
                        ) : (
                            <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%", tableLayout: "fixed" }}>
                                <thead>
                                    <tr style={{ backgroundColor: "#f2f2f2" }}>
                                        <th onClick={() => handleSortAndChangePage("value", 1)} style={thStyle}>Typ {renderSortArrow("value")}</th>
                                            <th style={thStyle}>Kolor</th>
                                            <th style={{ ...thStyle, width: "4%" }}>Akcje</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {visitType.map((v) => (
                                        <tr key={v.id}>
                                            <td style={tdStyle}>{v.value}</td>
                                            <td style={tdStyle}>
                                                <div style={{
                                                    width: "80px",
                                                    height: "20px",
                                                    backgroundColor: v.color,
                                                    borderRadius: "4px"
                                                }} />
                                            </td>
                                            <td style={{ ...tdStyle, padding: "2px 5px", textAlign: "center" }}>
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
                                                            setVisitTypeToEdit(v);
                                                            setShowForm(true);
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
                                                            const confirmed = window.confirm(
                                                                "Czy na pewno chcesz usunąć ten typ?"
                                                            );
                                                            if (!confirmed) return;

                                                            try {
                                                                const res = await fetch(
                                                                    `https://localhost:7193/api/visitTypes/${v.id}`,
                                                                    { method: "DELETE" }
                                                                );

                                                                if (!res.ok) throw new Error("Nie udało się usunąć typu");

                                                                await fetchVisitTypes();
                                                            } catch (err) {
                                                                alert("Błąd podczas usuwania typu: " + err.message);
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

                        <div style={{ marginTop: "15px", display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                            <button onClick={() => handlePageChange(page - 1)} disabled={page === 1}>⬅️</button>

                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => handlePageChange(i + 1)}
                                    style={{
                                        backgroundColor: i + 1 === page ? "#007bff" : "white",
                                        color: i + 1 === page ? "white" : "black",
                                        border: "1px solid gray",
                                        borderRadius: "5px",
                                        padding: "4px 8px",
                                    }}
                                >
                                    {i + 1}
                                </button>
                            ))}

                            <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages}>➡️</button>

                            <span style={{ marginLeft: "20px" }}>Elementów na stronę:</span>
                            <select value={pageSize} onChange={handlePageSizeChange}>
                                <option value="5">5</option>
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="50">50</option>
                            </select>
                        </div>
                    </>
                ) : (
                    <p></p>
                )}
            </div>
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
