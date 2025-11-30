import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import InsuranceUploader from './components/InsuranceUploader';
import RequestInvoice from './components/RequestInvoice';
import OrderTracker from './components/OrderTracker';
import { ViewState } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.HOME);

  const renderContent = () => {
    switch (currentView) {
      case ViewState.HOME:
        return <Dashboard setView={setCurrentView} />;
      case ViewState.INSURANCE:
        return <InsuranceUploader />;
      case ViewState.INVOICE:
        return <RequestInvoice />;
      case ViewState.TRACKER:
        return <OrderTracker />;
      default:
        return <Dashboard setView={setCurrentView} />;
    }
  };

  return (
    <Layout currentView={currentView} setView={setCurrentView}>
      {renderContent()}
    </Layout>
  );
};

export default App;