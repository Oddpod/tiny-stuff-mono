import { makePieceDraggable } from "./makePieceDraggable";
import { PieceCreator, type PieceEntity } from "./pieceCreator";
import { PieceCutter } from "./pieceCutter";
import { shuffle } from "./shuffle";

const boardContainer = document.getElementById("board-container")!;

interface CutAndPlacePiecesParams {
	board: PieceEntity[][];
	scaleFactorX: number;
	scaleFactorY: number;
	imageSrc: string;
}

let board: PieceEntity[][] = [];

interface BoardParams {
	boardElement: HTMLElement;
	pieceSize: number;
	pieceGap: number;
	pieceMovedCallback: () => void;
}

export function BoardCreator({
	boardElement,
	pieceSize,
	pieceGap,
	pieceMovedCallback,
}: BoardParams) {
	function setPieceSize(newSize: number) {
		pieceSize = newSize;
	}
	function createPuzzle(imageSrc: string) {
		if (!imageSrc) return;
		boardElement.innerHTML = "";

		const pieceCreator = new PieceCreator({
			boardHeight: boardElement.clientHeight,
			boardWidth: boardElement.clientWidth,
			pieceSize,
			pieceGap,
		});
		board = pieceCreator.createRandom();
		const scaleFactorX = pieceCreator.widthDimensions.scaleToFitLengthFactor;
		const scaleFactorY = pieceCreator.heightDimensions.scaleToFitLengthFactor;
		cutAndPlacePieces({
			board,
			scaleFactorX: pieceCreator.widthDimensions.scaleToFitLengthFactor,
			scaleFactorY: pieceCreator.heightDimensions.scaleToFitLengthFactor,
			imageSrc,
		});
		return { board, meta: { scaleFactorX, scaleFactorY } };
	}
	async function cutAndPlacePieces({
		scaleFactorY,
		scaleFactorX,
		board,
		imageSrc,
	}: CutAndPlacePiecesParams) {
		const img1 = new Image();
		img1.src = imageSrc;
		img1.onload = async () => {
			const boardWidth = Math.min(
				img1.width - (img1.width % pieceSize),
				boardContainer.clientWidth,
			);
			const aspectRatio = img1.height / img1.width;
			const boardHeight = aspectRatio * boardWidth;
			document.documentElement.style.setProperty(
				"--board-width",
				`${boardWidth.toString()}px`,
			);
			document.documentElement.style.setProperty(
				"--board-height",
				`${boardHeight.toString()}px`,
			);

			shuffle(board);

			const pieceCutter = new PieceCutter({
				imageElement: img1,
				pieceSize,
				scaleFactorX,
				scaleFactorY,
			});
			for (let i = 0; i < board.length; i++) {
				const row = board[i];
				for (let j = 0; j < row.length; j++) {
					const piece = row[j];
					const newPiece = await pieceCutter.cutPieceFromImage(piece);
					makePieceDraggable(newPiece, pieceMovedCallback);
					boardElement.appendChild(newPiece);
				}
			}
		};
	}
	return { createPuzzle, cutAndPlacePieces, setPieceSize };
}
