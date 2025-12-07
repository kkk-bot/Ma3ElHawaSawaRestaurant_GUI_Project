import React from "react";
import { ViewState, User } from "../types";
import {
  ShoppingCart,
  LogOut,
  User as UserIcon,
  Menu as MenuIcon,
  LogIn,
  ClipboardList,
  UtensilsCrossed,
} from "lucide-react";

interface NavbarProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  cartItemCount: number;
  isAdmin: boolean;
  currentUser: User | null;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  cartItemCount,
  isAdmin,
  currentUser,
  onLogout,
}) => {
  return (
    <nav className="bg-white border-b-4 border-primary shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo / Brand */}
          <div
            className="flex-shrink-0 cursor-pointer flex items-center gap-3 group"
            onClick={() => onNavigate("HOME")}
          >
            <div className="bg-primary text-white p-2.5 rounded-full shadow-sm group-hover:bg-amber-700 transition-colors ring-2 ring-orange-100">
              <UtensilsCrossed size={28} />
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl font-extrabold text-primary tracking-wide leading-none group-hover:text-amber-700 transition-colors">
                مع الهوى سوا
              </h1>
              <span className="text-xs text-gray-500 font-medium mt-1">
                طعم يلامس الروح
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8 space-x-reverse items-center">
            <button
              onClick={() => onNavigate("HOME")}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === "HOME"
                  ? "text-primary bg-orange-50"
                  : "text-gray-600 hover:text-primary"
              }`}
            >
              الرئيسية
            </button>
            <button
              onClick={() => onNavigate("MENU")}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === "MENU"
                  ? "text-primary bg-orange-50"
                  : "text-gray-600 hover:text-primary"
              }`}
            >
              القائمة
            </button>
            <button
              onClick={() => onNavigate("ABOUT")}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === "ABOUT"
                  ? "text-primary bg-orange-50"
                  : "text-gray-600 hover:text-primary"
              }`}
            >
              من نحن
            </button>

            {isAdmin && (
              <button
                onClick={() => onNavigate("ADMIN_DASHBOARD")}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === "ADMIN_DASHBOARD"
                    ? "text-primary bg-orange-50"
                    : "text-gray-600 hover:text-primary"
                }`}
              >
                لوحة التحكم
              </button>
            )}

            {currentUser && !isAdmin && (
              <button
                onClick={() => onNavigate("ORDER_HISTORY")}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === "ORDER_HISTORY"
                    ? "text-primary bg-orange-50"
                    : "text-gray-600 hover:text-primary"
                }`}
              >
                طلباتي
              </button>
            )}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4 space-x-reverse">
            {/* Cart Button */}
            <button
              onClick={() => onNavigate("CART")}
              className="relative p-2 text-gray-600 hover:text-primary transition-colors"
            >
              <ShoppingCart size={24} />
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Auth Actions */}
            {currentUser ? (
              <div className="flex items-center gap-2 border-r pr-4 border-gray-300">
                <span className="text-sm font-bold text-gray-800 hidden sm:block">
                  مرحباً، {currentUser.fullName.split(" ")[0]}
                </span>

                <button
                  onClick={onLogout}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                  title="تسجيل الخروج"
                >
                  <LogOut size={20} />
                </button>
                {isAdmin && <span className="text-blue-600">مشرف</span>}
              </div>
            ) : isAdmin ? (
              <button
                onClick={onLogout}
                className="flex items-center text-sm font-medium text-red-600 hover:text-red-800"
              >
                <LogOut size={20} className="ml-1" />
                خروج مسؤول
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate("USER_LOGIN")}
                  className="flex items-center text-sm font-bold text-gray-700 hover:text-primary px-3 py-2"
                >
                  <LogIn size={20} className="ml-1" />
                  دخول
                </button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-gray-600"
              onClick={() => onNavigate("MENU")}
            >
              <MenuIcon size={24} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
