import { PIECE_DIMENSIONS, PIECE_EAR_SIZE } from "./pieceDefintions";
import { PieceDragger } from "./makePieceDraggable";
import { PieceCreator, type PieceEntity } from "./pieceCreator";
import { PieceCutter } from "./pieceCutter";
import { shuffle } from "./shuffle";

const boardContainer = document.getElementById("board-container")!;

interface CutAndPlacePiecesParams {
	scaleFactorX: number;
	scaleFactorY: number;
	imageSrc: string;
}
type PieceMovedCallback = Parameters<
	ReturnType<typeof PieceDragger>["makePieceDraggable"]
>[2];

interface BoardParams {
	boardElement: HTMLElement;
	pieceSize: number;
	pieceGap: number;
	pieceMovedCallback: PieceMovedCallback;
}
export type PiecePositionLookup = Map<number, { x: number; y: number }>;

export class BoardCreator {
	boardElement: HTMLElement;
	pieceGap: number;
	pieceMovedCallback: PieceMovedCallback;
	pieceSize: number;
	board: PieceEntity[][];
	piecePositions: Map<number, { x: number; y: number }>;
	meta: { scaleFactorX: number; scaleFactorY: number };
	pieceDragger: ReturnType<typeof PieceDragger>;
	constructor({
		boardElement,
		pieceSize,
		pieceGap,
		pieceMovedCallback,
	}: BoardParams) {
		this.boardElement = boardElement;
		this.pieceSize = pieceSize;
		this.pieceGap = pieceGap;
		this.pieceMovedCallback = pieceMovedCallback;
		this.board = [];
		this.piecePositions = new Map();
		this.meta = {
			scaleFactorX: 1,
			scaleFactorY: 1,
		};
		this.pieceDragger = PieceDragger(boardElement);
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
					let placement = { x: 0, y: 0 };
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
					this.pieceDragger.makePieceDraggable(
						piece.id,
						newPiece,
						this.pieceMovedCallback,
					);
					newPiece.style.left = `${placement.x}px`;
					newPiece.style.top = `${placement.y}px`;
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
	const x = Math.max(
		Math.random() *
			(width - pieceSize - (PIECE_EAR_SIZE * pieceSize) / PIECE_DIMENSIONS),
		pieceSize,
	);
	const y = Math.max(
		Math.random() *
			(height - pieceSize - (PIECE_EAR_SIZE * pieceSize) / PIECE_DIMENSIONS),
		pieceSize,
	);
	return { x, y };
}
