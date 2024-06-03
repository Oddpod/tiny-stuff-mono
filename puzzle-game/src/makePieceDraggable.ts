export function PieceDragger(boardElement: HTMLElement) {
	const makePieceDraggable = (
		pieceId: number,
		divElement: HTMLDivElement,
		onMouseUpCallback = (_: { x: number; y: number; pieceId: number }) => {},
	) => {
		let x: number;
		let y: number;
		divElement.ondragstart = () => false;
		divElement.onmousedown = (event: MouseEvent) => {
			divElement.style.zIndex = "1000";

			// move it out of any current parents directly into body
			// to make it positioned relative to the body
			// document.body.append(divElement);
			// centers the ball at (pageX, pageY) coordinates
			function moveAt(pageX: number, pageY: number) {
				x = pageX - divElement.offsetWidth / 2;
				y = pageY - divElement.offsetHeight / 2;
				divElement.style.left = `${pageX - divElement.offsetWidth / 2}px`;
				divElement.style.top = `${pageY - divElement.offsetHeight / 2}px`;
			}

			// move our absolutely positioned ball under the pointer
			moveAt(event.pageX, event.pageY);

			function onMouseMove(event: MouseEvent) {
				moveAt(event.pageX, event.pageY);
			}

			// (2) move the ball on mousemove
			boardElement.addEventListener("mousemove", onMouseMove);

			// (3) drop the ball, remove unneeded handlers
			divElement.onmouseup = () => {
				boardElement.removeEventListener("mousemove", onMouseMove);
				divElement.onmouseup = null;
				onMouseUpCallback({ x, y, pieceId });
			};
		};
	};
	return {
		makePieceDraggable,
	};
}
