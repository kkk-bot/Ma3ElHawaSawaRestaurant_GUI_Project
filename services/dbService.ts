import { MenuItem, Order, AboutContent, User } from "../types";

export const dbService = {
  // SELECT * FROM menu
  getMenu: async (): Promise<MenuItem[]> => {
    const response = await fetch(`/api/menu?t=${Date.now()}`);
    if (!response.ok) throw new Error("Failed to fetch menu");
    return response.json();
  },

  // UPDATE menu item
  updateMenuItem: async (item: MenuItem): Promise<void> => {
    const response = await fetch(`/api/menu/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    if (!response.ok) throw new Error("Failed to update menu item");
  },

  // INSERT INTO menu ...
  addMenuItem: async (item: Omit<MenuItem, "id">): Promise<MenuItem> => {
    const response = await fetch("/api/menu", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    if (!response.ok) {
      const text = await response.text();
      console.error("Add menu item failed:", text);
      throw new Error("Failed to add menu item: " + text);
    }
    return response.json();
  },

  // SELECT * FROM orders
  getOrders: async (): Promise<Order[]> => {
    const response = await fetch("/api/orders");
    if (!response.ok) throw new Error("Failed to fetch orders");
    return response.json();
  },

  // SELECT * FROM orders WHERE userId = ?
  getUserOrders: async (userId: string): Promise<Order[]> => {
    const allOrders = await dbService.getOrders();
    const userOrders = allOrders.filter((order) => order.userId === userId);
    // Sort by date descending (newest first)
    userOrders.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    return userOrders;
  },

  // INSERT INTO orders ...
  placeOrder: async (order: Omit<Order, "id" | "date">): Promise<Order> => {
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    });
    if (!response.ok) throw new Error("Failed to place order");
    return response.json();
  },

  // DELETE FROM menu WHERE id = ...
  deleteMenuItem: async (id: number): Promise<void> => {
    const response = await fetch(`/api/menu/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete menu item");
  },

  // SELECT * FROM about
  getAboutContent: async (): Promise<AboutContent> => {
    const response = await fetch("/api/about");
    if (!response.ok) throw new Error("Failed to fetch about content");
    return response.json();
  },

  // UPDATE about
  updateAboutContent: async (content: AboutContent): Promise<void> => {
    const response = await fetch("/api/about", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(content),
    });
    if (!response.ok) throw new Error("Failed to update about content");
  },

  // --- USER AUTH ---

  getUsers: async (): Promise<User[]> => {
    // Backend doesn't support listing all users yet.
    console.warn("getUsers is not implemented in the backend");
    return [];
  },

  registerUser: async (user: Omit<User, "id">): Promise<User> => {
    user.is_admin = false; // Ensure new users are not admins

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Registration failed");
    }

    return response.json();
  },

  loginUser: async (
    username: string,
    password: string
  ): Promise<User | null> => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (response.status === 401) {
      return null;
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Login failed");
    }

    return response.json();
  },
};
