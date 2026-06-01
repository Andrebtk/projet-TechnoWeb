import { useEffect, useState } from "react";
import SearchZone from "./SearchZone";
import NewMessageForm from "./NewMessageForm";
import MessageList from "./MessageList";

const API_URL = "http://localhost:3001";

function ForumPage({ isConnected, currentUser }) {
	const [messages, setMessages] = useState([]);

	const [searchResults, setSearchResults] = useState([]);
	const [hasSearched, setHasSearched] = useState(false);

	const [info, setInfo] = useState("");
	const [activeTab, setActiveTab] = useState("list");

	useEffect(() => {
		loadMessages();
	}, []);

	const loadMessages = async () => {
		try {
			const response = await fetch(`${API_URL}/api/messages`, {
				credentials: "include",
			});

			const data = await response.json();

			if (response.ok) {
				setMessages(data);
			} else {
				setInfo(data.message || "Erreur lors du chargement des messages.");
			}
		} catch (error) {
			console.error("Erreur chargement messages :", error);
			setInfo("Impossible de charger les messages.");
		}
	};

	const handleSearch = async (filters) => {
		try {
			const params = new URLSearchParams();
			if (filters.keyword) params.append("q", filters.keyword);
			if (filters.author) params.append("author", filters.author);
			if (filters.startDate) params.append("startDate", filters.startDate);
			if (filters.endDate) params.append("endDate", filters.endDate);

			if (params.toString() === "") {
				setHasSearched(false);
				setSearchResults([]);
				setInfo("Veuillez saisir au moins un critère de recherche.");
				return;
			}

			const response = await fetch(`${API_URL}/api/messages/search?${params.toString()}`, {
				credentials: "include",
			});
			const data = await response.json();

			if (response.ok) { 
				setSearchResults(data); 
				setHasSearched(true);
				setInfo(`Recherche terminée : ${data.length} résultat(s) trouvé(s).`);
			} 
			else setInfo(data.message || "Erreur lors de la recherche.");
		} catch (error) {
			setInfo("Impossible d'effectuer la recherche.");
		}
	};

	const handleCreateMessage = async ({ title, text, forum_id }) => {
		try {
			const response = await fetch(`${API_URL}/api/messages`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify({ title, text, forum_id }),
			});

			const data = await response.json();

			if (response.ok) {
				setInfo(data.message || "Message posté.");
				loadMessages();
				setActiveTab(forum_id === "forum_ferme" ? "private" : "list");
			} else {
				setInfo(data.message || "Erreur lors de l'envoi du message.");
			}
			
		} catch (error) {
			console.error("Erreur création message :", error);
			setInfo("Impossible de créer le message.");
		}
	};

	const tabStyle = (tabName) => ({
		background: activeTab === tabName ? "#1f4e79" : "#e0e0e0",
		color: activeTab === tabName ? "white" : "#333",
		flex: 1, borderRadius: "8px 8px 0 0", padding: "10px", margin: "0 5px", cursor: "pointer",
		fontWeight: activeTab === tabName ? "bold" : "normal"
	});

	// 3. Séparation des messages en deux listes
	const publicMessages = messages.filter(m => m.forum_id !== "forum_ferme");
	const privateMessages = messages.filter(m => m.forum_id === "forum_ferme");

	return (
		<section className="page-card">
		<h2>Forum Associatif</h2>

		{/* Menu des Onglets */}
		<div style={{ display: "flex", borderBottom: "2px solid #1f4e79", marginBottom: "20px" }}>
			
			<button style={tabStyle("list")} onClick={() => { setActiveTab("list"); loadMessages(); }}>
				Forum Public
			</button>

			{/* Onglet Privé : Visible uniquement par les administrateurs */}
			{isConnected && currentUser?.role === "admin" && (
				<button style={tabStyle("private")} onClick={() => { setActiveTab("private"); loadMessages(); }}>
					Forum Privé 
				</button>
			)}

			<button style={tabStyle("search")} onClick={() => setActiveTab("search")}>
				Recherche avancée
			</button>

			{isConnected && (
				<button style={tabStyle("new")} onClick={() => setActiveTab("new")}>
					Nouveau message
				</button>
			)}
		</div>

		{info && <p className="info-message">{info}</p>}

		{/* Onglet 1 : Forum Public */}
		{activeTab === "list" && (
			<MessageList 
				messages={publicMessages} 
				isConnected={isConnected} 
				currentUser={currentUser} 
				onRefresh={loadMessages} 
			/>
		)}

		{/* Onglet 2 : Forum Privé */}
		{activeTab === "private" && (
			<MessageList 
				messages={privateMessages} 
				isConnected={isConnected} 
				currentUser={currentUser} 
				onRefresh={loadMessages} 
			/>
		)}

		{/* Onglet 3 : Recherche */}
		{activeTab === "search" && (
			<>
			<SearchZone onSearch={handleSearch} onReset={() => { setHasSearched(false); setSearchResults([]); setInfo(""); }} />
			
			{hasSearched ? (
				<>
				<h3 style={{marginTop: "20px"}}>Résultats :</h3>
				<MessageList 
					messages={searchResults} 
					isConnected={isConnected} 
					currentUser={currentUser} 
					onRefresh={() => { loadMessages(); setHasSearched(false); setActiveTab("list"); }} 
				/>
				</>
			) : (
				<p style={{ marginTop: "20px", color: "#666", fontStyle: "italic", textAlign: "center" }}>
					Utilisez le formulaire ci-dessus pour lancer une recherche.
				</p>
			)}
			</>
		)}

		{/* Onglet 4 : Nouveau Message */}
		{activeTab === "new" && (
			<NewMessageForm 
				onSubmitMessage={handleCreateMessage} 
				currentUser={currentUser}
			/>
		)}
		</section>
	);
}

export default ForumPage;