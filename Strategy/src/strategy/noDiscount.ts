import { ShoppingCart } from "../domain/shoppingCart.js";
import { DiscountStrategy } from "./discountStrategy.js";

export class NoDiscount implements DiscountStrategy {
  name = "Sem desconto";
  
  computeDiscount(_cart: ShoppingCart): number {
    return 0; 
  }
}
