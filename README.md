# FreshStock - Integrated Food Vendor and Outlet Management System

A unified platform that integrates food vendor ordering and outlet employee management systems with real-time stock synchronization.

## 🌟 Features

### 🏠 Home Dashboard
- Clean, modern interface with two main entry points
- Real-time synchronized features overview
- Seamless navigation between vendor and employee portals

### 🛒 Food Vendor System
- Browse products by vendor type (Pani Puri, Chaat, Pav Bhaji, Sandwiches, Momos, etc.)
- Select store locations
- Add items to cart with real-time stock validation
- Schedule pickup times
- View past orders and reorder functionality
- **Real-time stock updates** - Items automatically show out of stock when inventory is depleted

### 👥 Outlet Employee System
- Secure login system
- Inventory management with stock levels
- Order booking and completion
- Stock addition and updates
- **Real-time inventory synchronization** - Changes immediately reflect across all systems

## 🔄 Real-time Synchronization

The system features bi-directional synchronization:

1. **Vendor Orders → Stock Deduction**: When customers place orders, stock is automatically reduced
2. **Employee Updates → Vendor Availability**: When employees update stock, products become available/unavailable for vendors
3. **Order Completion → Stock Adjustment**: When employees complete orders, stock is deducted accordingly

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd freshstock-integrated
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

## 🏗️ Architecture

### Project Structure
```
/
├── src/                    # Main application source
│   ├── App.tsx            # Root application component
│   ├── HomePage.tsx       # Landing page with navigation buttons
│   ├── VendorApp.tsx      # Vendor system wrapper
│   ├── EmployeeApp.tsx    # Employee system wrapper
│   └── index.tsx          # Application entry point
├── shared/                # Shared data layer
│   ├── types.ts           # Common type definitions
│   └── DataContext.tsx    # Global state management
├── Vendor_page/           # Original vendor system
│   ├── components/        # Vendor UI components
│   ├── constants.tsx      # Vendor data and configurations
│   └── types.ts           # Vendor-specific types
├── employee/              # Original employee system
│   ├── components/        # Employee UI components
│   ├── constants.ts       # Employee data and configurations
│   └── types.ts           # Employee-specific types
└── public/                # Static assets
```

### Key Components

#### SharedDataProvider
- Manages global state for stock levels
- Provides real-time synchronization between vendor and employee systems
- Handles order processing and stock updates

#### VendorApp
- Wrapper around the original vendor system
- Integrates with shared data context for real-time stock information
- Automatically updates stock when orders are placed

#### EmployeeApp
- Wrapper around the original employee system
- Uses shared data context for inventory management
- Real-time stock updates reflect immediately in vendor system

## 🎯 Usage Flow

### For Food Vendors:
1. Click "Food Vendor" on the home page
2. Select a store location
3. Choose vendor type (Pani Puri, Chaat, etc.)
4. Browse available products (stock levels are live)
5. Add items to cart
6. Schedule pickup time
7. Confirm order (stock automatically deducted)

### For Outlet Employees:
1. Click "Outlet Employee" on the home page
2. Login with credentials
3. Manage inventory levels
4. Book orders for customers
5. Complete orders (stock automatically updated)
6. Add new stock (immediately available to vendors)

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **State Management**: React Context API
- **Icons**: Heroicons (via SVG)

## 🔧 Configuration

The system can be configured through:
- `shared/DataContext.tsx` - Initial stock levels and product pricing
- `Vendor_page/constants.tsx` - Store locations and vendor types
- `employee/constants.ts` - Basket configurations and additional stock items

## 🚀 Features in Detail

### Real-time Stock Management
- Stock levels are shared between both systems
- Automatic stock deduction on order placement
- Immediate availability updates
- Prevents overselling with real-time validation

### Unified Product Catalog
- Products from both systems are merged intelligently
- Pricing information maintained for vendor system
- Stock counts managed by employee system
- Seamless data flow between different product formats

### Order Synchronization
- Vendor orders automatically deduct stock
- Employee order completion updates inventory
- Both systems maintain their own order tracking
- Real-time updates prevent conflicts

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions, please contact the development team or create an issue in the repository.
