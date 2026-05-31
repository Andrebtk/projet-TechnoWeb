import { useEffect, useState } from "react";
import SearchZone from "./SearchZone";
import NewMessageForm from "./NewMessageForm";
import MessageList from "./MessageList";

const API_URL = "http://localhost:3001";

function ForumPage({ isConnected, currentUser }) {
  const [messages, setMessages] = useState([]);
  const [info, setInfo] = useState("");

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

  const handleSearch = async (keyword) => {
    if (!keyword) {
      loadMessages();
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/messages/search?q=${encodeURIComponent(keyword)}`,
        {
          credentials: "include",
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessages(data);
      } else {
        setInfo(data.message || "Erreur lors de la recherche.");
      }
    } catch (error) {
      console.error("Erreur recherche :", error);
      setInfo("Impossible d'effectuer la recherche.");
    }
  };

  const handleCreateMessage = async ({ title, text }) => {
    try {
      const response = await fetch(`${API_URL}/api/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ title, text }),
      });

      const data = await response.json();

      if (response.ok) {
        setInfo(data.message || "Message posté.");
        loadMessages();
      } else {
        setInfo(data.message || "Erreur lors de l'envoi du message.");
      }
    } catch (error) {
      console.error("Erreur création message :", error);
      setInfo("Impossible de créer le message.");
    }
  };

  return (
    <section className="page-card">
      <h2>Forum</h2>

      {currentUser && (
        <p className="connected-user">
          Utilisateur : {currentUser.prenom} {currentUser.nom}
        </p>
      )}

      <SearchZone onSearch={handleSearch} onReset={loadMessages} />

      {isConnected ? (
        <NewMessageForm onSubmitMessage={handleCreateMessage} />
      ) : (
        <p className="warning">
          Connectez-vous pour publier un nouveau message.
        </p>
      )}

      {info && <p className="info-message">{info}</p>}

      <MessageList
        messages={messages}
        isConnected={isConnected}
        onRefresh={loadMessages}
      />
    </section>
  );
}

export default ForumPage;