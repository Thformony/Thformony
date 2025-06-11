
import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { SUPPORTED_CURRENCIES, DEFAULT_FROM_CURRENCY_CODE, DEFAULT_TO_CURRENCY_CODE } from '../constants';
import { Currency } from '../types';
import { Select } from './ui/Select';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { StarIcon, TrashIcon } from './icons'; // Assuming StarIcon is available

interface FavoritePair {
  from: string;
  to: string;
}

export const FavoritePairsSection: React.FC = () => {
  const { t } = useAppContext();
  const [favorites, setFavorites] = useLocalStorage<FavoritePair[]>('favoritePairs', []);
  const [selectedFrom, setSelectedFrom] = React.useState<string>(DEFAULT_FROM_CURRENCY_CODE);
  const [selectedTo, setSelectedTo] = React.useState<string>(DEFAULT_TO_CURRENCY_CODE);

  const handleAddFavorite = () => {
    if (selectedFrom && selectedTo && selectedFrom !== selectedTo) {
      const newFavorite = { from: selectedFrom, to: selectedTo };
      if (!favorites.some(fav => fav.from === newFavorite.from && fav.to === newFavorite.to)) {
        setFavorites([...favorites, newFavorite]);
      }
    }
  };

  const handleRemoveFavorite = (pairToRemove: FavoritePair) => {
    setFavorites(favorites.filter(fav => fav.from !== pairToRemove.from || fav.to !== pairToRemove.to));
  };
  
  const getCurrencyName = (code: string) => SUPPORTED_CURRENCIES.find(c => c.code === code)?.name || code;

  return (
    <Card title={t('favoriteCurrencyPairs')}>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 items-end">
        <Select label={t('from')} value={selectedFrom} onChange={(e) => setSelectedFrom(e.target.value)}>
          {SUPPORTED_CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code} - {c.name}</option>)}
        </Select>
        <Select label={t('to')} value={selectedTo} onChange={(e) => setSelectedTo(e.target.value)}>
          {SUPPORTED_CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code} - {c.name}</option>)}
        </Select>
        <Button onClick={handleAddFavorite} leftIcon={<StarIcon className="w-4 h-4" />} className="w-full sm:w-auto">
          {t('addFavorite')}
        </Button>
      </div>

      {favorites.length === 0 ? (
        <p className="text-neutral-500 dark:text-neutral-400 text-center py-4">{t('noFavorites')}</p>
      ) : (
        <ul className="space-y-3">
          {favorites.map((pair, index) => (
            <li key={index} className="flex justify-between items-center p-4 bg-neutral-100 dark:bg-neutral-700 rounded-lg shadow">
              <div>
                <span className="font-semibold text-neutral-800 dark:text-neutral-100">{pair.from} / {pair.to}</span>
                <p className="text-xs text-neutral-600 dark:text-neutral-300">
                  {getCurrencyName(pair.from)} to {getCurrencyName(pair.to)}
                </p>
              </div>
              <Button onClick={() => handleRemoveFavorite(pair)} variant="ghost" size="sm" className="text-red-500 hover:text-red-700 p-1">
                <TrashIcon className="w-5 h-5" />
                <span className="sr-only">{t('removeFavorite')}</span>
              </Button>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
};
