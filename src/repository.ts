import { AppDataSource } from "./data-source";
import { User, Product } from "./entity";
import { DeleteResult, ILike } from "typeorm";

export class UserRepository {
  // Get TypeORM repository when needed (after DB is connected)
  private getRepo() {
    return AppDataSource.getRepository(User);
  }

  async create(data: Partial<User>): Promise<User> {
    const user = this.getRepo().create(data);
    return await this.getRepo().save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.getRepo().find();
  }

  async findById(id: string): Promise<User | null> {
    return await this.getRepo().findOneBy({ id });
  }

  async findByName(name: string): Promise<User[]> {
    return await this.getRepo().find({
      where: { name: ILike(`%${name}%`) },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.getRepo().findOneBy({ email });
  }

  async update(id: string, data: Partial<User>): Promise<User | null> {
    await this.getRepo().update(id, data);
    return await this.getRepo().findOneBy({ id });
  }

  async delete(id: string): Promise<DeleteResult> {
    return await this.getRepo().delete(id);
  }
}

export class ProductRepository {
  private getRepo() {
    return AppDataSource.getRepository(Product);
  }

  async create(data: Partial<Product>): Promise<Product> {
    const product = this.getRepo().create(data);
    return await this.getRepo().save(product);
  }

  async findAll(): Promise<Product[]> {
    return await this.getRepo().find();
  }

  async findById(id: string): Promise<Product | null> {
    return await this.getRepo().findOneBy({ id });
  }

  async findByName(productName: string): Promise<Product[]> {
    return await this.getRepo().find({
      where: { productName: ILike(`%${productName}%`) },
    });
  }

  async findByCategory(category: string): Promise<Product[]> {
    return await this.getRepo().find({
      where: { category: ILike(category) },
    });
  }

  async update(id: string, data: Partial<Product>): Promise<Product | null> {
    await this.getRepo().update(id, data);
    return await this.getRepo().findOneBy({ id });
  }

  async delete(id: string): Promise<DeleteResult> {
    return await this.getRepo().delete(id);
  }
}
