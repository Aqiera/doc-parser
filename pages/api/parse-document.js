// /pages/api/parse-document.js
import { Client, Function } from "appwrite";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT);

    const functions = new Function(client);

    try {
      const payload = {
        fileId: req.body.fileId,
        userId: req.body.userId,
      };

      const execution = await functions.createExecution(
        process.env.NEXT_PUBLIC_APPWRITE_FUNCTION_ID,
        JSON.stringify(payload)
      );

      return res.status(200).json({ success: true, execution });
    } catch (error) {
      console.error("Error calling Appwrite function:", error);
      return res
        .status(500)
        .json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
