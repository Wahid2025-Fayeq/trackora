import { useRef } from "react";
import { Search, X } from "lucide-react";
import "./SearchBar.css";

function SearchBar({ searchTerm, setSearchTerm }) {
  const inputRef = useRef(null);

  const handleSearchClick = () => {
    inputRef.current?.focus();
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    inputRef.current?.focus();
  };

  return (
    <div className="search-bar">
      <button
        className="search-bar__search-button"
        type="button"
        aria-label="Focus search"
        onClick={handleSearchClick}
      >
        <Search size={20} />
      </button>

      <input
        ref={inputRef}
        className="search-bar__input"
        type="text"
        placeholder="Search jobs..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        aria-label="Search jobs"
      />

      {searchTerm && (
        <button
          className="search-bar__clear-button"
          type="button"
          aria-label="Clear search"
          onClick={handleClearSearch}
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
}

export default SearchBar;
