import { useEffect, useState } from "react";
import MessageList from "./MessageList";

const API_URL = "http://localhost:3001";

function PublicProfile({ login, isConnected, currentUser, onBack }) {
	const [messages, setMessages] = useState([]);
	const [userProfile, setUserProfile] = useState(null);
	const [info, setInfo] = useState("");

	useEffect(() => {
	loadUserProfile();
	loadUserMessages();
	}, [login]);

	const loadUserProfile = async () => {
	try {

		const response = await fetch(`${API_URL}/api/users`, { credentials: "include" });
		if (response.ok) {
		const allUsers = await response.json();

		const foundUser = allUsers.find(u => u.login === login);
		
		if (foundUser) {
			setUserProfile(foundUser);
		} else {
			setUserProfile({ prenom: "Utilisateur", nom: "Inconnu", role: "user" });
		}
		}
	} catch (error) {
		console.error("Impossible de charger les infos de l'utilisateur");
	}
	};

	const loadUserMessages = async () => {
	try {
		const response = await fetch(`${API_URL}/api/users/${login}/messages`, { credentials: "include" });
		const data = await response.json();
		if (response.ok) { setMessages(data); setInfo(""); }
		else setInfo(data.message || "Erreur lors du chargement du profil.");
	} catch (error) { setInfo("Impossible de charger les messages."); }
	};

	return (
		<div className="page-card" style={{ padding: "20px" }}>
			<button onClick={onBack} style={{ marginBottom: "20px", background: "#666", color: "white", padding: "8px 15px", borderRadius: "5px", border: "none", cursor: "pointer" }}>
			⬅ Retour au forum
			</button>
			
			<div style={{ borderBottom: "2px solid #1f4e79", paddingBottom: "20px", marginBottom: "20px" }}>
			<h2 style={{ color: "#1f4e79", marginTop: 0 }}>Profil de {login}</h2>
			
			<div style={{ background: "#f4f4f4", padding: "15px", borderRadius: "8px", marginTop: "15px", border: "1px solid #ddd" }}>
				<p style={{ margin: "5px 0" }}>
				<strong>Prénom & Nom :</strong> {userProfile ? `${userProfile.prenom} ${userProfile.nom}` : "Chargement..."}
				</p>
				
				<p style={{ margin: "5px 0" }}>
				<strong>Login :</strong> {login}
				</p>

				<p style={{ margin: "5px 0" }}>
					<strong>Âge :</strong> {userProfile && userProfile.age ? `${userProfile.age} ans` : "Non renseigné"}
				</p>

				<p style={{ margin: "5px 0" }}>
				<strong>Rôle :</strong> {userProfile ? (userProfile.role === "admin" ? "Administrateur" : "Membre") : "..."}
				</p>
			</div>
			</div>

			<h3 style={{ color: "#333", marginBottom: "15px" }}>Messages publiés ({messages.length})</h3>
			
			{info && <p className="info-message">{info}</p>}
			
			<MessageList 
				messages={messages} 
				isConnected={isConnected} 
				currentUser={currentUser} 
				onRefresh={loadUserMessages} 
			/>
		</div>
	);
}

export default PublicProfile;