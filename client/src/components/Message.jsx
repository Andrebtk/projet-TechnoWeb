import { useState } from "react";

const API_URL = "http://localhost:3001";

function Message({ message, isConnected, onRefresh }) {
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [info, setInfo] = useState("");

  const messageId = message._id || message.id;

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
          // credentials: "include",
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

  return (
    <article className="message-card">
      <h3>{message.title || "Sans titre"}</h3>

      <p>{message.text || message.content}</p>

      {message.author && <p className="message-meta">Auteur : {message.author}</p>}
      {message.date && <p className="message-meta">Date : {message.date}</p>}

      {isConnected && (
        <button
          type="button"
          onClick={() => setShowCommentForm(!showCommentForm)}
        >
          Répondre
        </button>
      )}

      {showCommentForm && (
        <form className="comment-form" onSubmit={handleAddComment}>
          <label htmlFor={`comment-${messageId}`}>Commentaire</label>
          <textarea
            id={`comment-${messageId}`}
            value={commentText}
            onChange={(event) => setCommentText(event.target.value)}
          />

          <button type="submit">Envoyer</button>
        </form>
      )}

      {info && <p className="info-message">{info}</p>}

      {message.comments && message.comments.length > 0 && (
        <div className="comments">
          <h4>Commentaires</h4>
          {message.comments.map((comment, index) => (
            <p key={comment._id || index} className="comment">
              {comment.text || comment.content}
            </p>
          ))}
        </div>
      )}
    </article>
  );
}

export default Message;