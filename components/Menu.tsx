import React from 'react';
import { MenuItem } from '../types';
import { Plus } from 'lucide-react';

interface MenuProps {
  items: MenuItem[];
  onAddToCart: (item: MenuItem) => void;
}

export const Menu: React.FC<MenuProps> = ({ items, onAddToCart }) => {
  return (
    <div className="py-12 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center border-b pb-4 border-primary inline-block w-full">
          قائمة الطعام
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-48 overflow-hidden bg-gray-200 relative">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
                  <span className="text-lg font-bold text-primary">{item.price.toFixed(2)} د.أ</span>
                </div>
                <p className="text-sm text-gray-500 mb-4 h-12 overflow-hidden">{item.description}</p>
                <button 
                  onClick={() => onAddToCart(item)}
                  className="w-full bg-gray-900 hover:bg-primary text-white py-2 rounded transition-colors flex items-center justify-center gap-2"
                >
                  <Plus size={16} />
                  أضف للسلة
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};