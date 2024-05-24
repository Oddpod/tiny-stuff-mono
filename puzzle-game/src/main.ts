import { cutPieceFromImage } from "./cutPieceFromImage";
import { makePieceDraggable } from "./makePieceDraggable";
import { PieceCreator, type PieceEntity } from "./pieceCreator";
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
const PIECE_SIZE = Object.freeze(50 as const);
const PIECE_GAP = Object.freeze(0 as const);
const img1 = new Image();
img1.src = (document.getElementById("image") as HTMLImageElement)!.src;
//drawing of the test image - img1
img1.onload = () => {
	const boardWidth = img1.width - (img1.width % PIECE_SIZE);
	const boardHeight = img1.height - (img1.height % PIECE_SIZE);
	document.documentElement.style.setProperty(
		"--board-width",
		`${boardWidth.toString()}px`,
	);
	document.documentElement.style.setProperty(
		"--board-height",
		`${boardHeight.toString()}px`,
	);

	const pieceCreator = new PieceCreator({
		canvasHeight: boardElement.clientHeight,
		canvasWidth: boardElement.clientWidth,
		pieceSize: PIECE_SIZE,
		pieceGap: PIECE_GAP,
	});
	allPieces = pieceCreator.create();

	for (let i = 0; i < allPieces.length; i++) {
		const piece = allPieces[i];

		cutAndPlacePiece(
			piece,
			pieceCreator.widthDimensions.scaleToFitLengthFactor,
			pieceCreator.heightDimensions.scaleToFitLengthFactor,
		);
	}
};

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

async function cutAndPlacePiece(
	piece: PieceEntity,
	scaleFactorX: number,
	scaleFactorY: number,
) {
	const newPiece = await cutPieceFromImage({
		piece,
		pieceSize: PIECE_SIZE,
		scaleFactorX,
		scaleFactorY,
	});
	makePieceDraggable(newPiece);
	boardElement.appendChild(newPiece);
}
