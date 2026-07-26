(() => {
  "use strict";

  const languages = [
    ["auto", "自动识别"], ["zh-CN", "简体中文"], ["zh-TW", "繁体中文"],
    ["en", "英语"], ["ja", "日语"], ["ko", "韩语"], ["fr", "法语"],
    ["de", "德语"], ["es", "西班牙语"], ["ru", "俄语"], ["ar", "阿拉伯语"],
    ["pt", "葡萄牙语"], ["it", "意大利语"], ["th", "泰语"], ["vi", "越南语"]
  ];

  const $ = (id) => document.getElementById(id);
  const sourceSelect = $("sourceLanguage");
  const targetSelect = $("targetLanguage");
  const sourceText = $("sourceText");
  const translatedText = $("translatedText");
  const status = $("translationStatus");
  const translateButton = $("translateButton");
  const historyKey = "qingyi-static-history-v1";
  const themeKey = "qingyi-static-theme";
  let history = readHistory();
  let detectedLanguage = "";
  let debounceTimer = 0;
  let requestNumber = 0;
  let showingFavorites = false;
  let toastTimer = 0;

  function initialize() {
    languages.forEach(([code, name], index) => {
      sourceSelect.add(new Option(name, code));
      if (index > 0) targetSelect.add(new Option(name, code));
    });
    targetSelect.value = "en";

    const savedTheme = localStorage.getItem(themeKey);
    if (savedTheme === "dark" || (!savedTheme && matchMedia("(prefers-color-scheme: dark)").matches)) {
      document.documentElement.classList.add("dark");
    }

    bindEvents();
    renderHistory();
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("/translate/sw.js").catch(() => {});
  }

  function bindEvents() {
    sourceText.addEventListener("input", () => {
      $("characterCount").textContent = `${sourceText.value.length} / 5000`;
      clearTimeout(debounceTimer);
      if (!sourceText.value.trim()) {
        requestNumber++;
        setResult("", "等待输入");
        return;
      }
      debounceTimer = window.setTimeout(translate, 650);
    });

    sourceSelect.addEventListener("change", scheduleTranslation);
    targetSelect.addEventListener("change", scheduleTranslation);
    translateButton.addEventListener("click", translate);
    $("retryButton").addEventListener("click", translate);
    $("clearButton").addEventListener("click", () => {
      sourceText.value = "";
      sourceText.dispatchEvent(new Event("input"));
      sourceText.focus();
    });
    $("swapButton").addEventListener("click", swapLanguages);
    $("copySourceButton").addEventListener("click", () => copyText(sourceText.value));
    $("copyTargetButton").addEventListener("click", () => copyText(currentTranslation()));
    $("speakSourceButton").addEventListener("click", () => speak(sourceText.value, sourceSelect.value));
    $("speakTargetButton").addEventListener("click", () => speak(currentTranslation(), targetSelect.value));
    $("favoriteButton").addEventListener("click", toggleCurrentFavorite);
    $("themeButton").addEventListener("click", toggleTheme);
    $("viewTranslate").addEventListener("click", () => switchView("translate"));
    $("viewHistory").addEventListener("click", () => switchView("history"));
    $("allHistoryButton").addEventListener("click", () => setHistoryFilter(false));
    $("favoriteHistoryButton").addEventListener("click", () => setHistoryFilter(true));
    $("clearHistoryButton").addEventListener("click", clearHistory);
    document.addEventListener("keydown", (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
        event.preventDefault();
        translate();
      }
    });
  }

  function scheduleTranslation() {
    if (!sourceText.value.trim()) return;
    clearTimeout(debounceTimer);
    debounceTimer = window.setTimeout(translate, 120);
  }

  async function translate() {
    const text = sourceText.value.trim();
    if (!text) return showToast("请先输入需要翻译的内容");
    const source = sourceSelect.value;
    const target = targetSelect.value;
    if (source === target) {
      setResult(text, "语言相同");
      return;
    }

    const activeRequest = ++requestNumber;
    setLoading(true);
    try {
      const result = await translateChunks(text, source, target);
      if (activeRequest !== requestNumber) return;
      detectedLanguage = result.detectedLanguage || source;
      setResult(result.translatedText, detectedLanguage && source === "auto"
        ? `已识别为${languageName(detectedLanguage) || detectedLanguage}`
        : "翻译完成");
      addHistory(text, result.translatedText, source, target, detectedLanguage);
    } catch (error) {
      if (activeRequest !== requestNumber) return;
      translatedText.textContent = "当前网络无法连接翻译服务，请稍后重试";
      translatedText.className = "translated-text error";
      status.textContent = "翻译失败";
    } finally {
      if (activeRequest === requestNumber) setLoading(false);
    }
  }

  async function translateChunks(text, source, target) {
    const chunks = splitText(text, 450);
    const output = [];
    let detected = source === "auto" ? "" : source;

    for (const chunk of chunks) {
      let result;
      try {
        result = await translateMyMemory(chunk, source, target);
        if (isSuspiciousTranslation(chunk, result.translatedText, source, target)) {
          throw new Error("Low quality translation");
        }
      } catch (_) {
        result = await translateGoogle(chunk, source, target);
      }
      if (isSuspiciousTranslation(chunk, result.translatedText, source, target)) {
        throw new Error("Translation quality check failed");
      }
      output.push(result.translatedText);
      if (!detected && result.detectedLanguage) detected = result.detectedLanguage;
    }

    return { translatedText: output.join(""), detectedLanguage: detected };
  }

  function isSuspiciousTranslation(original, translated, source, target) {
    const inputValue = String(original || "").trim();
    const outputValue = String(translated || "").trim();
    if (!outputValue) return true;

    const compactInput = inputValue.replace(/\s+/g, "");
    const compactOutput = outputValue.replace(/\s+/g, "");
    if (source !== target && compactInput.length > 1
      && compactInput.toLocaleLowerCase() === compactOutput.toLocaleLowerCase()) return true;

    if (/([A-Za-z])\1{7,}/.test(outputValue)) return true;

    const latin = (outputValue.match(/[A-Za-z]/g) || []).length;
    const han = (outputValue.match(/[\u3400-\u9FFF]/g) || []).length;
    const meaningful = latin + han + (outputValue.match(/[0-9]/g) || []).length;
    if ((target === "zh-CN" || target === "zh-TW")
      && meaningful >= 4 && latin >= 6 && latin > han * 2) return true;

    const letterPattern = /[A-Za-z\u3400-\u9FFF\u3040-\u30FF\uAC00-\uD7AF]/g;
    const inputLetters = (inputValue.match(letterPattern) || []).length;
    const outputLetters = (outputValue.match(letterPattern) || []).length;
    return inputLetters >= 8 && outputLetters * 6 < inputLetters;
  }

  async function translateGoogle(text, source, target) {
    const params = new URLSearchParams({
      client: "gtx", sl: source === "auto" ? "auto" : source,
      tl: target, dt: "t", q: text
    });
    const response = await fetchWithTimeout(`https://translate.googleapis.com/translate_a/single?${params}`);
    if (!response.ok) throw new Error(`Google ${response.status}`);
    const data = await response.json();
    if (!Array.isArray(data) || !Array.isArray(data[0])) throw new Error("Invalid response");
    const value = data[0].map((part) => Array.isArray(part) ? part[0] || "" : "").join("");
    if (!value) throw new Error("Empty response");
    return { translatedText: value, detectedLanguage: typeof data[2] === "string" ? data[2] : source };
  }

  async function translateMyMemory(text, source, target) {
    const params = new URLSearchParams({
      q: text, langpair: `${source === "auto" ? "autodetect" : source}|${target}`
    });
    const response = await fetchWithTimeout(`https://api.mymemory.translated.net/get?${params}`);
    if (!response.ok) throw new Error(`MyMemory ${response.status}`);
    const data = await response.json();
    if (Number(data.responseStatus) !== 200 || !data.responseData?.translatedText) {
      throw new Error(data.responseDetails || "Empty response");
    }
    return {
      translatedText: data.responseData.translatedText,
      detectedLanguage: data.responseData.detectedLanguage || source
    };
  }

  async function fetchWithTimeout(url) {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 8000);
    try {
      return await fetch(url, { headers: { Accept: "application/json" }, signal: controller.signal });
    } finally {
      clearTimeout(timer);
    }
  }

  function splitText(text, maxLength) {
    const chunks = [];
    let remaining = text;
    while (remaining.length > maxLength) {
      const candidate = remaining.slice(0, maxLength);
      const boundaries = ["\n", "。", "！", "？", ". ", "! ", "? ", " "]
        .map((mark) => candidate.lastIndexOf(mark));
      const best = Math.max(...boundaries);
      const splitAt = best > maxLength * .45 ? best + 1 : maxLength;
      chunks.push(remaining.slice(0, splitAt));
      remaining = remaining.slice(splitAt);
    }
    if (remaining) chunks.push(remaining);
    return chunks;
  }

  function setLoading(loading) {
    translateButton.disabled = loading;
    translateButton.textContent = loading ? "正在翻译…" : "立即翻译";
    if (loading) status.textContent = "正在连接翻译服务…";
  }

  function setResult(value, statusText) {
    if (value) {
      translatedText.textContent = value;
      translatedText.className = "translated-text";
    } else {
      translatedText.textContent = "译文会显示在这里";
      translatedText.className = "translated-text empty";
    }
    status.textContent = statusText;
    updateFavoriteButton();
  }

  function currentTranslation() {
    return translatedText.classList.contains("empty") || translatedText.classList.contains("error")
      ? "" : translatedText.textContent;
  }

  function swapLanguages() {
    const source = sourceSelect.value === "auto" ? detectedLanguage : sourceSelect.value;
    if (!source || source === "auto") return showToast("请先完成一次语言识别");
    const target = targetSelect.value;
    sourceSelect.value = target;
    targetSelect.value = source;
    const translated = currentTranslation();
    if (translated) {
      const original = sourceText.value;
      sourceText.value = translated;
      $("characterCount").textContent = `${translated.length} / 5000`;
      setResult(original, "已交换语言");
    }
  }

  async function copyText(value) {
    if (!value) return showToast("当前没有可复制的内容");
    try {
      await navigator.clipboard.writeText(value);
      showToast("已复制");
    } catch (_) {
      const input = document.createElement("textarea");
      input.value = value;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      input.remove();
      showToast("已复制");
    }
  }

  function speak(value, language) {
    if (!value) return showToast("当前没有可朗读的内容");
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(value);
    utterance.lang = language === "auto" ? detectedLanguage || "zh-CN" : language;
    speechSynthesis.speak(utterance);
  }

  function languageName(code) {
    const normalized = String(code || "").toLowerCase();
    return languages.find(([value]) => value.toLowerCase() === normalized)?.[1] || "";
  }

  function addHistory(source, translated, sourceLanguage, targetLanguage, detected) {
    const duplicate = history.find((item) =>
      item.source === source && item.translated === translated && item.targetLanguage === targetLanguage);
    const record = {
      id: duplicate?.id || `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      source, translated, sourceLanguage, targetLanguage, detected,
      favorite: duplicate?.favorite || false, createdAt: Date.now()
    };
    history = [record, ...history.filter((item) => item.id !== record.id)].slice(0, 30);
    saveHistory();
    renderHistory();
    updateFavoriteButton();
  }

  function readHistory() {
    try {
      const parsed = JSON.parse(localStorage.getItem(historyKey) || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch (_) {
      return [];
    }
  }

  function saveHistory() {
    localStorage.setItem(historyKey, JSON.stringify(history));
  }

  function toggleCurrentFavorite() {
    const translated = currentTranslation();
    if (!translated) return showToast("完成翻译后才能收藏");
    const item = history.find((record) =>
      record.source === sourceText.value.trim() && record.translated === translated);
    if (!item) return;
    item.favorite = !item.favorite;
    saveHistory();
    renderHistory();
    updateFavoriteButton();
    showToast(item.favorite ? "已收藏" : "已取消收藏");
  }

  function updateFavoriteButton() {
    const translated = currentTranslation();
    const item = history.find((record) =>
      record.source === sourceText.value.trim() && record.translated === translated);
    $("favoriteButton").textContent = item?.favorite ? "已收藏" : "收藏";
    $("favoriteButton").classList.toggle("active", Boolean(item?.favorite));
  }

  function renderHistory() {
    const list = $("historyList");
    const records = showingFavorites ? history.filter((item) => item.favorite) : history;
    list.replaceChildren();
    if (!records.length) {
      const empty = document.createElement("div");
      empty.className = "empty-history";
      empty.textContent = showingFavorites ? "还没有收藏记录" : "翻译记录会显示在这里";
      list.appendChild(empty);
      return;
    }
    records.forEach((record) => list.appendChild(createHistoryItem(record)));
  }

  function createHistoryItem(record) {
    const item = document.createElement("article");
    item.className = "history-item";
    const source = document.createElement("div");
    source.innerHTML = `<p>${escapeHtml(languageName(record.detected || record.sourceLanguage) || "自动识别")}</p><strong>${escapeHtml(record.source)}</strong>`;
    const target = document.createElement("div");
    target.innerHTML = `<p>${escapeHtml(languageName(record.targetLanguage))}</p><strong>${escapeHtml(record.translated)}</strong><p class="history-meta">${new Date(record.createdAt).toLocaleString("zh-CN")}</p>`;
    const actions = document.createElement("div");
    actions.className = "history-actions";
    const use = historyButton("使用", () => useHistory(record));
    const favorite = historyButton(record.favorite ? "★" : "☆", () => {
      record.favorite = !record.favorite;
      saveHistory();
      renderHistory();
    });
    const remove = historyButton("删除", () => {
      history = history.filter((item) => item.id !== record.id);
      saveHistory();
      renderHistory();
    });
    actions.append(use, favorite, remove);
    item.append(source, target, actions);
    return item;
  }

  function historyButton(label, action) {
    const button = document.createElement("button");
    button.className = "text-button";
    button.type = "button";
    button.textContent = label;
    button.addEventListener("click", action);
    return button;
  }

  function useHistory(record) {
    sourceSelect.value = record.sourceLanguage;
    targetSelect.value = record.targetLanguage;
    sourceText.value = record.source;
    $("characterCount").textContent = `${record.source.length} / 5000`;
    detectedLanguage = record.detected || "";
    setResult(record.translated, "来自历史记录");
    switchView("translate");
  }

  function clearHistory() {
    if (!history.length || !confirm("确定清空当前设备上的全部翻译记录吗？")) return;
    history = [];
    saveHistory();
    renderHistory();
  }

  function setHistoryFilter(favorites) {
    showingFavorites = favorites;
    $("allHistoryButton").classList.toggle("active", !favorites);
    $("favoriteHistoryButton").classList.toggle("active", favorites);
    renderHistory();
  }

  function switchView(view) {
    const isTranslate = view === "translate";
    $("translateView").hidden = !isTranslate;
    $("historyView").hidden = isTranslate;
    $("viewTranslate").classList.toggle("active", isTranslate);
    $("viewHistory").classList.toggle("active", !isTranslate);
    if (!isTranslate) renderHistory();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function toggleTheme() {
    const dark = document.documentElement.classList.toggle("dark");
    localStorage.setItem(themeKey, dark ? "dark" : "light");
  }

  function showToast(message) {
    const toast = $("toast");
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("show"), 1800);
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[character]);
  }

  initialize();
})();
