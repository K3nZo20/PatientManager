import React, { useEffect, useState, useCallback } from "react";
import { format } from "date-fns"
import PatientForm from "./Forms/PatientForm";

function PatientList({ onSelectPatient }) {
    const [patients, setPatients] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("lastName");
    const [sortDesc, setSortDesc] = useState(false);
    const [showForm, setShowForm] = useState(false);

    const fetchPatients = useCallback(() => {
        fetch(
            `https://localhost:7193/api/patients?search=${search}&sortBy=${sortBy}&sortByDescending=${sortDesc}&page=${page}&pageSize=${pageSize}`
        )
            .then((res) => res.json())
            .then((data) => {
                setPatients(data.items);
                setTotalCount(data.totalCount);
            })
            .catch((err) =>
                console.error("Błąd podczas pobierania pacjentów:", err)
            );
    }, [search, sortBy, sortDesc, page, pageSize]);

    useEffect(() => {
        fetchPatients();
    }, [fetchPatients]);

    const totalPages = Math.ceil(totalCount / pageSize);

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > totalPages) return;
        setPage(newPage);
    };

    const handlePageSizeChange = (e) => {
        setPageSize(parseInt(e.target.value));
        setPage(1);
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
        <div style={{ padding: "20px" }}>
            <h1>🧍‍ Lista pacjentów</h1>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <input
                    type="text"
                    placeholder="Szukaj pacjenta..."
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
                    ➕ Dodaj pacjenta
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
                        <PatientForm
                            onPatientAdded={(addedPatient) => {
                                setPatients((prev) => [...prev, addedPatient]);
                                setShowForm(false);
                            }}
                            onCancel={() => setShowForm(false)}
                        />
                    </div>
                </div>
            )}

            <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%", tableLayout: "fixed" }}>
                <thead>
                    <tr style={{ backgroundColor: "#f2f2f2" }}>
                        <th onClick={() => handleSortAndChangePage("firstName", 1)} style={thStyle} >Imię {renderSortArrow("firstName")}</th>
                        <th onClick={() => handleSortAndChangePage("lastName", 1)} style={thStyle} >Nazwisko {renderSortArrow("lastName")}</th>
                        <th style={thStyle} >PESEL</th>
                        <th style={thStyle} >Data urodzenia</th>
                        <th style={thStyle} >Telefon</th>
                    </tr>
                </thead>
                <tbody>
                    {patients?.length === 0 ? (
                        <tr>
                            <td colSpan="5" style={{ textAlign: "center" }}>Brak wyników</td>
                        </tr>
                    ) : (
                        patients.map((p) => (
                            <tr
                                key={p.id}
                                onClick={() => onSelectPatient(p.id)}
                                style={{
                                    cursor: "pointer",
                                    transition: "0.2s",
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = "#f7f7f7")}
                                onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
                            >
                                <td style={thStyle}>{p.firstName}</td>
                                <td style={thStyle}>{p.lastName}</td>
                                <td style={thStyle}>{p.pesel}</td>
                                <td style={thStyle}>{format(p.dateOfBirth, "dd-MM-yyyy")}</td>
                                <td style={thStyle}>{p.phoneNumber}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            <div style={{ marginTop: "15px", display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                <button onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
                    ⬅️
                </button>

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

                <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages}>
                    ➡️
                </button>

                <span style={{ marginLeft: "20px" }}>Elementów na stronę:</span>
                <select value={pageSize} onChange={handlePageSizeChange}>
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                </select>
            </div>
        </div>
    );
}

const thStyle = {
    border: "1px solid #ddd",
    padding: "8px",
    textAlign: "left",
};

export default PatientList;
