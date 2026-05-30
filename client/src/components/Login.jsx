import { useState } from "react";

function Login({ onLogin }) {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!login || !password) {
      alert("Veuillez saisir un login et un mot de passe.");
      return;
    }

    onLogin(login, password);
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <label htmlFor="login">Login</label>
      <input
        id="login"
        type="text"
        value={login}
        onChange={(event) => setLogin(event.target.value)}
      />

      <label htmlFor="password">Mot de passe</label>
      <input
        id="password"
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />

      <button type="submit">Connexion</button>
    </form>
  );
}

export default Login;