import { PieceCreator } from "./pieceCreator";
import type { PieceEntity } from "./piecePainter";
import "./style.css";

const app = document.querySelector<HTMLDivElement>("#app")!;

let allPieces: PieceEntity[] = [];
// const canvas = app.querySelector("canvas")!;
// if (canvas.getContext) {
// 	const ctx = canvas.getContext("2d")!;
// 	//Loading of the home test image - img1
// 	const img1 = new Image();
// 	img1.src = (document.getElementById("image") as HTMLImageElement)!.src;
// 	//drawing of the test image - img1
// 	img1.onload = () => {
// 		canvas.height = img1.height;
// 		canvas.width = img1.width;
// 		ctx.fillStyle = "gray";
// 		ctx.fillRect(0, 0, canvas.width, canvas.height);
// 		//draw background image
// 		// ctx.drawImage(img1, 0, 0);

// 		ctx.fillStyle = "gray";

// 		allPieces = new PieceCreator({
// 			canvasHeight: canvas.height,
// 			canvasWidth: canvas.width,
// 		}).create();

// 		for (let i = 0; i < allPieces.length; i++) {
// 			const piece = allPieces[i];

// 			cutPieceFromImage(piece);
// 		}
// 		// allPiecesPlaced = fillBoardWithPieces({
// 		// 	canvasWidth: canvas.width,
// 		// 	ctx,
// 		// 	canvasHeight: canvas.height,
// 		// });
// 	};
// }

const boardElement = document.getElementById("board") as HTMLDivElement;

if (!boardElement) {
	throw Error("No board div element");
}
const pieceSize = 50;
const img1 = new Image();
img1.src = (document.getElementById("image") as HTMLImageElement)!.src;
//drawing of the test image - img1
img1.onload = () => {
	document.documentElement.style.setProperty(
		"--board-width",
		`${img1.width.toString()}px`,
	);
	document.documentElement.style.setProperty(
		"--board-height",
		`${img1.height.toString()}px`,
	);

	allPieces = new PieceCreator({
		canvasHeight: boardElement.clientHeight,
		canvasWidth: boardElement.clientHeight,
		pieceSize,
	}).create();

	for (let i = 0; i < allPieces.length; i++) {
		const piece = allPieces[i];

		console.log({ piece });
		cutPieceFromImage(piece);
	}
};

const firstDivElement = document.getElementById("firstDiv")!;

firstDivElement.onmousedown = (event) => {
	firstDivElement.style.position = "absolute";
	firstDivElement.style.zIndex = "1000";

	// move it out of any current parents directly into body
	// to make it positioned relative to the body
	document.body.append(firstDivElement);

	// centers the ball at (pageX, pageY) coordinates
	function moveAt(pageX: number, pageY: number) {
		firstDivElement.style.left = `${pageX - firstDivElement.offsetWidth / 2}px`;
		firstDivElement.style.top = `${pageY - firstDivElement.offsetHeight / 2}px`;
	}

	// move our absolutely positioned ball under the pointer
	moveAt(event.pageX, event.pageY);

	function onMouseMove(event: MouseEvent) {
		moveAt(event.pageX, event.pageY);
	}

	// (2) move the ball on mousemove
	document.addEventListener("mousemove", onMouseMove);

	// (3) drop the ball, remove unneeded handlers
	firstDivElement.onmouseup = () => {
		document.removeEventListener("mousemove", onMouseMove);
		firstDivElement.onmouseup = null;
	};
};

const makePieceDraggable = (divElement: HTMLDivElement) => {
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

firstDivElement.ondragstart = () => false;

// canvas.addEventListener("click", (e: MouseEvent) => {
// 	const xPos = e.offsetX;
// 	const yPos = e.offsetY;

// 	console.log({ xPos, yPos });
// 	const clickedPiece = allPieces.find(
// 		(pieceEntity) =>
// 			pieceEntity.boundingBox[0][0] < xPos &&
// 			pieceEntity.boundingBox[1][0] > xPos &&
// 			pieceEntity.boundingBox[0][1] < yPos &&
// 			pieceEntity.boundingBox[1][1] > yPos,
// 	);

// 	if (!clickedPiece) {
// 		return;
// 	}

// 	cutPieceFromImage(clickedPiece);
// });

function cutPieceFromImage(piece: PieceEntity) {
	const img1 = new Image();
	img1.src = (document.getElementById("image") as HTMLImageElement)!.src;

	const canvasForCropping = document.getElementById(
		"canvasForCropping",
	)! as HTMLCanvasElement;

	const croppingContext = canvasForCropping.getContext("2d")!;

	img1.onload = () => {
		croppingContext.drawImage(
			img1,
			piece.boundingBox[0].x,
			piece.boundingBox[0].y,
			pieceSize + 15,
			pieceSize,
			0,
			0,
			pieceSize + 15,
			pieceSize,
		);
		const croppedImageDataUrl = canvasForCropping.toDataURL();

		const croppedImage = new Image();
		croppedImage.src = croppedImageDataUrl;

		croppedImage.onload = () => {
			const style = `
				background-image: url(${croppedImageDataUrl});
				background-image: center;
				clip-path: path("${piece.path}");
				top: ${piece.boundingBox[0].y}px;
				left: ${piece.boundingBox[0].x}px;
				width: ${piece.boundingBox[1].x - piece.boundingBox[0].x}px;
				height: ${piece.boundingBox[1].y - piece.boundingBox[0].y}px;
			`;
			document.getElementById("firstDiv")?.setAttribute(
				"style",
				`
					background-image: url(${croppedImageDataUrl});
					clip-path: path("${piece.path}");
						`,
			);

			const newPiece = document.createElement("div");
			newPiece.setAttribute("style", style);
			newPiece.setAttribute("draggable", "");
			makePieceDraggable(newPiece);
			boardElement.appendChild(newPiece);
		};
	};
}
