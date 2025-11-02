import React from 'react';
import type { CartItem, FoodItem } from '../types';
import { IconClose, IconTrash, IconPlus, IconMinus } from './Icons';

interface CartProps {
  cart: CartItem[];
  cartTotal: number;
  onClose: () => void;
  onRemoveFromCart: (itemId: number) => void;
  onAddToCart: (item: FoodItem) => void;
  onClearCart: () => void;
}

export default function Cart({ cart, cartTotal, onClose, onRemoveFromCart, onAddToCart, onClearCart }: CartProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-end" onClick={onClose}>
      <div className="w-full max-w-md h-full bg-white shadow-xl flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="p-4 flex justify-between items-center border-b">
          <h2 className="text-2xl font-bold">Your Cart</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
            <IconClose className="w-6 h-6" />
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="flex-grow flex flex-col justify-center items-center">
            <p className="text-lg text-gray-500">Your cart is empty.</p>
          </div>
        ) : (
          <div className="flex-grow overflow-y-auto p-4">
            {cart.map(item => (
              <div key={item.id} className="flex items-center mb-4 pb-4 border-b last:border-b-0">
                <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-cover rounded-md mr-4" />
                <div className="flex-grow">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-gray-600 text-sm">${item.price.toFixed(2)}</p>
                  <div className="flex items-center mt-2">
                    <button onClick={() => onRemoveFromCart(item.id)} className="p-1 border rounded-md hover:bg-gray-100">
                      <IconMinus className="w-4 h-4" />
                    </button>
                    <span className="px-3 font-semibold">{item.quantity}</span>
                    <button onClick={() => onAddToCart(item)} className="p-1 border rounded-md hover:bg-gray-100">
                      <IconPlus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {cart.length > 0 && (
          <div className="p-4 border-t bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">Subtotal</span>
              <span className="text-xl font-bold">${cartTotal.toFixed(2)}</span>
            </div>
            <button className="w-full bg-green-500 text-white font-bold py-3 rounded-md hover:bg-green-600 transition-colors">
              Proceed to Checkout
            </button>
            <button onClick={onClearCart} className="w-full mt-2 flex items-center justify-center text-sm text-red-500 hover:text-red-700">
              <IconTrash className="w-4 h-4 mr-1"/> Clear Cart
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
