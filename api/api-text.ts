import { VercelRequest, VercelResponse } from "@vercel/node";
import puppeteer from "puppeteer-core";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const targetUrl = req.query.url as string;

  if (!targetUrl) {
    return res.status(400).json({ error: "The 'url' query parameter is required." });
  }

  try {
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: "/usr/bin/google-chrome", // Path to Chrome on Vercel
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.goto(targetUrl, { waitUntil: "networkidle2" });

    const htmlContent = await page.content();
    await browser.close();

    res.setHeader("Content-Type", "text/plain");
    res.status(200).send(htmlContent);
  } catch (error: any) {
    res.status(500).json({ error: error.message, details: "Failed to fetch the target URL." });
  }
}
