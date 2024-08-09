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
		img1.onerror = (error) => rej(error);
	});
};

export function getRndInteger(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function isWithinRangeInclusive(
	value: number,
	min: number,
	max: number,
) {
	return value >= min && value <= max;
}

export function gcd(a: number, b: number) {
	if (b > a) {
		const temp = a;
		a = b;
		b = temp;
	}
	while (true) {
		if (b === 0) return a;
		a %= b;
		if (a === 0) return b;
		b %= a;
	}
}

export function checkCollision(
	rect1: Pick<DOMRect, "bottom" | "top" | "left" | "right">,
	rect2: Pick<DOMRect, "bottom" | "top" | "left" | "right">,
) {
	return !(
		rect1.top > rect2.bottom ||
		rect1.right < rect2.left ||
		rect1.bottom < rect2.top ||
		rect1.left > rect2.right
	);
}
