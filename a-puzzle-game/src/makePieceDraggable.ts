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

		// move it out of any current parents directly into body
		// to make it positioned relative to the body
		// document.body.append(divElement);
		// centers the ball at (pageX, pageY) coordinates
		function moveAt(pageX: number, pageY: number) {
			x = pageX - divElement.offsetWidth / 2;
			y = pageY - divElement.offsetHeight / 2;
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
			event.preventDefault();
		};
		divElement.ontouchend = () => {
			boardElement.removeEventListener("touchmove", onMouseMove);
			divElement.ontouchend = null;
			onMouseUpCallback({ x, y });
			event.preventDefault();
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
