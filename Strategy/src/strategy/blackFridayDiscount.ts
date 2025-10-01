import { ShoppingCart } from "../domain/shoppingCart";
import { DiscountStrategy } from "./discountStrategy";

export class BlackFridayDiscount implements DiscountStrategy {
  name = "Black Friday (20%)";
  
  computeDiscount(cart: ShoppingCart): number {
    return cart.subtotal() * 0.2; 
  }
}
