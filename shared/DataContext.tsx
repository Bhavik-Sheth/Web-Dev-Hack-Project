import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { SharedDataContextType, StockItem, VendorOrder, EmployeeOrder, Product, OrderItem, CartItem } from './types';

const SharedDataContext = createContext<SharedDataContextType | undefined>(undefined);

// Initial stock data that maps products between both systems
const INITIAL_STOCK: StockItem[] = [
  { id: 'p1', name: 'Tomato', count: 80 },
  { id: 'p2', name: 'Onion', count: 100 },
  { id: 'p3', name: 'Potato', count: 100 },
  { id: 'p4', name: 'Coriander', count: 0 }, // Out of stock
  { id: 'p5', name: 'Green Chillies', count: 60 },
  { id: 'p6', name: 'Lemon', count: 50 },
  { id: 'p7', name: 'Maida Flour', count: 25 },
  { id: 'p8', name: 'Cooking Oil', count: 0 }, // Out of stock
  // Additional items from employee system
  { id: 'veg-4', name: 'Capsicum', count: 50 },
  { id: 'veg-5', name: 'Cabbage', count: 30 },
  { id: 'veg-6', name: 'Carrot', count: 40 },
  { id: 'veg-7', name: 'Green Peas', count: 60 },
  { id: 'veg-8', name: 'Ginger', count: 90 },
  { id: 'veg-9', name: 'Garlic', count: 90 },
  { id: 'veg-11', name: 'Noodles', count: 50 },
  { id: 'veg-12', name: 'Puffed Rice', count: 70 },
  { id: 'veg-13', name: 'Sev', count: 70 },
];

// Product details for vendor system (pricing, images, etc.)
const PRODUCT_DETAILS: Partial<Record<string, { price: number; unit: string; image: string }>> = {
  'p1': { price: 40, unit: 'kg', image: 'https://picsum.photos/id/1080/200/200' },
  'p2': { price: 30, unit: 'kg', image: 'https://picsum.photos/id/292/200/200' },
  'p3': { price: 25, unit: 'kg', image: 'https://picsum.photos/id/1078/200/200' },
  'p4': { price: 10, unit: 'bunch', image: 'https://picsum.photos/id/106/200/200' },
  'p5': { price: 50, unit: 'kg', image: 'https://picsum.photos/id/425/200/200' },
  'p6': { price: 5, unit: 'piece', image: 'https://picsum.photos/id/211/200/200' },
  'p7': { price: 45, unit: 'kg', image: 'https://picsum.photos/id/431/200/200' },
  'p8': { price: 150, unit: 'litre', image: 'https://picsum.photos/id/355/200/200' },
  'veg-4': { price: 35, unit: 'kg', image: 'https://picsum.photos/id/1073/200/200' },
  'veg-5': { price: 20, unit: 'kg', image: 'https://picsum.photos/id/1074/200/200' },
  'veg-6': { price: 30, unit: 'kg', image: 'https://picsum.photos/id/1075/200/200' },
  'veg-7': { price: 80, unit: 'kg', image: 'https://picsum.photos/id/1076/200/200' },
  'veg-8': { price: 120, unit: 'kg', image: 'https://picsum.photos/id/1077/200/200' },
  'veg-9': { price: 100, unit: 'kg', image: 'https://picsum.photos/id/1079/200/200' },
  'veg-11': { price: 60, unit: 'kg', image: 'https://picsum.photos/id/1081/200/200' },
  'veg-12': { price: 40, unit: 'kg', image: 'https://picsum.photos/id/1082/200/200' },
  'veg-13': { price: 50, unit: 'kg', image: 'https://picsum.photos/id/1083/200/200' },
};

interface SharedDataProviderProps {
  children: ReactNode;
}

export const SharedDataProvider: React.FC<SharedDataProviderProps> = ({ children }) => {
  const [stock, setStock] = useState<StockItem[]>(INITIAL_STOCK);

  const updateStock = useCallback((itemId: string, newCount: number) => {
    setStock(prevStock =>
      prevStock.map(item =>
        item.id === itemId ? { ...item, count: Math.max(0, newCount) } : item
      )
    );
  }, []);

  const syncVendorOrder = useCallback((vendorOrder: VendorOrder) => {
    // When a vendor order is placed, deduct from stock
    setStock(prevStock => {
      const stockMap = new Map(prevStock.map(item => [item.id, { ...item }]));
      
      for (const cartItem of vendorOrder.items) {
        const stockItem = stockMap.get(cartItem.productId);
        if (stockItem) {
          stockItem.count = Math.max(0, stockItem.count - cartItem.quantity);
        }
      }
      
      return Array.from(stockMap.values());
    });
  }, []);

  const syncEmployeeOrder = useCallback((employeeOrder: EmployeeOrder) => {
    // When an employee order is completed, deduct from stock
    if (employeeOrder.status === 'completed') {
      setStock(prevStock => {
        const stockMap = new Map(prevStock.map(item => [item.id, { ...item }]));
        
        for (const orderItem of employeeOrder.items) {
          const stockItem = stockMap.get(orderItem.itemId);
          if (stockItem) {
            stockItem.count = Math.max(0, stockItem.count - orderItem.quantity);
          }
        }
        
        return Array.from(stockMap.values());
      });
    }
  }, []);

  const getProductsFromStock = useCallback((): Product[] => {
    return stock.map(stockItem => {
      const details = PRODUCT_DETAILS[stockItem.id];
      return {
        id: stockItem.id,
        name: stockItem.name,
        price: details?.price || 0,
        unit: details?.unit || 'piece',
        image: details?.image || 'https://picsum.photos/200/200',
        inStock: stockItem.count > 0,
      };
    }).filter(product => product.price > 0); // Only include items with pricing (vendor products)
  }, [stock]);

  const contextValue: SharedDataContextType = {
    stock,
    updateStock,
    syncVendorOrder,
    syncEmployeeOrder,
    getProductsFromStock,
  };

  return (
    <SharedDataContext.Provider value={contextValue}>
      {children}
    </SharedDataContext.Provider>
  );
};

export const useSharedData = (): SharedDataContextType => {
  const context = useContext(SharedDataContext);
  if (context === undefined) {
    throw new Error('useSharedData must be used within a SharedDataProvider');
  }
  return context;
};