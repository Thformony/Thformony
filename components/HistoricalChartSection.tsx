
import React, { useState, useEffect, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAppContext } from '../contexts/AppContext';
import { SUPPORTED_CURRENCIES, DEFAULT_FROM_CURRENCY_CODE, DEFAULT_TO_CURRENCY_CODE } from '../constants';
import { HistoricalDataPoint } from '../types';
import { fetchHistoricalData } from '../services/currencyService';
import { Select } from './ui/Select';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { LoadingSpinner } from './ui/LoadingSpinner';

export const HistoricalChartSection: React.FC = () => {
  const { t, theme } = useAppContext();
  const [fromCurrency, setFromCurrency] = useState<string>(DEFAULT_FROM_CURRENCY_CODE);
  const [toCurrency, setToCurrency] = useState<string>(DEFAULT_TO_CURRENCY_CODE);
  const [days, setDays] = useState<number>(7);
  const [chartData, setChartData] = useState<HistoricalDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!fromCurrency || !toCurrency) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchHistoricalData(fromCurrency, toCurrency, days);
      setChartData(data);
    } catch (err) {
      setError(t('errorMessage'));
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [fromCurrency, toCurrency, days, t]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const axisColor = theme === 'dark' ? '#9E9E9E' : '#616161'; // neutral-500 dark, neutral-700 light
  const gridColor = theme === 'dark' ? '#424242' : '#E0E0E0'; // neutral-800 dark, neutral-300 light

  return (
    <Card title={`${t('showHistory')} ${fromCurrency}/${toCurrency}`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6 items-end">
        <Select label={t('from')} value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}>
          {SUPPORTED_CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code} - {c.name}</option>)}
        </Select>
        <Select label={t('to')} value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}>
          {SUPPORTED_CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code} - {c.name}</option>)}
        </Select>
        <div className="flex space-x-2 rtl:space-x-reverse">
          <Button onClick={() => setDays(7)} variant={days === 7 ? 'primary' : 'ghost'} className="flex-1">{t('sevenDayHistory')}</Button>
          <Button onClick={() => setDays(30)} variant={days === 30 ? 'primary' : 'ghost'} className="flex-1">{t('thirtyDayHistory')}</Button>
        </div>
      </div>

      {isLoading && <LoadingSpinner className="my-8" />}
      {error && <p className="text-red-500 dark:text-red-400 my-4 text-center">{error}</p>}
      
      {!isLoading && !error && chartData.length > 0 && (
        <div className="h-72 md:h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: -20 /* Adjust for YAxis labels */, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: axisColor }} />
              <YAxis tickFormatter={(value) => value.toFixed(4)} domain={['auto', 'auto']} tick={{ fontSize: 10, fill: axisColor }} />
              <Tooltip
                contentStyle={{ 
                    backgroundColor: theme === 'dark' ? 'rgba(33, 33, 33, 0.9)' : 'rgba(255, 255, 255, 0.9)', 
                    borderColor: theme === 'dark' ? '#616161' : '#BDBDBD',
                    borderRadius: '0.5rem',
                }}
                labelStyle={{ color: theme === 'dark' ? '#FAFAFA' : '#212121', fontWeight: 'bold' }}
                itemStyle={{ color: theme === 'dark' ? '#4A90E2' : '#357ABD' }}
              />
              <Legend wrapperStyle={{fontSize: '12px'}}/>
              <Line type="monotone" dataKey="rate" name={`${fromCurrency}/${toCurrency}`} stroke="#357ABD" strokeWidth={2} dot={{ r: 2 }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
      {!isLoading && !error && chartData.length === 0 && (
         <p className="text-neutral-500 dark:text-neutral-400 my-4 text-center">No historical data available for this selection.</p>
      )}
    </Card>
  );
};
