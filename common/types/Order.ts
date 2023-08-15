import type { Restaurant } from './Restaurant';
import type { User } from './User';

export type Order = {
	id: string;
	createdAt: Date;
	status: 'open' | 'locked' | 'closed';
	restaurant: Restaurant;
	payee: User;
};
