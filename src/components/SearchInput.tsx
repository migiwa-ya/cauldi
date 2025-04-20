import { useState, useEffect } from 'react';

type Suggestion = {
  name: string;
  slug?: string;
  id?: number;
};

const SearchInput = () => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [data, setData] = useState<{ herbs: Suggestion[]; tags: Suggestion[] }>({ herbs: [], tags: [] });

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/data.json');
      const jsonData = await response.json();
      setData(jsonData);
    };
    fetchData();
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);
    if (value) {
      const filteredHerbs = data.herbs.filter((herb) => herb.name.toLowerCase().includes(value.toLowerCase()));
      const filteredTags = data.tags.filter((tag) => tag.name.toLowerCase().includes(value.toLowerCase()));
      setSuggestions([...filteredHerbs, ...filteredTags]);
    } else {
      setSuggestions([]);
    }
  };

  return (
    <div>
      <input type="text" value={inputValue} onChange={handleInputChange} placeholder="Search herbs or tags..." />
      <ul>
        {suggestions.map((suggestion) => (
          <li key={suggestion.slug || `tag-${suggestion.id}`} onClick={() => window.location.href = suggestion.slug ? `/herbs/${suggestion.slug}/` : `/tags/${suggestion.id}/`}>
            {suggestion.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchInput;
