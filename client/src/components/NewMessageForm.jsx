import { useState } from "react";

function NewMessageForm({ onSubmitMessage }) {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!text) {
      alert("Le texte du message est obligatoire.");
      return;
    }

    onSubmitMessage({ title, text });

    setTitle("");
    setText("");
  };

  return (
    <form className="new-message-form" onSubmit={handleSubmit}>
      <h3>Nouveau message</h3>

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