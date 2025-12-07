import React, { useEffect, useState } from 'react';
import { Order, User } from '../types';
import { dbService } from '../services/dbService';
import { Clock, MapPin, Package, Truck, CheckCircle } from 'lucide-react';

interface OrderHistoryProps {
  currentUser: User;
}

export const OrderHistory: React.FC<OrderHistoryProps> = ({ currentUser }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (currentUser) {
        const userOrders = await dbService.getUserOrders(currentUser.id);
        setOrders(userOrders);
      }
      setLoading(false);
    };
    fetchOrders();
  }, [currentUser]);

  if (loading) {
    return <div className="p-12 text-center text-gray-500">جاري تحميل الطلبات...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
        <div className="bg-orange-50 p-6 rounded-full mb-4">
          <Package size={48} className="text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">لا توجد طلبات سابقة</h2>
        <p className="text-gray-600">لم تقم بإجراء أي طلبات حتى الآن.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold mb-8 text-gray-900 border-b pb-4 flex items-center gap-2">
        <ClipboardListIcon />
        طلباتي السابقة
      </h2>
      
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
            
            {/* Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex flex-wrap justify-between items-center gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">رقم الطلب</p>
                <p className="font-mono font-bold text-gray-700">#{order.id}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">تاريخ الطلب</p>
                <div className="flex items-center gap-1 text-gray-700 font-medium">
                   <Clock size={14} />
                   <span>{new Date(order.date).toLocaleDateString('ar-JO')}</span>
                   <span className="text-xs text-gray-400">({new Date(order.date).toLocaleTimeString('ar-JO', { hour: '2-digit', minute: '2-digit' })})</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">الحالة</p>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <CheckCircle size={12} className="ml-1" />
                  مكتمل
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                
                {/* Items List */}
                <div className="flex-grow">
                  <h4 className="text-sm font-bold text-gray-500 mb-3 uppercase tracking-wider">الأصناف المطلوبة</h4>
                  <ul className="space-y-3">
                    {order.items.map((item, idx) => (
                      <li key={idx} className="flex items-center justify-between border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                        <div className="flex items-center gap-3">
                          <span className="bg-orange-100 text-primary text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full">
                            {item.quantity}x
                          </span>
                          <span className="text-gray-800 font-medium">{item.name}</span>
                        </div>
                        <span className="text-gray-600 text-sm">{(item.price * item.quantity).toFixed(2)} د.أ</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Delivery Info & Total */}
                <div className="md:w-1/3 bg-gray-50 rounded-lg p-4 flex flex-col justify-between">
                  <div className="mb-4">
                     <h4 className="text-sm font-bold text-gray-500 mb-2 uppercase tracking-wider">طريقة الاستلام</h4>
                     <div className="flex items-start gap-2 text-gray-700">
                        {order.isDelivery ? (
                            <>
                                <Truck size={20} className="text-primary mt-1" />
                                <div>
                                    <span className="font-bold block">توصيل للمنزل</span>
                                    {order.address && <p className="text-sm text-gray-500 mt-1">{order.address}</p>}
                                </div>
                            </>
                        ) : (
                            <>
                                <Package size={20} className="text-primary mt-1" />
                                <span className="font-bold">استلام من المطعم</span>
                            </>
                        )}
                     </div>
                  </div>

                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">المجموع الكلي</span>
                        <span className="text-xl font-bold text-primary">{order.total.toFixed(2)} د.أ</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

const ClipboardListIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
    <path d="M9 12h6"></path>
    <path d="M9 16h6"></path>
    <path d="M9 8h6"></path>
  </svg>
);
