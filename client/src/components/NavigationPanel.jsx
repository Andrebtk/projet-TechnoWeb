import Login from "./Login";
import Logout from "./Logout";

function NavigationPanel({
	isConnected,
	currentUser,
	onLogin,
	onLogout,
	onGoForum,
	onGoSignin,
	onGoAdmin,
	onGoProfile,
	currentPage,
	currentTab
}) {

	const navBtnStyle = (pageName, tabName = null) => {
		const isActive = currentPage === pageName && (!tabName || currentTab === tabName);
		return {
			background: isActive ? "#1f4e79" : "inherit", // Bleu foncé si actif
			color: isActive ? "white" : "inherit",
			fontWeight: isActive ? "bold" : "normal",
			border: "1px solid #ddd",
			marginRight: "5px"
		};
	};

	return (
		<nav className="navigation" style={{ display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center" }}>
			
			{/* Les nouveaux boutons du Forum */}
			<button type="button" onClick={() => onGoForum("list")} style={navBtnStyle("forum_page", "list")}>
				Forum Public
			</button>

			{isConnected && currentUser?.role === "admin" && (
				<button type="button" onClick={() => onGoForum("private")} style={navBtnStyle("forum_page", "private")}>
					Forum Privé
				</button>
			)}

			<button type="button" onClick={() => onGoForum("search")} style={navBtnStyle("forum_page", "search")}>
				Recherche
			</button>

			{isConnected && (
				<button type="button" onClick={() => onGoForum("new")} style={navBtnStyle("forum_page", "new")}>
					Nouveau message
				</button>
			)}

			{/* Un petit séparateur visuel */}
			<div style={{ flex: 1 }}></div> 

			{/* Les autres boutons (Profil, Admin, etc) */}
			{isConnected && (
				<button type="button" onClick={onGoProfile} style={{ ...navBtnStyle("profile_page"), background: currentPage === "profile_page" ? "#31b0d5" : "#5bc0de", color: "white" }}>
					Mon Profil
				</button>
			)}

			{isConnected && currentUser?.role === "admin" && (
				<button type="button" onClick={onGoAdmin} style={{ ...navBtnStyle("admin_page"), background: currentPage === "admin_page" ? "#ec971f" : "#f0ad4e", color: "white" }}>
					Administration
				</button>
			)}

			{!isConnected && (
				<button type="button" onClick={onGoSignin} style={navBtnStyle("signin_page")}>
					Créer un compte
				</button>
			)}

			<div className="navigation-auth">
			{isConnected ? (
				<Logout currentUser={currentUser} onLogout={onLogout} />
			) : (
				<Login onLogin={onLogin} />
			)}
			</div>
		</nav>
	);
}

export default NavigationPanel;