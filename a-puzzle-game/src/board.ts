import { PIECE_DIMENSIONS, PIECE_EAR_SIZE } from "./pieceDefintions";
import {
	type MakePieceDraggableParams,
	PieceDragger,
} from "./makePieceDraggable";
import { PieceCreator, type PieceEntity } from "./pieceCreator";
import { PieceCutter } from "./pieceCutter";
import { shuffle } from "./shuffle";
import { clamp } from "./utils";

const boardContainer = document.getElementById("board-container")!;

interface CutAndPlacePiecesParams {
	scaleFactorX: number;
	scaleFactorY: number;
	imageSrc: string;
}
type PieceMovedCallback = MakePieceDraggableParams["onMouseUpCallback"];

interface BoardParams {
	boardElement: HTMLElement;
	pieceSize: number;
	pieceGap: number;
	pieceMovedCallback: PieceMovedCallback;
	boardContainer: HTMLElement;
}
export type PiecePositionLookup = Map<number, { left: number; top: number }>;

export class BoardCreator {
	boardElement: HTMLElement;
	pieceGap: number;
	pieceMovedCallback: PieceMovedCallback;
	pieceSize: number;
	board: PieceEntity[][];
	piecePositions: Map<number, { left: number; top: number }>;
	meta: { scaleFactorX: number; scaleFactorY: number };
	pieceDragger: ReturnType<typeof PieceDragger>;
	boardContainer: HTMLElement;
	constructor({
		boardElement,
		boardContainer,
		pieceSize,
		pieceGap,
		pieceMovedCallback,
	}: BoardParams) {
		this.boardElement = boardElement;
		this.boardContainer = boardContainer;
		this.pieceSize = pieceSize;
		this.pieceGap = pieceGap;
		this.pieceMovedCallback = pieceMovedCallback;
		this.board = [];
		this.piecePositions = new Map();
		this.meta = {
			scaleFactorX: 1,
			scaleFactorY: 1,
		};
		this.pieceDragger = PieceDragger({ boardElement, boardContainer });
	}
	setPieceSize(newSize: number) {
		this.pieceSize = newSize;
	}

	setPiecePositions(positions: typeof this.piecePositions) {
		this.piecePositions = positions;
	}

	resetPiecePositions() {
		this.piecePositions = new Map();
	}

	async createPuzzle(imageSrc: string) {
		if (!imageSrc) return;
		const boardElement = this.boardElement;
		boardElement.innerHTML = "";

		const pieceCreator = new PieceCreator({
			boardHeight: boardElement.clientHeight,
			boardWidth: boardElement.clientWidth,
			pieceSize: this.pieceSize,
			pieceGap: this.pieceGap,
		});
		this.board = pieceCreator.createRandom();
		const scaleFactorX = pieceCreator.widthDimensions.scaleToFitLengthFactor;
		const scaleFactorY = pieceCreator.heightDimensions.scaleToFitLengthFactor;
		await this.cutAndPlacePieces({
			scaleFactorX: pieceCreator.widthDimensions.scaleToFitLengthFactor,
			scaleFactorY: pieceCreator.heightDimensions.scaleToFitLengthFactor,
			imageSrc,
		});
		this.meta = { scaleFactorX, scaleFactorY };
	}
	async cutAndPlacePieces({
		scaleFactorY,
		scaleFactorX,
		imageSrc,
	}: CutAndPlacePiecesParams) {
		const img1 = new Image();
		img1.src = imageSrc;
		img1.onload = async () => {
			const boardWidth = Math.min(
				img1.width - (img1.width % this.pieceSize),
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

			shuffle(this.board);

			const pieceCutter = new PieceCutter({
				imageElement: img1,
				pieceSize: this.pieceSize,
				scaleFactorX,
				scaleFactorY,
			});
			for (let i = 0; i < this.board.length; i++) {
				const row = this.board[i];
				for (let j = 0; j < row.length; j++) {
					const piece = row[j];
					const newPiece = await pieceCutter.cutPieceFromImage(piece);
					let placement = { left: 0, top: 0 };
					if (this.piecePositions.has(piece.id)) {
						placement = this.piecePositions.get(piece.id)!;
					} else {
						placement = getRandomBoardCoordinates({
							width: boardWidth,
							pieceSize: this.pieceSize,
							height: boardHeight,
						});
						this.piecePositions.set(piece.id, placement);
					}
					this.pieceDragger.makePieceDraggable({
						divElement: newPiece,
						onMouseUpCallback: this.pieceMovedCallback,
						pieceId: piece.id,
					});
					newPiece.style.left = `${placement.left}px`;
					newPiece.style.top = `${placement.top}px`;
					this.boardElement.appendChild(newPiece);
				}
			}
		};
	}
}

function getRandomBoardCoordinates({
	width,
	height,
	pieceSize,
}: { width: number; height: number; pieceSize: number }) {
	const shiftXY =
		pieceSize + (2 * PIECE_EAR_SIZE * pieceSize) / PIECE_DIMENSIONS;
	const left = clamp(0, Math.random() * (width - shiftXY), width - shiftXY);
	const top = clamp(0, Math.random() * (height - shiftXY), height - shiftXY);
	return { left, top };
}
