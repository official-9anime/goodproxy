import { VercelRequest, VercelResponse } from "@vercel/node";
import puppeteer from "puppeteer-core";
import chromium from "chrome-aws-lambda";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const targetUrl = req.query.url as string;

  // Validate the `url` query parameter
  if (!targetUrl) {
    return res.status(400).json({ error: "The 'url' query parameter is required." });
  }

  try {
    // Launch a headless browser using Puppeteer and Chrome AWS Lambda
    const browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    });

    const page = await browser.newPage();

    // Set a realistic User-Agent to mimic a browser
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    );

    // Navigate to the target URL
    await page.goto(targetUrl, { waitUntil: "networkidle2" });

    // Extract the page content as HTML
    const htmlContent = await page.content();

    await browser.close();

    // Return the HTML content as plain text
    res.setHeader("Content-Type", "text/plain");
    res.status(200).send(htmlContent);
  } catch (error: any) {
    res.status(500).json({
      error: error.message,
      details: "An error occurred while fetching the target URL.",
    });
  }
}
