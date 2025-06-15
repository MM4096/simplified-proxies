export function setItem(key: string, value: unknown) {
	localStorage.setItem(key, JSON.stringify(value));
}

export function getItem(key: string, defaultValue: unknown): unknown {
	const value = localStorage.getItem(key);
	if (!value) {
		return defaultValue;
	}

	return JSON.parse(value);
}