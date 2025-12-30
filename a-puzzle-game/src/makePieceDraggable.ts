import { clamp } from "./utils";

interface MouseDownParams {
	boardElement: HTMLElement;
	divElement: HTMLElement;
	onMouseUpCallback: (_: { left: number; top: number }) => void;
	boardContainer: HTMLElement;
}

const pointerDown = ({
	boardContainer,
	boardElement,
	divElement,
	onMouseUpCallback,
}: MouseDownParams) => {
	let left: number;
	let top: number;
	return (event: PointerEvent) => {
		event.preventDefault();

		const shiftX = event.clientX - divElement.getBoundingClientRect().left;
		const shiftY = event.clientY - divElement.getBoundingClientRect().top;

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

		moveAt(event.pageX, event.pageY);

		function onPointerMove(event: PointerEvent) {
			event.preventDefault();
			event.stopPropagation();
			moveAt(event.pageX, event.pageY);
		}

		boardElement.addEventListener("pointermove", onPointerMove);
		const onPointerUp = () => {
			boardElement.removeEventListener("pointermove", onPointerMove);
			document.onpointerup = null;
			onMouseUpCallback({ left, top });
		}

		document.addEventListener("pointerup", onPointerUp)
	};
};

export interface MakePieceDraggableParams
	extends Pick<MouseDownParams, "divElement"> {
	onMouseUpCallback: (_: {
		left: number;
		top: number;
	}) => void;
}
export function PieceDragger({
	boardElement,
	boardContainer,
}: { boardElement: HTMLElement; boardContainer: HTMLElement }) {
	const makePieceDraggable = ({
		divElement,
		onMouseUpCallback,
	}: MakePieceDraggableParams) => {
		const onPointerDown = pointerDown({
			boardContainer,
			boardElement,
			divElement,
			onMouseUpCallback: ({ left, top }) => {
				onMouseUpCallback({ left, top });
			},
		});
		divElement.ondragstart = () => false;
		divElement.onpointerdown = onPointerDown
	};
	return {
		makePieceDraggable,
	};
}
