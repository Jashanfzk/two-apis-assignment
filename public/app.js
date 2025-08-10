const form = document.getElementById("searchForm");
const input = document.getElementById("query");
const statusBox = document.getElementById("status");
const results = document.getElementById("results");

const LANGS = [
  { code: "hi", label: "Hindi" },
  { code: "pa", label: "Punjabi" },
  { code: "fr", label: "French" },
  { code: "ar", label: "Arabic" },
  { code: "es", label: "Spanish" },
  { code: "zh", label: "Mandarin (Chinese)" }
];

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  results.innerHTML = "";
  statusBox.textContent = "Loading...";
  const q = (input.value || "").trim();
  if (!q) {
    statusBox.textContent = "Type a keyword first.";
    return;
  }
  try {
    const res = await fetch("/news", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: q })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "error");
    statusBox.textContent = data.articles.length ? `Found ${data.articles.length}` : "No results.";
    renderList(data.articles);
  } catch (e2) {
    statusBox.textContent = "Could not load news.";
  }
});

function renderList(items) {
  const list = document.createElement("ul");
  list.className = "news-list";
  items.forEach((a) => {
    const li = document.createElement("li");
    li.className = "news-item";

    const title = document.createElement("a");
    title.href = a.url;
    title.target = "_blank";
    title.textContent = a.title || "Untitled";
    li.appendChild(title);

    const desc = document.createElement("p");
    desc.textContent = a.description || "(No description)";
    li.appendChild(desc);

    const wrap = document.createElement("div");
    wrap.className = "translate-wrap";
    const select = document.createElement("select");
    LANGS.forEach((l) => {
      const opt = document.createElement("option");
      opt.value = l.code;
      opt.textContent = l.label;
      select.appendChild(opt);
    });
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = "Translate";
    const out = document.createElement("p");
    out.className = "translated";
    out.style.display = "none";

    btn.addEventListener("click", async () => {
      const text = (a.description || a.title || "").trim();
      if (!text) return;
      btn.disabled = true;
      btn.textContent = "Translating...";
      try {
        const res = await fetch(
          `/api/translate?text=${encodeURIComponent(text)}&target=${select.value}`
        );
        const data = await res.json();
        out.textContent = data.translated || "No translation";
        out.style.display = "block";
      } catch {
        out.textContent = "Translation failed.";
        out.style.display = "block";
      } finally {
        btn.disabled = false;
        btn.textContent = "Translate";
      }
    });

    wrap.appendChild(select);
    wrap.appendChild(btn);
    li.appendChild(wrap);
    li.appendChild(out);
    list.appendChild(li);
  });
  results.appendChild(list);
}
