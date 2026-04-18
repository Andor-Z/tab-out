/* ================================================================
   Tab Out — Internationalization (i18n) Module

   Provides translation functions and language switching for
   the Tab Out dashboard. Supports Chinese (zh) and English (en).
   
   Language preference is stored in chrome.storage.local and
   persists across browser sessions.
   ================================================================ */

'use strict';

/* ----------------------------------------------------------------
   TRANSLATIONS — Complete text mappings for all supported languages
   ---------------------------------------------------------------- */

const TRANSLATIONS = {
  zh: {
    // Greetings
    greetingMorning: '早上好',
    greetingAfternoon: '下午好',
    greetingEvening: '晚上好',
    
    // Date format locale
    dateFormat: 'zh-CN',
    
    // Section titles
    rightNow: '当前打开',
    openTabs: '打开的标签页',
    savedForLater: '稍后保存',
    
    // Empty states
    nothingSaved: '没有保存的内容。享受当下。',
    emptyInbox: '标签页清零。',
    emptyFree: '你自由了。',
    noResults: '没有结果',
    
    // Archive
    archive: '归档',
    searchArchive: '搜索归档的标签页...',
    
    // Tab counts and badges
    domains: (n) => `${n} 个域名`,
    tabs: '标签页',
    tabsOpen: (n) => `打开 ${n} 个标签页`,
    duplicates: (n) => `${n} 个重复`,
    itemsCount: (n) => `${n} 项`,
    
    // Time ago
    justNow: '刚刚',
    minsAgo: (n) => `${n} 分钟前`,
    hoursAgo: (n) => `${n} 小时前`,
    yesterday: '昨天',
    daysAgo: (n) => `${n} 天前`,
    
    // Action buttons
    closeAllTabs: (n) => `关闭全部 ${n} 个标签页`,
    closeDomainTabs: (n) => `关闭全部 ${n} 个标签页`,
    closeDuplicates: (n) => `关闭 ${n} 个重复项`,
    closeExtras: '关闭多余标签页',
    
    // Banner text
    tabOutDupeBanner: (n) => `你打开了 ${n} 个 Tab Out 标签页。只保留当前这个？`,
    
    // Overflow
    moreTabs: (n) => `还有 ${n} 个`,
    
    // Tooltips
    saveForLater: '保存到稍后查看',
    closeThisTab: '关闭此标签页',
    dismiss: '关闭',
    
    // Toast messages
    closedTabs: (n, domain) => `已关闭 ${domain} 的 ${n} 个标签页`,
    closedExtras: '已关闭多余的 Tab Out 标签页',
    tabClosed: '标签页已关闭',
    savedForLaterToast: '已保存供稍后查看',
    closedDuplicatesToast: '已关闭重复项，每页保留一份',
    allTabsClosed: '所有标签页已关闭。全新开始。',
    failedToSave: '保存标签页失败',
  },
  
  en: {
    // Greetings
    greetingMorning: 'Good morning',
    greetingAfternoon: 'Good afternoon',
    greetingEvening: 'Good evening',
    
    // Date format locale
    dateFormat: 'en-US',
    
    // Section titles
    rightNow: 'Right now',
    openTabs: 'Open tabs',
    savedForLater: 'Saved for later',
    
    // Empty states
    nothingSaved: 'Nothing saved. Living in the moment.',
    emptyInbox: 'Inbox zero, but for tabs.',
    emptyFree: 'You\'re free.',
    noResults: 'No results',
    
    // Archive
    archive: 'Archive',
    searchArchive: 'Search archived tabs...',
    
    // Tab counts and badges
    domains: (n) => `${n} domain${n !== 1 ? 's' : ''}`,
    tabs: 'Open tabs',
    tabsOpen: (n) => `${n} tab${n !== 1 ? 's' : ''} open`,
    duplicates: (n) => `${n} duplicate${n !== 1 ? 's' : ''}`,
    itemsCount: (n) => `${n} item${n !== 1 ? 's' : ''}`,
    
    // Time ago
    justNow: 'just now',
    minsAgo: (n) => `${n} min ago`,
    hoursAgo: (n) => `${n} hr${n !== 1 ? 's' : ''} ago`,
    yesterday: 'yesterday',
    daysAgo: (n) => `${n} days ago`,
    
    // Action buttons
    closeAllTabs: (n) => `Close all ${n} tab${n !== 1 ? 's' : ''}`,
    closeDomainTabs: (n) => `Close all ${n} tab${n !== 1 ? 's' : ''}`,
    closeDuplicates: (n) => `Close ${n} duplicate${n !== 1 ? 's' : ''}`,
    closeExtras: 'Close extras',
    
    // Banner text
    tabOutDupeBanner: (n) => `You have ${n} Tab Out tabs open. Keep just this one?`,
    
    // Overflow
    moreTabs: (n) => `+${n} more`,
    
    // Tooltips
    saveForLater: 'Save for later',
    closeThisTab: 'Close this tab',
    dismiss: 'Dismiss',
    
    // Toast messages
    closedTabs: (n, domain) => `Closed ${n} tab${n !== 1 ? 's' : ''} from ${domain}`,
    closedExtras: 'Closed extra Tab Out tabs',
    tabClosed: 'Tab closed',
    savedForLaterToast: 'Saved for later',
    closedDuplicatesToast: 'Closed duplicates, kept one copy each',
    allTabsClosed: 'All tabs closed. Fresh start.',
    failedToSave: 'Failed to save tab',
  }
};

/* ----------------------------------------------------------------
   LANGUAGE MANAGEMENT — Get/set current language preference
   ---------------------------------------------------------------- */

/**
 * getLanguage()
 * 
 * Returns the current language code ('zh' or 'en').
 * Defaults to 'zh' (Chinese) if no preference is stored.
 */
async function getLanguage() {
  try {
    const { language } = await chrome.storage.local.get('language');
    return language || 'zh'; // Default to Chinese
  } catch {
    return 'zh'; // Fallback to Chinese on error
  }
}

/**
 * setLanguage(lang)
 * 
 * Saves the language preference to chrome.storage.local.
 * @param {string} lang - Language code: 'zh' or 'en'
 */
async function setLanguage(lang) {
  if (!TRANSLATIONS[lang]) {
    console.warn(`[tab-out i18n] Unsupported language: ${lang}`);
    return;
  }
  try {
    await chrome.storage.local.set({ language: lang });
  } catch (err) {
    console.error('[tab-out i18n] Failed to save language:', err);
  }
}

/* ----------------------------------------------------------------
   TRANSLATION FUNCTION — t(key, ...params)
   ---------------------------------------------------------------- */

/**
 * t(key, ...params)
 * 
 * Translates a key into the current language.
 * Supports parameterized strings (functions that take arguments).
 * 
 * Usage:
 *   t('greetingMorning') => '早上好' or 'Good morning'
 *   t('tabsOpen', 5) => '打开 5 个标签页' or '5 tabs open'
 *   t('closedTabs', 3, 'GitHub') => '已关闭 GitHub 的 3 个标签页'
 * 
 * @param {string} key - Translation key
 * @param {...*} params - Optional parameters for parameterized strings
 * @returns {string} Translated text
 */
async function t(key, ...params) {
  const lang = await getLanguage();
  const translations = TRANSLATIONS[lang] || TRANSLATIONS.en;
  
  let text = translations[key];
  
  // If translation doesn't exist, fallback to English, then return key
  if (text === undefined) {
    text = TRANSLATIONS.en[key];
    if (text === undefined) {
      console.warn(`[tab-out i18n] Missing translation key: ${key}`);
      return key;
    }
  }
  
  // If the translation is a function, call it with params
  if (typeof text === 'function') {
    return text(...params);
  }
  
  return text;
}

/**
 * tSync(key, ...params)
 * 
 * Synchronous version of t() — uses cached language preference.
 * Use this in performance-critical rendering paths.
 * Call refreshLanguageCache() first to ensure cache is up to date.
 */
let cachedLanguage = 'zh';
let cachedTranslations = TRANSLATIONS.zh;

function refreshLanguageCache() {
  // This will be called during initialization
  getLanguage().then(lang => {
    cachedLanguage = lang;
    cachedTranslations = TRANSLATIONS[lang] || TRANSLATIONS.en;
  });
}

function tSync(key, ...params) {
  let text = cachedTranslations[key];
  
  if (text === undefined) {
    text = TRANSLATIONS.en[key];
    if (text === undefined) {
      return key;
    }
  }
  
  if (typeof text === 'function') {
    return text(...params);
  }
  
  return text;
}
