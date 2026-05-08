class MemoryCache {
	store: Map<string, string>;
	timers: Map<string, ReturnType<typeof setTimeout>>;

	constructor() {
		this.store = new Map();
		this.timers = new Map();
	}

	set(key: string, value: string, ttl: number | null = null) {
		// Clear any existing timer for this key before overwriting
		const existingTimer = this.timers.get(key);
		if (existingTimer !== undefined) {
			clearTimeout(existingTimer);
			this.timers.delete(key);
		}

		this.store.set(key, value);

		if (ttl) {
			const timer = setTimeout(() => {
				this.store.delete(key);
				this.timers.delete(key);
			}, ttl * 1000); // ttl is in seconds
			this.timers.set(key, timer);
		}
	}

	get(key: string) {
		return this.store.get(key);
	}

	has(key: string) {
		return this.store.has(key);
	}

	delete(key: string) {
		const existingTimer = this.timers.get(key);
		if (existingTimer !== undefined) {
			clearTimeout(existingTimer);
			this.timers.delete(key);
		}
		this.store.delete(key);
	}
}

export default MemoryCache;
