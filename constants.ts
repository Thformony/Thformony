
import { Currency, Language } from './types';
import { HomeIcon, ArrowPathRoundedSquareIcon, CalculatorIcon, StarIcon, ChatBubbleLeftEllipsisIcon } from './components/icons'; // Placeholder, replace with actual icons

export const SUPPORTED_CURRENCIES: Currency[] = [
  { code: 'USD', name: 'United States Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'GBP', name: 'British Pound Sterling', symbol: '£' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr' },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$' },
  { code: 'MXN', name: 'Mexican Peso', symbol: 'Mex$' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$' },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩' },
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺' },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
  // Arab Currencies
  { code: 'SAR', name: 'Saudi Riyal', symbol: '﷼' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ' },
  { code: 'EGP', name: 'Egyptian Pound', symbol: 'E£' },
  { code: 'QAR', name: 'Qatari Riyal', symbol: 'ر.ق' },
  { code: 'KWD', name: 'Kuwaiti Dinar', symbol: 'د.ك' },
  { code: 'BHD', name: 'Bahraini Dinar', symbol: '.د.ب' },
  { code: 'OMR', name: 'Omani Rial', symbol: 'ر.ع.' },
  { code: 'JOD', name: 'Jordanian Dinar', symbol: 'د.أ' },
  { code: 'MAD', name: 'Moroccan Dirham', symbol: 'د.م.' },
  { code: 'TND', name: 'Tunisian Dinar', symbol: 'د.ت' },
  { code: 'DZD', name: 'Algerian Dinar', symbol: 'د.ج' },
  { code: 'IQD', name: 'Iraqi Dinar', symbol: 'ع.د' },
  // Add more as needed, e.g., LYD, etc.
];

export const DEFAULT_FROM_CURRENCY_CODE = 'USD';
export const DEFAULT_TO_CURRENCY_CODE = 'EUR';

export const LANGUAGE_STRINGS: Record<Language, Record<string, string>> = {
  [Language.EN]: {
    appName: 'Th For Currency Exchange',
    tagline: 'AI-Powered Currency Converter',
    converter: 'Converter',
    history: 'History',
    calculator: 'Calculator',
    favorites: 'Favorites',
    chatbot: 'Chatbot',
    from: 'From',
    to: 'To',
    amount: 'Amount',
    convertedAmount: 'Converted Amount',
    rate: 'Rate',
    marketTrendSuggestion: 'AI Market Trend Suggestion',
    predictiveAnalysis: 'AI Predictive Analysis (7 Days)',
    alertSuggestion: 'AI Alert Suggestion',
    getSuggestions: 'Get AI Insights',
    fetchingSuggestions: 'Fetching AI insights...',
    noSuggestions: 'Could not fetch AI suggestions at this time.',
    sevenDayHistory: '7-Day History',
    thirtyDayHistory: '30-Day History',
    showHistory: 'Show History For',
    travelExpenseCalculator: 'Travel Expense Calculator',
    addItem: 'Add Item',
    itemName: 'Item Name (e.g., Hotel)',
    totalExpenses: 'Total Expenses',
    in: 'in',
    favoriteCurrencyPairs: 'Favorite Currency Pairs',
    addFavorite: 'Add to Favorites',
    removeFavorite: 'Remove Favorite',
    noFavorites: 'No favorite pairs saved yet.',
    settings: 'Settings',
    language: 'Language',
    theme: 'Theme',
    lightMode: 'Light',
    darkMode: 'Dark',
    chatWithOurBot: 'Chat with our AI Assistant',
    typeYourMessage: 'Type your message...',
    sendMessage: 'Send',
    errorMessage: 'An error occurred. Please try again.',
    apiKeyMissing: 'Gemini API Key is not configured. AI features are disabled.',
    lastUpdated: 'Last updated',
    getExchangeRate: 'Get Exchange Rate',
    selectCurrency: 'Select Currency',
    viewSources: 'View Sources',
    groundingSource: 'Source',
    forItems: 'for items',
    forTotal: 'for total',
    // ... more strings
  },
  [Language.AR]: {
    appName: 'ث للتحويل بين العملات',
    tagline: 'محول عملات ذكي مدعوم بالذكاء الاصطناعي',
    converter: 'المحول',
    history: 'السجل',
    calculator: 'الحاسبة',
    favorites: 'المفضلة',
    chatbot: 'الدردشة',
    from: 'من',
    to: 'إلى',
    amount: 'المبلغ',
    convertedAmount: 'المبلغ المحول',
    rate: 'سعر الصرف',
    marketTrendSuggestion: 'اقتراح اتجاه السوق بالذكاء الاصطناعي',
    predictiveAnalysis: 'تحليل تنبؤي بالذكاء الاصطناعي (7 أيام)',
    alertSuggestion: 'اقتراح تنبيه بالذكاء الاصطناعي',
    getSuggestions: 'احصل على رؤى الذكاء الاصطناعي',
    fetchingSuggestions: 'جاري جلب رؤى الذكاء الاصطناعي...',
    noSuggestions: 'تعذر جلب رؤى الذكاء الاصطناعي في الوقت الحالي.',
    sevenDayHistory: 'سجل 7 أيام',
    thirtyDayHistory: 'سجل 30 يومًا',
    showHistory: 'عرض سجل لـ',
    travelExpenseCalculator: 'حاسبة نفقات السفر',
    addItem: 'إضافة عنصر',
    itemName: 'اسم العنصر (مثال: فندق)',
    totalExpenses: 'إجمالي النفقات',
    in: 'في',
    favoriteCurrencyPairs: 'أزواج العملات المفضلة',
    addFavorite: 'إضافة إلى المفضلة',
    removeFavorite: 'إزالة من المفضلة',
    noFavorites: 'لا توجد أزواج مفضلة محفوظة حتى الآن.',
    settings: 'الإعدادات',
    language: 'اللغة',
    theme: 'المظهر',
    lightMode: 'فاتح',
    darkMode: 'داكن',
    chatWithOurBot: 'تحدث مع مساعدنا الذكي',
    typeYourMessage: 'اكتب رسالتك...',
    sendMessage: 'إرسال',
    errorMessage: 'حدث خطأ. يرجى المحاولة مرة أخرى.',
    apiKeyMissing: 'مفتاح Gemini API غير مهيأ. ميزات الذكاء الاصطناعي معطلة.',
    lastUpdated: 'آخر تحديث',
    getExchangeRate: 'الحصول على سعر الصرف',
    selectCurrency: 'اختر العملة',
    viewSources: 'عرض المصادر',
    groundingSource: 'المصدر',
    forItems: 'للعناصر',
    forTotal: 'للإجمالي',
    // ... more strings
  },
};

export const API_MODELS = {
  text: 'gemini-2.5-flash-preview-04-17',
  // imagen: 'imagen-3.0-generate-002' // If image generation was needed
};

export const FALLBACK_LOCAL_CURRENCY = 'USD';

export const NAV_TABS = [
  { id: 'converter', labelKey: 'converter', icon: HomeIcon },
  { id: 'history', labelKey: 'history', icon: ArrowPathRoundedSquareIcon },
  { id: 'calculator', labelKey: 'calculator', icon: CalculatorIcon },
  { id: 'favorites', labelKey: 'favorites', icon: StarIcon },
];

// For mocking location-based currency
export const LOCALE_CURRENCY_MAP: Record<string, string> = {
  'en-US': 'USD',
  'en-GB': 'GBP',
  'en-CA': 'CAD',
  'en-AU': 'AUD',
  'de-DE': 'EUR',
  'fr-FR': 'EUR',
  'es-ES': 'EUR',
  'it-IT': 'EUR',
  'ja-JP': 'JPY',
  'ko-KR': 'KRW',
  'zh-CN': 'CNY',
  'ar-SA': 'SAR', // Saudi Arabia
  'ar-AE': 'AED', // UAE
  'ar-EG': 'EGP', // Egypt
  'ar-QA': 'QAR', // Qatar
  'ar-KW': 'KWD', // Kuwait
  'ar-BH': 'BHD', // Bahrain
  'ar-OM': 'OMR', // Oman
  'ar-JO': 'JOD', // Jordan
  'ar-MA': 'MAD', // Morocco
  'ar-TN': 'TND', // Tunisia
  'ar-DZ': 'DZD', // Algeria
  'ar-IQ': 'IQD', // Iraq
};
