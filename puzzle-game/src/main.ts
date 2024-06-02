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

let createdPuzzle: ReturnType<
	ReturnType<typeof BoardCreator>["createPuzzle"]
> | null = null;
// TODO: Use this to scale pieces in pieceCreator?
const PIECE_SIZE = Object.freeze(100 as const);
const PIECE_GAP = Object.freeze(0 as const);

const boardCreator = BoardCreator({
	boardElement,
	pieceGap: PIECE_GAP,
	pieceSize: PIECE_SIZE,
	pieceMovedCallback,
});

function pieceMovedCallback() {
	saveBoardState({
		board: createdPuzzle!.board,
		imageSrc: previewImageElement.src,
		scaleFactorX: createdPuzzle!.meta.scaleFactorX,
		scaleFactorY: createdPuzzle!.meta.scaleFactorY,
	});
}

fileUpload?.addEventListener("change", () => previewFile());

const loadButton = document.getElementById("load-button");
loadButton?.addEventListener("click", () => {
	createdPuzzle = boardCreator.createPuzzle(previewImageElement.src);
});
const resetButton = document.getElementById("reset-button")!;
resetButton.addEventListener("click", () => {
	localStorage.clear();
	resetToDefaultImage();
	boardCreator.createPuzzle(previewImageElement.src);
});
loadSavedState(
	(params) => boardCreator.cutAndPlacePieces(params),
	() => boardCreator.createPuzzle(previewImageElement.src),
);
