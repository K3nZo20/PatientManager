import React, { useEffect, useState } from "react";

function EmployeeList() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("lastName");
    const [sortDesc, setSortDesc] = useState(false);

    useEffect(() => {
        fetch(
            `https://localhost:7193/api/employees?search=${search}&sortBy=${sortBy}&sortByDescending=${sortDesc}&page=${page}&pageSize=${pageSize}`
        )
            .then(async (res) => {
                if (!res.ok) {
                    throw new Error(`Błąd HTTP: ${res.status}`);
                }

                const text = await res.text();
                return text ? JSON.parse(text) : [];
            })
            .then((data) => {
                setEmployees(data.items);
                setTotalCount(data.totalCount);
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [page, pageSize, search, sortBy, sortDesc]);

    const totalPages = Math.ceil(totalCount / pageSize);

    if (loading) return <p>Ładowanie danych...</p>;
    if (error) return <p style={{ color: "red" }}>Błąd: {error}</p>;

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
            {/* 🔍 Wyszukiwanie */}
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
            {employees.length === 0 ? (
                <p>Brak pracowników w bazie danych.</p>
            ) : (
                <table
                    style={{
                        width: "100%",
                        borderCollapse: "collapse",
                    }}
                >
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
            {/* 📄 Paginacja */}
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
