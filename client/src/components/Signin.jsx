import { useState } from "react";

const API_URL = "http://localhost:3001";

function Signin({ onSigninSuccess }) {
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [age, setAge] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!prenom || !nom) {
      setMessage("Le prénom et le nom sont obligatoires.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prenom,
          nom,
          login,
          password,
          email,
          age: Number(age)
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || "Utilisateur créé.");
        onSigninSuccess();
      } else {
        setMessage(data.message || "Erreur lors de l'inscription.");
      }
    } catch (error) {
      console.error("Erreur inscription :", error);
      setMessage("Impossible de contacter le serveur.");
    }
  };

  return (
    <section className="page-card">
      <h2>Créer un compte</h2>

      {message && <p className="info-message">{message}</p>}

      <form className="form" onSubmit={handleSubmit}>
        <label htmlFor="prenom">Prénom *</label>
        <input
          id="prenom"
          type="text"
          value={prenom}
          onChange={(event) => setPrenom(event.target.value)}
        />

        <label htmlFor="nom">Nom *</label>
        <input
          id="nom"
          type="text"
          value={nom}
          onChange={(event) => setNom(event.target.value)}
        />

        <label htmlFor="signin-login">Login</label>
        <input
          id="signin-login"
          type="text"
          value={login}
          onChange={(event) => setLogin(event.target.value)}
        />

        <label htmlFor="signin-password">Mot de passe</label>
        <input
          id="signin-password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <label htmlFor="age">Âge</label>
        <input
            id="age"
            type="number"
            min="0"
            max="120"
            value={age}
            onChange={(event) => setAge(event.target.value)}
            placeholder="Ex: 19"
        />

        <button type="submit">Créer le compte</button>
      </form>
    </section>
  );
}

export default Signin;