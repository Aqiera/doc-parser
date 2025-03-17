// /pages/api/get-parsed-data.js
import { Client, Databases, Query } from "appwrite";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT);

    const databases = new Databases(client);

    const { documentId } = req.query;

    try {
      const documents = await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID,
        [Query.equal("documentId", documentId)]
      );

      if (documents.total > 0) {
        return res.status(200).json({ success: true, data: documents.documents[0] });
      } else {
        return res.status(404).json({ success: false, message: "No data found for this document." });
      }
    } catch (error) {
      console.error("Error fetching parsed data:", error);
      return res
        .status(500)
        .json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
