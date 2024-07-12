export function getRandom<T>(array: T[]) {
	return array[Math.round(Math.random() * (array.length - 1))];
}

export function clamp(value: number, min: number, max: number) {
	return Math.min(Math.max(value, min), max);
}

export const loadImage = (imageSrc: string): Promise<HTMLImageElement> => {
	return new Promise((res, rej) => {
		const img1 = new Image();
		img1.src = imageSrc;
		img1.onload = () => res(img1);
		img1.onerror = (error) => rej(error)
	});
};