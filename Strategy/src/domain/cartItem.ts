export type CartItem = {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

export const lineTotal = (item: CartItem): number => item.quantity * item.price;
