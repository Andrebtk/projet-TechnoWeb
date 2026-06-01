import { useState } from "react";

function SearchZone({ onSearch, onReset }) {
	const [keyword, setKeyword] = useState("");
	const [author, setAuthor] = useState("");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");


	const handleSubmit = (event) => {
		event.preventDefault();
		onSearch({ keyword, author, startDate, endDate });
	};

	const handleReset = () => {
		setKeyword("");
		setAuthor("");
		setStartDate("");
		setEndDate("");
		onReset();
	};

	return (
		<form className="search-zone" onSubmit={handleSubmit} style={{ gridTemplateColumns: "1fr 1fr", gap: "15px", background: "#fafafa", padding: "15px", borderRadius: "8px", border: "1px solid #ddd" }}>
		
		<div style={{ display: "flex", flexDirection: "column" }}>
			<label htmlFor="search">Mot-clé</label>
			<input id="search" type="text" value={keyword} placeholder="Que cherchez-vous ?" onChange={(e) => setKeyword(e.target.value)} />
		</div>

		<div style={{ display: "flex", flexDirection: "column" }}>
			<label htmlFor="author">Auteur (Login)</label>
			<input id="author" type="text" value={author} placeholder="Ex: alice" onChange={(e) => setAuthor(e.target.value)} />
		</div>

		<div style={{ display: "flex", flexDirection: "column" }}>
			<label htmlFor="startDate">Date de début</label>
			<input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
		</div>

		<div style={{ display: "flex", flexDirection: "column" }}>
			<label htmlFor="endDate">Date de fin</label>
			<input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
		</div>

		<div style={{ gridColumn: "span 2", display: "flex", gap: "10px", marginTop: "10px" }}>
			<button type="submit" style={{ flex: 1 }}>Rechercher</button>
			<button type="button" onClick={handleReset} style={{ flex: 1, background: "#ccc", color: "#333" }}>Réinitialiser</button>
		</div>
		</form>
	);
}

export default SearchZone;