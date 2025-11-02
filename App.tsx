import React, { useState, useEffect } from 'react';
import type { User, FoodItem } from './types';
import Login from './components/Login';
import Header from './components/Header';
import Menu from './components/Menu';
import Cart from './components/Cart';
import Chatbot from './components/Chatbot';
import MealPlanner from './components/MealPlanner';
import OrderTracker from './components/OrderTracker';
import LiveAssistant from './components/LiveAssistant';
import { useCart } from './hooks/useCart';
import { INITIAL_MENU_ITEMS } from './constants';

type View = 'menu' | 'mealPlanner' | 'orderTracker' | 'liveAssistant';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeView, setActiveView] = useState<View>('menu');
  const [menuItems, setMenuItems] = useState<FoodItem[]>(INITIAL_MENU_ITEMS);
  const [categories, setCategories] = useState<string[]>([]);
  const { cart, addToCart, removeFromCart, clearCart, cartTotal } = useCart();
  
  useEffect(() => {
    // Derive categories from menu items
    const uniqueCategories = [...new Set(menuItems.map(item => item.category))];
    setCategories(uniqueCategories);
  }, [menuItems]);

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    if (loggedInUser.email.toLowerCase() === 'support@laylawn.com') {
      setIsAdmin(true);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setIsAdmin(false);
  };

  const handleAddDish = (dish: Omit<FoodItem, 'id'>) => {
    const newDish: FoodItem = {
      ...dish,
      id: Math.max(0, ...menuItems.map(item => item.id)) + 1,
    };
    setMenuItems(prev => [...prev, newDish]);
  };
  
  const handleUpdateDish = (updatedDish: FoodItem) => {
    setMenuItems(prev => prev.map(item => item.id === updatedDish.id ? updatedDish : item));
  };
  
  const handleDeleteDish = (id: number) => {
    setMenuItems(prev => prev.filter(item => item.id !== id));
  };

  const handleAddCategory = (category: string) => {
    if (category && !categories.includes(category)) {
      setCategories(prev => [...prev, category]);
    }
  };

  const handleDeleteCategory = (category: string) => {
    setCategories(prev => prev.filter(cat => cat !== category));
    setMenuItems(prev => prev.filter(item => item.category !== category));
  };

  if (!user) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  const renderActiveView = () => {
    switch(activeView) {
      case 'menu':
        return <Menu 
                  menuItems={menuItems} 
                  onAddToCart={addToCart} 
                  isAdmin={isAdmin}
                  categories={categories}
                  onAddDish={handleAddDish}
                  onUpdateDish={handleUpdateDish}
                  onDeleteDish={handleDeleteDish}
                  onAddCategory={handleAddCategory}
                  onDeleteCategory={handleDeleteCategory}
                />;
      case 'mealPlanner':
        return <MealPlanner />;
      case 'orderTracker':
        return <OrderTracker />;
      case 'liveAssistant':
        return <LiveAssistant />;
      default:
        return <div>Not Found</div>;
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header 
        user={user} 
        cartItemCount={cartItemCount}
        onCartClick={() => setIsCartOpen(true)}
        onLogout={handleLogout}
        onNavigate={setActiveView}
        activeView={activeView}
      />
      <main>
        {renderActiveView()}
      </main>
      {isCartOpen && (
        <Cart 
          cart={cart}
          cartTotal={cartTotal}
          onClose={() => setIsCartOpen(false)}
          onRemoveFromCart={removeFromCart}
          onAddToCart={addToCart}
          onClearCart={clearCart}
        />
      )}
      <Chatbot menuItems={menuItems} />
    </div>
  );
}
