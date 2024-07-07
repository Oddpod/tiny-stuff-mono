import "./style.css";
import 'virtual:uno.css'

import { previewFile, resetToDefaultImage } from "./previewFile";
import { loadSavedState, saveBoardState } from "./storeState";
import { BoardCreator } from "./board";
import { createPuzzle } from "./boardUsingEffect";
import { loadImage } from "./utils";

const boardElement = document.getElementById("board") as HTMLDivElement;
const boardContainer = document.getElementById("board-container") as HTMLDivElement
const settingsButton = document.getElementById("settings-button") as HTMLButtonElement
const settingsDrawer = document.getElementById("settings-drawer") as HTMLDivElement
const closeSettingsButton = document.getElementById("settings-close-button") as HTMLButtonElement


let settingsDrawerOpen = false

function toggleSettingsDrawer() {
	settingsDrawerOpen = !settingsDrawerOpen
	if (settingsDrawerOpen) {
		settingsDrawer.classList.remove("hidden")
	} else {
		settingsDrawer.classList.add("hidden")
	}
}
settingsButton.addEventListener("click", () => {
	toggleSettingsDrawer();
})

closeSettingsButton.addEventListener("click", () => {
	toggleSettingsDrawer()
})

if (!boardElement) {
	throw Error("No board div element");
}

const PIECE_GAP = Object.freeze(0 as const);
const DEFAULT_PIECE_SIZE = Object.freeze(200 as const);
const pieceSizeSelector = document.getElementById(
	"select-piece-size",
)! as HTMLSelectElement;

const dimensionsConfig = document.getElementById("select-piece-dimensions") as HTMLFormElement

// const inputWidth = dimensionsConfig.querySelector('input[id="dim-width"') as HTMLInputElement
// const inputHeight = dimensionsConfig.querySelector('input[id="dim-height"') as HTMLInputElement
dimensionsConfig.addEventListener("submit", (event: SubmitEvent) => {
	event.preventDefault();
	boardElement.innerHTML = ""
	createPuzzle()
})

createPuzzle()


// const boardCreator = new BoardCreator({
// 	boardContainer,
// 	boardElement,
// 	pieceGap: PIECE_GAP,
// 	pieceSize: Number(pieceSizeSelector.value),
// 	pieceMovedCallback: ({ pieceId, left, top }) => {
// 		boardCreator.piecePositions.set(pieceId, { left, top });
// 		saveBoardState({
// 			board: boardCreator.board,
// 			imageSrc: previewImageElement.src,
// 			scaleFactorX: boardCreator.meta.scaleFactorX,
// 			scaleFactorY: boardCreator.meta.scaleFactorY,
// 			piecePositions: boardCreator.piecePositions,
// 		});
// 	},
// });

// pieceSizeSelector.addEventListener("change", (event) => {
// 	const target = event.target as HTMLSelectElement;
// 	boardCreator.setPieceSize(Number(target.value ?? DEFAULT_PIECE_SIZE));
// });

// const loadButton = document.getElementById("load-button") as HTMLButtonElement;
// loadButton?.addEventListener("click", () => {
// 	boardCreator.resetPiecePositions();
// 	boardCreator.createPuzzle(previewImageElement.src);
// });
// const resetButton = document.getElementById("reset-button")!;
// resetButton.addEventListener("click", () => {
// 	try {
// 		loadButton.setAttribute("disabled", "");
// 		localStorage.clear();
// 		resetToDefaultImage();
// 		boardCreator.createPuzzle(previewImageElement.src);
// 	} finally {
// 		setTimeout(() => loadButton.removeAttribute("disabled"), 500);
// 	}
// });
// loadSavedState(
// 	({ piecePositions, board, ...rest }) => {
// 		boardCreator.setPiecePositions(piecePositions);
// 		boardCreator.board = board;
// 		boardCreator.cutAndPlacePieces(rest);
// 	},
// 	async () => {
// 		await boardCreator.createPuzzle(previewImageElement.src);
// 	},
// );
