import { useEffect, useState } from "react";

const getStoredValue = key => {
  const storedValue = localStorage.getItem(key);
  try {
    return JSON.parse(storedValue);
  } catch { }
  return storedValue;
};
const setStoredValue = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
}

export function useLocalStorage(key, initialValue = null) {
  const firstValue = getStoredValue(key) ?? initialValue;
  const [state, setState] = useState(firstValue);

  useEffect(() => {
    setStoredValue(key, state);
  }, [state, key]);

  useEffect(() => {
    const handleStorageChange = () => {
      setState(getStoredValue(key));
    };

    window.addEventListener("storage", handleStorageChange);

    return function cleanup() {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [key]);
  return [state, setState];
}

function Form() {
  const [name, setName] = useLocalStorage("name", "");

  return (
    <form style={{ display: "flex", flexDirection: "column" }}>
      <label htmlFor="name">Name:</label>
      <input type="text" value={name} onChange={e => setName(e.target.value)} />
      <h4>{name ? `Welcome, ${name}!` : "Enter your name"}</h4>
    </form>
  );
}

function FormWithObject() {
  // 🤓 save me for the bonus! when you're ready, update this useState to use your useLocalStorage hook instead
  const [formData, setFormData] = useLocalStorage("object", {
    title: "",
    content: "",
  });

  function handleChange(e) {
    setFormData(formData => ({
      ...formData,
      [e.target.name]: e.target.value,
    }));
  }

  return (
    <form style={{ display: "flex", flexDirection: "column" }}>
      <label htmlFor="name">Title:</label>
      <input name="title" value={formData.title} onChange={handleChange} />
      <label htmlFor="name">Content:</label>
      <textarea
        name="content"
        value={formData.content}
        onChange={handleChange}
      />
    </form>
  );
}

export default function App() {
  return (
    <div>
      <h2>useLocalStorage can save string</h2>
      <Form />
      <hr />
      <h2>useLocalStorage can save objects (Bonus)</h2>
      <FormWithObject />
    </div>
  );
}
