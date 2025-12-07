import React from 'react';
import { AboutContent } from '../types';
import { BookOpen, Star, ShieldCheck } from 'lucide-react';

interface AboutProps {
  content: AboutContent;
}

export const About: React.FC<AboutProps> = ({ content }) => {
  return (
    <div className="py-16 bg-white">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-4">من نحن</h2>
        <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        
        {/* Story Section */}
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-orange-100 p-3 rounded-full">
                <BookOpen className="text-primary w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">قصتنا</h3>
            </div>
            <p className="text-lg text-gray-600 leading-8 bg-gray-50 p-6 rounded-xl border border-gray-100">
              {content.story}
            </p>
          </div>
          <div className="flex-1 w-full h-64 md:h-80 bg-gray-200 rounded-2xl overflow-hidden shadow-lg transform md:-rotate-1 hover:rotate-0 transition-transform duration-300">
            <img 
              src="https://i.imgur.com/chfZOgI.png" 
              alt="قصتنا" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* USP Section */}
        <div className="flex flex-col md:flex-row-reverse items-center gap-10">
          <div className="flex-1 space-y-4">
             <div className="flex items-center gap-3 mb-2">
              <div className="bg-orange-100 p-3 rounded-full">
                <Star className="text-primary w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">لماذا "مع الهوى سوا"؟</h3>
            </div>
            <p className="text-lg text-gray-600 leading-8 bg-gray-50 p-6 rounded-xl border border-gray-100">
              {content.usps}
            </p>
          </div>
          <div className="flex-1 w-full h-64 md:h-80 bg-gray-200 rounded-2xl overflow-hidden shadow-lg transform md:rotate-1 hover:rotate-0 transition-transform duration-300">
             <img 
              src="https://i.imgur.com/O0rROOh.png" 
              alt="مميزاتنا" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Quality Section */}
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 space-y-4">
             <div className="flex items-center gap-3 mb-2">
              <div className="bg-orange-100 p-3 rounded-full">
                <ShieldCheck className="text-primary w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">التزامنا بالجودة</h3>
            </div>
            <p className="text-lg text-gray-600 leading-8 bg-gray-50 p-6 rounded-xl border border-gray-100">
              {content.quality}
            </p>
          </div>
          <div className="flex-1 w-full h-64 md:h-80 bg-gray-200 rounded-2xl overflow-hidden shadow-lg transform md:-rotate-1 hover:rotate-0 transition-transform duration-300">
             <img 
              src="https://i.imgur.com/2RFWkkg.png" 
              alt="الجودة" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

      </div>
    </div>
  );
};