(() => {
  "use strict";

  const DATA = Array.isArray(window.GIFT_MANIFEST) ? window.GIFT_MANIFEST : [];
  const ANIMATION_MS = 7000;
  const WISHES = {
    "万子睿": "愿你有书可读，有山可攀；<br>每一次出发，都抵达欢喜。",
    "伍思霖": "愿你眼里有光，心中有海；<br>走过的路，都长成辽阔。",
    "刘为易": "愿你手中有事做，心里有人念；<br>平常日子，也有小小的闪光。",
    "刘献雍": "愿你所求皆有回响，所行皆有归途；<br>不慌不忙，自有答案。",
    "刘航": "愿你乘风时尽兴，停泊时安心；<br>远方和归途，都值得期待。",
    "孙博宇": "愿你把热爱装进行囊，把犹豫留在身后；<br>一路向前，自有天光。",
    "孙广益": "愿你有足够的耐心等花开，<br>也有足够的勇气去远方。",
    "张子木": "愿你像树一样安静生长，<br>根扎得深，枝伸得远。",
    "彭盛飞": "愿你心中有旷野，脚下有坦途；<br>想飞的时候，风刚好来。",
    "施一晨": "愿你的每个清晨都有期待，<br>每个夜晚都能安心睡去。",
    "曲厚行": "愿你行过曲折，仍觉得人间值得；<br>走过山海，仍保留温柔。",
    "李初晗": "愿你如初升的晨光，<br>不急着耀眼，却始终明亮。",
    "李子舜": "愿你有少年意气，也有从容底气；<br>想做的事，都来得及。",
    "李延泽": "愿你被岁月温柔以待，<br>也始终有重新出发的勇气。",
    "李林杰": "愿你在自己的节奏里，<br>长成喜欢的模样。",
    "毛天承": "愿你有抬头看云的闲情，<br>也有低头赶路的坚定。",
    "汪义轩": "愿你心里有杆秤，眼里有片天；<br>走得正，也走得远。",
    "汪家齐": "愿你的日子有烟火，也有星光；<br>身边有热闹，心里有安宁。",
    "王江楠": "愿你见过江海的辽阔，<br>也珍惜岸边的灯火。",
    "王泓霖": "愿你逢山有路，遇水有舟；<br>想见的人，都在不远处。",
    "王泽旭": "愿你如旭日初升，<br>把每一个平凡日子照得滚烫。",
    "程书宇": "愿你读万卷书，也行万里路；<br>字里行间，皆是坦途。",
    "胡恩铭": "愿你记得别人的好，也记得自己的珍贵；<br>被世界温柔，也温柔待世界。",
    "董涵宇": "愿你有涵养天地的胸襟，<br>也有守护小小欢喜的柔软。",
    "陈庆霄": "愿你抬头有星河，低头有生活；<br>每一步，都走得踏实。",
    "陈沈楷": "愿你落笔皆从容，落子皆无悔；<br>人生的答卷，写自己喜欢的答案。",
    "齐晟焯": "愿你光明磊落，也热烈自由；<br>所到之处，皆有回响。",
  };
  const wishFor = (name) =>
    WISHES[name] || "愿你所行皆有光，所遇皆温柔；<br>往后的每一天，都值得期待。";
  const wishTextFor = (name) => wishFor(name).replace(/<br\s*\/?>/gi, "\n");
  const SHARE_TEXT = (name) =>
    `${name}，男生节快乐！\n${wishTextFor(name)}\n—— 未央56班`;

  const $ = (id) => document.getElementById(id);

  const gate = $("gate");
  const reveal = $("reveal");
  const siteShell = $("siteShell");
  const form = $("claimForm");
  const input = $("nameInput");
  const openBtn = $("openBtn");
  const openLabel = openBtn.querySelector(".btn-open-label");
  const errorEl = $("nameError");
  const suggestPanel = $("suggestPanel");
  const suggestHint = $("suggestHint");
  const suggestList = $("suggestList");

  const revealTo = $("revealTo");
  const revealTitle = $("revealTitle");
  const cardShell = $("cardShell");
  const cardImage = $("cardImage");
  const cardMeta = $("cardMeta");
  const fileMeta = $("fileMeta");
  const noteText = $("noteText");

  const downloadBtn = $("downloadBtn");
  const downloadLabel = $("downloadLabel");
  const viewBtn = $("viewBtn");
  const copyBtn = $("copyBtn");
  const replayBtn = $("replayBtn");
  const replayTop = $("replayTop");
  const changeBtn = $("changeBtn");
  const changeBtn2 = $("changeBtn2");

  const opening = $("opening");
  const skipBtn = $("skipBtn");
  const animTo = $("animTo");
  const animName = $("animName");
  const animCard = $("animCard");
  const leafField = $("leafField");
  const homeLeaves = $("homeLeaves");
  const stageStars = $("stageStars");
  const sparkField = $("sparkField");

  const lightbox = $("lightbox");
  const lightboxImg = $("lightboxImg");
  const lightboxClose = $("lightboxClose");
  const lightboxScroll = $("lightboxScroll");
  const lightboxLoader = $("lightboxLoader");
  const lightboxDownload = $("lightboxDownload");

  const toastEl = $("toast");

  const state = {
    selected: null,
    animating: false,
    closeTimer: 0,
    timers: [],
    lastFocus: null,
    lightboxFocus: null,
    cardLoaded: false,
    busyDownload: false,
    suggestIndex: -1,
    suggestNames: [],
    composing: false,
    reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  };

  /* ------------------------------------------------------------------ */
  /* utils                                                              */
  /* ------------------------------------------------------------------ */

  const normalizeName = (value) =>
    String(value || "")
      .normalize("NFC")
      .replace(/[\s\u3000]+/g, "")
      .trim();

  const findByInput = (value) => {
    const name = normalizeName(value);
    if (!name) return null;
    return DATA.find((item) => item.name === name) || null;
  };

  const nameMatches = (query) => {
    const q = normalizeName(query);
    if (!q) return DATA.slice();
    return DATA.filter((item) => item.name.includes(q));
  };

  const prefersReduced = () => state.reducedMotion;

  function toast(message, duration = 2300) {
    toastEl.textContent = message;
    toastEl.classList.add("is-showing");
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
      toastEl.classList.remove("is-showing");
    }, duration);
  }

  function setBodyLocked(locked) {
    document.body.classList.toggle("is-locked", locked);
  }

  function setSiteInert(inert) {
    siteShell.inert = inert;
    if (inert) siteShell.setAttribute("aria-hidden", "true");
    else siteShell.removeAttribute("aria-hidden");
  }

  function clearAnimationTimers() {
    state.timers.forEach((timer) => clearTimeout(timer));
    state.timers = [];
    clearTimeout(state.closeTimer);
    state.closeTimer = 0;
  }

  function createLeaf(className, styleVars) {
    const img = document.createElement("img");
    img.src = "assets/leaf-line.png";
    img.alt = "";
    img.width = 512;
    img.height = 512;
    img.decoding = "async";
    img.className = className;
    for (const [key, value] of Object.entries(styleVars)) {
      img.style.setProperty(key, value);
    }
    return img;
  }

  function buildHomeLeaves() {
    const spots = [
      { "--x": "3%", "--y": "18%", "--s": "31px", "--r": "-19deg", "--o": ".24", "--dur": "12s", "--dx": "11px" },
      { "--x": "88%", "--y": "10%", "--s": "22px", "--r": "31deg", "--o": ".28", "--dur": "10s", "--dx": "-7px" },
      { "--x": "91%", "--y": "42%", "--s": "38px", "--r": "12deg", "--o": ".16", "--dur": "14s", "--dx": "-12px" },
      { "--x": "7%", "--y": "61%", "--s": "20px", "--r": "-32deg", "--o": ".2", "--dur": "11s", "--dx": "8px" },
      { "--x": "79%", "--y": "79%", "--s": "28px", "--r": "48deg", "--o": ".14", "--dur": "13s", "--dx": "-9px" },
      { "--x": "13%", "--y": "87%", "--s": "16px", "--r": "8deg", "--o": ".22", "--dur": "9s", "--dx": "6px" },
      { "--x": "47%", "--y": "5%", "--s": "14px", "--r": "-11deg", "--o": ".16", "--dur": "8s", "--dx": "9px" },
      { "--x": "-3%", "--y": "73%", "--s": "74px", "--r": "-22deg", "--o": ".11", "--dur": "16s", "--dx": "14px" },
      { "--x": "85%", "--y": "67%", "--s": "58px", "--r": "26deg", "--o": ".12", "--dur": "15s", "--dx": "-12px" },
      { "--x": "65%", "--y": "90%", "--s": "36px", "--r": "7deg", "--o": ".14", "--dur": "12s", "--dx": "8px" },
    ];
    spots.forEach((spot) => homeLeaves.appendChild(createLeaf("ambient-leaf", spot)));
  }

  function buildFallingLeaves() {
    if (leafField.childElementCount) return;
    const colors = ["#e4c27f", "#d7ae64", "#c2914f", "#f0dcaa", "#b98342"];
    for (let i = 0; i < 16; i += 1) {
      const size = 26 + Math.random() * 34;
      const near = i > 13;
      leafField.appendChild(
        createLeaf("falling-leaf", {
          "--x": `${Math.random() * 104 - 2}%`,
          "--s": `${size.toFixed(1)}px`,
          "--dur": `${(8.5 + Math.random() * 8).toFixed(2)}s`,
          "--delay": `${(-Math.random() * 10).toFixed(2)}s`,
          "--drift": `${(Math.random() * 170 - 85).toFixed(0)}px`,
          "--r": `${(Math.random() * 580 - 290).toFixed(0)}deg`,
          "--o": near ? 0.44 : (0.24 + Math.random() * 0.21).toFixed(2),
          "--c": colors[i % colors.length],
        })
      );
      if (near) leafField.lastElementChild.classList.add("is-near");
    }
  }

  function buildStars() {
    if (!stageStars || stageStars.childElementCount) return;
    for (let i = 0; i < 42; i += 1) {
      const star = document.createElement("span");
      star.className = "star";
      star.style.setProperty("--x", `${(Math.random() * 100).toFixed(2)}%`);
      star.style.setProperty("--y", `${(Math.random() * 100).toFixed(2)}%`);
      star.style.setProperty("--s", `${(1 + Math.random() * 2.6).toFixed(1)}px`);
      star.style.setProperty("--d", `${(2.4 + Math.random() * 3.6).toFixed(2)}s`);
      star.style.setProperty("--delay", `${(-Math.random() * 6).toFixed(2)}s`);
      star.style.setProperty("--o", (0.18 + Math.random() * 0.55).toFixed(2));
      stageStars.appendChild(star);
    }
  }

  function buildSparks() {
    if (!sparkField || sparkField.childElementCount) return;
    for (let i = 0; i < 20; i += 1) {
      const spark = document.createElement("span");
      spark.className = "spark";
      spark.style.setProperty("--x", `${(Math.random() * 100).toFixed(2)}%`);
      spark.style.setProperty("--y", `${(45 + Math.random() * 42).toFixed(2)}%`);
      spark.style.setProperty("--s", `${(2 + Math.random() * 4).toFixed(1)}px`);
      spark.style.setProperty("--dur", `${(2.8 + Math.random() * 3.2).toFixed(2)}s`);
      spark.style.setProperty("--delay", `${(-Math.random() * 4).toFixed(2)}s`);
      spark.style.setProperty("--dx", `${(Math.random() * 80 - 40).toFixed(0)}px`);
      sparkField.appendChild(spark);
    }
  }

  function refreshInputState() {
    input.classList.toggle("has-value", normalizeName(input.value).length > 0);
  }

  /* ------------------------------------------------------------------ */
  /* suggestions                                                        */
  /* ------------------------------------------------------------------ */

  function closeSuggestions() {
    suggestPanel.hidden = true;
    input.setAttribute("aria-expanded", "false");
    state.suggestIndex = -1;
  }

  function paintSuggestions() {
    suggestList.querySelectorAll(".suggest-option").forEach((button, index) => {
      button.classList.toggle("is-active", index === state.suggestIndex);
      button.setAttribute("aria-selected", index === state.suggestIndex ? "true" : "false");
    });
    if (state.suggestIndex >= 0) {
      const active = suggestList.querySelector(".suggest-option.is-active");
      if (active) active.scrollIntoView({ block: "nearest" });
    }
  }

  function renderSuggestions() {
    const q = normalizeName(input.value);
    const matches = nameMatches(q);
    state.suggestNames = matches.map((item) => item.name);
    state.suggestIndex = -1;
    suggestList.textContent = "";

    if (!matches.length) {
      suggestHint.textContent = "没有匹配的名字";
      const empty = document.createElement("p");
      empty.className = "suggest-empty";
      empty.textContent = "换一个字试试，或者核对一下姓名～";
      suggestList.appendChild(empty);
    } else {
      suggestHint.textContent = q ? `${matches.length} 个匹配` : "从 27 位同学中选择";
      matches.forEach((item) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "suggest-option";
        button.setAttribute("role", "option");
        button.setAttribute("aria-selected", "false");
        button.dataset.name = item.name;
        button.textContent = item.name;
        suggestList.appendChild(button);
      });
    }

    suggestPanel.hidden = false;
    input.setAttribute("aria-expanded", "true");
  }

  function chooseSuggestion(name, submit = false) {
    input.value = name;
    refreshInputState();
    closeSuggestions();
    errorEl.textContent = "";
    openBtn.focus({ preventScroll: true });
    if (submit) {
      form.requestSubmit();
    }
  }

  input.addEventListener("focus", () => {
    if (!findByInput(input.value)) renderSuggestions();
  });

  input.addEventListener("input", () => {
    refreshInputState();
    errorEl.textContent = "";
    if (state.composing) return;
    if (findByInput(input.value)) {
      closeSuggestions();
      return;
    }
    renderSuggestions();
  });

  input.addEventListener("compositionstart", () => {
    state.composing = true;
  });

  input.addEventListener("compositionend", () => {
    state.composing = false;
    refreshInputState();
    renderSuggestions();
  });

  input.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeSuggestions();
      return;
    }
    if (event.key === "ArrowDown") {
      if (suggestPanel.hidden) renderSuggestions();
      if (!state.suggestNames.length) return;
      event.preventDefault();
      state.suggestIndex = (state.suggestIndex + 1) % state.suggestNames.length;
      paintSuggestions();
      return;
    }
    if (event.key === "ArrowUp") {
      if (suggestPanel.hidden) renderSuggestions();
      if (!state.suggestNames.length) return;
      event.preventDefault();
      state.suggestIndex =
        state.suggestIndex <= 0 ? state.suggestNames.length - 1 : state.suggestIndex - 1;
      paintSuggestions();
      return;
    }
    if (event.key === "Enter" && !suggestPanel.hidden && state.suggestIndex >= 0) {
      event.preventDefault();
      chooseSuggestion(state.suggestNames[state.suggestIndex], true);
    }
  });

  suggestList.addEventListener("click", (event) => {
    const option = event.target.closest(".suggest-option");
    if (!option) return;
    chooseSuggestion(option.dataset.name);
  });

  document.addEventListener("pointerdown", (event) => {
    if (!event.target.closest(".name-control") && event.target !== input) {
      closeSuggestions();
    }
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const entry = findByInput(input.value);
    if (!entry) {
      errorEl.textContent = normalizeName(input.value)
        ? "没有找到这个名字，请从名单中选择～"
        : "先写下你的名字，再拆礼物哦。";
      errorEl.classList.remove("is-shaking");
      void errorEl.offsetWidth;
      errorEl.classList.add("is-shaking");
      renderSuggestions();
      input.focus({ preventScroll: true });
      return;
    }
    errorEl.textContent = "";
    closeSuggestions();
    beginGift(entry);
  });

  /* ------------------------------------------------------------------ */
  /* reveal preparation                                                 */
  /* ------------------------------------------------------------------ */

  function prepareReveal(entry) {
    state.selected = entry;
    state.cardLoaded = false;

    revealTo.textContent = entry.name;
    animTo.textContent = entry.name;
    animName.textContent = entry.name;
    cardImage.alt = `${entry.name}的男生节贺图`;
    cardMeta.textContent = `${entry.w} × ${entry.h}`;
    fileMeta.textContent = `PNG 原图 · ${entry.origMB} MB · ${entry.w} × ${entry.h}`;
    noteText.innerHTML = wishFor(entry.name);

    cardShell.classList.remove("is-loaded");
    cardImage.onload = () => {
      state.cardLoaded = true;
      cardShell.classList.add("is-loaded");
    };
    cardImage.onerror = () => {
      cardImage.onerror = null;
      cardImage.src = entry.thumb;
    };
    cardImage.src = entry.preview;
    if (animCard) {
      animCard.onerror = () => {
        animCard.onerror = null;
        animCard.src = entry.thumb;
      };
      animCard.src = entry.preview;
    }
    if (cardImage.complete && cardImage.naturalWidth > 0) {
      state.cardLoaded = true;
      cardShell.classList.add("is-loaded");
    }

    lightboxImg.removeAttribute("src");
    lightboxLoader.classList.remove("is-hidden");
  }

  function showRevealNow(entry) {
    if (entry) prepareReveal(entry);
    clearAnimationTimers();
    opening.hidden = true;
    opening.classList.remove("is-open", "is-closing");
    gate.hidden = true;
    reveal.hidden = false;
    setSiteInert(false);
    setBodyLocked(false);
    window.scrollTo({ top: 0, behavior: "auto" });
    revealTitle.setAttribute("tabindex", "-1");
    requestAnimationFrame(() => revealTitle.focus({ preventScroll: true }));
  }

  function beginGift(entry) {
    if (!entry || state.animating) return;
    if (prefersReduced()) {
      showRevealNow(entry);
      return;
    }

    state.selected = entry;
    prepareReveal(entry);
    gate.hidden = false;
    reveal.hidden = false;
    setBodyLocked(true);
    window.scrollTo({ top: 0, behavior: "auto" });
    startOpening();
  }

  function startOpening() {
    clearAnimationTimers();
    state.animating = true;
    state.lastFocus = document.activeElement;

    opening.hidden = true;
    opening.classList.remove("is-open", "is-closing");
    void opening.offsetWidth;
    opening.hidden = false;
    opening.tabIndex = -1;
    opening.setAttribute("role", "dialog");
    opening.setAttribute("aria-modal", "true");
    setSiteInert(true);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        opening.classList.add("is-open");
        opening.focus({ preventScroll: true });
      });
    });

    state.timers.push(setTimeout(() => finishOpening(false), ANIMATION_MS));
  }

  function finishOpening(byUser) {
    if (!state.animating) return;
    state.animating = false;
    clearAnimationTimers();
    opening.classList.add("is-closing");
    opening.classList.remove("is-open");

    const delay = prefersReduced() ? 20 : 360;
    state.closeTimer = setTimeout(() => {
      opening.hidden = true;
      opening.classList.remove("is-closing");
      gate.hidden = true;
      reveal.hidden = false;
      setSiteInert(false);
      setBodyLocked(false);
      lightboxLoader.classList.remove("is-hidden");
      window.scrollTo({ top: 0, behavior: "auto" });
      revealTitle.setAttribute("tabindex", "-1");
      requestAnimationFrame(() => {
        revealTitle.focus({ preventScroll: true });
      });
      if (byUser) {
        toast("祝福已经为你留好", 1800);
      }
    }, delay);
  }

  skipBtn.addEventListener("click", () => finishOpening(true));

  /* ------------------------------------------------------------------ */
  /* navigation                                                         */
  /* ------------------------------------------------------------------ */

  function backToGate() {
    clearAnimationTimers();
    state.animating = false;
    opening.hidden = true;
    opening.classList.remove("is-open", "is-closing");
    setSiteInert(false);
    setBodyLocked(false);
    reveal.hidden = true;
    gate.hidden = false;
    window.scrollTo({ top: 0, behavior: "auto" });

    if (history.replaceState) {
      history.replaceState(null, "", location.pathname + location.hash);
    }

    requestAnimationFrame(() => {
      input.focus({ preventScroll: true });
      refreshInputState();
    });
    setTimeout(() => cardImage.removeAttribute("src"), 240);
  }

  changeBtn.addEventListener("click", backToGate);
  changeBtn2.addEventListener("click", backToGate);
  replayBtn.addEventListener("click", () => {
    if (!state.selected) return;
    prepareReveal(state.selected);
    gate.hidden = true;
    reveal.hidden = false;
    setBodyLocked(true);
    startOpening();
  });
  replayTop.addEventListener("click", () => {
    if (!state.selected) return;
    prepareReveal(state.selected);
    gate.hidden = true;
    reveal.hidden = false;
    setBodyLocked(true);
    startOpening();
  });

  /* ------------------------------------------------------------------ */
  /* download                                                           */
  /* ------------------------------------------------------------------ */

  function isIOS() {
    return (
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
    );
  }

  function downloadName(entry) {
    return `${entry.name}_男生节快乐.png`;
  }

  function triggerAnchorDownload(href, filename, newTab = false) {
    const anchor = document.createElement("a");
    anchor.href = href;
    anchor.download = filename;
    if (newTab) {
      anchor.target = "_blank";
      anchor.rel = "noopener";
    }
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  }

  function setDownloadBusy(busy) {
    state.busyDownload = busy;
    downloadBtn.classList.toggle("is-loading", busy);
    downloadBtn.disabled = busy;
    lightboxDownload.disabled = busy;
    downloadLabel.textContent = busy ? "正在准备原图…" : "下载原图";
    lightboxDownload.textContent = busy ? "准备中…" : "下载原图";
  }

  async function downloadOriginal() {
    const entry = state.selected;
    if (!entry || state.busyDownload) return;

    setDownloadBusy(true);
    const filename = downloadName(entry);
    const absoluteUrl = new URL(entry.orig, location.href).href;

    try {
      const response = await fetch(entry.orig, { cache: "force-cache" });
      if (!response.ok) throw new Error("fetch failed");
      const blob = await response.blob();

      if (isIOS() && navigator.canShare) {
        const file = new File([blob], filename, { type: "image/png" });
        if (navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({ files: [file], title: filename });
            toast("在分享面板里选择「存储图像」即可保存");
            setDownloadBusy(false);
            return;
          } catch (shareError) {
            if (shareError && shareError.name === "AbortError") {
              setDownloadBusy(false);
              return;
            }
          }
        }
      }

      const objectUrl = URL.createObjectURL(blob);
      triggerAnchorDownload(objectUrl, filename);
      setTimeout(() => URL.revokeObjectURL(objectUrl), 30000);
      toast("原图已开始下载");
    } catch (error) {
      try {
        triggerAnchorDownload(absoluteUrl, filename, isIOS());
        toast(isIOS() ? "已打开原图，长按图片即可保存" : "已打开原图，可长按保存", 3200);
      } catch (fallbackError) {
        window.open(absoluteUrl, "_blank", "noopener");
        toast("已打开原图，长按图片保存", 3200);
      }
    } finally {
      setDownloadBusy(false);
    }
  }

  downloadBtn.addEventListener("click", downloadOriginal);
  lightboxDownload.addEventListener("click", downloadOriginal);

  /* ------------------------------------------------------------------ */
  /* copy                                                               */
  /* ------------------------------------------------------------------ */

  async function copyBlessing() {
    const entry = state.selected;
    if (!entry) return;
    const text = SHARE_TEXT(entry.name);

    const fallback = () => {
      const area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.top = "-1000px";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      area.setSelectionRange(0, area.value.length);
      let ok = false;
      try {
        ok = document.execCommand("copy");
      } catch (error) {
        ok = false;
      }
      area.remove();
      if (ok) {
        toast("祝福已复制，可以发给重要的人啦");
        if (navigator.vibrate) navigator.vibrate(12);
      } else {
        toast("复制没有成功，可以长按寄语手动复制", 3000);
      }
    };

    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        toast("祝福已复制，可以发给重要的人啦");
        if (navigator.vibrate) navigator.vibrate(12);
        return;
      } catch (error) {
        fallback();
        return;
      }
    }
    fallback();
  }

  copyBtn.addEventListener("click", copyBlessing);

  /* ------------------------------------------------------------------ */
  /* lightbox                                                           */
  /* ------------------------------------------------------------------ */

  function openLightbox() {
    const entry = state.selected;
    if (!entry) return;
    state.lightboxFocus = document.activeElement;
    lightbox.hidden = false;
    setBodyLocked(true);
    setSiteInert(true);
    lightboxImg.alt = `${entry.name}的男生节贺图（大图）`;
    lightboxImg.src = entry.preview;
    lightboxLoader.classList.remove("is-hidden");
    lightboxClose.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "auto" });

    const full = new Image();
    full.onload = () => {
      if (lightbox.hidden) return;
      lightboxImg.src = entry.orig;
      lightboxLoader.classList.add("is-hidden");
    };
    full.onerror = () => {
      if (!lightbox.hidden) {
        lightboxLoader.classList.add("is-hidden");
        toast("高清图加载较慢，已显示清晰预览", 2400);
      }
    };
    full.src = entry.orig;
  }

  function closeLightbox() {
    if (lightbox.hidden) return;
    lightbox.hidden = true;
    setSiteInert(false);
    setBodyLocked(false);
    lightboxImg.removeAttribute("src");
    if (state.lightboxFocus && state.lightboxFocus.focus) {
      state.lightboxFocus.focus({ preventScroll: true });
    }
  }

  viewBtn.addEventListener("click", openLightbox);
  lightboxClose.addEventListener("click", closeLightbox);
  lightboxScroll.addEventListener("click", (event) => {
    if (event.target === lightboxScroll) closeLightbox();
  });
  lightbox.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeLightbox();
      return;
    }
    if (event.key !== "Tab") return;
    const focusables = [lightboxClose, lightboxDownload];
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  /* ------------------------------------------------------------------ */
  /* deep link / boot                                                   */
  /* ------------------------------------------------------------------ */

  function boot() {
    buildHomeLeaves();
    buildFallingLeaves();
    buildStars();
    buildSparks();

    if (!DATA.length) {
      openBtn.disabled = true;
      openLabel.textContent = "名单加载失败，请刷新";
      return;
    }

    const params = new URLSearchParams(location.search);
    const directName = params.get("to") || params.get("name");
    const instant = params.get("instant") === "1";

    if (directName) {
      input.value = directName;
      refreshInputState();
      const entry = findByInput(directName);
      if (entry) {
        if (instant || prefersReduced()) {
          setTimeout(() => showRevealNow(entry), 120);
        } else {
          setTimeout(() => beginGift(entry), 450);
        }
      } else {
        setTimeout(() => {
          errorEl.textContent = "链接里的名字不在名单中，请重新选择～";
          renderSuggestions();
        }, 450);
      }
    }
  }

  boot();
})();
