import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { name, phone, gender, score, percent } = req.body;

    if (!name || !phone || !gender || score === undefined || percent === undefined) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Construct the message for Telegram
    const message = `
📖 Bible Quiz Submission
👤 Name: ${name}
📞 Phone: ${phone}
⚥ Gender: ${gender}
🏆 Score: ${score}
📊 Percentage: ${percent}%
    `;

    // Send to Telegram
    const tgRes = await fetch(
      `https://api.telegram.org/bot8526007970:AAGwLxlOsBB1DEPSfNPGmelX77_I2zfJHSI/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: 874563737,
          text: message,
        }),
      }
    );

    const data = await tgRes.json();

    if (!data.ok) {
      return res.status(500).json({ error: "Failed to send to Telegram", details: data });
    }

    res.status(200).json({ success: true, telegramResponse: data });
  } catch (error) {
    console.error("Telegram API error:", error);
    res.status(500).json({ error: "Server error", details: error });
  }
}
