let projects = structuredClone(seedProjects);

// ====== 2) 工具 ======
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));
function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (s) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[s]));
}
function normalizeKw(kw) {
  if (kw == null) return "";
  return String(kw).trim();
}
function buildKwRegex(kw) {
  const s = normalizeKw(kw);
  if (!s) return null;
  const esc = s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  try {
    return new RegExp(`(${esc})`, "ig");
  } catch {
    return null;
  }
}
function highlight(text, kw) {
  const re = buildKwRegex(kw);
  if (!re) return escapeHtml(text);
  return escapeHtml(text).replace(re, '<span class="mark">$1</span>');
}

// ====== 3) 狀態 ======
const state = { q: "", types: new Set(), sort: "recent" };

function buildTypeChips() {
  const types = [
    ...new Set(
      projects.flatMap((p) =>
        Array.isArray(p.type) ? p.type : [p.type]
      )
    ),
  ].sort((a, b) => a.localeCompare(b, "zh-Hant"));
  const box = $("#type-chips");
  box.innerHTML = types
    .map(
      (t) =>
        `<button class="chip" data-type="${escapeHtml(t)}" data-active="${state.types.has(t)}">${escapeHtml(t)}</button>`
    )
    .join("");
}

document.getElementById("type-chips").addEventListener("click", (e) => {
  const btn = e.target.closest(".chip");
  if (!btn) return;
  const t = btn.dataset.type;
  if (state.types.has(t)) state.types.delete(t);
  else state.types.add(t);
  btn.dataset.active = state.types.has(t);
  renderList();
});

$("#toggle-types").addEventListener("click", () => {
  const chipsBox = $("#type-chips");
  const visible = chipsBox.style.display !== "none";
  chipsBox.style.display = visible ? "none" : "flex";
  $("#toggle-types").dataset.active = !visible;
});

$("#q").addEventListener("input", (e) => {
  state.q = e.target.value.trim();
  renderList();
});

$("#sort").addEventListener("change", (e) => {
  state.sort = e.target.value;
  renderList();
});

$("#reset").addEventListener("click", () => {
  state.q = "";
  state.types.clear();
  $$("#type-chips .chip").forEach((c) => (c.dataset.active = false));
  $("#q").value = "";
  $("#sort").value = "recent";
  state.sort = "recent";
  renderList();
});

// ====== 4) 路由 ======
window.addEventListener("hashchange", router);
function router() {
  window.scrollTo(0, 0);
  const hash = location.hash.replace(/^#\/?/, "");
  if (hash.startsWith("p/")) {
    const id = Number(hash.split("/")[1]);
    renderDetail(id);
  } else {
    renderList();
  }
}

// ====== 5) 列表頁渲染 ======
function renderList() {
  $("#list-view").hidden = false;
  $("#detail-view").hidden = true;
  $("#toolbar").style.display = "flex";
  buildTypeChips();
  let list = projects.slice();
  if (state.types.size) {
    list = list.filter((p) => state.types.has(p.type));
  }
  const q = normalizeKw(state.q);
  if (q) {
    const low = q.toLowerCase();
    list = list.filter((p) => (p.name + " " + p.type + " " + (p.tags || []).join(" ")).toLowerCase().includes(low));
  }
  if (state.sort === "recent") {
    list.sort((a, b) => (b.year || 0) - (a.year || 0));
  }
  if (state.sort === "az") {
    list.sort((a, b) => a.name.localeCompare(b.name, "zh-Hant"));
  }
  if (state.sort === "type") {
    list.sort((a, b) => a.type.localeCompare(b.type, "zh-Hant") || a.name.localeCompare(b.name, "zh-Hant"));
  }

  const grid = $("#grid");
  if (!list.length) {
    grid.innerHTML = "";
    $("#empty").style.display = "block";
    $("#count").textContent = "0 個結果";
    return;
  }
  $("#empty").style.display = "none";

  grid.innerHTML = list
    .map((p) => {
      const safeName = highlight(p.name, q);
      const safeType = highlight(p.type, q);
      const tags = (p.tags || []).map((t) => `<span class="chip" style="pointer-events:none">${escapeHtml(t)}</span>`).join(" ");
      const img = p.thumb ? `<img loading="lazy" src="${p.thumb}" alt="${escapeHtml(p.name)}">` : placeholder();
      return `
    <article class="card" tabindex="0" aria-label="${escapeHtml(p.name)} ${escapeHtml(p.type)}">
      <a class="thumb" href="#/p/${p.id}" data-id="${p.id}">
        ${img}
        <span class="badge">${safeType}</span>
      </a>
      <div class="body">
        <h3 class="name">${safeName}</h3>
        <div class="meta"><span>${p.year || "—"}</span><span class="dot"></span><span>${safeType}</span></div>
        <div class="chips">${tags}</div>
      </div>
      <div class="actions">
        <a class="btn" href="#/p/${p.id}">內頁版型</a>
      </div>
    </article>`;
    })
    .join("");
  $("#count").textContent = `${list.length} 個結果`;
}

// ====== 6) 詳細頁渲染 ======
function renderDetail(id) {
  const proj = projects.find((p) => p.id === id);
  if (!proj) {
    location.hash = "#/";
    return;
  }
  $("#list-view").hidden = true;
  $("#detail-view").hidden = false;

  $("#crumb-name").textContent = proj.name;
  $("#proj-name").textContent = proj.name;
  $("#proj-sub").textContent = `${proj.type} · ${proj.year || "—"} · ${(proj.tags || []).join(" / ")}`;

  const demoBtn = $("#proj-demo-url");
  const officialBtn = $("#proj-official-url");

  if (demoBtn) {
    demoBtn.href = proj.url || "#";
    demoBtn.style.display = proj.url ? "inline-flex" : "none";
  }

  if (officialBtn) {
    officialBtn.href = proj.officialUrl || "#";
    officialBtn.style.display = proj.officialUrl ? "inline-flex" : "none";
  }

  const grid = $("#layouts-grid");
  const url = proj.url || "#";
  let base;
  try {
    base = new URL(url, location.origin);
  } catch (e) {
    base = new URL(location.href);
  }

  grid.innerHTML = (proj.layouts || [])
    .map((l) => {
      let href = "#";
      try {
        href = proj.url ? new URL(l.path.replace(/^\//, ""), base).toString() : "#";
      } catch (e) {
        href = "#";
      }
      const img = l.thumb ? `<img loading="lazy" src="${l.thumb}" alt="${escapeHtml(l.title)}">` : placeholder();
      return `
      <article class="layout-card">
        <a class="layout-thumb" href="${href}" target="_blank" rel="noopener">${img}<span class="badge">${escapeHtml(l.kind)}</span></a>
        <div class="layout-body">
          <strong>${escapeHtml(l.title)}</strong>
          <div class="meta"><span>${escapeHtml(l.kind)}</span><span class="dot"></span><span>${escapeHtml(l.path)}</span></div>
          <div class="actions">
            <a class="btn" href="${href}" target="_blank" rel="noopener">開啟頁面</a>
          </div>
        </div>
      </article>`;
    })
    .join("");

  $("#layout-count").textContent = `${(proj.layouts || []).length} 個內頁版型`;
}

function placeholder() {
  return `<img alt="placeholder" src="data:image/svg+xml;utf8,${encodeURIComponent(`
  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 500'>
    <defs>
      <linearGradient id='g' x1='0' x2='1'>
        <stop offset='0%' stop-color='%2310182a'/>
        <stop offset='100%' stop-color='%230d1220'/>
      </linearGradient>
    </defs>
    <rect width='800' height='500' fill='url(%23g)'/>
    <g fill='none' stroke='%232a2f3e' stroke-width='2'>
      <rect x='80' y='80' width='640' height='340' rx='24'/>
      <path d='M140 360l120-140 120 100 80-70 120 110' />
    </g>
  </svg>
  `)}">`;
}

function copyLayout(pid, key) {
  const p = projects.find((x) => x.id === pid);
  const l = (p.layouts || []).find((y) => y.key === key);
  const text = `專案: ${p.name}\n頁面: ${l.title}\n類型: ${l.kind}\n路徑: ${l.path}`;
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.activeElement;
    if (btn) {
      btn.textContent = "已複製";
      setTimeout(() => (btn.textContent = "複製路徑"), 1200);
    }
  });
}

$("#back").addEventListener("click", () => {
  history.back();
});

// ====== 9) 啟動流程 ======
async function boot() {
  try {
    const resp = await fetch("json/projects.json", { cache: "no-store" });
    if (resp.ok) {
      const data = await resp.json();
      projects = data;
    }
  } catch (e) {}
  buildTypeChips();
  if (!location.hash || location.hash === "#") {
    location.hash = "#/";
  }
  router();
}
boot();

const topBtn = document.getElementById("TOP");
if (topBtn) {
  topBtn.style.top = "-95px";
  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const HEIGHT = scrollY + window.innerHeight - 60;
    if (scrollY > 200) {
      topBtn.style.transition = "top 0.5s";
      topBtn.style.top = HEIGHT + "px";
    } else {
      topBtn.style.transition = "top 0.5s";
      topBtn.style.top = "-95px";
    }
  });
  topBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}