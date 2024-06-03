export function getRandom<T>(array: T[]) {
	return array[Math.round(Math.random() * (array.length - 1))];
}
