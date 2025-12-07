import React from 'react';

export const Hero: React.FC = () => {
  return (
    <div className="bg-white border-b border-gray-200 py-12 px-4 text-center">
      <div className="max-w-3xl mx-auto space-y-6">
        <h2 className="text-3xl md:text-5xl font-bold text-gray-800 leading-tight">
          أهلاً بكم في <span className="text-primary">مع الهوى سوا</span>
        </h2>
        <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
          نقدم لكم أشهى المأكولات الشرقية والغربية المحضرة بكل حب. 
          نتميز بجودة مكوناتنا الطازجة يومياً ووصفاتنا السرية التي تناقلناها عبر الأجيال.
          سواء كنت ترغب بوجبة سريعة أو وليمة عائلية، نحن هنا لخدمتك وتوصيل السعادة لباب بيتك.
        </p>
        <div className="pt-4">
          <span className="inline-block w-24 h-1 bg-primary rounded-full"></span>
        </div>
      </div>
    </div>
  );
};