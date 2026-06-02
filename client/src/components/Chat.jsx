import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3001", {
  withCredentials: true,
  autoConnect: false 
});

function Chat({ currentUser }) {
	// On sépare les messages en deux listes
	const [publicMessages, setPublicMessages] = useState([]);
	const [adminMessages, setAdminMessages] = useState([]);

	const [currentText, setCurrentText] = useState("");
	const [isOpen, setIsOpen] = useState(false);

	// Onglet actif ('public' ou 'admin')
	const [activeTab, setActiveTab] = useState("public"); 

	useEffect(() => {
		socket.connect();


		socket.emit('join_chat', { role: currentUser.role });

		// Écoute des messages entrants
		socket.on("reception_message", (messageData) => {
			if (messageData.room === 'admin') {
				setAdminMessages((prev) => [...prev, messageData]);
			} else {
				setPublicMessages((prev) => [...prev, messageData]);
			}
		});

		return () => {
			socket.off("reception_message");
			socket.disconnect();
		};
	}, [currentUser]);

	const handleSendMessage = (e) => {
		e.preventDefault();
		if (!currentText.trim()) return;

		// On prépare le message en précisant la Room (publique ou admin)
		const messageData = {
			author: currentUser.login,
			text: currentText,
			time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
			room: activeTab 
		};

		// On l'envoie au serveur
		socket.emit("nouveau_message", messageData);
		setCurrentText("");
	};

	const chatContainerStyle = {
		position: "fixed", bottom: "20px", right: "20px", width: "320px",
		background: "white", border: "1px solid #1f4e79", borderRadius: "10px",
		boxShadow: "0 4px 15px rgba(0,0,0,0.2)", display: "flex", flexDirection: "column",
		overflow: "hidden", zIndex: 1000
	};

	const headerStyle = {
		background: activeTab === 'admin' ? "#d9534f" : "#1f4e79", 
		color: "white", padding: "10px", fontWeight: "bold",
		cursor: "pointer", display: "flex", justifyContent: "space-between"
	};

	// Liste des messages à afficher selon l'onglet
	const displayedMessages = activeTab === 'admin' ? adminMessages : publicMessages;

	if (!isOpen) {
	return (
		<div style={{ position: "fixed", bottom: "20px", right: "20px", zIndex: 1000 }}>
		<button onClick={() => setIsOpen(true)} style={{ borderRadius: "50px", padding: "15px 20px", boxShadow: "0 4px 10px rgba(0,0,0,0.2)", fontSize: "1.1em" }}>
			Chats
		</button>
		</div>
	);
	}

	return (
	<div style={chatContainerStyle}>
		{/* En-tête cliquable pour fermer */}
		<div style={headerStyle} onClick={() => setIsOpen(false)}>
		<span>{activeTab === 'admin' ? 'Chat Admin' : 'Chat Public'}</span>
		<span>▼</span>
		</div>

		{/* Onglets de navigation (Visibles que par les admins) */}
		{currentUser?.role === 'admin' && (
		<div style={{ display: "flex", background: "#f0f0f0", borderBottom: "1px solid #ddd" }}>
			<button 
				onClick={() => setActiveTab('public')} 
				style={{ flex: 1, padding: "8px", background: activeTab === 'public' ? "white" : "transparent", color: "#333", borderRadius: 0, fontWeight: activeTab === 'public' ? "bold" : "normal" }}>
				Public
			</button>
			<button 
				onClick={() => setActiveTab('admin')} 
				style={{ flex: 1, padding: "8px", background: activeTab === 'admin' ? "white" : "transparent", color: "#d9534f", borderRadius: 0, fontWeight: activeTab === 'admin' ? "bold" : "normal" }}>
				Admin
			</button>
		</div>
		)}

		{/* Zone des messages */}
		<div style={{ height: "250px", overflowY: "auto", padding: "10px", display: "flex", flexDirection: "column", gap: "10px", background: "#f9f9f9" }}>
		{displayedMessages.length === 0 && (
			<p style={{ textAlign: "center", color: "#888", fontSize: "0.9em", marginTop: "20px" }}>
				Aucun message dans ce canal.
			</p>
		)}
		
		{displayedMessages.map((msg, index) => {
			const isMe = msg.author === currentUser.login;
			return (
			<div key={index} style={{ alignSelf: isMe ? "flex-end" : "flex-start", background: isMe ? "#d1e7dd" : "#e2e3e5", padding: "8px", borderRadius: "8px", maxWidth: "85%" }}>
				{!isMe && <span style={{ fontWeight: "bold", fontSize: "0.8em", color: activeTab === 'admin' ? "#d9534f" : "#1f4e79", display: "block" }}>{msg.author}</span>}
				<span style={{ fontSize: "0.9em" }}>{msg.text}</span>
				<span style={{ fontSize: "0.7em", color: "#666", display: "block", textAlign: "right", marginTop: "4px" }}>{msg.time}</span>
			</div>
			);
		})}
		</div>

		{/* Formulaire d'envoi */}
		<form onSubmit={handleSendMessage} style={{ display: "flex", borderTop: "1px solid #ddd" }}>
		<input 
			type="text" 
			value={currentText} 
			onChange={(e) => setCurrentText(e.target.value)} 
			placeholder={activeTab === 'admin' ? "Message secret..." : "Message public..."} 
			style={{ flex: 1, border: "none", padding: "10px", outline: "none" }} 
		/>
		<button type="submit" style={{ borderRadius: "0", background: activeTab === 'admin' ? "#d9534f" : "#1f4e79", padding: "0 15px" }}>
			Envoyer
		</button>
		</form>
	</div>
	);
}

export default Chat;