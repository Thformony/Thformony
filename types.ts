
export interface Currency {
  code: string;
  name: string;
  symbol: string;
}

export interface ExchangeRates {
  [key: string]: number;
}

export interface HistoricalDataPoint {
  date: string; // YYYY-MM-DD
  rate: number;
}

export enum Language {
  EN = 'en',
  AR = 'ar',
}

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
}

export interface ExpenseItem {
  id: string;
  name: string;
  amount: number;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot' | 'system';
  timestamp: number;
  groundingChunks?: WebGrounding[];
}

export interface GroundingChunk {
  web?: WebGrounding;
  retrievedContext?: object; // or a more specific type if known
}

export interface WebGrounding {
  uri: string;
  title: string;
}

export interface AppContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  language: Language;
  setLanguage: (language: Language) => void;
  translations: Record<string, string>;
  t: (key: string, replacements?: Record<string, string | number>) => string;
  apiKeyAvailable: boolean;
}

export interface Tab {
  id: string;
  labelKey: string; // Key for translation
  icon: (props: React.SVGProps<SVGSVGElement>) => React.ReactNode;
}
