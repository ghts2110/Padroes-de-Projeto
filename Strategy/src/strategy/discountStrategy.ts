import { ShoppingCart } from "../domain/shoppingCart";

export interface DiscountStrategy {
  name: string;
  computeDiscount(cart: ShoppingCart): number;
}
