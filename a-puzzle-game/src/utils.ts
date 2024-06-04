export function getRandom<T>(array: T[]) {
	return array[Math.round(Math.random() * (array.length - 1))];
}

export function clamp(value: number, min: number, max: number) {
	return Math.min(Math.max(value, min), max);
}
