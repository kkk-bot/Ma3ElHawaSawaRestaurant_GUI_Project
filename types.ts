export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  isSpecial: boolean;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface Order {
  id: string;
  userId: string; // Link order to user
  customerName: string;
  customerPhone: string;
  isDelivery: boolean;
  address?: string;
  items: CartItem[];
  total: number;
  date: string;
}

export interface AboutContent {
  story: string;
  usps: string;
  quality: string;
}

export interface User {
  id: string;
  username: string;
  password: string;
  fullName: string;
  phone: string;
  is_admin: boolean;
}

export type ViewState =
  | "HOME"
  | "MENU"
  | "CART"
  | "CHECKOUT"
  | "ADMIN_LOGIN"
  | "ADMIN_DASHBOARD"
  | "ABOUT"
  | "USER_LOGIN"
  | "USER_REGISTER"
  | "ORDER_HISTORY";

export type NotificationType = "success" | "error" | "info";

export interface Notification {
  id: number;
  message: string;
  type: NotificationType;
}
