
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { SUPPORTED_CURRENCIES, DEFAULT_FROM_CURRENCY_CODE, DEFAULT_TO_CURRENCY_CODE } from '../constants';
import { ExpenseItem, ExchangeRates } from '../types';
import { fetchExchangeRates, getCurrencyFromCode } from '../services/currencyService';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { LoadingSpinner } from './ui/LoadingSpinner';
import { PlusCircleIcon, TrashIcon } from './icons';

export const TravelExpenseCalculatorSection: React.FC = () => {
  const { t } = useAppContext();
  const [items, setItems] = useState<ExpenseItem[]>([]);
  const [itemName, setItemName] = useState<string>('');
  const [itemAmount, setItemAmount] = useState<string>('');
  
  const [sourceCurrency, setSourceCurrency] = useState<string>(DEFAULT_FROM_CURRENCY_CODE);
  const [targetCurrency, setTargetCurrency] = useState<string>(DEFAULT_TO_CURRENCY_CODE);
  
  const [rates, setRates] = useState<ExchangeRates | null>(null);
  const [isLoadingRates, setIsLoadingRates] = useState<boolean>(false);
  const [totalSourceAmount, setTotalSourceAmount] = useState<number>(0);
  const [totalTargetAmount, setTotalTargetAmount] = useState<number | null>(null);

  useEffect(() => {
    const loadRates = async () => {
      setIsLoadingRates(true);
      try {
        const fetchedRates = await fetchExchangeRates(sourceCurrency);
        setRates(fetchedRates);
      } catch (error) {
        console.error("Failed to load rates for calculator:", error);
        setRates(null);
      } finally {
        setIsLoadingRates(false);
      }
    };
    loadRates();
  }, [sourceCurrency]);

  useEffect(() => {
    const total = items.reduce((sum, item) => sum + item.amount, 0);
    setTotalSourceAmount(total);

    if (rates && rates[targetCurrency] && total > 0) {
      setTotalTargetAmount(total * rates[targetCurrency]);
    } else if (total === 0) {
      setTotalTargetAmount(0);
    } else {
      setTotalTargetAmount(null);
    }
  }, [items, rates, targetCurrency]);

  const handleAddItem = () => {
    const amountNum = parseFloat(itemAmount);
    if (itemName.trim() && !isNaN(amountNum) && amountNum > 0) {
      setItems([...items, { id: Date.now().toString(), name: itemName.trim(), amount: amountNum }]);
      setItemName('');
      setItemAmount('');
    }
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };
  
  const handleItemAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setItemAmount(value);
    }
  };

  const sourceCurrencyDetails = getCurrencyFromCode(sourceCurrency);
  const targetCurrencyDetails = getCurrencyFromCode(targetCurrency);

  return (
    <Card title={t('travelExpenseCalculator')}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Select label={`${t('from')} (${t('selectCurrency')} ${t('forItems')})`} value={sourceCurrency} onChange={(e) => setSourceCurrency(e.target.value)}>
          {SUPPORTED_CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code} - {c.name}</option>)}
        </Select>
        <Select label={`${t('to')} (${t('selectCurrency')} ${t('forTotal')})`} value={targetCurrency} onChange={(e) => setTargetCurrency(e.target.value)}>
          {SUPPORTED_CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code} - {c.name}</option>)}
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 items-end">
        <Input
          label={t('itemName')}
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          placeholder={t('itemName')}
          wrapperClassName="md:col-span-1"
        />
        <Input
          label={t('amount')}
          type="text"
          inputMode="decimal"
          value={itemAmount}
          onChange={handleItemAmountChange}
          placeholder="100.00"
          wrapperClassName="md:col-span-1"
        />
        <Button onClick={handleAddItem} leftIcon={<PlusCircleIcon className="w-5 h-5" />} className="w-full md:w-auto h-10">
          {t('addItem')}
        </Button>
      </div>

      {items.length > 0 && (
        <div className="mb-6 space-y-2 max-h-60 overflow-y-auto p-1">
          {items.map(item => (
            <div key={item.id} className="flex justify-between items-center p-3 bg-neutral-100 dark:bg-neutral-700 rounded-md">
              <span className="text-neutral-800 dark:text-neutral-200">{item.name}</span>
              <div className="flex items-center">
                <span className="text-neutral-700 dark:text-neutral-300 font-medium me-3 rtl:me-0 rtl:ms-3">
                    {sourceCurrencyDetails?.symbol}{item.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <Button onClick={() => handleRemoveItem(item.id)} variant="ghost" size="sm" className="p-1 text-red-500 hover:text-red-700">
                  <TrashIcon className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isLoadingRates && <LoadingSpinner className="my-4" />}
      {!isLoadingRates && (
        <div className="mt-6 p-4 bg-primary-light/10 dark:bg-primary-dark/20 rounded-lg text-center">
          <p className="text-lg font-semibold text-neutral-700 dark:text-neutral-200">{t('totalExpenses')}</p>
          <p className="text-2xl font-bold text-primary dark:text-primary-light my-1">
            {sourceCurrencyDetails?.symbol}{totalSourceAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            <span className="text-sm font-normal text-neutral-600 dark:text-neutral-400"> ({t('in')} {sourceCurrency})</span>
          </p>
          {totalTargetAmount !== null && rates && rates[targetCurrency] && (
            <p className="text-xl font-semibold text-secondary dark:text-secondary-light">
              ≈ {targetCurrencyDetails?.symbol}{totalTargetAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              <span className="text-sm font-normal text-neutral-600 dark:text-neutral-400"> ({t('in')} {targetCurrency})</span>
            </p>
          )}
          {totalTargetAmount !== null && rates && !rates[targetCurrency] && totalSourceAmount > 0 && (
            <p className="text-sm text-red-500 dark:text-red-400">Could not convert to {targetCurrency}. Rate unavailable.</p>
          )}
        </div>
      )}
    </Card>
  );
};
