import React, { useEffect, useState, useCallback } from "react";
import EmployeeForm from "./Forms/EmployeeForm";

function EmployeeList({ onSelectEmployee }) {
    const [employees, setEmployees] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("lastName");
    const [sortDesc, setSortDesc] = useState(false);
    const [showForm, setShowForm] = useState(false);


    const fetchEmployees = useCallback(async () => {
        try {
            const res = await fetch(
                `https://localhost:7193/api/employees?search=${search}&sortBy=${sortBy}&sortByDescending=${sortDesc}&page=${page}&pageSize=${pageSize}`
            );

            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const text = await res.text();
            const data = text ? JSON.parse(text) : [];

            setEmployees(data.items);
            setTotalCount(data.totalCount);
        } catch (err) {
            console.error("Błąd podczas pobierania pacjentów:", err)
        }
    }, [search, sortBy, sortDesc, page, pageSize]);

    useEffect(() => {
        fetchEmployees();
    }, [fetchEmployees]);

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

        <div style={{ padding: "20px" }}>
            <h1>👨‍🔬 Lista pracowników</h1>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <input
                    type="text"
                    placeholder="Szukaj pracownika..."
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
                    ➕ Dodaj pracownika
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
                        <EmployeeForm
                            onEmployeeAdded={() => {
                                fetchEmployees();
                                setShowForm(false);
                            }}
                            onCancel={() => setShowForm(false)}
                        />
                    </div>
                </div>
            )}

            {employees.length === 0 ? (
                <p>Brak pracowników w bazie danych.</p>
            ) : (
                <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%", tableLayout: "fixed" }}>
                        <thead>
                        <tr style={{ backgroundColor: "#f2f2f2" }}>
                            <th onClick={() => handleSortAndChangePage("firstName", 1)} style={thStyle}>Imię {renderSortArrow("firstName")} </th>
                            <th onClick={() => handleSortAndChangePage("lastName", 1)} style={thStyle}>Nazwisko {renderSortArrow("lastName")} </th>
                            <th style={thStyle}>Stanowisko</th>
                            <th style={thStyle}>Telefon</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map((emp) => (
                            <tr
                                key={emp.id}
                                onClick={() => onSelectEmployee(emp.id)}
                                style={{
                                    cursor: "pointer",
                                    transition: "0.2s",
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = "#f7f7f7")}
                                onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
                            >

                                <td style={tdStyle}>{emp.firstName}</td>
                                <td style={tdStyle}>{emp.lastName}</td>
                                <td style={tdStyle}>{emp.title}</td>
                                <td style={tdStyle}>{emp.phoneNumber}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
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

const tdStyle = {
    border: "1px solid #ddd",
    padding: "8px",
};

export default EmployeeList;
