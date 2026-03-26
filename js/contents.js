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
  const esc = s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // 安全跳脫所有正則特殊字元（含反斜線與方括號）
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

// 初始化 chips（依資料動態生成）
function buildTypeChips() {
  // 支援 type 為陣列或字串
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

// 顯示/隱藏 chips
$("#toggle-types").addEventListener("click", () => {
  const chipsBox = $("#type-chips");
  const visible = chipsBox.style.display !== "none";
  chipsBox.style.display = visible ? "none" : "flex";
  $("#toggle-types").dataset.active = !visible;
});

// 搜尋框
$("#q").addEventListener("input", (e) => {
  state.q = e.target.value.trim();
  renderList();
});
window.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.key === "/") {
    e.preventDefault();
    $("#q").focus();
  }
});

// 排序
$("#sort").addEventListener("change", (e) => {
  state.sort = e.target.value;
  renderList();
});

// 重置
$("#reset").addEventListener("click", () => {
  state.q = "";
  state.types.clear();
  $$("#type-chips .chip").forEach((c) => (c.dataset.active = false));
  $("#q").value = "";
  $("#sort").value = "recent";
  state.sort = "recent";
  renderList();
});

// ====== 4) 路由：#/  與  #/p/:id ======
window.addEventListener("hashchange", router);
function router() {
  // 每次執行路由切換時，強制將視窗捲動至最上方
  window.scrollTo(0, 0);
  const hash = location.hash.replace(/^#\/?/, "");
  if (hash.startsWith("p/")) {
    const id = Number(hash.split("/")[1]);
    renderDetail(id);
  } else if (hash === "tests") {
    runTests(true);
    renderList();
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
        <a class="btn ghost" href="${p.url || "#"}" target="_blank" rel="noopener"><i class="fas fa-link"></i></a>
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
  // $("#toolbar").style.display = "none";

  $("#crumb-name").textContent = proj.name;
  $("#proj-name").textContent = proj.name;
  $("#proj-sub").textContent = `${proj.type} · ${proj.year || "—"} · ${(proj.tags || []).join(" / ")}`;
  const url = proj.url || "#";
  let base;
  try {
    base = new URL(url, location.origin);
  } catch (e) {
    base = new URL(location.href);
  }
  const grid = $("#layouts-grid");

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
            <button class="btn ghost" onclick='copyLayout(${proj.id},"${l.key}")'>複製路徑</button>
          </div>
        </div>
      </article>`;
    })
    .join("");

  $("#proj-url").href = proj.url || "#";
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

function copyMeta(id) {
  const p = projects.find((x) => x.id === id);
  const text = `名稱: ${p.name}\n版型: ${p.type}\n年份: ${p.year || ""}\n標籤: ${(p.tags || []).join(", ")}\nURL: ${p.url || ""}`;
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.activeElement;
    if (btn) {
      btn.textContent = "已複製";
      setTimeout(() => (btn.textContent = "複製資料"), 1200);
    }
  });
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

// ====== 7) 匯入/匯出與外部載入 ======
const srcSel = $("#data-source");
const srcUrl = $("#data-url");
const srcFile = $("#data-file");
$("#data-source").addEventListener("change", () => {
  const v = srcSel.value;
  srcUrl.style.display = v === "url" ? "inline-block" : "none";
  srcFile.style.display = v === "file" ? "inline-block" : "none";
});

$("#load-data").addEventListener("click", async () => {
  const v = srcSel.value;
  try {
    if (v === "seed") {
      projects = structuredClone(seedProjects);
      afterDataLoaded("seed");
      return;
    }
    if (v === "url") {
      const url = srcUrl.value || "./projects.json";
      const data = await (await fetch(url, { cache: "no-store" })).json();
      assertProjects(data);
      projects = data;
      afterDataLoaded("url");
      return;
    }
    if (v === "file") {
      if (!srcFile.files[0]) throw new Error("請選擇 JSON 檔");
      const text = await srcFile.files[0].text();
      const data = JSON.parse(text);
      assertProjects(data);
      projects = data;
      afterDataLoaded("file");
      return;
    }
    // auto
    const autoUrl = "json/projects.json";
    const resp = await fetch(autoUrl, { cache: "no-store" });
    if (resp.ok) {
      const data = await resp.json();
      assertProjects(data);
      projects = data;
      afterDataLoaded("auto-json");
    } else {
      projects = structuredClone(seedProjects);
      afterDataLoaded("auto-seed");
    }
  } catch (e) {
    console.warn("載入失敗，改用內建資料：", e);
    projects = structuredClone(seedProjects);
    afterDataLoaded("fallback-seed", e.message);
  }
});

function afterDataLoaded(mode, note) {
  state.q = "";
  state.types.clear();
  buildTypeChips();
  renderList();
  if (note) console.log("[data]", mode, note);
  else console.log("[data]", mode);
}

$("#export-json").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(projects, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "projects.json";
  a.click();
  URL.revokeObjectURL(a.href);
});

$("#import-csv").addEventListener("click", () => {
  $("#dlg-import").showModal();
});
$("#btn-import-sample").addEventListener("click", () => {
  const sample = `id,name,type,year,tags,url,thumb,layouts\n7,示例新案,企業形象,2025,企業|品牌,https://example.com/new,https://picsum.photos/800/500,home^首頁^/index.html^Landing^https://picsum.photos/seed/home/800/500;about^關於我們^/about.html^Content^https://picsum.photos/seed/about/800/500`;
  $("#import-text").value = sample;
});
$("#btn-import-apply").addEventListener("click", () => {
  const raw = $("#import-text").value.trim();
  if (!raw) {
    alert("請貼上 CSV 或 JSON");
    return;
  }
  let items = [];
  try {
    if (raw.startsWith("[")) {
      items = JSON.parse(raw);
    } else {
      items = parseCSV(raw);
    }
    mergeProjects(items);
    $("#dlg-import").close();
    afterDataLoaded("import");
  } catch (e) {
    alert("解析失敗：" + e.message);
  }
});

function parseCSV(text) {
  // 簡易 CSV 解析（支援引號與逗號），轉換為專案結構
  text = String(text).replace(/\r\n?/g, "\n");
  const rows = [];
  let field = "",
    row = [],
    inQ = false;
  const pushField = () => {
    row.push(field);
    field = "";
  };
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '"') {
      if (inQ && text[i + 1] === '"') {
        field += '"';
        i++;
        continue;
      } // 轉義雙引號
      inQ = !inQ;
      continue;
    }
    if (ch === "\n") {
      if (inQ) {
        field += "\n";
      } else {
        pushField();
        rows.push(row);
        row = [];
      }
      continue;
    }
    if (ch === ",") {
      if (inQ) {
        field += ch;
      } else {
        pushField();
      }
      continue;
    }
    field += ch;
  }
  if (field.length || row.length) {
    pushField();
    rows.push(row);
  }
  const header = rows.shift().map((s) => s.trim());
  const idx = (name) => header.indexOf(name);
  return rows
    .filter((r) => r.length > 1)
    .map((r) => {
      const id = Number(r[idx("id")]);
      const name = r[idx("name")];
      const type = r[idx("type")];
      const year = Number(r[idx("year")]) || undefined;
      const tags = (r[idx("tags")] || "").split("|").filter(Boolean);
      const url = r[idx("url")];
      const thumb = r[idx("thumb")];
      const layoutsRaw = r[idx("layouts")] || "";
      const layouts = layoutsRaw
        .split(";")
        .filter(Boolean)
        .map((s) => {
          const [key, title, path, kind, thumb] = s.split("^");
          return { key, title, path, kind, thumb };
        });
      return { id, name, type, year, tags, url, thumb, layouts };
    });
}

function mergeProjects(items) {
  // 依 id 覆蓋或新增
  const map = new Map(projects.map((p) => [p.id, p]));
  for (const it of items) {
    if (!it || typeof it !== "object") continue;
    if (!("id" in it)) throw new Error("缺少 id 欄位");
    map.set(it.id, Object.assign({}, map.get(it.id) || {}, it));
  }
  projects = Array.from(map.values()).sort((a, b) => a.id - b.id);
}

function assertProjects(data) {
  if (!Array.isArray(data)) throw new Error("JSON 應為陣列");
  for (const p of data) {
    if (typeof p.id === "undefined") throw new Error("每筆資料需有 id");
  }
}

// ====== 8) 測試 ======
function runHighlightTests() {
  const cases = [
    { text: "ABC xyz", kw: undefined },
    { text: "ABC xyz", kw: null },
    { text: "ABC xyz", kw: "" },
    { text: "ABC xyz", kw: "   " },
    { text: "ABC xyz", kw: "A" },
    { text: "a.*+?^${}()|[]\\\\", kw: ".*+?^${}()|[]\\\\" }, // 所有特殊字元 + 結尾反斜線
    { text: "Noto Sans", kw: "Sans" },
    { text: "多關鍵字 測試", kw: "測試" },
    { text: "regex edge )(?=x", kw: ")(?=x" }, // 惡意樣式片段
    { text: "表情 😀 emoji", kw: "😀" }, // emoji
    { text: "全形ＡＢＣ 測試", kw: "Ａ" }, // 全形字元
  ];
  const results = cases.map((c, i) => {
    let ok = true;
    let out = "";
    try {
      out = highlight(c.text, c.kw);
      ok = typeof out === "string" && out.length > 0;
    } catch (e) {
      ok = false;
      out = e.message;
    }
    return `${ok ? "✅" : "❌"} #${i + 1} kw=${String(c.kw)} => ${out.slice(0, 60)}${out.length > 60 ? "…" : ""}`;
  });
  return results;
}

function runDataLoadTests() {
  const results = [];
  try {
    assertProjects(seedProjects);
    results.push("✅ seed 結構檢查通過");
  } catch (e) {
    results.push("❌ seed 結構錯誤: " + e.message);
  }
  // 匯入 CSV 解析最小案例
  const csv = "id,name,type,year,tags,url,thumb,layouts\n1,測試案,形象型,2025,品牌|B2B,https://x,https://t,home^首頁^/index.html^Landing^https://t";
  try {
    const arr = parseCSV(csv);
    if (arr.length !== 1 || arr[0].layouts.length !== 1) throw new Error("解析不正確");
    results.push("✅ CSV 解析最小案例通過");
  } catch (e) {
    results.push("❌ CSV 解析失敗: " + e.message);
  }
  return results;
}

function runTests(force = false) {
  const out = [];
  out.push(...runHighlightTests());
  out.push(...runDataLoadTests());
  const hasFail = out.some((s) => s.startsWith("❌"));
  const panel = document.getElementById("test-panel");
  const ul = document.getElementById("test-list");
  if (hasFail || force || /[?&]test=1/.test(location.search) || location.hash === "#/tests") {
    ul.innerHTML = out.map((s) => `<li class="${s.startsWith("❌") ? "fail" : "ok"}">${escapeHtml(s)}</li>`).join("");
    panel.style.display = "block";
  } else {
    panel.style.display = "none";
  }
}

// ====== 9) 啟動流程（外部載入優先） ======
async function boot() {
  // 預設為 auto：嘗試載入 ./projects.json
  try {
    const resp = await fetch("json/projects.json", { cache: "no-store" });
    if (resp.ok) {
      const data = await resp.json();
      assertProjects(data);
      projects = data;
      console.log("[boot] 使用外部 JSON");
    } else {
      console.log("[boot] 外部 JSON 不可用，使用內建資料");
    }
  } catch (e) {
    console.log("[boot] 外部 JSON 載入失敗，使用內建資料", e.message);
  }
  buildTypeChips();
  if (!location.hash || location.hash === "#") {
    location.hash = "#/";
  }
  router();
  runTests();
}
boot();


// 回到頂部按鈕
const topBtn = document.getElementById("TOP");
if (topBtn) {
  // 初始隱藏
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

// 回到頂部按鈕