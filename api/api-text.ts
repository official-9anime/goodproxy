import { VercelRequest, VercelResponse } from "@vercel/node";
import axios from "axios";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const targetUrl = req.query.url as string;

  // Validate the `url` query parameter
  if (!targetUrl) {
    return res.status(400).json({ error: "The 'url' query parameter is required." });
  }

  try {
    // Fetch the target URL
    const response = await axios.get(targetUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    // Return the raw HTML as plain text
    res.setHeader("Content-Type", "text/plain");
    res.status(200).send(response.data);
  } catch (error: any) {
    // Handle errors gracefully
    res.status(error.response?.status || 500).json({
      error: error.message,
      details: error.response?.data || "An error occurred while fetching the target URL.",
    });
  }
}
