function Logout({ currentUser, onLogout }) {
  return (
    <div className="logout-zone">
      <span>
        Connecté
        {currentUser ? ` : ${currentUser.prenom} ${currentUser.nom}` : ""}
      </span>

      <button type="button" onClick={onLogout}>
        Déconnexion
      </button>
    </div>
  );
}

export default Logout;