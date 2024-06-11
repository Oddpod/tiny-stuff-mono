import { clamp } from "./utils";

interface MouseDownParams {
	boardElement: HTMLElement;
	divElement: HTMLElement;
	onMouseUpCallback: (_: { left: number; top: number }) => void;
	boardContainer: HTMLElement;
}

const mouseDown = ({
	boardContainer,
	boardElement,
	divElement,
	onMouseUpCallback,
}: MouseDownParams) => {
	let left: number;
	let top: number;
	return (event: MouseEvent | TouchEvent) => {
		divElement.style.zIndex = "1000";

		const shiftX =
			("clientX" in event ? event.clientX : event.touches[0].clientX) -
			divElement.getBoundingClientRect().left;
		const shiftY =
			("clientY" in event ? event.clientY : event.touches[0].clientY) -
			divElement.getBoundingClientRect().top;

		function moveAt(pageX: number, pageY: number) {
			left = clamp(
				0,
				pageX - shiftX,
				boardContainer.clientWidth - divElement.offsetWidth,
			);
			top = clamp(
				0,
				pageY - shiftY,
				boardContainer.clientHeight - divElement.offsetHeight,
			);
			divElement.style.left = `${left}px`;
			divElement.style.top = `${top}px`;
		}

		// move our absolutely positioned ball under the pointer
		if ("targetTouches" in event) {
			moveAt(event.targetTouches[0].pageX, event.targetTouches[0].pageY);
		} else {
			moveAt(event.pageX, event.pageY);
		}

		function onMouseMove(event: MouseEvent | TouchEvent) {
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
		document.onmouseup = () => {
			boardElement.removeEventListener("mousemove", onMouseMove);
			onMouseUpCallback({ left, top });
			document.onmouseup = null;
		};
		divElement.ontouchend = () => {
			boardElement.removeEventListener("touchmove", onMouseMove);
			divElement.ontouchend = null;
			onMouseUpCallback({ left, top });
		};
	};
};

export interface MakePieceDraggableParams
	extends Pick<MouseDownParams, "divElement"> {
	pieceId: number;
	onMouseUpCallback: (_: {
		left: number;
		top: number;
		pieceId: number;
	}) => void;
}
export function PieceDragger({
	boardElement,
	boardContainer,
}: { boardElement: HTMLElement; boardContainer: HTMLElement }) {
	const makePieceDraggable = ({
		pieceId,
		divElement,
		onMouseUpCallback,
	}: MakePieceDraggableParams) => {
		const mouseDownCallback = mouseDown({
			boardContainer,
			boardElement,
			divElement,
			onMouseUpCallback: ({ left, top }) =>
				onMouseUpCallback({ left, top, pieceId }),
		});
		divElement.ondragstart = () => false;
		divElement.onmousedown = mouseDownCallback;
		divElement.ontouchstart = mouseDownCallback;
	};
	return {
		makePieceDraggable,
	};
}
