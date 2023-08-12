import { Session, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

declare global {
	namespace App {
		interface Locals {
			supabase: SupabaseClient<Database>;
			getSession(): Promise<Session | null>;
		}
		interface PageData {
			supabase: SupabaseClient<Database>;
			session: Session | null;
		}
		// interface Error {}
		// interface Platform {}
	}
}
