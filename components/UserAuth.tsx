import React, { useState } from "react";
import { User, ViewState } from "../types";
import { dbService } from "../services/dbService";

interface UserAuthProps {
  mode: "LOGIN" | "REGISTER";
  onSuccess: (user: User) => void;
  onNavigate: (view: ViewState) => void;
}

export const UserAuth: React.FC<UserAuthProps> = ({
  mode,
  onSuccess,
  onNavigate,
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "LOGIN") {
        const user = await dbService.loginUser(username, password);
        if (user) {
          onSuccess(user);
        } else {
          setError("اسم المستخدم أو كلمة المرور غير صحيحة");
        }
      } else {
        // Register
        if (!username || !password || !fullName || !phone) {
          setError("جميع الحقول مطلوبة");
          setLoading(false);
          return;
        }
        const newUser = await dbService.registerUser({
          username,
          password,
          fullName,
          phone,
          is_admin: false,
        });
        onSuccess(newUser);
      }
    } catch (err: any) {
      setError(err.toString());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          {mode === "LOGIN" ? "تسجيل الدخول" : "إنشاء حساب جديد"}
        </h2>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-center text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "REGISTER" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  الاسم الكامل
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full border border-gray-300 rounded p-2 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  رقم الهاتف
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border border-gray-300 rounded p-2 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  required
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              اسم المستخدم
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              كلمة المرور
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-amber-700 transition shadow-md disabled:opacity-50 mt-4"
          >
            {loading
              ? "جاري التحميل..."
              : mode === "LOGIN"
              ? "دخول"
              : "تسجيل حساب"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          {mode === "LOGIN" ? (
            <p>
              ليس لديك حساب؟{" "}
              <button
                onClick={() => onNavigate("USER_REGISTER")}
                className="text-primary font-bold hover:underline"
              >
                أنشئ حساباً الآن
              </button>
            </p>
          ) : (
            <p>
              لديك حساب بالفعل؟{" "}
              <button
                onClick={() => onNavigate("USER_LOGIN")}
                className="text-primary font-bold hover:underline"
              >
                سجل الدخول هنا
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
