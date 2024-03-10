import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api_var";

function AppDetails() {
  const { appName } = useParams();
  const [translations, setTranslations] = useState({});
  const [newKey, setNewKey] = useState("");
  const [english, setEnglish] = useState("");
  const [french, setFrench] = useState("");
  const [german, setGerman] = useState("");

  useEffect(() => {
    fetchTranslations();
  }, [appName]); // Re-fetch translations if appName changes

  const fetchTranslations = async () => {
    try {
      const response = await fetch(
        `${api}/api/Translations/getTranslationsForApp/${appName}`
      );
      if (!response.ok) {
        setTranslations({});

        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setTranslations(data);
    } catch (error) {
      console.error("Failed to fetch translations:", error);
    }
  };

  const handleAddTranslation = async () => {
    try {
      const response = await fetch(
        `${api}/api/Translations/addTranslationKey/${appName}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            key: newKey,
            translationValue: {
              English: english,
              French: french,
              German: german,
            },
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      fetchTranslations(); // Refresh the list of translations
      // Reset input fields
      setNewKey("");
      setEnglish("");
      setFrench("");
      setGerman("");
    } catch (error) {
      console.error("Failed to add translation:", error);
    }
  };

  return (
    <div>
      <h2>App Details for {appName}</h2>
      <div>
        <h3>Add New Translation</h3>
        <input
          value={newKey}
          onChange={(e) => setNewKey(e.target.value)}
          placeholder="Key"
        />
        <input
          value={english}
          onChange={(e) => setEnglish(e.target.value)}
          placeholder="English"
        />
        <input
          value={french}
          onChange={(e) => setFrench(e.target.value)}
          placeholder="French"
        />
        <input
          value={german}
          onChange={(e) => setGerman(e.target.value)}
          placeholder="German"
        />
        <button onClick={handleAddTranslation}>Add Translation</button>
      </div>
      <div>
        <h3>Current Translations</h3>
        {Object.entries(translations).map(([key, value]) => (
          <div key={key}>
            <strong>{key}:</strong> Eng: {value.English}, Fr: {value.French},
            Ger: {value.German}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AppDetails;
