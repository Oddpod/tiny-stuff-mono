import { PIECE_DIMENSIONS, PIECE_EAR_SIZE, type Side } from "./pieceDefinitions";
import { clamp, getRndInteger } from "./utils";

const boardContainer = document.getElementById("board-container")!;

export type PiecePositionLookup = Map<number, { left: number; top: number }>;

export function clearBoardContainer() {
	boardContainer.innerHTML = "";
}

interface CalculateBoardDimensions {
	image: HTMLImageElement;
	widthInPieces: number;
	heightInPieces: number;
}

const MAX_PIECE_SIZE = Object.freeze(150);
const MIN_PIECE_SIZE = Object.freeze(50);
export function calculateBoardDimensions({
	image,
	widthInPieces,
	heightInPieces,
}: CalculateBoardDimensions) {
	let pieceSize = 50;

	const initialBoardWidth = Math.min(image.width, (window.innerWidth * 3) / 4);
	const initialBoardHeight = Math.min(
		image.height,
		(window.innerHeight * 3) / 4,
	);

	pieceSize =
		initialBoardWidth > initialBoardHeight
			? initialBoardWidth / widthInPieces
			: initialBoardHeight / heightInPieces;

	pieceSize = clamp(pieceSize, MIN_PIECE_SIZE, MAX_PIECE_SIZE);

	const boardWidth = pieceSize * widthInPieces;
	const boardHeight = pieceSize * heightInPieces;

	return { boardHeight, boardWidth, pieceSize };
}

export function setBoardDimensions({
	boardWidth,
	boardHeight,
}: { boardWidth: number; boardHeight: number }) {
	document.documentElement.style.setProperty(
		"--board-width",
		`${boardWidth.toString()}px`,
	);
	document.documentElement.style.setProperty(
		"--board-height",
		`${boardHeight.toString()}px`,
	);
}

export function getRandomBoardCoordinates(
	pieceSize: number,
	sides: { bottom: Side; top: Side; left: Side; right: Side },
) {
	const shiftXForRightEar =
		sides.right === "ear" ? (PIECE_EAR_SIZE * pieceSize) / PIECE_DIMENSIONS : 0;
	const shiftXForLeftEar =
		sides.left === "ear" ? (PIECE_EAR_SIZE * pieceSize) / PIECE_DIMENSIONS : 0;
	const pieceWidth = pieceSize + shiftXForLeftEar + shiftXForRightEar;

	const shiftYForTopEar =
		sides.top === "ear" ? (PIECE_EAR_SIZE * pieceSize) / PIECE_DIMENSIONS : 0;
	const shiftYForBottomEar =
		sides.bottom === "ear"
			? (PIECE_EAR_SIZE * pieceSize) / PIECE_DIMENSIONS
			: 0;
	const pieceHeight = pieceSize + shiftYForBottomEar + shiftYForTopEar;

	const left = getRndInteger(pieceWidth, window.innerWidth - pieceWidth);
	const top = getRndInteger(pieceHeight, window.innerHeight - pieceHeight);
	return { left, top };
}
