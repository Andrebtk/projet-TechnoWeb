import { useState } from "react";

const API_URL = "http://localhost:3001";

function Message({ message, isConnected, currentUser, onRefresh, onAuthorClick }) {
	const [showCommentForm, setShowCommentForm] = useState(false);
	const [commentText, setCommentText] = useState("");
	const [info, setInfo] = useState("");



	const [isEditing, setIsEditing] = useState(false);
	const [editText, setEditText] = useState(message.text || message.content);
	const [editTitle, setEditTitle] = useState(message.title || "");

	const messageId = message._id || message.id;


	const isAuthor = currentUser && currentUser.login === message.author;


	const handleAddComment = async (event) => {
		event.preventDefault();

		if (!commentText) {
			setInfo("Le commentaire ne peut pas être vide.");
			return;
		}

		try {
			const response = await fetch(
				`${API_URL}/api/messages/${messageId}/comments`,
				{
					method: "POST",
					headers: {
					"Content-Type": "application/json",
					},
					credentials: "include",
					body: JSON.stringify({ text: commentText }),
				}
			);

			const data = await response.json();

			if (response.ok) {
				setCommentText("");
				setShowCommentForm(false);
				setInfo(data.message || "Commentaire ajouté.");
				onRefresh();
			} else {
				setInfo(data.message || "Erreur lors de l'ajout du commentaire.");
			}
		} catch (error) {
			console.error("Erreur commentaire :", error);
			setInfo("Impossible d'ajouter le commentaire.");
		}
	};


	const handleDelete = async () => {
		if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce message ?")) return;
		try {
			const response = await fetch(`${API_URL}/api/messages/${messageId}`, {
				method: "DELETE",
				credentials: "include"
			});
			if (response.ok) onRefresh();
			else setInfo("Erreur lors de la suppression.");
		} catch (error) { setInfo("Impossible de supprimer."); }
	};

	const handleEdit = async () => {
		try {
			const response = await fetch(`${API_URL}/api/messages/${messageId}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				// NOUVEAU : On envoie title ET text
				body: JSON.stringify({ title: editTitle, text: editText })
			});
			if (response.ok) { setIsEditing(false); onRefresh(); }
			else setInfo("Erreur lors de la modification.");
		} catch (error) { setInfo("Impossible de modifier."); }
	};

	return (
		<article className="message-card">
		{/* Mode édition */}
		{isEditing ? (
			<div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "10px" }}>

			<input 
				type="text" 
				value={editTitle} 
				onChange={(e) => setEditTitle(e.target.value)} 
				placeholder="Titre du message"
				style={{ fontWeight: "bold", fontSize: "1.1em" }}
			/>
			<textarea value={editText} onChange={(e) => setEditText(e.target.value)} rows="4" />
			<div>
				<button onClick={handleEdit}>Valider</button>
				<button onClick={() => setIsEditing(false)} style={{marginLeft: "10px", background: "#ccc"}}>Annuler</button>
			</div>
			</div>
		) : (
			<>
				<h3>
					{message.title || "Sans titre"}
					{message.isEdited && (
						<span style={{ fontSize: "0.75rem", color: "#888", fontStyle: "italic", marginLeft: "10px", fontWeight: "normal" }}>
							(Modifié)
						</span>
					)}
				</h3>
				<p>{message.text || message.content}</p>
			</>
		)}

		{message.author && (
			<p className="message-meta">
				Auteur : 
				<button 
					onClick={() => onAuthorClick && onAuthorClick(message.author)} 
					style={{background: "none", border: "none", color: "#1f4e79", textDecoration: "underline", cursor: "pointer", padding: "0 5px", fontSize: "1em"}}
				>
					{message.author}
				</button>
			</p>
		)}
		
		{message.date && <p className="message-meta">Date : {new Date(message.date).toLocaleString()}</p>}

		{/* Boutons d'action */}
		<div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
			{isConnected && (
			<button type="button" onClick={() => setShowCommentForm(!showCommentForm)}>Répondre</button>
			)}
			
			{isAuthor && !isEditing && (
			<>
				<button type="button" onClick={() => setIsEditing(true)} style={{background: "#f0ad4e"}}>Modifier</button>
				<button type="button" onClick={handleDelete} style={{background: "#d9534f"}}>Supprimer</button>
			</>
			)}
		</div>

		{showCommentForm && (
			<form className="comment-form" onSubmit={handleAddComment}>
			<label htmlFor={`comment-${messageId}`}>Commentaire</label>
			<textarea id={`comment-${messageId}`} value={commentText} onChange={(e) => setCommentText(e.target.value)} />
			<button type="submit">Envoyer</button>
			</form>
		)}

		{info && <p className="info-message">{info}</p>}

		{/* Commentaires */}
		{message.comments && message.comments.length > 0 && (
			<div className="comments">
			<h4>Commentaires</h4>
			{message.comments.map((comment, index) => (
				<p key={comment._id || index} className="comment">
				<strong>{comment.author} : </strong> {comment.text || comment.content}
				</p>
			))}
			</div>
		)}
		</article>
	);

}

export default Message;