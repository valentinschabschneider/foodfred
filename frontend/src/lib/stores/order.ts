import { browser } from '$app/environment';
import { getOrder } from '$supabase/queries/order';
import type { FoodFredSupabaseClient } from '$supabase/types/FoodFredSupabaseClient';
import type { Order } from '$supabase/types/Order';
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { getContext } from 'svelte';
import { toast } from 'svelte-sonner';
import { readable } from 'svelte/store';
import { useSharedStore } from './sharedStore';

const handleOrderChange = (
	client: FoodFredSupabaseClient,
	payload: RealtimePostgresChangesPayload<{ [key: string]: any }>,
	oldOrder: Order, // TODO: this is wrong, no way to get the current state, axbe idea?
	set: (value: Order) => void
) => {
	if (payload.eventType == 'DELETE') {
		// set(null);

		toast.info(`Order has been deleted!`);

		return;
	}

	// const oldOrder = get(useOrder(null, orderId).order)!;

	getOrder(client, payload.new.id).then(async (response) => {
		const order = response.data!;

		set(order);

		if (oldOrder.status != order.status) {
			if (order.status == 'locked') toast.info(`Order has been locked!`);
			else if (order.status == 'closed') toast.info(`Order has been closed!`);
			else toast.info(`Order status changed to ${order.status}!`);
		}

		if (oldOrder.payee.id != order.payee.id) {
			const currentUserId = (await client.auth.getUser()).data.user?.id;

			toast.info(
				`Order payee changed to ${currentUserId == order.payee.id ? 'you' : order.payee.name}!`
			);
		}
	});
};

const orderStore = (order: Order | undefined) => {
	const { subscribe } = readable(order, (set) => {
		if (!browser || !order) return;

		const supabase: FoodFredSupabaseClient = getContext('supabase');

		const channel = supabase
			.channel(`order-changes-${order.id}`)
			.on(
				'postgres_changes',
				{
					event: '*',
					schema: 'public',
					table: 'orders',
					filter: `id=eq.${order.id}`
				},
				(payload) => handleOrderChange(supabase, payload, order, set)
			)
			.subscribe();

		return () => channel.unsubscribe();
	});

	return {
		order: { subscribe }
	};
};

export const useOrder = (order: Order) =>
	useSharedStore(`order-store-${order.id}`, orderStore, order);
