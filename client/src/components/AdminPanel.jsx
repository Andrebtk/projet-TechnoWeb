import { useEffect, useState } from "react";

const API_URL = "http://localhost:3001";

function AdminPanel({ currentUser }) {
	
	const [users, setUsers] = useState([]);
	const [message, setMessage] = useState("");

	useEffect(() => {
		loadUsers();
	}, []);

	const loadUsers = async () => {
	try {
		const response = await fetch(`${API_URL}/api/users`, {
			credentials: "include", 
		});
		if (response.ok) {
			const data = await response.json();
			setUsers(data);
		} else {
			setMessage("Erreur lors du chargement des utilisateurs.");
		}

	} catch (error) {
		console.error("Erreur :", error);
		setMessage("Impossible de contacter le serveur.");
	}
	};

	const handleValidate = async (userId, currentRole) => {
		try {
			const response = await fetch(`${API_URL}/api/users/${userId}/status`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({ isActive: true, role: currentRole }),
			});
			if (response.ok) {
				setMessage("Utilisateur validé avec succès.");
				loadUsers(); // On rafraîchit la liste
			}
		} catch (error) {
			setMessage("Erreur lors de la validation.");
		}
	};

	const handleChangeRole = async (userId, currentRole) => {
		const newRole = currentRole === "admin" ? "user" : "admin";
		try {
			const response = await fetch(`${API_URL}/api/users/${userId}/role`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({ role: newRole }),
			});
			if (response.ok) {
				setMessage(`Rôle modifié en ${newRole}.`);
				loadUsers();
			} else {
				const data = await response.json();
				setMessage(data.erreur || "Erreur lors du changement de rôle.");
			}
		} catch (error) {
			setMessage("Erreur lors de la modification du rôle.");
		}
	};

	return (
	<section className="page-card">
		<h2>Panneau d'Administration</h2>
		{message && <p className="info-message">{message}</p>}

		<div className="message-list">
		{users.map((user) => (
			<div key={user._id} className="message-card">
			<h3>{user.prenom} {user.nom} ({user.login})</h3>
			<p className="message-meta">Statut : {user.isActive ? "🟢 Actif" : "🔴 En attente"} | Rôle : {user.role}</p>
			
			<div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
				{!user.isActive && (
				<button onClick={() => handleValidate(user._id, user.role)}>
					Valider le compte
				</button>
				)}
				
				{user._id !== currentUser.id && (
				<button onClick={() => handleChangeRole(user._id, user.role)}>
					{user.role === "admin" ? "Rétrograder en User" : "Promouvoir Admin"}
				</button>
				)}
			</div>
			</div>
		))}
		</div>
	</section>
	);
}

export default AdminPanel;