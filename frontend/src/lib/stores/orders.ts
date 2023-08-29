import { browser } from '$app/environment';
import { getOrdersForUser } from '$supabase/queries/order';
import type { FoodFredSupabaseClient } from '$supabase/types/FoodFredSupabaseClient';
import type { Order } from '$supabase/types/Order';
import { getContext } from 'svelte';
import { readable } from 'svelte/store';
import { useSharedStore } from './sharedStore';

const ordersStore = (orders: Order[] | undefined, userId: string) => {
	const { subscribe } = readable(orders, (set) => {
		if (!browser || !orders) return;

		const supabase: FoodFredSupabaseClient = getContext('supabase');

		const channel = supabase
			.channel('order-changes')
			.on(
				'postgres_changes',
				{
					event: '*',
					schema: 'public',
					table: 'orders'
				},
				() => getOrdersForUser(supabase, userId).then((response) => set(response.data!))
			)
			.subscribe();

		return () => channel.unsubscribe();
	});

	return {
		orders: { subscribe }
	};
};

export const useOrders = (userId: string, orders: Order[]) =>
	useSharedStore(`orders-store-${userId}`, ordersStore, orders, userId);
