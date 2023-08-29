import { browser } from '$app/environment';
import { getOrder } from '$supabase/queries/order';
import type { FoodFredSupabaseClient } from '$supabase/types/FoodFredSupabaseClient';
import type { Order, OrderStatus } from '$supabase/types/Order';
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { getContext } from 'svelte';
import { toast } from 'svelte-sonner';
import { readable } from 'svelte/store';
import { useOrderStatus } from './orderStatus';
import { useSharedStore } from './sharedStore';

const handleOrderChange = (
	client: FoodFredSupabaseClient,
	payload: RealtimePostgresChangesPayload<{ [key: string]: any }>, // TODO: this is wrong, no way to get the current state, axbe idea?
	set: (value: Order) => void
) => {
	if (payload.eventType == 'DELETE') {
		// set(null);

		toast.info(`Order has been deleted!`);

		return;
	}

	const oldOrder = payload.old as { status: OrderStatus; payee_id: string };

	getOrder(client, payload.new.id).then(async (response) => {
		const order = response.data!;

		set(order);

		if (oldOrder.status != order.status) {
			useOrderStatus(order.id, order.status).update(order.status);
		}

		if (oldOrder.payee_id != order.payee?.id) {
			const currentUserId = (await client.auth.getUser()).data.user?.id;

			toast.info(
				`Order payee changed to ${
					currentUserId == order.payee?.id ? 'you' : order.payee?.name ?? 'unknown'
				}!`
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
				(payload) => handleOrderChange(supabase, payload, set)
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
