import { ShoppingCart } from "./domain/shoppingCart";
import { DiscountContext } from "./discountContext";
import { NoDiscount } from "./strategy/noDiscount";
import { BlackFridayDiscount } from "./strategy/blackFridayDiscount";

const cart = new ShoppingCart();
cart.add({ id: "1", name: "Camisa Básica", quantity: 2, price: 80 });
cart.add({ id: "2", name: "Caneca Natal 2025", quantity: 1, price: 60 });
cart.add({ id: "3", name: "Tenis Runner", quantity: 1, price: 250 });

const context = new DiscountContext(new NoDiscount());

const scenarios = [
  new NoDiscount(),
  new BlackFridayDiscount(),
];

for (const strategy of scenarios) {
  context.setStrategy(strategy);
  const result = context.checkout(cart);

  console.log("==== Checkout ====");
  console.log("Estratégia:", result.strategy);
  console.log("Subtotal: R$", result.subtotal.toFixed(2));
  console.log("Desconto: R$", result.discount.toFixed(2));
  console.log("Total:    R$", result.total.toFixed(2));
  console.log();
}
