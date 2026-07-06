const DEFAULT_PLAN = {
  "site": {
    "brand": "Edelweisschen",
    "title": "Streamplan",
    "eyebrow": "Edelweisschen",
    "weekLabel": "06.07.2026 bis 12.07.2026",
    "emptyText": "TBA – to be announced",
    "streamStatus": {
      "status": "offline",
      "label": "Livestream",
      "onlineText": "gerade live",
      "offlineText": "gerade offline"
    },
    "socialLinks": [
      {
        "label": "Twitch",
        "url": "https://www.twitch.tv/edelweisschen"
      },
      {
        "label": "Instagram",
        "url": "https://www.instagram.com/"
      },
      {
        "label": "Discord",
        "url": "https://discord.com/"
      }
    ]
  },
  "schedule": [
    {
      "day": "Montag",
      "dateLabel": "06.07.2026",
      "streams": [
        {
          "time": "TBA",
          "title": "Split Fiction mit Kalle",
          "categories": [
            "Split Fiction"
          ],
          "note": "Co-op-Stream. Die genaue Uhrzeit wird noch angekündigt.",
          "coverUrl": "https://static-cdn.jtvnw.net/ttv-boxart/1354355809_IGDB-285x380.jpg",
          "coverAlt": "Twitch Game Cover zu Split Fiction"
        }
      ]
    },
    {
      "day": "Dienstag",
      "dateLabel": "07.07.2026",
      "streams": [
        {
          "time": "TBA",
          "title": "TBA",
          "categories": [],
          "note": "to be announced"
        }
      ]
    },
    {
      "day": "Mittwoch",
      "dateLabel": "08.07.2026",
      "streams": [
        {
          "time": "TBA",
          "title": "TBA",
          "categories": [],
          "note": "to be announced"
        }
      ]
    },
    {
      "day": "Donnerstag",
      "dateLabel": "09.07.2026",
      "streams": [
        {
          "time": "TBA",
          "title": "TBA",
          "categories": [],
          "note": "to be announced"
        }
      ]
    },
    {
      "day": "Freitag",
      "dateLabel": "10.07.2026",
      "streams": [
        {
          "time": "TBA",
          "title": "TBA",
          "categories": [],
          "note": "to be announced"
        }
      ]
    },
    {
      "day": "Samstag",
      "dateLabel": "11.07.2026",
      "streams": [
        {
          "time": "",
          "title": "Off-Day",
          "categories": [],
          "note": "Heute ist kein Stream geplant."
        }
      ]
    },
    {
      "day": "Sonntag",
      "dateLabel": "12.07.2026",
      "streams": [
        {
          "time": "TBA",
          "title": "TBA",
          "categories": [],
          "note": "to be announced"
        }
      ]
    }
  ]
};

const dayOrder = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];
const themeStorageKey = "edelweisschen-streamplan-theme";
const viewStorageKey = "edelweisschen-streamplan-view";
const SVG_NS = "http://www.w3.org/2000/svg";
const edelweissPetals = [
  "M32 5.5c4.4 7.7 4.8 15 0 21.8-4.8-6.8-4.4-14.1 0-21.8Z",
  "M51.9 12.1c-1 8.7-5.1 14.8-12.4 17.5.9-8.2 5.2-14 12.4-17.5Z",
  "M60.5 32.9c-7 5-14.1 6-21.2 2.6 6.1-5.2 13.1-6 21.2-2.6Z",
  "M49.4 56.1c-8.3-2.1-13.6-6.8-15.6-14.4 7.8 1.9 13 6.8 15.6 14.4Z",
  "M14.6 56.1c2.7-7.6 7.8-12.5 15.6-14.4-2 7.6-7.3 12.3-15.6 14.4Z",
  "M3.5 32.9c8.1-3.4 15.1-2.6 21.2 2.6-7.1 3.4-14.2 2.4-21.2-2.6Z",
  "M12.1 12.1c7.2 3.5 11.5 9.3 12.4 17.5-7.3-2.7-11.4-8.8-12.4-17.5Z"
];

function safeGetStorage(key) {
  try {
    return window.localStorage?.getItem(key) || "";
  } catch (error) {
    return "";
  }
}

function safeSetStorage(key, value) {
  try {
    window.localStorage?.setItem(key, value);
  } catch (error) {
    // Lokale content:// Vorschauen erlauben Storage nicht immer. Der Toggle funktioniert trotzdem für die aktuelle Ansicht.
  }
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function splitCategories(value) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeText(value, fallback = "") {
  return value === undefined || value === null ? fallback : String(value);
}

function normalizeStreamStatus(value) {
  const source = value && typeof value === "object" ? value : {};
  const rawStatus = normalizeText(source.status, DEFAULT_PLAN.site.streamStatus.status).trim().toLowerCase();
  const status = rawStatus === "online" ? "online" : "offline";

  return {
    status,
    label: normalizeText(source.label, DEFAULT_PLAN.site.streamStatus.label),
    onlineText: normalizeText(source.onlineText, DEFAULT_PLAN.site.streamStatus.onlineText),
    offlineText: normalizeText(source.offlineText, DEFAULT_PLAN.site.streamStatus.offlineText)
  };
}

function normalizePlan(plan) {
  const safe = plan && typeof plan === "object" ? plan : {};
  const site = {
    ...DEFAULT_PLAN.site,
    ...(safe.site || {})
  };

  site.socialLinks = Array.isArray(site.socialLinks)
    ? site.socialLinks.map((link) => ({
        label: normalizeText(link?.label),
        url: normalizeText(link?.url)
      }))
    : clone(DEFAULT_PLAN.site.socialLinks);

  site.streamStatus = normalizeStreamStatus(site.streamStatus);

  const sourceSchedule = Array.isArray(safe.schedule) ? safe.schedule : DEFAULT_PLAN.schedule;
  const byDay = new Map(sourceSchedule.map((day) => [day?.day, day]));

  const schedule = dayOrder.map((dayName) => {
    const source = byDay.get(dayName) || sourceSchedule.find((entry) => entry?.day === dayName) || {};

    return {
      day: normalizeText(source.day, dayName),
      dateLabel: normalizeText(source.dateLabel),
      streams: Array.isArray(source.streams)
        ? source.streams.map((stream) => ({
            time: normalizeText(stream?.time),
            title: normalizeText(stream?.title, "Stream"),
            categories: Array.isArray(stream?.categories) ? stream.categories.map((item) => normalizeText(item)).filter(Boolean) : splitCategories(stream?.categories),
            note: normalizeText(stream?.note),
            coverUrl: normalizeText(stream?.coverUrl),
            coverFallbackUrl: normalizeText(stream?.coverFallbackUrl),
            coverAlt: normalizeText(stream?.coverAlt, stream?.title || "Game Cover")
          }))
        : []
    };
  });

  return { site, schedule };
}

function formatDate(date) {
  return new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" }).format(date);
}

function getMonday(date) {
  const result = new Date(date);
  const day = result.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  result.setDate(result.getDate() + diff);
  result.setHours(0, 0, 0, 0);
  return result;
}

function getWeekDates() {
  const monday = getMonday(new Date());
  return dayOrder.map((_, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    return date;
  });
}

function getWeekLabel() {
  const weekDates = getWeekDates();
  return `${formatDate(weekDates[0])} bis ${formatDate(weekDates[6])}`;
}

function getDayDateLabel(day, index) {
  return day.dateLabel || formatDate(getWeekDates()[index]);
}

function setText(selector, value) {
  const element = document.querySelector(selector);
  if (element && value !== undefined && value !== null) element.textContent = value;
}

function createElement(tag, className = "", text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined && text !== null) element.textContent = text;
  return element;
}

function createSvgElement(tag, attributes = {}) {
  const element = document.createElementNS(SVG_NS, tag);
  Object.entries(attributes).forEach(([name, value]) => {
    element.setAttribute(name, value);
  });
  return element;
}

function createEdelweissSvg(className = "") {
  const svg = createSvgElement("svg", {
    class: `edelweiss ${className}`.trim(),
    viewBox: "0 0 64 64",
    "aria-hidden": "true",
    focusable: "false"
  });
  const petals = createSvgElement("g", { class: "edelweiss-petals" });

  edelweissPetals.forEach((path) => {
    petals.append(createSvgElement("path", { d: path }));
  });

  svg.append(
    createSvgElement("path", {
      class: "edelweiss-leaf",
      d: "M31.5 39.5c-6.4 4-14.1 5.2-21.4 2.8 3.6 6.3 9.6 10.9 17.2 12.9 1.4-5.6 2.8-10.7 4.2-15.7Zm2.2.1c6.1 4.2 13.8 5.9 21.2 3.8-4 6-10.4 10.4-18 12-1-5.7-2.1-10.9-3.2-15.8Z"
    }),
    petals,
    createSvgElement("circle", { class: "edelweiss-center", cx: "32", cy: "33", r: "9.2" }),
    createSvgElement("circle", { class: "edelweiss-center-dark", cx: "32", cy: "33", r: "4.7" })
  );

  return svg;
}

function hasUrlScheme(value) {
  return /^[a-z][a-z0-9+.-]*:/i.test(String(value || "").trim());
}

function isLocalHttpUrl(url) {
  return url.protocol === "http:" && ["localhost", "127.0.0.1", "::1"].includes(url.hostname);
}

function getSafeWebUrl(value) {
  const trimmed = String(value || "").trim();
  if (!trimmed) return "";

  try {
    const url = new URL(trimmed);
    return url.protocol === "https:" || isLocalHttpUrl(url) ? url.href : "";
  } catch (error) {
    return "";
  }
}

function getSafeImageUrl(value) {
  const trimmed = String(value || "").trim();
  if (!trimmed) return "";

  if (/^data:image\/(?:png|gif|jpe?g|webp|svg\+xml);/i.test(trimmed)) {
    return trimmed;
  }

  try {
    const url = new URL(trimmed, window.location.href);
    if (url.protocol === "https:" || isLocalHttpUrl(url)) return url.href;
    if ((url.protocol === "file:" || url.protocol === "content:") && !hasUrlScheme(trimmed)) return url.href;
    return "";
  } catch (error) {
    return "";
  }
}

function resolveImageUrl(value) {
  try {
    return new URL(value, window.location.href).href;
  } catch (error) {
    return value;
  }
}

async function loadPlan() {
  if (window.location.protocol === "file:" || window.location.protocol === "content:") {
    return normalizePlan(clone(DEFAULT_PLAN));
  }

  try {
    const response = await fetch("./data/streamplan.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return normalizePlan(await response.json());
  } catch (error) {
    console.warn("Streamplan konnte nicht aus data/streamplan.json geladen werden. Fallback wird verwendet.", error);
    return normalizePlan(clone(DEFAULT_PLAN));
  }
}

function renderHero(site) {
  setText("#heroEyebrow", site.eyebrow || site.brand || "Edelweisschen");
  setText("#page-title", site.title || "Streamplan");
  const weekRange = document.querySelector("#weekRange");

  if (weekRange) {
    weekRange.replaceChildren(createEdelweissSvg(), createElement("span", "", site.weekLabel || getWeekLabel()));
  }

  document.title = `${site.brand || "Edelweisschen"} · ${site.title || "Streamplan"}`;
}

function renderStreamStatus(site) {
  const statusElement = document.querySelector("#streamStatus");
  const statusText = document.querySelector("#streamStatusText");
  if (!statusElement || !statusText) return;

  const status = normalizeStreamStatus(site.streamStatus);
  const isOnline = status.status === "online";
  statusElement.hidden = false;
  statusElement.dataset.status = status.status;
  statusText.textContent = `${status.label}: ${isOnline ? status.onlineText : status.offlineText}`;
  statusElement.setAttribute("aria-label", statusText.textContent);
}

function renderSocialLinks(site) {
  const footer = document.querySelector("#socialLinks");
  const footerWrap = document.querySelector(".footer");
  if (!footer) return;

  footer.replaceChildren();
  site.socialLinks.forEach((link) => {
    const href = getSafeWebUrl(link?.url);
    if (!link?.label || !href) return;

    const anchor = createElement("a", "", link.label);
    anchor.href = href;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    footer.append(anchor);
  });

  if (footerWrap) footerWrap.hidden = footer.children.length === 0;
}

function isTbaValue(value) {
  return String(value || "").trim().toLowerCase() === "tba";
}

function isTbaStream(stream) {
  if (!stream) return false;
  const hasOnlyTbaContent = isTbaValue(stream.title) && !stream.categories?.length && !stream.coverUrl;
  return hasOnlyTbaContent || (isTbaValue(stream.title) && isTbaValue(stream.time));
}

function createCover(stream) {
  const coverUrl = getSafeImageUrl(stream.coverUrl);
  const fallbackUrl = getSafeImageUrl(stream.coverFallbackUrl);

  if (!coverUrl && !fallbackUrl) return null;

  const cover = createElement("div", "stream__cover");
  const img = document.createElement("img");
  img.src = coverUrl || fallbackUrl;
  img.alt = stream.coverAlt || stream.title || "Game Cover";
  img.loading = "lazy";
  img.referrerPolicy = "no-referrer";

  img.addEventListener("error", () => {
    const fallbackAlreadyTried = img.dataset.fallbackTried === "true";
    if (fallbackUrl && !fallbackAlreadyTried && resolveImageUrl(img.src) !== resolveImageUrl(fallbackUrl)) {
      img.dataset.fallbackTried = "true";
      img.src = fallbackUrl;
      return;
    }
    cover.classList.add("is-broken");
  });

  const fallback = createElement("span", "stream__cover-fallback", stream.categories?.[0] || stream.title || "Game Cover");
  cover.append(img, fallback);
  return cover;
}

function createTbaEntry(stream) {
  const article = createElement("article", "stream stream--tba");
  const body = createElement("div", "stream__body");
  const label = createElement("p", "stream__tba");
  const title = createElement("strong", "", "TBA");
  label.append(title);

  const note = String(stream.note || "to be announced").trim();
  if (note && note.toLowerCase() !== "tba") {
    label.append(document.createTextNode(" – "));
    label.append(createElement("span", "", note));
  }

  body.append(label);
  article.append(body);
  return article;
}

function createStreamEntry(stream) {
  const cover = createCover(stream);
  if (isTbaStream(stream) && !cover) return createTbaEntry(stream);

  const article = createElement("article", cover ? "stream stream--with-cover" : "stream");
  const body = createElement("div", "stream__body");

  if (stream.time) body.append(createElement("div", "stream__time", stream.time));
  if (stream.title) body.append(createElement("h3", "stream__title", stream.title));

  if (stream.categories?.length) body.append(createElement("p", "stream__meta", stream.categories.join(" · ")));
  if (stream.note) body.append(createElement("p", "stream__note", stream.note));

  if (cover) article.append(cover, body);
  else article.append(body);
  return article;
}

function createDayCard(day, index, emptyText) {
  const section = createElement("section", "day-card");
  const header = createElement("header", "day-card__head");
  const title = createElement("h2", "", day.day);
  const date = createElement("span", "day-card__date", getDayDateLabel(day, index));
  const body = createElement("div", "day-card__body");
  header.append(title, date);

  if (day.streams.length === 0) body.append(createElement("p", "empty-day", emptyText || DEFAULT_PLAN.site.emptyText));
  else day.streams.forEach((stream) => body.append(createStreamEntry(stream)));

  body.append(createEdelweissSvg("card-flower"));
  section.append(header, body);
  return section;
}

function renderSchedule(plan) {
  const scheduleList = document.querySelector("#scheduleList");
  if (!scheduleList) return;

  scheduleList.replaceChildren();
  plan.schedule.forEach((day, index) => scheduleList.append(createDayCard(day, index, plan.site.emptyText)));
}

function getPreferredTheme() {
  const stored = safeGetStorage(themeStorageKey);
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme) {
  const safeTheme = theme === "dark" ? "dark" : "light";
  document.documentElement.dataset.theme = safeTheme;
  document.querySelector("meta[name='theme-color']")?.setAttribute("content", safeTheme === "dark" ? "#111711" : "#eef5ea");

  const toggle = document.querySelector("#themeToggle");
  const lightLabel = document.querySelector("#themeLightLabel");
  const darkLabel = document.querySelector("#themeDarkLabel");

  if (toggle) {
    toggle.setAttribute("aria-pressed", safeTheme === "dark" ? "true" : "false");
    toggle.setAttribute("aria-label", safeTheme === "dark" ? "Helles Design aktivieren" : "Dunkles Design aktivieren");
  }

  lightLabel?.classList.toggle("is-active", safeTheme === "light");
  darkLabel?.classList.toggle("is-active", safeTheme === "dark");
}

function initThemeToggle() {
  const toggle = document.querySelector("#themeToggle");
  applyTheme(getPreferredTheme());
  if (!toggle) return;
  toggle.addEventListener("click", () => {
    const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    safeSetStorage(themeStorageKey, nextTheme);
    applyTheme(nextTheme);
  });
}

function getPreferredViewMode() {
  const stored = safeGetStorage(viewStorageKey);
  return stored === "cards" ? "cards" : "list";
}

function applyViewMode(mode) {
  const safeMode = mode === "cards" ? "cards" : "list";
  document.documentElement.dataset.view = safeMode;

  const toggle = document.querySelector("#viewModeToggle");
  const listLabel = document.querySelector("#viewListLabel");
  const cardsLabel = document.querySelector("#viewCardsLabel");

  if (toggle) {
    toggle.setAttribute("aria-pressed", safeMode === "cards" ? "true" : "false");
    toggle.setAttribute("aria-label", safeMode === "cards" ? "Listenansicht aktivieren" : "Kachelansicht aktivieren");
  }

  listLabel?.classList.toggle("is-active", safeMode === "list");
  cardsLabel?.classList.toggle("is-active", safeMode === "cards");
}

function initViewToggle() {
  const toggle = document.querySelector("#viewModeToggle");
  applyViewMode(getPreferredViewMode());
  if (!toggle) return;

  toggle.addEventListener("click", () => {
    const nextMode = document.documentElement.dataset.view === "cards" ? "list" : "cards";
    safeSetStorage(viewStorageKey, nextMode);
    applyViewMode(nextMode);
  });
}

async function init() {
  initThemeToggle();
  initViewToggle();
  const plan = await loadPlan();
  renderHero(plan.site);
  renderStreamStatus(plan.site);
  renderSchedule(plan);
  renderSocialLinks(plan.site);
}

document.addEventListener("DOMContentLoaded", init);
