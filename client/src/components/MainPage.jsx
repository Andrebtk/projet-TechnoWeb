import { useEffect, useState } from "react";
import NavigationPanel from "./NavigationPanel";
import Signin from "./Signin";
import ForumPage from "./ForumPage";

const API_URL = "http://localhost:3001";

function MainPage() {
  const [isConnected, setIsConnected] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [page, setPage] = useState("forum_page");
  const [message, setMessage] = useState("");

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const response = await fetch(`${API_URL}/api/auth/me`, {
        //credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setIsConnected(true);
        setCurrentUser(data.user);
      } else {
        setIsConnected(false);
        setCurrentUser(null);
      }
    } catch (error) {
      console.error("Erreur session :", error);
      setIsConnected(false);
      setCurrentUser(null);
    }
  };

  const handleLogin = async (login, password) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ login, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsConnected(true);
        setCurrentUser(data.user);
        setMessage("Connexion réussie.");
        setPage("forum_page");
      } else {
        setMessage(data.message || "Erreur de connexion.");
      }
    } catch (error) {
      console.error("Erreur login :", error);
      setMessage("Impossible de se connecter au serveur.");
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(`${API_URL}/api/auth/logout`, {
        //credentials: "include",
      });

      if (response.ok) {
        setIsConnected(false);
        setCurrentUser(null);
        setMessage("Déconnexion réussie.");
        setPage("forum_page");
      }
    } catch (error) {
      console.error("Erreur logout :", error);
      setMessage("Erreur lors de la déconnexion.");
    }
  };

  const handleSigninSuccess = () => {
    setMessage("Compte créé. Vous pouvez maintenant vous connecter.");
    setPage("forum_page");
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Organiz'Asso</h1>
        <p>Forum associatif</p>
      </header>

      <NavigationPanel
        isConnected={isConnected}
        currentUser={currentUser}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onGoForum={() => setPage("forum_page")}
        onGoSignin={() => setPage("signin_page")}
      />

      {message && <p className="info-message">{message}</p>}

      <main className="main-content">
        {page === "signin_page" ? (
          <Signin onSigninSuccess={handleSigninSuccess} />
        ) : (
          <ForumPage isConnected={isConnected} currentUser={currentUser} />
        )}
      </main>
    </div>
  );
}

export default MainPage;