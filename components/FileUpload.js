// components/FileUpload.js
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Client, Storage, ID } from "appwrite";

const FileUpload = ({setFileId}) => {
  const [uploadedFileId, setUploadedFileId] = useState(null);

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];

    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT);

    const storage = new Storage(client);

    try {
      const uploadedFile = await storage.createFile(
        "default",
        ID.unique(),
        file
      );
      setUploadedFileId(uploadedFile.$id);
      setFileId(uploadedFile.$id);
      alert("File uploaded successfully!");
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file.");
    }
  }, [setFileId]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  });

  return (
    <div>
      <div {...getRootProps()} style={{ border: "1px dashed grey", padding: "20px", textAlign: "center", cursor: "pointer" }}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag 'n' drop some files here, or click to select files</p>
        )}
      </div>
      {uploadedFileId && <p>Uploaded File ID: {uploadedFileId}</p>}
    </div>
  );
};

export default FileUpload;
