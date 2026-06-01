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
	onGoProfile
}) {
	return (
	<nav className="navigation">
		<button type="button" onClick={onGoForum}>
			Forum
		</button>

		{isConnected && (
			<button type="button" onClick={onGoProfile} style={{ background: "#5bc0de" }}>
				Mon Profil
			</button>
		)}

		{isConnected && currentUser?.role === "admin" && (
			<button type="button" onClick={onGoAdmin} style={{ background: "#f0ad4e" }}>
				Administration
			</button>
		)}

		{!isConnected && (
		<button type="button" onClick={onGoSignin}>
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