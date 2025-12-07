import React, { useState, useEffect } from 'react';
import { AboutContent, NotificationType } from '../types';

interface AdminPanelProps {
  onAddItem: (item: any) => Promise<void>;
  aboutContent: AboutContent;
  onUpdateAbout: (content: AboutContent) => Promise<void>;
  showNotification: (msg: string, type: NotificationType) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onAddItem, aboutContent, onUpdateAbout, showNotification }) => {
  const [activeTab, setActiveTab] = useState<'MENU' | 'CONTENT'>('MENU');

  // Menu Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [isSpecial, setIsSpecial] = useState(false);
  const [loadingMenu, setLoadingMenu] = useState(false);

  // Content Form State
  const [story, setStory] = useState('');
  const [usps, setUsps] = useState('');
  const [quality, setQuality] = useState('');
  const [loadingContent, setLoadingContent] = useState(false);

  useEffect(() => {
    if (aboutContent) {
      setStory(aboutContent.story);
      setUsps(aboutContent.usps);
      setQuality(aboutContent.quality);
    }
  }, [aboutContent]);

  const handleMenuSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingMenu(true);
    try {
        const imgUrl = image || `https://picsum.photos/400/300?random=${Date.now()}`;
        const parsedPrice = parseFloat(price);
        
        if (isNaN(parsedPrice)) {
            showNotification('الرجاء إدخال سعر صحيح', 'error');
            setLoadingMenu(false);
            return;
        }

        await onAddItem({
            name,
            description,
            price: parsedPrice,
            image: imgUrl,
            isSpecial
        });
        
        setName('');
        setDescription('');
        setPrice('');
        setImage('');
        setIsSpecial(false);
    } catch (error) {
        console.error("Error adding item:", error);
        showNotification('حدث خطأ أثناء الإضافة', 'error');
    } finally {
        setLoadingMenu(false);
    }
  };

  const handleContentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingContent(true);
    try {
      await onUpdateAbout({ story, usps, quality });
    } catch (error) {
      showNotification('حدث خطأ أثناء التحديث', 'error');
    } finally {
      setLoadingContent(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">لوحة تحكم المسؤول</h2>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-8">
        <button
          className={`flex-1 py-4 text-center font-bold text-lg transition-colors border-b-4 ${activeTab === 'MENU' ? 'border-primary text-primary bg-orange-50' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('MENU')}
        >
          إدارة قائمة الطعام
        </button>
        <button
          className={`flex-1 py-4 text-center font-bold text-lg transition-colors border-b-4 ${activeTab === 'CONTENT' ? 'border-primary text-primary bg-orange-50' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('CONTENT')}
        >
          إدارة محتوى "من نحن"
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        
        {activeTab === 'MENU' ? (
          <form onSubmit={handleMenuSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-down">
            <h3 className="md:col-span-2 text-xl font-bold text-gray-800 mb-2">إضافة صنف جديد</h3>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">اسم الوجبة</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded p-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                required
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">الوصف</label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border border-gray-300 rounded p-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none h-24"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">السعر (د.أ)</label>
              <input 
                type="number" 
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full border border-gray-300 rounded p-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">رابط الصورة (اختياري)</label>
              <input 
                type="url" 
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full border border-gray-300 rounded p-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={isSpecial}
                  onChange={(e) => setIsSpecial(e.target.checked)}
                  className="w-5 h-5 text-primary rounded focus:ring-primary"
                />
                <span className="mr-3 text-gray-700 font-bold">إضافة إلى العروض المميزة</span>
              </label>
            </div>

            <div className="md:col-span-2 pt-4">
              <button 
                type="submit" 
                disabled={loadingMenu}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-4 rounded-lg transition shadow-md disabled:opacity-50"
              >
                {loadingMenu ? 'جاري الإضافة...' : 'حفظ الوجبة'}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleContentSubmit} className="space-y-6 animate-fade-in-down">
            <h3 className="text-xl font-bold text-gray-800 mb-2">تعديل نصوص صفحة "من نحن"</h3>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">قصة المطعم</label>
              <textarea 
                value={story}
                onChange={(e) => setStory(e.target.value)}
                className="w-full border border-gray-300 rounded p-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none h-32"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">لماذا "مع الهوى سوا"؟ (نقاط القوة)</label>
              <textarea 
                value={usps}
                onChange={(e) => setUsps(e.target.value)}
                className="w-full border border-gray-300 rounded p-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none h-32"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">التزامنا بالجودة</label>
              <textarea 
                value={quality}
                onChange={(e) => setQuality(e.target.value)}
                className="w-full border border-gray-300 rounded p-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none h-32"
                required
              />
            </div>

            <div className="pt-4">
              <button 
                type="submit" 
                disabled={loadingContent}
                className="w-full bg-primary hover:bg-amber-700 text-white font-bold py-4 rounded-lg transition shadow-md disabled:opacity-50"
              >
                {loadingContent ? 'جاري التحديث...' : 'حفظ التعديلات'}
              </button>
            </div>
          </form>
        )}
        
      </div>
    </div>
  );
};