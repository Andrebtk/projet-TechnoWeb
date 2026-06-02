import { useEffect, useState } from "react";
import SearchZone from "./SearchZone";
import NewMessageForm from "./NewMessageForm";
import MessageList from "./MessageList";
import PublicProfile from "./PublicProfile";


const API_URL = "http://localhost:3001";

function ForumPage({ isConnected, currentUser, activeTab, setActiveTab }) {
	const [messages, setMessages] = useState([]);

	const [searchResults, setSearchResults] = useState([]);
	const [hasSearched, setHasSearched] = useState(false);

	const [info, setInfo] = useState("");

	const [selectedUser, setSelectedUser] = useState(null);

	useEffect(() => {
		loadMessages();
	}, [activeTab]);

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
		
		{/* Les anciens boutons onglets ont été supprimés ! */}
		
		{info && <p className="info-message">{info}</p>}

		{activeTab === "list" && (
			<>
				<h2 style={{marginTop: 0, color: "#1f4e79"}}>Forum Public</h2>
				<MessageList 
					messages={publicMessages} 
					isConnected={isConnected} 
					currentUser={currentUser} 
					onRefresh={loadMessages}
					onAuthorClick={(login) => { setSelectedUser(login); setActiveTab("public_profile"); }}
				/>
			</>
		)}

		{activeTab === "private" && (
			<>
				<h2 style={{marginTop: 0, color: "#d9534f"}}>Forum Privé</h2>
				<MessageList 
					messages={privateMessages} 
					isConnected={isConnected} 
					currentUser={currentUser} 
					onRefresh={loadMessages} 
					onAuthorClick={(login) => { setSelectedUser(login); setActiveTab("public_profile"); }}
				/>
			</>
		)}

		{activeTab === "search" && (
			<>
			<h2 style={{marginTop: 0, color: "#1f4e79"}}>Recherche avancée</h2>
			<SearchZone onSearch={handleSearch} onReset={() => { setHasSearched(false); setSearchResults([]); setInfo(""); }} />
			
			{hasSearched ? (
				<>
				<h3 style={{marginTop: "20px"}}>Résultats :</h3>
				<MessageList 
					messages={searchResults} 
					isConnected={isConnected} 
					currentUser={currentUser} 
					onRefresh={() => { loadMessages(); setHasSearched(false); setActiveTab("list"); }} 
					onAuthorClick={(login) => { setSelectedUser(login); setActiveTab("public_profile"); }}
				/>
				</>
			) : (
				<p style={{ marginTop: "20px", color: "#666", fontStyle: "italic", textAlign: "center" }}>
					Utilisez le formulaire ci-dessus pour lancer une recherche.
				</p>
			)}
			</>
		)}

		{activeTab === "new" && (
			<NewMessageForm 
				onSubmitMessage={handleCreateMessage} 
				currentUser={currentUser}
			/>
		)}

		{activeTab === "public_profile" && selectedUser && (
			<PublicProfile 
				login={selectedUser} 
				isConnected={isConnected} 
				currentUser={currentUser} 
				onBack={() => setActiveTab("list")} 
			/>
		)}

		</section>
	);
}

export default ForumPage;