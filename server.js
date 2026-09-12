const express = require("express");
const { exec } = require("child_process");

const app = express();
const PORT = 3000;

const SESSION_ID = "applypilot-agent-m3";

app.use(express.json());
app.use(express.static("public"));

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    agent: "ApplyPilot",
    status: "ready"
  });
});

app.post("/api/search", (req, res) => {
  const profile = req.body.profile || "";

  const command = `webcmd.cmd --session ${SESSION_ID} browser run --file .\\agent-search.js`;

  console.log("ApplyPilot searching with session:", SESSION_ID);

  exec(command, { cwd: __dirname }, (error, stdout, stderr) => {
    if (error) {
      console.error(stderr || error.message);

      return res.status(500).json({
        ok: false,
        error: "Browser agent failed",
        details: stderr || error.message
      });
    }

    let parsed;

    try {
      parsed = JSON.parse(stdout.trim());
    } catch (e) {
      return res.status(500).json({
        ok: false,
        error: "Failed to parse Webcmd stdout as JSON",
        raw: stdout
      });
    }

    const inner = parsed.result || parsed;
const candidates = inner.candidates || [];
const query = inner.query || null;

const profileText = profile.toLowerCase();

const keywords = [
  "ai",
  "artificial intelligence",
  "machine learning",
  "software",
  "engineering",
  "python",
  "javascript",
  "react",
  "aws",
  "internship"
];

const rankedCandidates = candidates.map(candidate => {
  const text = (candidate.text || "").toLowerCase();

  const matchedKeywords = keywords.filter(keyword =>
    profileText.includes(keyword) && text.includes(keyword)
  );

  const score = Math.min(
    100,
    40 + matchedKeywords.length * 10
  );

  return {
    ...candidate,
    matchScore: score,
    matchedSkills: matchedKeywords
  };
});

rankedCandidates.sort((a, b) => b.matchScore - a.matchScore);

res.json({
  ok: true,
  query: query,
  profile: profile,
  results: rankedCandidates
});
  });
});

app.post("/api/prepare", (req, res) => {

  const command =
    `webcmd.cmd --session ${SESSION_ID} browser run --file .\\agent-prepare.js`;

  console.log("ApplyPilot preparing application...");

  exec(command, { cwd: __dirname }, (error, stdout, stderr) => {

    if (error) {

      console.error(stderr || error.message);

      return res.status(500).json({
        ok: false,
        error: "Application preparation failed",
        details: stderr || error.message
      });

    }

    try {

      const parsed = JSON.parse(stdout.trim());
      const inner = parsed.result || parsed;

      if (!inner.ok || !inner.draft) {

        return res.status(500).json({
          ok: false,
          error: "Application draft was not generated"
        });

      }

      res.json({
        ok: true,
        draft: inner.draft
      });

    } catch (e) {

      res.status(500).json({
        ok: false,
        error: "Failed to parse application draft",
        raw: stdout
      });

    }

  });

});
app.listen(PORT, () => {
  console.log(`ApplyPilot running at http://localhost:${PORT}`);
});