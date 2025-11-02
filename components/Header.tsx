import React from 'react';
import type { User } from '../types';
import { IconShoppingCart, IconUser, IconLogout } from './Icons';

// Fix: Implemented Header component to resolve module errors.
interface HeaderProps {
  user: User | null;
  cartItemCount: number;
  onCartClick: () => void;
  onLogout: () => void;
  onNavigate: (view: string) => void;
  activeView: string;
}

export default function Header({ user, cartItemCount, onCartClick, onLogout, onNavigate, activeView }: HeaderProps) {
  const navLinkClasses = (view: string) => 
    `px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeView === view ? 'bg-green-600 text-white' : 'text-gray-700 hover:bg-green-100'}`;

  return (
    <header className="bg-white shadow-md sticky top-0 z-30">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-green-600 cursor-pointer" onClick={() => onNavigate('menu')}>LayLawn</h1>
          <nav className="ml-10 hidden md:flex items-center space-x-4">
            <button onClick={() => onNavigate('menu')} className={navLinkClasses('menu')}>Menu</button>
            <button onClick={() => onNavigate('mealPlanner')} className={navLinkClasses('mealPlanner')}>Meal Planner</button>
            <button onClick={() => onNavigate('orderTracker')} className={navLinkClasses('orderTracker')}>Order Tracker</button>
            <button onClick={() => onNavigate('liveAssistant')} className={navLinkClasses('liveAssistant')}>Live Assistant</button>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <button onClick={onCartClick} className="relative p-2 rounded-full hover:bg-gray-100">
            <IconShoppingCart className="w-6 h-6 text-gray-700" />
            {cartItemCount > 0 && (
              <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </button>
          {user && (
            <div className="flex items-center space-x-2">
              <IconUser className="w-6 h-6 text-gray-500" />
              <span className="hidden sm:block font-medium text-gray-700">{user.name}</span>
              <button onClick={onLogout} className="p-2 rounded-full hover:bg-gray-100">
                <IconLogout className="w-6 h-6 text-gray-500" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
