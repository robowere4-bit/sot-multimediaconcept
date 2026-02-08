import fetch from "node-fetch";
import FormData from "form-data";
import multiparty from "multiparty";
import fs from "fs";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

  // Parse multipart/form-data (for file uploads)
  const form = new multiparty.Form();
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(400).json({ error: "Error parsing form" });

    const caption = fields.caption ? fields.caption[0] : "No caption";
    const file = files.photo ? files.photo[0] : null;
    if (!file) return res.status(400).json({ error: "No photo uploaded" });

    // Prepare FormData for Telegram
    const fd = new FormData();
    fd.append("chat_id", process.env.TG_CHAT_ID);
    fd.append("caption", caption);
    fd.append("photo", fs.createReadStream(file.path), file.originalFilename);

    try {
      const tgRes = await fetch(
        `https://api.telegram.org/bot${process.env.TG_BOT_TOKEN}/sendPhoto`,
        {
          method: "POST",
          body: fd,
          headers: fd.getHeaders(),
        }
      );
      const data = await tgRes.json();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to send to Telegram", details: error });
    }
  });
}
