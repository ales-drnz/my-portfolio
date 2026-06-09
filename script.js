/* ============================================================
   Loads repos live from the GitHub API so the page updates
   itself whenever a new repository is published.
   ============================================================ */

const USERNAME = "ales-drnz";
// repos hidden from the portfolio (profile readme, forks are filtered separately)
const HIDDEN_REPOS = [USERNAME];
const FEATURED = "mpv_audio_kit";

// shared state for the interactive terminal
const state = { repos: [] };

const SOCIAL_URLS = {
  github: "https://github.com/ales-drnz",
  "pub.dev": "https://pub.dev/publishers/ales-drnz.com/packages",
  linkedin: "https://www.linkedin.com/in/alessandro-di-ronza-911587241",
  x: "https://x.com/ales_drnz",
  instagram: "https://instagram.com/ales.drnz",
  patreon: "https://www.patreon.com/cw/ales_drnz",
  linktree: "https://linktr.ee/ales.drnz",
};

// GitHub linguist colors for the languages actually used
const LANG_COLORS = {
  Dart: "#00B4AB",
  Python: "#3572A5",
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  C: "#555555",
  "C++": "#f34b7d",
  Shell: "#89e051",
  Go: "#00ADD8",
  Rust: "#dea584",
  Kotlin: "#A97BFF",
  Swift: "#F05138",
  HTML: "#e34c26",
  CSS: "#563d7c",
};

const STAR_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;

// "3d ago" style relative time for the card footer
function timeAgo(dateStr) {
  const days = Math.floor((Date.now() - new Date(dateStr)) / 86400000);
  if (days < 1) return "today";
  if (days < 30) return `${days}d ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

function repoCard(repo) {
  const card = document.createElement("a");
  card.className = "card";
  card.href = repo.html_url;
  card.target = "_blank";
  card.rel = "noopener";

  const lang = repo.language
    ? `<span class="card-lang"><span class="lang-dot" style="background:${LANG_COLORS[repo.language] || "#8b8b9e"}"></span>${repo.language}</span>`
    : "";

  const topics = (repo.topics || [])
    .slice(0, 4)
    .map((t) => `<span class="topic">${t}</span>`)
    .join("");

  card.innerHTML = `
    <div class="card-top">
      <span class="card-name">${repo.name}</span>
      <span class="card-stars">${STAR_ICON}${repo.stargazers_count}</span>
    </div>
    <p class="card-desc">${repo.description || "No description yet."}</p>
    <div class="card-meta">
      ${lang}
      <div class="card-topics">${topics}</div>
      <span class="card-updated">updated ${timeAgo(repo.pushed_at)}</span>
    </div>
  `;
  return card;
}

function showStats(visible, user) {
  const totalStars = visible.reduce((sum, r) => sum + r.stargazers_count, 0);
  document.getElementById("stat-repos").textContent = visible.length;
  document.getElementById("stat-stars").textContent = totalStars;
  if (user) document.getElementById("stat-followers").textContent = user.followers;
}

async function loadProjects() {
  const grid = document.getElementById("projects-grid");
  try {
    const [repoRes, userRes] = await Promise.all([
      fetch(`https://api.github.com/users/${USERNAME}/repos?sort=updated&per_page=100`),
      fetch(`https://api.github.com/users/${USERNAME}`),
    ]);
    if (!repoRes.ok) throw new Error(`GitHub API ${repoRes.status}`);
    const repos = await repoRes.json();
    const user = userRes.ok ? await userRes.json() : null;

    const visible = repos
      .filter((r) => !r.fork && !HIDDEN_REPOS.includes(r.name))
      .sort(
        (a, b) =>
          b.stargazers_count - a.stargazers_count ||
          new Date(b.pushed_at) - new Date(a.pushed_at)
      );

    showStats(visible, user);
    state.repos = visible;

    const feat = visible.find((r) => r.name === FEATURED);
    if (feat) document.getElementById("feat-stars").textContent = feat.stargazers_count;

    grid.innerHTML = "";
    if (visible.length === 0) {
      grid.innerHTML = `<p class="grid-error">No public repositories found.</p>`;
      return;
    }
    visible.forEach((repo) => grid.appendChild(repoCard(repo)));

    // repos whose homepage points to pub.dev are published packages
    const pkgNames = visible
      .map((r) => (r.homepage || "").match(/^https:\/\/pub\.dev\/packages\/([\w-]+)/))
      .filter(Boolean)
      .map((m) => m[1]);
    loadPackages(pkgNames);
  } catch (err) {
    // rate-limited or offline: link straight to the GitHub profile
    grid.innerHTML = `<p class="grid-error">Couldn't load repositories right now — browse them on <a href="https://github.com/${USERNAME}?tab=repositories" target="_blank" rel="noopener">GitHub</a>.</p>`;
    loadPackages([]);
  }
}

/* ============ pub.dev packages ============ */
const PUBLISHER = "ales-drnz.com";

async function loadPackages(names) {
  const list = document.getElementById("packages-list");
  const fail = () => {
    list.innerHTML = `<p class="grid-error">Couldn't load package stats — see them on <a href="https://pub.dev/publishers/${PUBLISHER}/packages" target="_blank" rel="noopener">pub.dev</a>.</p>`;
  };
  try {
    if (names.length === 0) return fail();

    const pkgs = await Promise.all(
      names.map(async (name) => {
        const [score, info] = await Promise.all([
          fetch(`https://pub.dev/api/packages/${name}/score`).then((r) =>
            r.ok ? r.json() : null
          ),
          fetch(`https://pub.dev/api/packages/${name}`).then((r) =>
            r.ok ? r.json() : null
          ),
        ]);
        return { name, score, info };
      })
    );

    pkgs.sort((a, b) => (b.score?.likeCount || 0) - (a.score?.likeCount || 0));

    const featScore = pkgs.find((p) => p.name === FEATURED)?.score;
    if (featScore) {
      document.getElementById("feat-likes").textContent = featScore.likeCount;
      document.getElementById("feat-downloads").textContent = featScore.downloadCount30Days;
      document.getElementById("feat-points").textContent = `${featScore.grantedPoints}/${featScore.maxPoints}`;
    }

    list.innerHTML = "";
    pkgs.forEach(({ name, score, info }) => {
      const row = document.createElement("a");
      row.className = "pkg";
      row.href = `https://pub.dev/packages/${name}`;
      row.target = "_blank";
      row.rel = "noopener";
      const version = info?.latest?.version ? `v${info.latest.version}` : "";
      const stats = score
        ? `<span class="pkg-stat">♥ ${score.likeCount}</span>
           <span class="pkg-stat">⇣ ${score.downloadCount30Days}/mo</span>
           <span class="pkg-stat">${score.grantedPoints}/${score.maxPoints} pts</span>`
        : "";
      row.innerHTML = `
        <span class="pkg-name">${name}</span>
        <span class="pkg-version">${version}</span>
        <span class="pkg-stats">${stats}</span>
      `;
      list.appendChild(row);
    });
  } catch (err) {
    fail();
  }
}

/* ============ typing animation for the hero terminal ============ */
async function typeHero() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const body = document.querySelector(".term-body");
  const steps = Array.from(body.children);
  steps.forEach((el) => el.classList.add("pre-type"));
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  // first key press or click skips straight to the full hero
  let skip = false;
  const skipper = () => { skip = true; };
  document.addEventListener("keydown", skipper, { once: true });
  document.addEventListener("pointerdown", skipper, { once: true });

  for (const el of steps) {
    const cmd = el.querySelector(".cmd");
    if (!skip && el.classList.contains("line") && cmd) {
      const text = cmd.textContent;
      cmd.textContent = "";
      el.classList.remove("pre-type");
      for (const ch of text) {
        if (skip) {
          cmd.textContent = text;
          break;
        }
        cmd.textContent += ch;
        await sleep(34);
      }
      if (!skip) await sleep(140);
    } else {
      // command output (or skipping): reveal at once
      el.classList.remove("pre-type");
      if (!skip) await sleep(80);
    }
  }
  document.removeEventListener("keydown", skipper);
  document.removeEventListener("pointerdown", skipper);
}

/* ============ contact: email obfuscated from scrapers ============ */
function setupContact() {
  const addr = ["ales", "drnz"].join(".") + "@" + "gmail.com";
  const link = document.getElementById("mail-link");
  link.href = "mailto:" + addr + "?subject=hello";
  link.textContent = addr;
}

/* ============ featured: copy install command ============ */
function setupCopy() {
  const btn = document.getElementById("copy-btn");
  btn.addEventListener("click", () => {
    navigator.clipboard
      .writeText(document.getElementById("install-cmd").textContent)
      .then(() => {
        btn.textContent = "copied!";
        btn.classList.add("copied");
        setTimeout(() => {
          btn.textContent = "copy";
          btn.classList.remove("copied");
        }, 1500);
      });
  });
}

/* ============ interactive terminal ============ */
function setupTerminal() {
  const input = document.getElementById("term-input");
  const typed = document.getElementById("typed");
  const hint = document.getElementById("term-hint");
  const inputLine = document.getElementById("input-line");
  const termBody = document.querySelector(".term-body");
  const history = [];
  let histIdx = -1;

  const esc = (s) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  function print(html, cls = "") {
    const div = document.createElement("div");
    div.className = "term-out output " + cls;
    div.innerHTML = html;
    termBody.insertBefore(div, inputLine);
  }

  function echoLine(raw) {
    const div = document.createElement("p");
    div.className = "line term-echo";
    div.innerHTML = `<span class="prompt">❯</span> <span class="cmd">${esc(raw)}</span>`;
    termBody.insertBefore(div, inputLine);
  }

  function tvOff() {
    document.body.classList.add("crt-off");
    setTimeout(() => {
      document.body.classList.remove("crt-off");
      print(`I'm afraid I can't let you do that. <span class="flag">// filesystem is read-only</span>`);
    }, 1100);
  }

  const COMMANDS = {
    help() {
      print(
        [
          "available commands:",
          "  <b>about</b>      who I am",
          "  <b>skills</b>     what I work with",
          "  <b>ls</b>         list projects / socials",
          "  <b>open</b> &lt;x&gt;   open github, pub.dev, linkedin, x, instagram, patreon, linktree",
          "  <b>mail</b>       get in touch",
          "  <b>date</b>       current date",
          "  <b>echo</b> &lt;x&gt;   say something",
          "  <b>clear</b>      clean the terminal",
        ].join("<br>")
      );
    },
    whoami() {
      print("Alessandro Di Ronza");
    },
    about() {
      print(
        "Building open source tools and apps.<br>Electronics & Telecommunication Engineering student at Sapienza University of Rome."
      );
    },
    skills() {
      print("dart · flutter · python · c · c++ · swift");
    },
    ls(args) {
      const dir = (args[0] || "").replace(/\/$/, "");
      if (dir === "projects") {
        print(
          state.repos.map((r) => `<a href="${r.html_url}" target="_blank" rel="noopener">${r.name}/</a>`).join("&nbsp;&nbsp;") ||
            "projects/ is still loading…"
        );
      } else if (dir === "socials") {
        print(
          Object.entries(SOCIAL_URLS)
            .map(([n, u]) => `<a href="${u}" target="_blank" rel="noopener">${n}</a>`)
            .join("&nbsp;&nbsp;")
        );
      } else {
        print(`<b>projects/</b>&nbsp;&nbsp;<b>socials/</b>&nbsp;&nbsp;about.txt&nbsp;&nbsp;skills.txt`);
      }
    },
    open(args) {
      const key = (args[0] || "").toLowerCase();
      const url = SOCIAL_URLS[key];
      if (!url) {
        print(`open: unknown target "${esc(args[0] || "")}" — try: ${Object.keys(SOCIAL_URLS).join(", ")}`);
        return;
      }
      print(`opening ${key}…`);
      window.open(url, "_blank", "noopener");
    },
    mail() {
      const addr = ["ales", "drnz"].join(".") + "@" + "gmail.com";
      print(`drop me a line: <a href="mailto:${addr}?subject=hello">${addr}</a>`);
    },
    date() {
      print(new Date().toString());
    },
    echo(args) {
      print(esc(args.join(" ")) || "&nbsp;");
    },
    clear() {
      termBody.querySelectorAll(".term-out, .term-echo").forEach((el) => el.remove());
    },
    sudo(args) {
      if (args.join(" ") === "hire-me") {
        const addr = ["ales", "drnz"].join(".") + "@" + "gmail.com";
        print(`permission granted ✓ — opening mail client…`);
        window.location.href = `mailto:${addr}?subject=Let's work together`;
      } else {
        print("alessandro is not in the sudoers file. This incident will be reported.");
      }
    },
    rm(args) {
      if (args.includes("-rf") || args.includes("-fr")) tvOff();
      else print("rm: nothing was harmed. // filesystem is read-only");
    },
    exit() {
      print("logout<br>// just kidding, you can stay");
    },
  };

  function run(raw) {
    const line = raw.trim();
    echoLine(raw);
    if (!line) return;
    history.push(raw);
    histIdx = history.length;

    let [cmd, ...args] = line.split(/\s+/);
    cmd = cmd.toLowerCase();
    if (cmd === "cat" && args[0] === "about.txt") return COMMANDS.about();
    if (cmd === "cat" && args[0] === "skills.txt") return COMMANDS.skills();
    if (cmd === "projects") return COMMANDS.ls(["projects"]);
    if (cmd === "socials") return COMMANDS.ls(["socials"]);
    if (COMMANDS[cmd]) return COMMANDS[cmd](args);
    print(`bash: ${esc(cmd)}: command not found — try <b>help</b>`);
  }

  document.querySelector(".terminal").addEventListener("click", (e) => {
    if (e.target.closest("a, button")) return;
    input.focus({ preventScroll: true });
  });

  input.addEventListener("input", () => {
    typed.textContent = input.value;
    hint.classList.add("hidden");
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      run(input.value);
      input.value = "";
      typed.textContent = "";
      inputLine.scrollIntoView({ block: "nearest" });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (histIdx > 0) input.value = history[--histIdx];
      typed.textContent = input.value;
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      histIdx = Math.min(histIdx + 1, history.length);
      input.value = history[histIdx] || "";
      typed.textContent = input.value;
    }
  });
}

/* ============ konami code: cranks up the CRT effect ============ */
function setupKonami() {
  const seq = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
  let pos = 0;
  document.addEventListener("keydown", (e) => {
    pos = e.key === seq[pos] ? pos + 1 : e.key === seq[0] ? 1 : 0;
    if (pos === seq.length) {
      pos = 0;
      document.body.classList.toggle("crt-heavy");
    }
  });
}

document.getElementById("year").textContent = new Date().getFullYear();
typeHero();
loadProjects(); // chains into loadPackages() with the pub.dev names
setupContact();
setupCopy();
setupTerminal();
setupKonami();
