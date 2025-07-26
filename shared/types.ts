import type { ReactNode } from 'react';

// Shared Product/Item interface that maps between both systems
export interface SharedItem {
  id: string;
  name: string;
  price?: number; // Used in vendor system
  unit?: string;  // Used in vendor system
  count: number;  // Stock count from employee system
  image?: string; // Used in vendor system
  inStock: boolean; // Computed from count > 0
}

// Vendor-specific types
export enum Screen {
  Splash,
  SelectStore,
  SelectVendorType,
  BrowseProducts,
  PickupTime,
  OrderConfirmation,
  PastOrders
}

export interface Store {
  id: string;
  name: string;
  area: string;
  hours: string;
  isOpen: boolean;
}

export interface VendorType {
  id: string;
  name: string;
  icon: ReactNode;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  unit: string;
  image: string;
  inStock: boolean;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface VendorOrder {
  id: string;
  items: CartItem[];
  total: number;
  pickupTime: string;
  store: Store;
  date: string;
}

// Employee-specific types
export enum Page {
  Login,
  Home,
  BookOrder,
  BookingSuccess,
  CompleteOrder,
  AddStock
}

export interface OrderItem {
  itemId: string;
  name: string;
  quantity: number;
}

export interface EmployeeOrder {
  id: string;
  items: OrderItem[];
  bookingTime: string;
  status: 'pending' | 'completed';
}

export interface StockItem {
  id: string;
  name: string;
  count: number;
}

export interface Basket {
  id: string;
  name: string;
  itemIds: string[];
}

// Shared data context interface
export interface SharedDataContextType {
  stock: StockItem[];
  updateStock: (itemId: string, newCount: number) => void;
  syncVendorOrder: (order: VendorOrder) => void;
  syncEmployeeOrder: (order: EmployeeOrder) => void;
  getProductsFromStock: () => Product[];
}