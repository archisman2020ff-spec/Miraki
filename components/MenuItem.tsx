import React from 'react';
import type { FoodItem } from '../types';
import { IconPlus, IconTrash, IconPencil } from './Icons';

// Fix: Implemented MenuItem component to resolve module errors.
interface MenuItemProps {
  item: FoodItem;
  onAddToCart: (item: FoodItem) => void;
  isAdmin: boolean;
  onEdit: (item: FoodItem) => void;
  onDelete: (id: number) => void;
}

// Fix: Add explicit return type to ensure TypeScript recognizes this as a React component.
export default function MenuItem({ item, onAddToCart, isAdmin, onEdit, onDelete }: MenuItemProps): JSX.Element {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform transform hover:scale-105 flex flex-col">
      <img src={item.imageUrl} alt={item.name} className="w-full h-48 object-cover" />
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start">
            <h3 className="text-xl font-bold text-gray-800">{item.name}</h3>
            <p className="text-lg font-semibold text-green-600">${item.price.toFixed(2)}</p>
        </div>
        <p className="text-gray-600 my-2 flex-grow">{item.description}</p>
        <div className="flex flex-wrap gap-2 mt-2">
            {item.tags?.map(tag => (
                <span key={tag} className="bg-gray-200 text-gray-700 px-2 py-1 text-xs font-semibold rounded-full">{tag}</span>
            ))}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200">
            {isAdmin ? (
                <div className="flex justify-between items-center">
                    <button onClick={() => onEdit(item)} className="text-sm text-blue-500 hover:text-blue-700 font-semibold flex items-center">
                        <IconPencil className="w-4 h-4 mr-1" /> Edit
                    </button>
                    <button onClick={() => onDelete(item.id)} className="text-sm text-red-500 hover:text-red-700 font-semibold flex items-center">
                        <IconTrash className="w-4 h-4 mr-1" /> Delete
                    </button>
                </div>
            ) : (
                <button 
                    onClick={() => onAddToCart(item)} 
                    className="w-full bg-green-500 text-white font-bold py-2 px-4 rounded-md hover:bg-green-600 transition-colors flex items-center justify-center"
                >
                    <IconPlus className="w-5 h-5 mr-2" />
                    Add to Cart
                </button>
            )}
        </div>
      </div>
    </div>
  );
}
