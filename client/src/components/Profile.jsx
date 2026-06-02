import { useEffect, useState } from "react";
import MessageList from "./MessageList";

const API_URL = "http://localhost:3001";

function Profile({ currentUser }) {
	const [messages, setMessages] = useState([]);
	const [info, setInfo] = useState("");

	const loadUserMessages = async () => {
		try {
			const response = await fetch(`${API_URL}/api/users/${currentUser.login}/messages`, {
			credentials: "include",
			});
			if (response.ok) {
			const data = await response.json();
			setMessages(data);
			} else {
			setInfo("Erreur lors du chargement de l'historique.");
			}
		} catch (error) {
			setInfo("Impossible de contacter le serveur.");
		}
	};

	useEffect(() => {
		loadUserMessages();
	}, []);

	return (
		<section className="page-card">
			<h2>Mon Profil</h2>
			
			<div style={{ background: "#f9f9f9", padding: "15px", borderRadius: "8px", marginBottom: "20px" }}>
				<p><strong>Prénom & Nom :</strong> {currentUser.prenom} {currentUser.nom}</p>
				<p><strong>Login :</strong> {currentUser.login}</p>

				<p><strong>Âge :</strong> {currentUser.age ? `${currentUser.age} ans` : "Non renseigné"}</p>

				<p><strong>Rôle :</strong> {currentUser.role === 'admin' ? 'Administrateur' : 'Membre'}</p>
			</div>

			<h3>Mes messages publiés ({messages.length})</h3>
			{info && <p className="info-message">{info}</p>}

			<MessageList
				messages={messages}
				isConnected={true}
				currentUser={currentUser}
				onRefresh={loadUserMessages}
			/>
		</section>
	);
}

export default Profile;