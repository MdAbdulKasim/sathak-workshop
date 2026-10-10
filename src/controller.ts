import { Request, Response } from "express";
import { UserService, ProductService } from "./usecase";

const userService = new UserService();
const productService = new ProductService();

// -------------------- USER --------------------

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, phoneNumber, password } = req.body;

    // Check required fields
    if (!name || !email || !phoneNumber || !password) {
      return res.status(400).json({
        message: "name, email, phoneNumber and password are required",
      });
    }

    const result = await userService.createUser(req.body);
    return res.status(201).json({
      success: true,
      message: result.message,
      user: result.user,
    });
  } catch (error: any) {
    if (error.message.includes("already")) {
      return res.status(409).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await userService.login(email, password);
    return res.status(200).json({
      success: true,
      token: result.token,
      user: result.user,
    });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    const result = await userService.verifyOtp(email, otp);
    return res.status(200).json({
      success: true,
      message: result.message,
      user: result.user,
    });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const result = await userService.forgotPassword(email);
    return res.status(200).json({
      success: true,
      message: result.message,
      email: result.email,
    });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, otp, newPassword } = req.body;
    const result = await userService.resetPassword(email, otp, newPassword);
    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers();
    return res.status(200).json(users);
  } catch (error: any) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!id || typeof id !== "string") {
      return res.status(400).json({ error: "Invalid ID" });
    }

    const user = await userService.getUserById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch user" });
  }
};

export const getUserByName = async (req: Request, res: Response) => {
  try {
    const name = req.params.name;
    if (!name || typeof name !== "string") {
      return res.status(400).json({ error: "Invalid name" });
    }

    const users = await userService.getUserByName(name);
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch users" });
  }
};

export const getUserByEmail = async (req: Request, res: Response) => {
  try {
    const email = req.params.email;
    if (!email || typeof email !== "string") {
      return res.status(400).json({ error: "Invalid email" });
    }

    const user = await userService.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch user" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const updated = await userService.updateUser(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ message: "User updated", user: updated });
  } catch (error) {
    return res.status(500).json({ error: "Failed to update user" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.deleteUser(req.params.id);
    if (result.affected === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({ message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete user" });
  }
};

// -------------------- PRODUCT --------------------

export const createProduct = async (req: Request, res: Response) => {
  try {
    const product = await productService.createProduct(req.body);
    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error: any) {
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await productService.getAllProducts();
    return res.status(200).json(products);
  } catch (error: any) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!id || typeof id !== "string") {
      return res.status(400).json({ error: "Invalid ID" });
    }

    const product = await productService.getProductById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch product" });
  }
};

export const getProductByName = async (req: Request, res: Response) => {
  try {
    const name = req.params.name;
    if (!name || typeof name !== "string") {
      return res.status(400).json({ error: "Invalid name" });
    }

    const products = await productService.getProductByName(name);
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch products" });
  }
};

export const getProductByCategory = async (req: Request, res: Response) => {
  try {
    const category = req.params.category;
    if (!category || typeof category !== "string") {
      return res.status(400).json({ error: "Invalid category" });
    }

    const products = await productService.getProductByCategory(category);
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch products" });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const updated = await productService.updateProduct(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: "Product not found" });
    }

    return res.status(200).json({ message: "Product updated", product: updated });
  } catch (error) {
    return res.status(500).json({ error: "Failed to update product" });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const result = await productService.deleteProduct(req.params.id);
    if (result.affected === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    return res.json({ message: "Product deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete product" });
  }
};
