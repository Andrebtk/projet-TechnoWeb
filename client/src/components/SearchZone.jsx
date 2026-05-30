import { useState } from "react";

function SearchZone({ onSearch, onReset }) {
  const [keyword, setKeyword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch(keyword);
  };

  const handleReset = () => {
    setKeyword("");
    onReset();
  };

  return (
    <form className="search-zone" onSubmit={handleSubmit}>
      <label htmlFor="search">Rechercher un message</label>
      <input
        id="search"
        type="text"
        value={keyword}
        placeholder="Mot-clé"
        onChange={(event) => setKeyword(event.target.value)}
      />

      <button type="submit">Rechercher</button>
      <button type="button" onClick={handleReset}>
        Réinitialiser
      </button>
    </form>
  );
}

export default SearchZone;