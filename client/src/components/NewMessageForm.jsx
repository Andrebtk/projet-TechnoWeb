import { useState } from "react";

function NewMessageForm({ onSubmitMessage, currentUser }) {
	const [title, setTitle] = useState("");
	const [text, setText] = useState("");

	const [forumId, setForumId] = useState("forum_ouvert");
	
	const handleSubmit = (event) => {
		event.preventDefault();

		if (!text) {
			alert("Le texte du message est obligatoire.");
			return;
		}

		onSubmitMessage({ title, text, forum_id: forumId });

		setTitle("");
		setText("");
		setForumId("forum_ouvert");
	};

	return (
		<form className="new-message-form" onSubmit={handleSubmit}>
			<h3>Nouveau message</h3>

			{currentUser && currentUser.role === "admin" && (
			<>
				<label htmlFor="forum-select" style={{ fontWeight: "bold", color: "#d9534f" }}>
				Destination (Mode Administrateur)
				</label>
				<select 
				id="forum-select" 
				value={forumId} 
				onChange={(e) => setForumId(e.target.value)}
				style={{ padding: "0.6rem", borderRadius: "6px", border: "1px solid #ccc", marginBottom: "10px", background: "#fff3cd" }}
				>
				<option value="forum_ouvert">Forum Ouvert (Visible par tous les membres)</option>
				<option value="forum_ferme">Forum Fermé (Réservé aux Administrateurs)</option>
				</select>
			</>
			)}

			<label htmlFor="message-title">Titre</label>
			<input
			id="message-title"
			type="text"
			value={title}
			onChange={(event) => setTitle(event.target.value)}
			/>

			<label htmlFor="message-text">Message *</label>
			<textarea
			id="message-text"
			value={text}
			onChange={(event) => setText(event.target.value)}
			/>

			<button type="submit">Publier</button>
		</form>
	);
}

export default NewMessageForm;