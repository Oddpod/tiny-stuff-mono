import "./style.css";
import 'virtual:uno.css'
import './settings'

import { createPuzzle, resumeSavedPuzzle } from "./boardUsingEffect";

const boardContainer = document.getElementById("board-container") as HTMLDivElement

const dimensionsConfig = document.getElementById("select-piece-dimensions") as HTMLFormElement

dimensionsConfig.addEventListener("submit", (event: SubmitEvent) => {
	event.preventDefault();
	boardContainer.innerHTML = '<div id="board" class=""></div>'
	createPuzzle()
})

resumeSavedPuzzle()

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
