// components/ParseButton.js
import React from "react";

const ParseButton = ({ fileId, userId }) => {
  const handleParse = async () => {
    try {
      const response = await fetch("/api/parse-document", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fileId: fileId, userId: userId }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Parsing started successfully!");
      } else {
        alert("Parsing failed: " + data.error);
      }
    } catch (error) {
      console.error("Error triggering parsing:", error);
      alert("Error triggering parsing: " + error.message);
    }
  };

  return <button onClick={handleParse}>Parse Document</button>;
};

export default ParseButton;
