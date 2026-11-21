(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const introPanel = $("introPanel");
  const showPanel = $("showPanel");
  const qrPanel = $("qrPanel");
  const playBtn = $("playBtn");
  const skipBtn = $("skipBtn");
  const replayBtn = $("replayBtn");
  const qrCode = $("qrCode");
  const qrUrl = $("qrUrl");
  const openLink = $("openLink");
  const leaves = $("stageLeaves");

  const SHOW_MS = 6800;
  let timer = 0;
  let qrRendered = false;

  const pageUrl = new URL(".", location.href).href;
  const isLocalFile = location.protocol === "file:";

  function prettyUrl(url) {
    try {
      const parsed = new URL(url);
      return parsed.host + parsed.pathname.replace(/index\.html$/, "");
    } catch (error) {
      return url;
    }
  }

  function createLeaf() {
    const img = document.createElement("img");
    img.src = "assets/leaf-line.png";
    img.alt = "";
    img.width = 512;
    img.height = 512;
    img.decoding = "async";
    img.className = "stage-leaf";
    img.style.setProperty("--x", `${Math.random() * 104 - 2}%`);
    img.style.setProperty("--s", `${(34 + Math.random() * 38).toFixed(1)}px`);
    img.style.setProperty("--dur", `${(9 + Math.random() * 9).toFixed(2)}s`);
    img.style.setProperty("--delay", `${(-Math.random() * 12).toFixed(2)}s`);
    img.style.setProperty("--drift", `${(Math.random() * 240 - 120).toFixed(0)}px`);
    img.style.setProperty("--r", `${(Math.random() * 620 - 310).toFixed(0)}deg`);
    img.style.setProperty("--o", (0.22 + Math.random() * 0.24).toFixed(2));
    return img;
  }

  function buildLeaves() {
    for (let i = 0; i < 16; i += 1) leaves.appendChild(createLeaf());
  }

  function renderQr() {
    if (qrRendered) return;
    qrRendered = true;

    openLink.href = isLocalFile ? "index.html" : pageUrl;

    if (isLocalFile) {
      const empty = document.createElement("div");
      empty.className = "qr-empty";
      empty.innerHTML = "本地预览无法生成可扫码链接<br>部署到公网后，这里会自动出现二维码";
      qrCode.appendChild(empty);
      qrUrl.textContent = "本地预览 · 部署后显示正式链接";
      return;
    }

    try {
      const qr = qrcode(0, "M");
      qr.addData(pageUrl);
      qr.make();
      qrCode.innerHTML = qr.createSvgTag({ cellSize: 7, margin: 2 });
      const svg = qrCode.querySelector("svg");
      if (svg) {
        svg.setAttribute("role", "img");
        svg.setAttribute("aria-label", "未央56男生节祝福领取页二维码");
      }
      qrUrl.textContent = prettyUrl(pageUrl);
      qrUrl.title = pageUrl;
    } catch (error) {
      const empty = document.createElement("div");
      empty.className = "qr-empty";
      empty.textContent = "二维码生成失败，请直接打开链接：" + pageUrl;
      qrCode.appendChild(empty);
      qrUrl.textContent = pageUrl;
    }
  }

  function clearTimer() {
    clearTimeout(timer);
    timer = 0;
  }

  function showQr() {
    clearTimer();
    showPanel.hidden = true;
    qrPanel.hidden = true;
    void qrPanel.offsetWidth;
    qrPanel.hidden = false;
    renderQr();
    replayBtn.focus({ preventScroll: true });
  }

  function restartAnimationTargets() {
    showPanel.hidden = true;
    void showPanel.offsetWidth;
    showPanel.hidden = false;
  }

  function playShow() {
    clearTimer();
    introPanel.hidden = true;
    qrPanel.hidden = true;
    restartAnimationTargets();

    if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {});
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    timer = setTimeout(showQr, reduced ? 400 : SHOW_MS);
  }

  playBtn.addEventListener("click", playShow);
  skipBtn.addEventListener("click", showQr);
  replayBtn.addEventListener("click", playShow);

  buildLeaves();

  const view = new URLSearchParams(location.search).get("view");
  if (view === "qr") {
    introPanel.hidden = true;
    showPanel.hidden = true;
    qrPanel.hidden = false;
    renderQr();
  } else if (view === "show") {
    introPanel.hidden = true;
    qrPanel.hidden = true;
    showPanel.hidden = false;
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      timer = setTimeout(showQr, SHOW_MS);
    }
  } else if (new URLSearchParams(location.search).get("autoplay") === "1") {
    setTimeout(playShow, 500);
  }
})();
