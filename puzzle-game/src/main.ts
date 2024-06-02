import "./style.css";
import { previewFile, resetToDefaultImage } from "./previewFile";
import { loadSavedState, saveBoardState } from "./storeState";
import { BoardCreator } from "./board";
import { PIECE_EAR_SIZE } from "./divPieces";

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
const PIECE_GAP = Object.freeze(0 as const);
const DEFAULT_PIECE_SIZE = Object.freeze(200 as const);
const pieceSizeSelector = document.getElementById(
	"select-piece-size",
)! as HTMLSelectElement;

const boardCreator = BoardCreator({
	boardElement,
	pieceGap: PIECE_GAP,
	pieceSize: Number(pieceSizeSelector.value),
	pieceMovedCallback,
});

pieceSizeSelector.addEventListener("change", (event) => {
	const target = event.target as HTMLSelectElement;
	boardCreator.setPieceSize(Number(target.value ?? DEFAULT_PIECE_SIZE));
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

const loadButton = document.getElementById("load-button") as HTMLButtonElement;
loadButton?.addEventListener("click", () => {
	createdPuzzle = boardCreator.createPuzzle(previewImageElement.src);
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
	(params) => boardCreator.cutAndPlacePieces(params),
	() =>
		console.log({ board: boardCreator.createPuzzle(previewImageElement.src) }),
);
