import { Effect } from "effect";
import { InputConfig } from "./input";
import { PIECE_DIMENSIONS, PIECE_EAR_SIZE } from "./pieceDefintions";

const boardContainer = document.getElementById("board-container")!;
const boardElement = document.getElementById("board") as HTMLDivElement;

export type PiecePositionLookup = Map<number, { left: number; top: number }>;

export function calculateBoardDimensions(image: HTMLImageElement) {
	const aspectRatio = image.height / image.width;

	let boardWidth = Math.min(image.width, window.innerWidth)
	let boardHeight = Math.min(image.height, window.innerHeight)
	if (image.width > image.height) {
		boardWidth = Math.min(image.width, window.innerWidth * 3 / 4)
		boardHeight = Math.round(boardWidth * aspectRatio)
	} else {
		boardHeight = Math.min(image.height, window.innerHeight * 3 / 4)
		boardWidth = Math.round(boardHeight / aspectRatio)
	}
	return { boardHeight, boardWidth }
}

export function setBoardDimensions({ boardWidth, boardHeight }: { boardWidth: number, boardHeight: number }) {
	document.documentElement.style.setProperty(
		"--board-width",
		`${boardWidth.toString()}px`,
	);
	document.documentElement.style.setProperty(
		"--board-height",
		`${boardHeight.toString()}px`,
	);
}

export function getRandomCoordinatesOutsideBoard({ board, pieceSize }: { board: HTMLDivElement, pieceSize: number }) {
	const shiftXY =
		pieceSize + (2 * PIECE_EAR_SIZE * pieceSize) / PIECE_DIMENSIONS;

	const left = Math.random() * (window.innerWidth - shiftXY)
	// TODO: Limit top based on width
	const top = Math.random() > 0.5 ? Math.random() * (board.offsetTop - shiftXY) :
		board.offsetTop + board.offsetHeight + Math.random() * (board.offsetTop - shiftXY)
	return { left, top }
}

interface CalculatePieceSizeParams extends Pick<InputConfig, 'heightInPieces' | 'widthInPieces'> {
}

export const calculatePieceSize = ({ widthInPieces, heightInPieces }: CalculatePieceSizeParams) => {
	let pieceSize = 50;
	if (widthInPieces > heightInPieces) {
		pieceSize = boardElement.clientWidth / widthInPieces
	} else {
		pieceSize = boardElement.clientHeight / heightInPieces
	}
	Effect.logDebug({ pieceSize, widthInPieces, heightInPieces })
	return Effect.succeed(Math.round(pieceSize))
}