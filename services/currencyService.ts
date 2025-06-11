
import { ExchangeRates, HistoricalDataPoint, Currency } from '../types';
import { SUPPORTED_CURRENCIES } from '../constants';

// Mock base rates relative to USD for simplicity
const MOCK_RATES_USD_BASE: ExchangeRates = {
  USD: 1,
  EUR: 0.92,
  JPY: 157.0,
  GBP: 0.79,
  AUD: 1.50,
  CAD: 1.37,
  CHF: 0.90,
  CNY: 7.25,
  SEK: 10.40,
  NZD: 1.62,
  MXN: 17.00,
  SGD: 1.35,
  HKD: 7.80,
  NOK: 10.50,
  KRW: 1370.0,
  TRY: 32.0,
  RUB: 90.0,
  INR: 83.0,
  BRL: 5.10,
  ZAR: 18.50,
  // Arab Currencies (Approximate mock rates vs USD)
  SAR: 3.75,  // Saudi Riyal
  AED: 3.67,  // UAE Dirham
  EGP: 47.00, // Egyptian Pound (approx, can be volatile)
  QAR: 3.64,  // Qatari Riyal
  KWD: 0.31,  // Kuwaiti Dinar (1 USD = 0.31 KWD)
  BHD: 0.38,  // Bahraini Dinar (1 USD = 0.38 BHD)
  OMR: 0.38,  // Omani Rial (1 USD = 0.38 OMR)
  JOD: 0.71,  // Jordanian Dinar (1 USD = 0.71 JOD)
  MAD: 10.00, // Moroccan Dirham
  TND: 3.10,  // Tunisian Dinar
  DZD: 135.00, // Algerian Dinar
  IQD: 1310.0, // Iraqi Dinar (approx rate)
};

export const fetchExchangeRates = async (baseCurrencyCode: string): Promise<ExchangeRates> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const baseRateInUSD = MOCK_RATES_USD_BASE[baseCurrencyCode];
  if (typeof baseRateInUSD === 'undefined') { // Check specifically for undefined
    console.error(`Base currency ${baseCurrencyCode} not found in mock rates. Defaulting to USD base rates.`);
    // Fallback or throw error. For now, returning rates as if baseCurrency was USD and its rate was 1.
    // This part needs careful handling if the base currency itself is missing.
    // A simple approach: if baseCurrency is not in MOCK_RATES_USD_BASE, we can't accurately calculate.
    // For this mock, let's assume if baseCurrencyCode is not in MOCK_RATES_USD_BASE, we return empty or throw.
    // However, to keep it functional for newly added currencies not yet in MOCK_RATES_USD_BASE (though they should be),
    // we'll proceed cautiously.
    // A better robust solution for missing baseRateInUSD is to throw an error or handle it more explicitly.
    // Given the current structure, if baseCurrencyCode itself is one of the new ones and not yet in MOCK_RATES_USD_BASE
    // as a key, this would fail. It's vital MOCK_RATES_USD_BASE is comprehensive.

    // If the base currency is NOT USD and is MISSING from MOCK_RATES_USD_BASE, we cannot proceed.
    if (baseCurrencyCode !== 'USD') {
        console.error(`Cannot calculate rates for base ${baseCurrencyCode} as its USD equivalent is unknown.`);
        throw new Error(`Exchange rate for base currency ${baseCurrencyCode} to USD is not defined in mock data.`);
    }
    // If base currency IS USD and somehow missing (should not happen with USD:1), then it's 1.
     // This case should ideally not be hit if MOCK_RATES_USD_BASE always has USD:1.
    const effectiveBaseRateInUSD = baseCurrencyCode === 'USD' ? 1 : MOCK_RATES_USD_BASE[baseCurrencyCode];
    if (typeof effectiveBaseRateInUSD === 'undefined') {
      // This is a critical failure point if not USD.
      console.error(`Critical: Effective base rate for ${baseCurrencyCode} is undefined.`);
      throw new Error (`Effective base rate for ${baseCurrencyCode} is undefined.`);
    }


    const rates: ExchangeRates = {};
    for (const currency of SUPPORTED_CURRENCIES) {
      const targetRateInUSD = MOCK_RATES_USD_BASE[currency.code];
      if (typeof targetRateInUSD !== 'undefined') { // Check specifically for undefined
        rates[currency.code] = targetRateInUSD / effectiveBaseRateInUSD;
      } else {
        console.warn(`Rate for ${currency.code} against USD not found in mock data. Skipping ${currency.code}.`);
      }
    }
    return rates;
  }


  const rates: ExchangeRates = {};
  for (const currency of SUPPORTED_CURRENCIES) {
    const targetRateInUSD = MOCK_RATES_USD_BASE[currency.code];
    // Ensure both baseRateInUSD and targetRateInUSD are numbers before division
    if (typeof targetRateInUSD === 'number' && typeof baseRateInUSD === 'number' && baseRateInUSD !== 0) {
      rates[currency.code] = targetRateInUSD / baseRateInUSD;
    }  else if (typeof targetRateInUSD === 'undefined') {
      console.warn(`Rate for ${currency.code} against USD not found in mock data. Skipping ${currency.code}.`);
    } else if (baseRateInUSD === 0) {
      console.error(`Cannot divide by zero for baseRateInUSD for ${baseCurrencyCode}`);
    }
  }
  return rates;
};

export const fetchHistoricalData = async (
  fromCurrencyCode: string,
  toCurrencyCode: string,
  days: number = 7
): Promise<HistoricalDataPoint[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 700));

  const data: HistoricalDataPoint[] = [];
  const endDate = new Date();
  
  // Get current rate to base the historical trend on
  const rates = await fetchExchangeRates(fromCurrencyCode);
  let currentRate = rates[toCurrencyCode];

  // If rate is undefined (e.g. new currency not yet in MOCK_RATES_USD_BASE or issue with calculation)
  // Provide a default or handle error. For now, defaulting to 1 if undefined.
  if (typeof currentRate === 'undefined') {
    console.warn(`Historical data: Current rate for ${fromCurrencyCode} to ${toCurrencyCode} is undefined. Defaulting to 1 for chart.`);
    currentRate = 1; 
  }


  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(endDate);
    date.setDate(endDate.getDate() - i);
    
    // Simulate some fluctuation: +/- 5% of the current rate over the period
    const fluctuation = (Math.random() - 0.5) * 0.1 * currentRate; // Max 5% fluctuation from base
    const historicalRate = currentRate + fluctuation - ( (days -1 - i) * (0.005 * currentRate) / days) ; // slight trend
    
    data.push({
      date: date.toISOString().split('T')[0],
      rate: parseFloat(historicalRate.toFixed(4)),
    });
  }
  return data;
};

export const getCurrencyFromCode = (code: string): Currency | undefined => {
    return SUPPORTED_CURRENCIES.find(c => c.code === code);
}
