type Order = {
	id: string;
	status: 'open' | 'locked' | 'closed';
	restaurant: Restaurant;
	payee: User;
};
