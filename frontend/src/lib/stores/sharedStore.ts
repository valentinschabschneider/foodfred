import { getContext, hasContext, setContext } from 'svelte';

export const useSharedStore = <T, A>(
	name: string,
	fn: (value?: A, ...args: any[]) => T,
	defaultValue?: A,
	...args: any[]
) => {
	if (hasContext(name)) {
		return getContext<T>(name);
	}
	const _value = fn(defaultValue, ...args);
	setContext(name, _value);
	return _value;
};

// // writable store context
// export const useWritable = <T>(name: string, value: T) => useSharedStore(name, writable, value);

// // readable store context
// export const useReadable = <T>(name: string, value: T) => useSharedStore(name, readable, value);
