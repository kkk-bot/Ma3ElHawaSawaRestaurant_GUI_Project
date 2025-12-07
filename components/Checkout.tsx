import React, { useState, useEffect } from 'react';
import { CartItem, User, NotificationType } from '../types';

interface CheckoutProps {
  cart: CartItem[];
  currentUser: User | null;
  onSubmitOrder: (details: { name: string; phone: string; isDelivery: boolean; address: string }) => void;
  onCancel: () => void;
  showNotification: (msg: string, type: NotificationType) => void;
}

export const Checkout: React.FC<CheckoutProps> = ({ cart, currentUser, onSubmitOrder, onCancel, showNotification }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isDelivery, setIsDelivery] = useState(false);
  const [address, setAddress] = useState('');

  // Autofill if user is logged in
  useEffect(() => {
    if (currentUser) {
        setName(currentUser.fullName);
        setPhone(currentUser.phone);
    }
  }, [currentUser]);

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  // Simple delivery fee logic
  const deliveryFee = isDelivery ? 2.50 : 0.00;
  const grandTotal = total + deliveryFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      showNotification('يرجى تعبئة الاسم ورقم الهاتف', 'error');
      return;
    }
    if (isDelivery && !address) {
      showNotification('يرجى إدخال عنوان التوصيل', 'error');
      return;
    }
    onSubmitOrder({ name, phone, isDelivery, address });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
        <h2 className="text-2xl font-bold mb-6 text-center text-primary">إتمام عملية الدفع</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Personal Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الاسم الكامل</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                placeholder="أدخل اسمك"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف</label>
              <input 
                type="tel" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                placeholder="079xxxxxxx"
                required
              />
            </div>
          </div>

          {/* Delivery Toggle */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <label className="flex items-center cursor-pointer mb-2">
              <input 
                type="checkbox" 
                checked={isDelivery}
                onChange={(e) => setIsDelivery(e.target.checked)}
                className="w-5 h-5 text-primary rounded focus:ring-primary"
              />
              <span className="mr-3 font-bold text-gray-800">أرغب بخدمة التوصيل</span>
            </label>
            <p className="text-sm text-gray-500 mr-8">تضاف رسوم توصيل بقيمة 2.50 د.أ</p>
          </div>

          {/* Address (Conditional) */}
          {isDelivery && (
            <div className="animate-fade-in-down">
              <label className="block text-sm font-medium text-gray-700 mb-1">عنوان التوصيل بالتفصيل</label>
              <textarea 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none h-24"
                placeholder="المدينة، المنطقة، الشارع، رقم البناية..."
                required={isDelivery}
              />
            </div>
          )}

          {/* Summary */}
          <div className="border-t pt-4 mt-4 space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>قيمة الطلبات</span>
              <span>{total.toFixed(2)} د.أ</span>
            </div>
            {isDelivery && (
              <div className="flex justify-between text-gray-600">
                <span>رسوم التوصيل</span>
                <span>{deliveryFee.toFixed(2)} د.أ</span>
              </div>
            )}
            <div className="flex justify-between text-xl font-bold text-gray-900 border-t pt-2 mt-2">
              <span>الإجمالي</span>
              <span className="text-primary">{grandTotal.toFixed(2)} د.أ</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <button 
              type="button" 
              onClick={onCancel}
              className="flex-1 py-3 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 font-bold"
            >
              إلغاء
            </button>
            <button 
              type="submit"
              className="flex-1 py-3 bg-primary text-white rounded-lg hover:bg-amber-700 font-bold shadow-lg transition"
            >
              تأكيد الطلب
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};