import { clamp } from "./utils";

const mouseDown = (
	boardElement: HTMLElement,
	divElement: HTMLElement,
	onMouseUpCallback: (_: { x: number; y: number }) => void,
) => {
	let x: number;
	let y: number;
	return (event: MouseEvent | TouchEvent) => {
		divElement.style.zIndex = "1000";

		const shiftX =
			("clientX" in event ? event.clientX : event.touches[0].clientX) -
			divElement.getBoundingClientRect().left;
		const shiftY =
			("clientY" in event ? event.clientY : event.touches[0].clientY) -
			divElement.getBoundingClientRect().top;

		function moveAt(pageX: number, pageY: number) {
			x = pageX - shiftX;
			y = pageY - shiftY;
			divElement.style.left = `${clamp(
				0,
				x,
				boardElement.clientWidth - divElement.offsetWidth,
			)}px`;
			divElement.style.top = `${clamp(
				0,
				y,
				boardElement.clientHeight - divElement.offsetHeight,
			)}px`;
		}

		// move our absolutely positioned ball under the pointer
		if ("targetTouches" in event) {
			moveAt(event.targetTouches[0].pageX, event.targetTouches[0].pageY);
		} else {
			moveAt(event.pageX, event.pageY);
		}

		function onMouseMove(event: MouseEvent | TouchEvent) {
			event.preventDefault();
			if ("targetTouches" in event) {
				moveAt(event.targetTouches[0].pageX, event.targetTouches[0].pageY);
			} else {
				moveAt(event.pageX, event.pageY);
			}
		}

		// (2) move the ball on mousemove
		boardElement.addEventListener("touchmove", onMouseMove);
		boardElement.addEventListener("mousemove", onMouseMove);

		// (3) drop the ball, remove unneeded handlers
		divElement.onmouseup = () => {
			boardElement.removeEventListener("mousemove", onMouseMove);
			divElement.onmouseup = null;
			onMouseUpCallback({ x, y });
		};
		divElement.ontouchend = () => {
			boardElement.removeEventListener("touchmove", onMouseMove);
			divElement.ontouchend = null;
			onMouseUpCallback({ x, y });
		};
	};
};

export function PieceDragger(boardElement: HTMLElement) {
	const makePieceDraggable = (
		pieceId: number,
		divElement: HTMLDivElement,
		onMouseUpCallback = (_: { x: number; y: number; pieceId: number }) => {},
	) => {
		const mouseDownCallback = mouseDown(boardElement, divElement, ({ x, y }) =>
			onMouseUpCallback({ x, y, pieceId }),
		);
		divElement.ondragstart = () => false;
		divElement.onmousedown = mouseDownCallback;
		divElement.ontouchstart = mouseDownCallback;
	};
	return {
		makePieceDraggable,
	};
}
