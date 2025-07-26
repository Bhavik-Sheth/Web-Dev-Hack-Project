import React, { useState, useCallback } from 'react';
import { Page, EmployeeOrder, StockItem } from '../shared/types';
import { useSharedData } from '../shared/DataContext';

import LoginScreen from '../employee/components/LoginScreen';
import HomeScreen from '../employee/components/HomeScreen';
import BookOrderScreen from '../employee/components/BookOrderScreen';
import CompleteOrderScreen from '../employee/components/CompleteOrderScreen';
import AddStockScreen from '../employee/components/AddStockScreen';

interface EmployeeAppProps {
  onGoHome: () => void;
}

const EmployeeApp: React.FC<EmployeeAppProps> = ({ onGoHome }) => {
  const { stock, updateStock, syncEmployeeOrder } = useSharedData();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<Page>(Page.Login);
  const [orders, setOrders] = useState<EmployeeOrder[]>([]);
  const [lastOrderId, setLastOrderId] = useState<string | null>(null);

  const handleLogin = useCallback(() => {
    setIsLoggedIn(true);
    setCurrentPage(Page.Home);
  }, []);

  const handleLogout = useCallback(() => {
    setIsLoggedIn(false);
    setCurrentPage(Page.Login);
  }, []);

  const handleNavigate = useCallback((page: Page) => {
    setCurrentPage(page);
  }, []);

  const handleBookOrder = useCallback((newOrder: Omit<EmployeeOrder, 'id' | 'status'>) => {
    const orderId = `ORD${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    const orderWithId: EmployeeOrder = {
      ...newOrder,
      id: orderId,
      status: 'pending',
    };
    setOrders(prevOrders => [orderWithId, ...prevOrders]);
    setLastOrderId(orderId);
    setCurrentPage(Page.BookingSuccess);
  }, []);

  const handleCompleteOrder = useCallback((orderId: string) => {
    const orderToComplete = orders.find(order => order.id === orderId);

    if (!orderToComplete) {
      console.error(`Order with id ${orderId} not found.`);
      return;
    }
    
    // Mark order as completed
    const completedOrder: EmployeeOrder = { ...orderToComplete, status: 'completed' };
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? completedOrder : order
      )
    );

    // Sync with shared data context to update stock
    syncEmployeeOrder(completedOrder);
  }, [orders, syncEmployeeOrder]);

  const handleUpdateStock = useCallback((itemId: string, newCount: number) => {
    updateStock(itemId, newCount);
  }, [updateStock]);

  const renderPage = () => {
    if (!isLoggedIn) {
      return (
        <div className="relative min-h-screen">
          <button
            onClick={onGoHome}
            className="absolute top-4 left-4 z-10 bg-gray-700/80 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-200 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </button>
          <LoginScreen onLogin={handleLogin} />
        </div>
      );
    }

    switch (currentPage) {
      case Page.Home:
        return (
          <div className="relative">
            <button
              onClick={onGoHome}
              className="absolute top-4 left-4 z-10 bg-gray-700/80 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-200 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </button>
            <HomeScreen onNavigate={handleNavigate} onLogout={handleLogout} />
          </div>
        );
      case Page.BookOrder:
        return <BookOrderScreen stock={stock} onBookOrder={handleBookOrder} onBack={() => handleNavigate(Page.Home)} />;
      case Page.BookingSuccess:
        return (
          <div className="w-full max-w-lg mx-auto bg-gray-800 border border-green-700 p-8 rounded-xl shadow-lg text-center">
            <h2 className="text-2xl font-bold text-green-400 mb-4">Order Placed!</h2>
            <p className="text-gray-300 mb-2">Your order has been successfully booked.</p>
            <p className="text-gray-100 font-semibold text-lg mb-6">Order ID: <span className="text-green-400">{lastOrderId}</span></p>
            <button
              onClick={() => handleNavigate(Page.Home)}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-300"
            >
              Done
            </button>
          </div>
        );
      case Page.CompleteOrder:
        return <CompleteOrderScreen orders={orders} onCompleteOrder={handleCompleteOrder} onBack={() => handleNavigate(Page.Home)} />;
      case Page.AddStock:
        return <AddStockScreen stock={stock} onUpdateStock={handleUpdateStock} onBack={() => handleNavigate(Page.Home)} />;
      default:
        return (
          <div className="relative">
            <button
              onClick={onGoHome}
              className="absolute top-4 left-4 z-10 bg-gray-700/80 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-200 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </button>
            <HomeScreen onNavigate={handleNavigate} onLogout={handleLogout} />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-4 sm:p-6 lg:p-8">
      {renderPage()}
    </div>
  );
};

export default EmployeeApp;