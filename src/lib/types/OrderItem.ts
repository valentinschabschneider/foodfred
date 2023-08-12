export type OrderItem = {
	id: string;
	consumer: User;
	name: string;
	price: number;
	note: string | null;
	status: 'open' | 'says-payed' | 'payed';
};

export type AddOrderItem = {
	consumerId: string;
	name: string;
	price: number;
	note: string | null;
};

export type OrderItemInputs = {
	name: string | undefined;
	price: number | undefined;
	note: string | null;
};
