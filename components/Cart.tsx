import React from 'react';
import { CartItem } from '../types';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';

interface CartProps {
  cart: CartItem[];
  updateQuantity: (id: number, delta: number) => void;
  removeFromCart: (id: number) => void;
  onCheckout: () => void;
  onContinueShopping: () => void;
}

export const Cart: React.FC<CartProps> = ({ 
  cart, 
  updateQuantity, 
  removeFromCart, 
  onCheckout,
  onContinueShopping
}) => {
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
        <div className="bg-gray-100 p-6 rounded-full mb-4">
          <Trash2 size={48} className="text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">سلة المشتريات فارغة</h2>
        <p className="text-gray-600 mb-6">لم تقم بإضافة أي وجبات بعد.</p>
        <button 
          onClick={onContinueShopping}
          className="bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-amber-700 transition"
        >
          تصفح القائمة
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold mb-8 text-gray-900 border-b pb-4">سلة المشتريات</h2>
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {cart.map((item) => (
            <li key={item.id} className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-md" />
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
                  <p className="text-primary font-medium">{item.price.toFixed(2)} د.أ</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="flex items-center border rounded-md">
                  <button 
                    onClick={() => updateQuantity(item.id, -1)}
                    className="p-2 hover:bg-gray-100 text-gray-600"
                    disabled={item.quantity <= 1}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-10 text-center font-bold">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, 1)}
                    className="p-2 hover:bg-gray-100 text-gray-600"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                
                <p className="font-bold w-20 text-center">
                  {(item.price * item.quantity).toFixed(2)} د.أ
                </p>
                
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:text-red-700 p-2"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </li>
          ))}
        </ul>
        
        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <div className="flex justify-between items-center text-xl font-bold mb-6">
            <span>المجموع الكلي:</span>
            <span className="text-primary">{total.toFixed(2)} د.أ</span>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={onContinueShopping}
              className="flex-1 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 font-bold transition text-center"
            >
              إضافة المزيد
            </button>
            <button 
              onClick={onCheckout}
              className="flex-1 py-3 bg-primary text-white rounded-lg hover:bg-amber-700 font-bold shadow-md transition flex items-center justify-center gap-2"
            >
              <span>إتمام الطلب</span>
              <ArrowRight size={20} className="transform rotate-180" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};