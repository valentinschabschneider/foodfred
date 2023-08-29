import type { OrderStatus } from '$supabase/types/Order';
import { toast } from 'svelte-sonner';
import { writable } from 'svelte/store';
import { useSharedStore } from './sharedStore';

const orderStatusStore = (value: OrderStatus | undefined) => {
	const { set, update, subscribe } = writable<string | null>(value);
	return {
		update: (value: OrderStatus) => {
			if (value == 'locked') toast.info(`Order has been locked!`);
			else if (value == 'closed') toast.info(`Order has been closed!`);
			else toast.info(`Order status changed to ${value}!`);

			update(() => value);
		},
		status: { subscribe }
	};
};

export const useOrderStatus = (orderId: string, status: OrderStatus | undefined = undefined) =>
	useSharedStore(`order-status-store-${orderId}`, orderStatusStore, status);
