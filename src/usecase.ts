import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { DeleteResult } from "typeorm";
import { User, Product } from "./entity";
import { UserRepository, ProductRepository } from "./repository";
import { sendOtpEmail } from "./mail";

const JWT_SECRET = process.env.JWT_SECRET || "";

export class UserService {
  private userRepository = new UserRepository();

  // Create a new user + send OTP by email
  async createUser(userData: any) {
    const existing = await this.userRepository.findByEmail(userData.email);
    if (existing) {
      throw new Error("Email already registered");
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const user = await this.userRepository.create({
      name: userData.name,
      email: userData.email,
      phoneNumber: userData.phoneNumber,
      password: hashedPassword,
      otp,
      otpExpiresAt,
      isVerified: false,
    });

    // Send OTP to user's email using SMTP
    await sendOtpEmail(user.email, otp, "verify");

    return { user, message: "User created. OTP sent to email. Verify to activate account." };
  }

  // Login with email + password
  async login(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid email or password");
    }

    if (!user.isVerified) {
      throw new Error("Account not verified. Please verify OTP first.");
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "1d",
    });

    return { token, user };
  }

  // Verify OTP after register
  async verifyOtp(email: string, otp: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }

    if (!user.otp || user.otp !== otp) {
      throw new Error("Invalid OTP");
    }

    if (user.otpExpiresAt && user.otpExpiresAt < new Date()) {
      throw new Error("OTP expired. Request a new one.");
    }

    const updated = await this.userRepository.update(user.id, {
      isVerified: true,
      otp: null,
      otpExpiresAt: null,
    });

    return { user: updated, message: "OTP verified successfully" };
  }

  // Forgot password -> send OTP by email
  async forgotPassword(email: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await this.userRepository.update(user.id, { otp, otpExpiresAt });

    // Send OTP to user's email using SMTP
    await sendOtpEmail(user.email, otp, "reset");

    return { email, message: "OTP sent to email for password reset" };
  }

  // Reset password using OTP
  async resetPassword(email: string, otp: string, newPassword: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }

    if (!user.otp || user.otp !== otp) {
      throw new Error("Invalid OTP");
    }

    if (user.otpExpiresAt && user.otpExpiresAt < new Date()) {
      throw new Error("OTP expired. Request a new one.");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.userRepository.update(user.id, {
      password: hashedPassword,
      otp: null,
      otpExpiresAt: null,
      isVerified: true,
    });

    return { message: "Password reset successfully" };
  }

  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.findAll();
  }

  async getUserById(id: string): Promise<User | null> {
    return await this.userRepository.findById(id);
  }

  async getUserByName(name: string): Promise<User[]> {
    return await this.userRepository.findByName(name);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findByEmail(email);
  }

  async updateUser(id: string, userData: any): Promise<User | null> {
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }

    await this.userRepository.update(id, userData);
    return await this.userRepository.findById(id);
  }

  async deleteUser(id: string): Promise<DeleteResult> {
    return await this.userRepository.delete(id);
  }
}

export class ProductService {
  private productRepository = new ProductRepository();

  async createProduct(productData: Partial<Product>): Promise<Product> {
    return await this.productRepository.create(productData);
  }

  async getAllProducts(): Promise<Product[]> {
    return await this.productRepository.findAll();
  }

  async getProductById(id: string): Promise<Product | null> {
    return await this.productRepository.findById(id);
  }

  async getProductByName(name: string): Promise<Product[]> {
    return await this.productRepository.findByName(name);
  }

  async getProductByCategory(category: string): Promise<Product[]> {
    return await this.productRepository.findByCategory(category);
  }

  async updateProduct(id: string, productData: Partial<Product>): Promise<Product | null> {
    await this.productRepository.update(id, productData);
    return await this.productRepository.findById(id);
  }

  async deleteProduct(id: string): Promise<DeleteResult> {
    return await this.productRepository.delete(id);
  }
}
