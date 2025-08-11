const path = require("path");
const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index", { title: "Global News Translator" });
});

app.post("/news", async (req, res) => {
  const q = (req.body.query || "").trim();
  if (!q) return res.status(400).json({ error: "Please enter a search term." });

  if (!process.env.NEWS_API_KEY) {
    return res.status(500).json({ error: "NEWS_API_KEY missing in .env" });
  }

  try {
    const { data } = await axios.get("https://newsapi.org/v2/everything", {
      params: {
        q,
        sortBy: "publishedAt",
        language: "en",
        pageSize: 10,
        apiKey: process.env.NEWS_API_KEY
      }
    });

    const articles = (data.articles || []).map(a => ({
      title: a.title || "",
      description: a.description || "",
      url: a.url,
      urlToImage: a.urlToImage,
      source: a?.source?.name || "",
      publishedAt: a.publishedAt
    }));

    res.json({ articles });
  } catch (err) {
    console.log("News error:", err?.response?.data || err.message);
    res.status(500).json({ error: "Could not load news right now." });
  }
});

app.get("/api/translate", async (req, res) => {
  const text = (req.query.text || "").toString();
  const target = (req.query.target || "").toString();
  if (!text) return res.status(400).json({ error: "text is required" });
  if (!target) return res.status(400).json({ error: "target is required" });

  if (!process.env.GOOGLE_API_KEY) {
    return res.status(500).json({ error: "GOOGLE_API_KEY missing in .env" });
  }

  try {
    const url = `https://translation.googleapis.com/language/translate/v2?key=${process.env.GOOGLE_API_KEY}`;
    const { data } = await axios.post(url, { q: text, target });
    const translated = data?.data?.translations?.[0]?.translatedText || "";
    res.json({ translated });
  } catch (err) {
    console.log("Translate error:", err?.response?.data || err.message);
    res.status(500).json({ error: "Translation failed." });
  }
});

app.listen(PORT, () => {
  console.log(`Server: http://localhost:${PORT}`);
});
