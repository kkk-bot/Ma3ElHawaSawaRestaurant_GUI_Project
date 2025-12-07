import React from 'react';
import { Notification } from '../types';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

interface NotificationToastProps {
  notifications: Notification[];
  removeNotification: (id: number) => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ notifications, removeNotification }) => {
  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-full max-w-sm pointer-events-none">
      {notifications.map((note) => (
        <div 
          key={note.id} 
          className={`
            pointer-events-auto transform transition-all duration-300 ease-in-out animate-slide-in-up
            flex items-center gap-3 p-4 rounded-lg shadow-lg border-r-4
            ${note.type === 'success' ? 'bg-white border-green-500 text-gray-800' : ''}
            ${note.type === 'error' ? 'bg-white border-red-500 text-gray-800' : ''}
            ${note.type === 'info' ? 'bg-white border-blue-500 text-gray-800' : ''}
          `}
        >
          <div className="flex-shrink-0">
            {note.type === 'success' && <CheckCircle className="text-green-500" size={24} />}
            {note.type === 'error' && <XCircle className="text-red-500" size={24} />}
            {note.type === 'info' && <Info className="text-blue-500" size={24} />}
          </div>
          <div className="flex-grow text-sm font-medium">
            {note.message}
          </div>
          <button 
            onClick={() => removeNotification(note.id)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      ))}
    </div>
  );
};