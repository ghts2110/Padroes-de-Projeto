import { CartItem, lineTotal } from "./cartItem";

export class ShoppingCart {
  private items: CartItem[] = [];

  add(item: CartItem): void {
    this.items.push(item);
  }

  removeById(id: string): void {
    this.items = this.items.filter(i => i.id !== id);
  }

  clear(): void {
    this.items = [];
  }

  getItems(): CartItem[] {
    return [...this.items];
  }

  count(): number {
    return this.items.length;
  }

  subtotal(): number {
    return this.items.reduce((sum, i) => sum + lineTotal(i), 0);
  }
}
