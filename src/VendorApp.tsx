import React, { useState, useCallback, useMemo } from 'react';
import { Screen } from '../shared/types';
import type { Store, VendorType, Product, CartItem, VendorOrder } from '../shared/types';
import { useSharedData } from '../shared/DataContext';

// Import vendor components
import SplashScreen from '../Vendor_page/components/SplashScreen';
import SelectStoreScreen from '../Vendor_page/components/SelectStoreScreen';
import SelectVendorTypeScreen from '../Vendor_page/components/SelectVendorTypeScreen';
import BrowseProductsScreen from '../Vendor_page/components/BrowseProductsScreen';
import PickupTimeScreen from '../Vendor_page/components/PickupTimeScreen';
import OrderConfirmationScreen from '../Vendor_page/components/OrderConfirmationScreen';
import PastOrdersScreen from '../Vendor_page/components/PastOrdersScreen';
import HelpModal from '../Vendor_page/components/HelpModal';

// Import constants
import { STORES, VENDOR_TYPES } from '../Vendor_page/constants';

interface VendorAppProps {
  onGoHome: () => void;
}

const VendorApp: React.FC<VendorAppProps> = ({ onGoHome }) => {
    const { getProductsFromStock, syncVendorOrder } = useSharedData();
    const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.Splash);
    const [selectedStore, setSelectedStore] = useState<Store | null>(null);
    const [selectedVendorType, setSelectedVendorType] = useState<VendorType | null>(null);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [confirmedOrder, setConfirmedOrder] = useState<VendorOrder | null>(null);
    const [pastOrders, setPastOrders] = useState<VendorOrder[]>([]);
    const [isHelpModalOpen, setHelpModalOpen] = useState(false);

    // Get products from shared stock instead of static constants
    const products = useMemo(() => getProductsFromStock(), [getProductsFromStock]);

    const resetToHome = useCallback(() => {
        setCurrentScreen(Screen.Splash);
        setSelectedStore(null);
        setSelectedVendorType(null);
        setCart([]);
        setConfirmedOrder(null);
    }, []);

    const handleStartShopping = () => {
        setConfirmedOrder(null);
        setCurrentScreen(Screen.SelectStore);
    };
    
    const handleViewPastOrders = () => {
        setConfirmedOrder(null);
        setCurrentScreen(Screen.PastOrders);
    };

    const handleGoHomeFromConfirmation = () => {
        setCurrentScreen(Screen.Splash);
        setCart([]);
    };

    const handleSelectStore = (store: Store) => {
        setSelectedStore(store);
        setCurrentScreen(Screen.SelectVendorType);
    };

    const handleSelectVendorType = (vendorType: VendorType) => {
        setSelectedVendorType(vendorType);
        setCurrentScreen(Screen.BrowseProducts);
    };

    const handleUpdateCart = (productId: string, quantity: number) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.productId === productId);
            if (quantity <= 0) {
                return prevCart.filter(item => item.productId !== productId);
            }
            if (existingItem) {
                return prevCart.map(item => item.productId === productId ? { ...item, quantity } : item);
            }
            return [...prevCart, { productId, quantity }];
        });
    };
    
    const handleConfirmPickupTime = (timeSlot: string) => {
        if (!selectedStore || cart.length === 0) return;
        
        const total = cart.reduce((sum, item) => {
            const product = products.find(p => p.id === item.productId);
            return sum + (product ? product.price * item.quantity : 0);
        }, 0);

        const newOrder: VendorOrder = {
            id: `A${Math.floor(100 + Math.random() * 900)}`,
            items: cart,
            total,
            pickupTime: timeSlot,
            store: selectedStore,
            date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric'}),
        };

        setConfirmedOrder(newOrder);
        setPastOrders(prev => [newOrder, ...prev]);
        
        // Sync with shared data context to update stock
        syncVendorOrder(newOrder);
        
        setCurrentScreen(Screen.OrderConfirmation);
    };
    
    const handleReorder = (order: VendorOrder) => {
        const storeForReorder = STORES.find(s => s.id === order.store.id)
        if(storeForReorder && storeForReorder.isOpen) {
            setConfirmedOrder(null);
            setSelectedStore(storeForReorder);
            setCart(order.items);
            setCurrentScreen(Screen.BrowseProducts);
        } else {
            alert("The store for this order is currently closed or unavailable. Please start a new order.");
        }
    }

    const renderScreen = () => {
        switch (currentScreen) {
            case Screen.Splash:
                return (
                    <div className="relative">
                        <button
                            onClick={onGoHome}
                            className="absolute top-4 left-4 z-10 bg-gray-800/80 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Home
                        </button>
                        <SplashScreen onStart={handleStartShopping} onViewOrders={handleViewPastOrders} recentOrder={confirmedOrder} />
                    </div>
                );
            case Screen.SelectStore:
                return <SelectStoreScreen stores={STORES} onSelectStore={handleSelectStore} onBack={resetToHome} />;
            case Screen.SelectVendorType:
                return <SelectVendorTypeScreen vendorTypes={VENDOR_TYPES} onSelectVendorType={handleSelectVendorType} onBack={() => setCurrentScreen(Screen.SelectStore)} />;
            case Screen.BrowseProducts:
                return <BrowseProductsScreen
                    products={products}
                    cart={cart}
                    onUpdateCart={handleUpdateCart}
                    onViewOrder={() => setCurrentScreen(Screen.PickupTime)}
                    onOpenHelp={() => setHelpModalOpen(true)}
                    onBack={() => setCurrentScreen(Screen.SelectVendorType)}
                />;
            case Screen.PickupTime:
                return <PickupTimeScreen onConfirm={handleConfirmPickupTime} onBack={() => setCurrentScreen(Screen.BrowseProducts)} />;
            case Screen.OrderConfirmation:
                return confirmedOrder ? <OrderConfirmationScreen order={confirmedOrder} products={products} onGoHome={handleGoHomeFromConfirmation} /> : <SplashScreen onStart={handleStartShopping} onViewOrders={handleViewPastOrders} recentOrder={null} />;
            case Screen.PastOrders:
                return <PastOrdersScreen orders={pastOrders} products={products} onReorder={handleReorder} onBack={resetToHome} />;
            default:
                return <SplashScreen onStart={handleStartShopping} onViewOrders={handleViewPastOrders} recentOrder={null} />;
        }
    };

    return (
        <div className="antialiased text-gray-800">
            {renderScreen()}
            <HelpModal isOpen={isHelpModalOpen} onClose={() => setHelpModalOpen(false)} />
        </div>
    );
};

export default VendorApp;