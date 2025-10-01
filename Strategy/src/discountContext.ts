import { ShoppingCart } from "./domain/shoppingCart";
import type { DiscountStrategy } from "./strategy/discountStrategy";

export class DiscountContext {
  constructor(private strategy: DiscountStrategy) {}

  setStrategy(strategy: DiscountStrategy) {
    this.strategy = strategy;
  }

  // Executa o cálculo do desconto usando a estratégia atual
  checkout(cart: ShoppingCart) {
    const subtotal = cart.subtotal();
    const discount = this.strategy.computeDiscount(cart);
    const total = Math.max(0, subtotal - discount);

    return {
      strategy: this.strategy.name,
      subtotal,
      discount,
      total
    };
  }
}
