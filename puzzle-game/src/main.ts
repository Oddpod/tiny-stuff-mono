import { cutPieceFromImage } from "./cutPieceFromImage";
import { makePieceDraggable } from "./makePieceDraggable";
import { PieceCreator, type PieceEntity } from "./pieceCreator";
import "./style.css";

const app = document.querySelector<HTMLDivElement>("#app")!;

let allPieces: PieceEntity[] = [];

const boardElement = document.getElementById("board") as HTMLDivElement;

if (!boardElement) {
	throw Error("No board div element");
}
// TODO: Use this to scale pieces in pieceCreator?
const PIECE_SIZE = Object.freeze(200 as const);
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
	// newPiece.style.top = `${(
	// 	Math.random() *
	// 	(boardElement.clientHeight - PIECE_DIMENSIONS * 2)
	// ).toString()}px`;
	// newPiece.style.left = `${(
	// 	Math.random() *
	// 	(boardElement.clientWidth - PIECE_DIMENSIONS * 2)
	// ).toString()}px`;
	// newPiece.style.top = `${piece.boundingBox[0].y.toString()}px`;
	// newPiece.style.left = `${piece.boundingBox[0].x.toString()}px`;
	boardElement.appendChild(newPiece);
}
