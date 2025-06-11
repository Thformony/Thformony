
import React, { useState } from 'react';
import { useAppContext } from './contexts/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CurrencyConverterSection } from './components/CurrencyConverterSection';
import { HistoricalChartSection } from './components/HistoricalChartSection';
import { TravelExpenseCalculatorSection } from './components/TravelExpenseCalculatorSection';
import { FavoritePairsSection } from './components/FavoritePairsSection';
import { ChatbotModal } from './components/ChatbotModal';
import { ChatBubbleLeftEllipsisIcon } from './components/icons';
import { NAV_TABS } from './constants';
import { Button } from './components/ui/Button';

const App: React.FC = () => {
  const { t } = useAppContext();
  const [activeTab, setActiveTab] = useState<string>(NAV_TABS[0].id);
  const [isChatbotOpen, setIsChatbotOpen] = useState<boolean>(false);

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'converter':
        return <CurrencyConverterSection />;
      case 'history':
        return <HistoricalChartSection />;
      case 'calculator':
        return <TravelExpenseCalculatorSection />;
      case 'favorites':
        return <FavoritePairsSection />;
      default:
        return <CurrencyConverterSection />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header activeTab={activeTab} onTabChange={setActiveTab} tabs={NAV_TABS} />
      <main className="flex-grow container mx-auto px-4 py-8">
        {renderActiveTabContent()}
      </main>
      <Footer />
      <Button
        onClick={() => setIsChatbotOpen(true)}
        className="fixed bottom-6 end-6 rtl:end-auto rtl:start-6 z-50 p-3 rounded-full shadow-lg !w-auto"
        aria-label={t('chatWithOurBot')}
        variant="secondary"
      >
        <ChatBubbleLeftEllipsisIcon className="w-6 h-6" />
      </Button>
      <ChatbotModal isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />
    </div>
  );
};

export default App;
