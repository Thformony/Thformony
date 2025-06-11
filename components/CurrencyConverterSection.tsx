
import React, { useState, useEffect, useCallback } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { SUPPORTED_CURRENCIES, DEFAULT_FROM_CURRENCY_CODE, DEFAULT_TO_CURRENCY_CODE } from '../constants';
import { ExchangeRates, Currency } from '../types';
import { fetchExchangeRates, getCurrencyFromCode } from '../services/currencyService';
import { getSmartSuggestionGemini, getRatePredictionGemini, getAlertSuggestionGemini } from '../services/geminiService';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { LoadingSpinner } from './ui/LoadingSpinner';
import { InformationCircleIcon, ArrowPathRoundedSquareIcon } from './icons'; // Added ArrowPathRoundedSquareIcon

export const CurrencyConverterSection: React.FC = () => {
  const { t, apiKeyAvailable } = useAppContext();
  const [fromCurrency, setFromCurrency] = useState<string>(DEFAULT_FROM_CURRENCY_CODE);
  const [toCurrency, setToCurrency] = useState<string>(DEFAULT_TO_CURRENCY_CODE);
  const [amount, setAmount] = useState<string>('1');
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [rates, setRates] = useState<ExchangeRates | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const [smartSuggestion, setSmartSuggestion] = useState<string | null>(null);
  const [ratePrediction, setRatePrediction] = useState<string | null>(null);
  const [alertSuggestion, setAlertSuggestion] = useState<string | null>(null);

  const loadExchangeRates = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedRates = await fetchExchangeRates(fromCurrency);
      setRates(fetchedRates);
      setLastUpdated(new Date());
    } catch (err) {
      setError(t('errorMessage'));
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [fromCurrency, t]);

  useEffect(() => {
    loadExchangeRates();
  }, [loadExchangeRates]);

  useEffect(() => {
    if (rates && toCurrency && amount) {
      const rate = rates[toCurrency];
      if (rate) {
        setExchangeRate(rate);
        const numAmount = parseFloat(amount);
        if (!isNaN(numAmount)) {
          setConvertedAmount(numAmount * rate);
        } else {
          setConvertedAmount(null);
        }
      } else {
        setConvertedAmount(null);
        setExchangeRate(null);
      }
    }
  }, [rates, toCurrency, amount]);

  const handleSwapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
    // Amount might need to be re-evaluated or kept as is, depending on desired UX
    // For now, let's recalculate with the new 'fromCurrency' base.
    // The useEffect for loadExchangeRates will trigger automatically.
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow empty input, numbers, and a single decimal point
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };
  
  const fetchAiInsights = useCallback(async () => {
    if (!apiKeyAvailable || !exchangeRate) return;
    setIsAiLoading(true);
    setSmartSuggestion(null);
    setRatePrediction(null);
    setAlertSuggestion(null);

    try {
      const [smart, prediction, alertS] = await Promise.all([
        getSmartSuggestionGemini(fromCurrency, toCurrency, exchangeRate),
        getRatePredictionGemini(fromCurrency, toCurrency),
        getAlertSuggestionGemini(fromCurrency, toCurrency, exchangeRate)
      ]);
      setSmartSuggestion(smart);
      setRatePrediction(prediction);
      setAlertSuggestion(alertS);
    } catch (err) {
      console.error("Error fetching AI insights:", err);
      setSmartSuggestion(t('noSuggestions'));
    } finally {
      setIsAiLoading(false);
    }
  }, [apiKeyAvailable, fromCurrency, toCurrency, exchangeRate, t]);

  const fromCurrencyDetails = getCurrencyFromCode(fromCurrency);
  const toCurrencyDetails = getCurrencyFromCode(toCurrency);

  return (
    <Card title={t('converter')}>
      {!apiKeyAvailable && (
        <div className="mb-4 p-3 bg-yellow-100 dark:bg-yellow-700 border border-yellow-300 dark:border-yellow-600 rounded-md text-yellow-700 dark:text-yellow-200 text-sm flex items-center">
          <InformationCircleIcon className="w-5 h-5 me-2 rtl:ms-2 flex-shrink-0"/> {t('apiKeyMissing')}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
        <Input
          label={t('amount')}
          type="text" // Use text to manage decimal input properly
          inputMode="decimal" // Hint for mobile keyboards
          value={amount}
          onChange={handleAmountChange}
          placeholder="1.00"
        />
        <div className="grid grid-cols-2 gap-2 items-center md:flex md:items-end">
          <Select label={t('from')} value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}>
            {SUPPORTED_CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code} - {c.name}</option>)}
          </Select>
          <button 
            onClick={handleSwapCurrencies}
            className="p-2 mt-3 md:mb-4 h-10 w-10 bg-neutral-200 dark:bg-neutral-700 rounded-full hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors flex items-center justify-center"
            aria-label="Swap currencies"
            >
            <ArrowPathRoundedSquareIcon className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
          </button>
          <Select label={t('to')} value={toCurrency} onChange={(e) => setToCurrency(e.target.value)} wrapperClassName="col-start-2 md:col-start-auto">
            {SUPPORTED_CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code} - {c.name}</option>)}
          </Select>
        </div>
      </div>

      {isLoading && <LoadingSpinner className="my-4" text={t('fetchingSuggestions')} />}
      {error && <p className="text-red-500 dark:text-red-400 my-2">{error}</p>}
      
      {exchangeRate !== null && convertedAmount !== null && !isLoading && (
        <div className="mt-6 p-4 bg-primary-light/10 dark:bg-primary-dark/20 rounded-lg text-center">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {amount || 0} {fromCurrencyDetails?.name} ({fromCurrencyDetails?.symbol}) =
          </p>
          <p className="text-3xl font-bold text-primary dark:text-primary-light my-1">
            {toCurrencyDetails?.symbol}{convertedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
          </p>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
             {toCurrencyDetails?.name}
          </p>
          <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-2">
            1 {fromCurrency} = {exchangeRate.toFixed(4)} {toCurrency}
          </p>
        </div>
      )}
      {lastUpdated && !isLoading && (
        <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-2 text-center">
            {t('lastUpdated')}: {lastUpdated.toLocaleString()}
        </p>
      )}

      {apiKeyAvailable && exchangeRate !== null && (
        <div className="mt-6">
          <Button onClick={fetchAiInsights} disabled={isAiLoading || isLoading} className="w-full md:w-auto">
            {isAiLoading ? <LoadingSpinner size="sm" /> : t('getSuggestions')}
          </Button>
          
          {isAiLoading && <LoadingSpinner className="my-4" text={t('fetchingSuggestions')} />}

          {!isAiLoading && (smartSuggestion || ratePrediction || alertSuggestion) && (
            <div className="mt-4 space-y-3">
              {smartSuggestion && <AISuggestionBox title={t('marketTrendSuggestion')} content={smartSuggestion} />}
              {ratePrediction && <AISuggestionBox title={t('predictiveAnalysis')} content={ratePrediction} />}
              {alertSuggestion && <AISuggestionBox title={t('alertSuggestion')} content={alertSuggestion} />}
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

interface AISuggestionBoxProps {
  title: string;
  content: string;
}
const AISuggestionBox: React.FC<AISuggestionBoxProps> = ({ title, content }) => (
  <div className="p-3 bg-neutral-100 dark:bg-neutral-700 rounded-lg">
    <h4 className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">{title}</h4>
    <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-1">{content}</p>
  </div>
);
