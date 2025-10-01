import { ShoppingCart } from "../domain/shoppingCart.js";

export interface DiscountStrategy {
  name: string;
  computeDiscount(cart: ShoppingCart): number;
}
