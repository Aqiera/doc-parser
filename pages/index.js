// pages/index.js
import FileUpload from "../components/FileUpload";
import ParseButton from "../components/ParseButton";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

const IndexPage = () => {
  const [fileId, setFileId] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const userId = "user123"; // Replace with actual user ID

  useEffect(() => {
    const fetchData = async () => {
      if (fileId) {
        try {
          const response = await fetch(`/api/get-parsed-data?documentId=${fileId}`);
          const data = await response.json();
          if (data.success) {
            setParsedData(data.data);
          } else {
            console.log(data.message);
            setParsedData(null);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
          setParsedData(null);
        }
      }
    };

    fetchData();
  }, [fileId]);

  const downloadXLSX = () => {
    if (parsedData && parsedData.xlsxOutput) {
      const base64Data = parsedData.xlsxOutput;
      const blob = b64toBlob(base64Data, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "table_data.xlsx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  // Utility function to convert base64 to Blob
  function b64toBlob(b64Data, contentType = "", sliceSize = 512) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  return (
    <div>
      <h1>Document Parser</h1>
      <FileUpload setFileId={setFileId} />
      {fileId && <ParseButton fileId={fileId} userId={userId} />}

      {parsedData && (
        <div>
          {parsedData.markdownOutput && (
            <div>
              <h2>Markdown Output:</h2>
              <ReactMarkdown>{parsedData.markdownOutput}</ReactMarkdown>
            </div>
          )}

          {parsedData.xlsxOutput && (
            <div>
              <h2>XLSX Output:</h2>
              <button onClick={downloadXLSX}>Download XLSX</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default IndexPage;
