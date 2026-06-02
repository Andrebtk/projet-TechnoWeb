import { useEffect, useState } from "react";
import NavigationPanel from "./NavigationPanel";
import Signin from "./Signin";
import ForumPage from "./ForumPage";
import AdminPanel from "./AdminPanel";
import Profile from "./Profile";
import Chat from "./Chat";

const API_URL = "http://localhost:3001";

function MainPage() {
	const [isConnected, setIsConnected] = useState(false);
	const [currentUser, setCurrentUser] = useState(null);

	const [forumTab, setForumTab] = useState("list");
	const [page, setPage] = useState("forum_page");
	const [message, setMessage] = useState("");

	useEffect(() => {
	checkSession();
	}, []);

	const checkSession = async () => {
		try {
			const response = await fetch(`${API_URL}/api/auth/me`, {
			credentials: "include",
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
		credentials: "include",
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
			credentials: "include",
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
				onGoForum={(tab) => { setPage("forum_page"); setForumTab(tab); }}
				onGoSignin={() => setPage("signin_page")}
				onGoAdmin={() => setPage("admin_page")}
				onGoProfile={() => setPage("profile_page")}
				currentPage={page}        
				currentTab={forumTab}     
			/>

			{message && <p className="info-message">{message}</p>}

			<main className="main-content">
				{page === "signin_page" && <Signin onSigninSuccess={handleSigninSuccess} />}
				{page === "forum_page" && (
					<ForumPage 
						isConnected={isConnected} 
						currentUser={currentUser} 
						activeTab={forumTab}         // <-- On l'envoie au Forum
						setActiveTab={setForumTab}   // <-- On permet au forum de le changer (ex: clic sur auteur)
					/>
				)}
				{page === "admin_page" && <AdminPanel currentUser={currentUser} />}
				{page === "profile_page" && <Profile currentUser={currentUser} />}
			</main>

			{isConnected && <Chat currentUser={currentUser} />}
		</div>
	);
}

export default MainPage;