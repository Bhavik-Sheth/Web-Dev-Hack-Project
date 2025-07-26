import React, { useState } from 'react';
import { SharedDataProvider } from '../shared/DataContext';
import HomePage from './HomePage';
import VendorApp from './VendorApp';
import EmployeeApp from './EmployeeApp';

enum AppMode {
  Home,
  Vendor,
  Employee
}

const App: React.FC = () => {
  const [currentMode, setCurrentMode] = useState<AppMode>(AppMode.Home);

  const handleNavigateToVendor = () => {
    setCurrentMode(AppMode.Vendor);
  };

  const handleNavigateToEmployee = () => {
    setCurrentMode(AppMode.Employee);
  };

  const handleGoHome = () => {
    setCurrentMode(AppMode.Home);
  };

  const renderApp = () => {
    switch (currentMode) {
      case AppMode.Home:
        return (
          <HomePage 
            onNavigateToVendor={handleNavigateToVendor}
            onNavigateToEmployee={handleNavigateToEmployee}
          />
        );
      case AppMode.Vendor:
        return <VendorApp onGoHome={handleGoHome} />;
      case AppMode.Employee:
        return <EmployeeApp onGoHome={handleGoHome} />;
      default:
        return (
          <HomePage 
            onNavigateToVendor={handleNavigateToVendor}
            onNavigateToEmployee={handleNavigateToEmployee}
          />
        );
    }
  };

  return (
    <SharedDataProvider>
      {renderApp()}
    </SharedDataProvider>
  );
};

export default App;