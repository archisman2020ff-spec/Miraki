import React, { useState, useEffect } from 'react';
import type { FoodItem } from '../types';
import MenuItem from './MenuItem';
import { IconClose, IconPlus, IconTrash } from './Icons';

interface MenuProps {
  menuItems: FoodItem[];
  onAddToCart: (item: FoodItem) => void;
  isAdmin: boolean;
  categories: FoodItem['category'][];
  onAddDish: (dish: Omit<FoodItem, 'id'>) => void;
  onUpdateDish: (dish: FoodItem) => void;
  onDeleteDish: (id: number) => void;
  onAddCategory: (category: string) => void;
  onDeleteCategory: (category: string) => void;
}

const emptyDish: Omit<FoodItem, 'id'> = {
  name: '',
  description: '',
  price: 0,
  imageUrl: '',
  category: 'Mains',
  tags: [],
};

export default function Menu({ menuItems, onAddToCart, isAdmin, categories, onAddDish, onUpdateDish, onDeleteDish, onAddCategory, onDeleteCategory }: MenuProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<Omit<FoodItem, 'id'> | FoodItem | null>(null);
  const [formData, setFormData] = useState<Omit<FoodItem, 'id'>>(emptyDish);
  const [newCategory, setNewCategory] = useState('');

  useEffect(() => {
    if (editingDish) {
      setFormData(editingDish);
    } else {
      setFormData(emptyDish);
    }
  }, [editingDish]);
  
  const handleOpenAddModal = () => {
    setEditingDish(null);
    setFormData(emptyDish);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (dish: FoodItem) => {
    setEditingDish(dish);
    setFormData(dish);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingDish(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "tags") {
        setFormData(prev => ({ ...prev, tags: value.split(',').map(tag => tag.trim()) }));
    } else if (name === "price") {
        setFormData(prev => ({ ...prev, price: parseFloat(value) || 0 }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.imageUrl) {
        alert("Please upload an image.");
        return;
    }
    if (editingDish && 'id' in editingDish) {
        onUpdateDish(formData as FoodItem);
    } else {
        onAddDish(formData);
    }
    handleCloseModal();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {isAdmin && (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-12 border border-green-200">
          <h3 className="text-2xl font-bold mb-4 text-gray-800">Admin Panel</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-xl font-semibold mb-3">Manage Categories</h4>
              <div className="flex items-center mb-4">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="New category name"
                  className="flex-grow border rounded-l-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button onClick={() => { onAddCategory(newCategory); setNewCategory(''); }} className="bg-green-500 text-white px-4 py-2 rounded-r-md hover:bg-green-600">Add</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <div key={cat} className="flex items-center bg-gray-200 rounded-full px-3 py-1 text-sm">
                    <span>{cat}</span>
                    <button onClick={() => onDeleteCategory(cat)} className="ml-2 text-red-500 hover:text-red-700">
                      <IconTrash className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-center">
              <button onClick={handleOpenAddModal} className="w-full bg-blue-500 text-white font-bold py-3 px-6 rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center text-lg">
                <IconPlus className="w-6 h-6 mr-2" /> Add New Dish
              </button>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-40 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative m-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">{editingDish ? 'Edit Dish' : 'Add New Dish'}</h2>
            <button onClick={handleCloseModal} className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200">
                <IconClose className="w-6 h-6" />
            </button>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-semibold">Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded" required />
              </div>
              <div>
                <label className="block font-semibold">Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} className="w-full p-2 border rounded" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold">Price</label>
                  <input type="number" name="price" step="0.01" value={formData.price} onChange={handleChange} className="w-full p-2 border rounded" required />
                </div>
                <div>
                  <label className="block font-semibold">Category</label>
                  <select name="category" value={formData.category} onChange={handleChange} className="w-full p-2 border rounded" required>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-semibold">Image</label>
                <input 
                    type="file" 
                    name="image" 
                    accept="image/png, image/jpeg, image/webp" 
                    onChange={handleImageChange}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                />
                {formData.imageUrl && (
                    <div className="mt-4">
                        <p className="font-semibold text-sm mb-1">Image Preview:</p>
                        <img src={formData.imageUrl} alt="Preview" className="w-32 h-32 object-cover rounded-md border" />
                    </div>
                )}
              </div>
               <div>
                <label className="block font-semibold">Tags (comma-separated)</label>
                <input type="text" name="tags" value={formData.tags?.join(', ') || ''} onChange={handleChange} className="w-full p-2 border rounded" />
              </div>
              <div className="flex justify-end pt-4">
                <button type="button" onClick={handleCloseModal} className="mr-2 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {categories.map(category => {
        const itemsInCategory = menuItems.filter(item => item.category === category);
        if (itemsInCategory.length === 0) return null;

        return (
          <div key={category} className="mb-12">
            <h2 className="text-3xl font-bold mb-6 border-b-2 border-green-500 pb-2">{category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {itemsInCategory.map(item => (
                <MenuItem 
                    key={item.id} 
                    item={item} 
                    onAddToCart={onAddToCart}
                    isAdmin={isAdmin}
                    onEdit={handleOpenEditModal}
                    onDelete={onDeleteDish}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}