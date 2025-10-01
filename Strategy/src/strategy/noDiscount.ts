import { ShoppingCart } from "../domain/shoppingCart";
import { DiscountStrategy } from "./discountStrategy";

export class NoDiscount implements DiscountStrategy {
  name = "Sem desconto";
  
  computeDiscount(_cart: ShoppingCart): number {
    return 0; 
  }
}
