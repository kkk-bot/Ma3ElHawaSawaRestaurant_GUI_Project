import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-auto border-t-4 border-primary">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-2xl font-bold mb-4 text-primary">مع الهوى سوا</h2>
        <p className="mb-4 text-gray-400">نقدم لكم أفضل المأكولات في الأردن</p>
        <div className="flex justify-center space-x-4 space-x-reverse mb-6">
          <a href="#" className="text-gray-400 hover:text-white transition">فيسبوك</a>
          <a href="#" className="text-gray-400 hover:text-white transition">انستغرام</a>
          <a href="#" className="text-gray-400 hover:text-white transition">تويتر</a>
        </div>
        <p className="text-sm text-gray-500">
          &copy; {new Date().getFullYear()} جميع الحقوق محفوظة لمطعم مع الهوى سوا - الجويد، شارع الاذاعة ، عند دوار الجمرك
        </p>
      </div>
    </footer>
  );
};