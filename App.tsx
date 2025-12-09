import React, { useState } from 'react';
import Layout from './Layout';
import Dashboard from './Dashboard';
import InsuranceUploader from './InsuranceUploader';
import RequestInvoice from './RequestInvoice';
import OrderTracker from './OrderTracker';
import ContactOptions from './ContactOptions';
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
      case ViewState.CONTACT:
        return <ContactOptions />;
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
