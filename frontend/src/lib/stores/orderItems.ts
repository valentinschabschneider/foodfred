import { browser } from '$app/environment';
import { getOrderItems } from '$supabase/queries/orderItems';
import type { FoodFredSupabaseClient } from '$supabase/types/FoodFredSupabaseClient';
import type { OrderItem } from '$supabase/types/OrderItem';
import { getContext } from 'svelte';
import { readable } from 'svelte/store';
import { useSharedStore } from './sharedStore';

const orderItemsStore = (orderItems: OrderItem[] | undefined, orderId: string) => {
	const { subscribe } = readable(orderItems, (set) => {
		if (!browser || !orderItems) return;

		const supabase: FoodFredSupabaseClient = getContext('supabase');

		console.log('oooorder', orderId);

		const channel = supabase
			.channel(`order-items-changes-${orderId}`)
			.on(
				'postgres_changes',
				{
					event: '*',
					schema: 'public',
					table: 'order_entries',
					filter: `order_id=eq.${orderId}`
				},
				() => getOrderItems(supabase, orderId).then((response) => set(response.data!))
			)
			.subscribe();

		return () => channel.unsubscribe();
	});

	return {
		orderItems: { subscribe }
	};
};

export const useOrderItems = (orderItems: OrderItem[], orderId: string) =>
	useSharedStore(`order-items-store-${orderId}`, orderItemsStore, orderItems, orderId);
