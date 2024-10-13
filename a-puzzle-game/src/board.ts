import {
	PIECE_DIMENSIONS,
	PIECE_EAR_SIZE,
	type Side,
} from "./pieceDefinitions";
import { getRndInteger } from "./utils";

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

export function calculateBoardDimensions({
	image,
	widthInPieces,
	heightInPieces,
}: CalculateBoardDimensions) {
	const initialBoardWidth = Math.min(image.width, (window.innerWidth * 3) / 4);
	const initialBoardHeight = Math.min(
		image.height,
		(window.innerHeight * 3) / 4,
	);

	// TODO: Should this clamp logic be here or should it happen on input instead?
	//  Keep numbers nice and whole
	const pieceWidth = Math.floor(initialBoardWidth / widthInPieces);
	const pieceHeight = Math.floor(initialBoardHeight / heightInPieces);

	const boardWidth = pieceWidth * widthInPieces;
	const boardHeight = pieceHeight * heightInPieces;

	return { boardHeight, boardWidth, pieceWidth, pieceHeight };
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

export type PieceDimensions = Pick<
	ReturnType<typeof calculateBoardDimensions>,
	"pieceHeight" | "pieceWidth"
>;
interface GetRandomBoardCoordinatesParams extends PieceDimensions {
	sides: { bottom: Side; top: Side; left: Side; right: Side };
}

export function getRandomBoardCoordinates({
	pieceWidth,
	pieceHeight,
	sides,
}: GetRandomBoardCoordinatesParams) {
	const shiftXForRightEar =
		sides.right === "ear"
			? (PIECE_EAR_SIZE * pieceWidth) / PIECE_DIMENSIONS
			: 0;
	const shiftXForLeftEar =
		sides.left === "ear" ? (PIECE_EAR_SIZE * pieceWidth) / PIECE_DIMENSIONS : 0;
	const pieceWidthWithEars = pieceWidth + shiftXForLeftEar + shiftXForRightEar;

	const shiftYForTopEar =
		sides.top === "ear" ? (PIECE_EAR_SIZE * pieceHeight) / PIECE_DIMENSIONS : 0;
	const shiftYForBottomEar =
		sides.bottom === "ear"
			? (PIECE_EAR_SIZE * pieceHeight) / PIECE_DIMENSIONS
			: 0;
	const pieceHeightWithEars =
		pieceHeight + shiftYForBottomEar + shiftYForTopEar;

	const left = getRndInteger(
		pieceWidthWithEars,
		window.innerWidth - pieceWidthWithEars,
	);
	const top = getRndInteger(
		pieceHeightWithEars,
		window.innerHeight - pieceHeightWithEars,
	);
	return { left, top };
}
