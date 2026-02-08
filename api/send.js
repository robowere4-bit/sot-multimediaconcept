import fetch from "node-fetch";
import multiparty from "multiparty";
import fs from "fs";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

  const form = new multiparty.Form();

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(400).json({ error: "Error parsing form", details: err });

    try {
      const caption = fields.caption ? fields.caption[0] : "No caption provided";
      const file = files.photo ? files.photo[0] : null;

      if (!file) return res.status(400).json({ error: "No photo uploaded" });

      const fd = new fetch.FormData();
      fd.append("chat_id", process.env.TG_CHAT_ID);
      fd.append("caption", caption);
      fd.append("photo", fs.createReadStream(file.path), { filename: file.originalFilename });

      const tgRes = await fetch(`https://api.telegram.org/bot${process.env.TG_BOT_TOKEN}/sendPhoto`, {
        method: "POST",
        body: fd,
      });

      const data = await tgRes.json();
      if (!data.ok) {
        return res.status(500).json({ error: "Failed to send to Telegram", details: data });
      }

      res.status(200).json({ success: true, data });
    } catch (error) {
      res.status(500).json({ error: "Server error sending to Telegram", details: error.toString() });
    }
  });
}
