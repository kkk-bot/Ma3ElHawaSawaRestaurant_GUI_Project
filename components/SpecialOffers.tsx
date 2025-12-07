import React from 'react';
import { MenuItem } from '../types';

interface SpecialOffersProps {
  items: MenuItem[];
  onAddToCart: (item: MenuItem) => void;
}

export const SpecialOffers: React.FC<SpecialOffersProps> = ({ items, onAddToCart }) => {
  // Take only the first 3 items marked as special, or just first 3 if none
  const specials = items.filter(i => i.isSpecial).slice(0, 3);
  const displayItems = specials.length > 0 ? specials : items.slice(0, 3);

  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h3 className="text-3xl font-bold text-center mb-10 text-primary">عروضنا المميزة</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayItems.map((item, index) => (
            <div 
              key={item.id} 
              className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 border border-gray-100 flex flex-col h-full"
            >
              <div className="relative h-48 md:h-56">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                  عرض خاص
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-grow text-center">
                <h4 className="text-xl font-bold text-gray-900 mb-2">{item.name}</h4>
                <p className="text-gray-600 mb-4 flex-grow text-sm line-clamp-3">
                  {item.description}
                </p>
                <div className="mt-auto pt-4 border-t border-gray-100 w-full">
                  <p className="text-2xl font-bold text-primary mb-4">
                    {item.price.toFixed(2)} د.أ
                  </p>
                  <button 
                    onClick={() => onAddToCart(item)}
                    className="w-full bg-primary hover:bg-amber-700 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <span>أضف للسلة</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};