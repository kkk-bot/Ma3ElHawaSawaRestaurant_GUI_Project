import React, { useState, useEffect } from "react";
// Components
import { Layout } from "./components/Layout";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { SpecialOffers } from "./components/SpecialOffers";
import { Menu } from "./components/Menu";
import { Cart } from "./components/Cart";
import { Checkout } from "./components/Checkout";
import { AdminPanel } from "./components/AdminPanel";
import { About } from "./components/About";
import { UserAuth } from "./components/UserAuth";
import { OrderHistory } from "./components/OrderHistory";
import { Footer } from "./components/Footer";
import { NotificationToast } from "./components/NotificationToast";

// Services
import { dbService } from "./services/dbService";

// Types
import {
  MenuItem,
  CartItem,
  ViewState,
  AboutContent,
  User,
  Notification,
  NotificationType,
} from "./types";
import { log } from "console";

function App() {
  const [view, setView] = useState<ViewState>("USER_LOGIN");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [aboutContent, setAboutContent] = useState<AboutContent | null>(null);

  // Notification State
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Fetch data on load and when view changes
  useEffect(() => {
    const fetchData = async () => {
      // Refresh menu items when entering HOME, MENU, or ADMIN_DASHBOARD
      if (["HOME", "MENU", "ADMIN_DASHBOARD"].includes(view)) {
        try {
          const items = await dbService.getMenu();
          setMenuItems(items);
        } catch (error) {
          console.error("Failed to fetch menu items", error);
        }
      }

      // Refresh about content when entering ABOUT or ADMIN_DASHBOARD
      // Also fetch initially if null to ensure we have it
      if (["ABOUT", "ADMIN_DASHBOARD"].includes(view) || !aboutContent) {
        try {
          const about = await dbService.getAboutContent();
          setAboutContent(about);
        } catch (error) {
          console.error("Failed to fetch about content", error);
        }
      }
    };
    fetchData();
  }, [view]);

  // Notification Logic
  const showNotification = (
    message: string,
    type: NotificationType = "info"
  ) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);

    // Auto remove after 3 seconds
    setTimeout(() => {
      removeNotification(id);
    }, 3000);
  };

  const removeNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Cart Operations
  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    // Replace alert with toast
    showNotification(`تم إضافة ${item.name} للسلة`, "success");
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, quantity: Math.max(1, item.quantity + delta) };
        }
        return item;
      })
    );
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setCurrentUser(null);
    setView("USER_LOGIN");
    showNotification("تم تسجيل الخروج", "info");
  };

  const handleUserLoginSuccess = (user: User) => {
    setCurrentUser(user);
    showNotification(`مرحباً بك ${user.fullName}`, "success");
    // If cart has items, go to cart/checkout, else home
    if (cart.length > 0) {
      setView("CART");
    } else {
      setView("HOME");
    }

    console.log(user);

    // If he is admin user, set isAdmin
    if (user.is_admin) {
      setIsAdmin(true);
    }
  };

  // Admin Items Logic
  const handleAddItem = async (item: any) => {
    await dbService.addMenuItem(item);
    const updated = await dbService.getMenu();
    setMenuItems(updated);
    showNotification("تم إضافة الصنف بنجاح", "success");
  };

  const handleUpdateAbout = async (content: AboutContent) => {
    await dbService.updateAboutContent(content);
    setAboutContent(content);
    showNotification("تم تحديث المحتوى بنجاح", "success");
  };

  // Order Logic
  const handleCheckoutClick = () => {
    if (!currentUser) {
      const confirmLogin = window.confirm(
        "يجب تسجيل الدخول لإتمام عملية الشراء. هل تود الذهاب لصفحة الدخول؟"
      );
      if (confirmLogin) {
        setView("USER_LOGIN");
      }
    } else {
      setView("CHECKOUT");
    }
  };

  const handleCheckoutSubmit = async (details: any) => {
    if (!currentUser) return;

    await dbService.placeOrder({
      userId: currentUser.id,
      ...details,
      customerName: details.name,
      customerPhone: details.phone,
      items: cart,
      total:
        cart.reduce((sum, i) => sum + i.price * i.quantity, 0) +
        (details.isDelivery ? 2.5 : 0),
    });
    setCart([]);

    showNotification("تم استلام طلبك بنجاح! شكراً لك", "success");
    setView("ORDER_HISTORY");
  };

  // Render View Switcher
  const renderContent = () => {
    switch (view) {
      case "HOME":
        return (
          <>
            <Hero />
            <SpecialOffers items={menuItems} onAddToCart={addToCart} />
            <div className="bg-white py-8 text-center">
              <button
                onClick={() => setView("MENU")}
                className="text-primary font-bold text-lg hover:underline"
              >
                مشاهدة القائمة الكاملة
              </button>
            </div>
          </>
        );
      case "MENU":
        return <Menu items={menuItems} onAddToCart={addToCart} />;
      case "ABOUT":
        return aboutContent ? (
          <About content={aboutContent} />
        ) : (
          <div className="p-12 text-center">جاري التحميل...</div>
        );
      case "CART":
        return (
          <Cart
            cart={cart}
            updateQuantity={updateQuantity}
            removeFromCart={removeFromCart}
            onCheckout={handleCheckoutClick}
            onContinueShopping={() => setView("MENU")}
          />
        );
      case "CHECKOUT":
        if (!currentUser) {
          return (
            <div className="text-center py-20">
              <p className="mb-4 text-xl">يجب تسجيل الدخول أولاً</p>
              <button
                onClick={() => setView("USER_LOGIN")}
                className="bg-primary text-white px-4 py-2 rounded"
              >
                تسجيل دخول
              </button>
            </div>
          );
        }
        return (
          <Checkout
            cart={cart}
            currentUser={currentUser}
            onSubmitOrder={handleCheckoutSubmit}
            onCancel={() => setView("CART")}
            showNotification={showNotification}
          />
        );
      case "ORDER_HISTORY":
        if (!currentUser)
          return <div className="p-10 text-center">يجب تسجيل الدخول</div>;
        return <OrderHistory currentUser={currentUser} />;
      case "USER_LOGIN":
        return (
          <UserAuth
            mode="LOGIN"
            onSuccess={handleUserLoginSuccess}
            onNavigate={setView}
          />
        );
      case "USER_REGISTER":
        return (
          <UserAuth
            mode="REGISTER"
            onSuccess={handleUserLoginSuccess}
            onNavigate={setView}
          />
        );

      case "ADMIN_DASHBOARD":
        return isAdmin ? (
          <AdminPanel
            onAddItem={handleAddItem}
            aboutContent={aboutContent || { story: "", usps: "", quality: "" }}
            onUpdateAbout={handleUpdateAbout}
            showNotification={showNotification}
          />
        ) : (
          <Hero />
        );
      default:
        return <Hero />;
    }
  };

  return (
    <Layout>
      <Navbar
        currentView={view}
        onNavigate={(v) => {
          setView(v);
        }}
        cartItemCount={cart.reduce((acc, item) => acc + item.quantity, 0)}
        isAdmin={isAdmin}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      <main className="flex-grow relative">
        {renderContent()}
        <NotificationToast
          notifications={notifications}
          removeNotification={removeNotification}
        />
      </main>

      <Footer />
    </Layout>
  );
}

export default App;
