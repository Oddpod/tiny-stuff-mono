import "./style.css";
import { previewFile, resetToDefaultImage } from "./previewFile";
import { loadSavedState, saveBoardState } from "./storeState";
import { BoardCreator } from "./board";

const boardElement = document.getElementById("board") as HTMLDivElement;
export const fileUpload = document.getElementById(
	"file-upload",
) as HTMLInputElement;
export const previewImageElement = (document.getElementById(
	"image",
) as HTMLImageElement)!;

if (!boardElement) {
	throw Error("No board div element");
}

const PIECE_GAP = Object.freeze(0 as const);
const DEFAULT_PIECE_SIZE = Object.freeze(200 as const);
const pieceSizeSelector = document.getElementById(
	"select-piece-size",
)! as HTMLSelectElement;

const boardCreator = new BoardCreator({
	boardElement,
	pieceGap: PIECE_GAP,
	pieceSize: Number(pieceSizeSelector.value),
	pieceMovedCallback: ({ pieceId, x, y }) => {
		boardCreator.piecePositions.set(pieceId, { x, y });
		saveBoardState({
			board: boardCreator.board,
			imageSrc: previewImageElement.src,
			scaleFactorX: boardCreator.meta.scaleFactorX,
			scaleFactorY: boardCreator.meta.scaleFactorY,
			piecePositions: boardCreator.piecePositions,
		});
	},
});

pieceSizeSelector.addEventListener("change", (event) => {
	const target = event.target as HTMLSelectElement;
	boardCreator.setPieceSize(Number(target.value ?? DEFAULT_PIECE_SIZE));
});

fileUpload?.addEventListener("change", () => previewFile());

const loadButton = document.getElementById("load-button") as HTMLButtonElement;
loadButton?.addEventListener("click", () => {
	boardCreator.resetPiecePositions();
	boardCreator.createPuzzle(previewImageElement.src);
});
const resetButton = document.getElementById("reset-button")!;
resetButton.addEventListener("click", () => {
	try {
		loadButton.setAttribute("disabled", "");
		localStorage.clear();
		resetToDefaultImage();
		boardCreator.createPuzzle(previewImageElement.src);
	} finally {
		setTimeout(() => loadButton.removeAttribute("disabled"), 500);
	}
});
loadSavedState(
	({ piecePositions, board, ...rest }) => {
		boardCreator.setPiecePositions(piecePositions);
		boardCreator.board = board;
		boardCreator.cutAndPlacePieces(rest);
	},
	async () => {
		await boardCreator.createPuzzle(previewImageElement.src);
	},
);
