import type { User } from '$supabase/types/User';
import { Session } from '@supabase/supabase-js';
import type { FoodFredSupabaseClient } from '../../common/types/FoodFredSupabaseClient';

declare global {
	namespace App {
		interface Locals {
			supabase: FoodFredSupabaseClient;
			getSession(): Promise<Session | null>;
		}
		interface PageData {
			supabase: FoodFredSupabaseClient;
			session: Session | null;
			currentUser: User | null;
		}
		// interface Error {}
		// interface Platform {}
	}
}
