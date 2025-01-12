import type { Restaurant } from "./Restaurant";
import type { User } from "./User";

export type OrderStatus = "open" | "locked" | "closed";

export type Order = {
	id: string;
	createdAt: Date;
	status: OrderStatus;
	restaurant: Restaurant;
	payee: User | null;
};
