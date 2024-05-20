// const firstDivElement = document.getElementById("firstDiv")!;
// firstDivElement.onmousedown = (event) => {
// 	firstDivElement.style.position = "absolute";
// 	firstDivElement.style.zIndex = "1000";

// 	// move it out of any current parents directly into body
// 	// to make it positioned relative to the body
// 	document.body.append(firstDivElement);

// 	// centers the ball at (pageX, pageY) coordinates
// 	function moveAt(pageX: number, pageY: number) {
// 		firstDivElement.style.left = `${pageX - firstDivElement.offsetWidth / 2}px`;
// 		firstDivElement.style.top = `${pageY - firstDivElement.offsetHeight / 2}px`;
// 	}

// 	// move our absolutely positioned ball under the pointer
// 	moveAt(event.pageX, event.pageY);

// 	function onMouseMove(event: MouseEvent) {
// 		moveAt(event.pageX, event.pageY);
// 	}

// 	// (2) move the ball on mousemove
// 	document.addEventListener("mousemove", onMouseMove);

// 	// (3) drop the ball, remove unneeded handlers
// 	firstDivElement.onmouseup = () => {
// 		document.removeEventListener("mousemove", onMouseMove);
// 		firstDivElement.onmouseup = null;
// 	};
// };
export const makePieceDraggable = (divElement: HTMLDivElement) => {
	divElement.ondragstart = () => false;
	divElement.onmousedown = (event: MouseEvent) => {
		divElement.style.zIndex = "1000";

		// move it out of any current parents directly into body
		// to make it positioned relative to the body
		// document.body.append(divElement);
		// centers the ball at (pageX, pageY) coordinates
		function moveAt(pageX: number, pageY: number) {
			divElement.style.left = `${pageX - divElement.offsetWidth / 2}px`;
			divElement.style.top = `${pageY - divElement.offsetHeight / 2}px`;
		}

		// move our absolutely positioned ball under the pointer
		moveAt(event.pageX, event.pageY);

		function onMouseMove(event: MouseEvent) {
			moveAt(event.pageX, event.pageY);
		}

		// (2) move the ball on mousemove
		document.addEventListener("mousemove", onMouseMove);

		// (3) drop the ball, remove unneeded handlers
		divElement.onmouseup = () => {
			document.removeEventListener("mousemove", onMouseMove);
			divElement.onmouseup = null;
		};
	};
};
// firstDivElement.ondragstart = () => false;
