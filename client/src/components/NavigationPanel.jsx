import Login from "./Login";
import Logout from "./Logout";

function NavigationPanel({
  isConnected,
  currentUser,
  onLogin,
  onLogout,
  onGoForum,
  onGoSignin,
}) {
  return (
    <nav className="navigation">
      <button type="button" onClick={onGoForum}>
        Forum
      </button>

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