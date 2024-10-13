import "./style.css";
import "virtual:uno.css";
import "./settings";

import { resumePuzzleProgram } from "./resumePuzzleProgram";
import { clearBoardContainer } from "./board";
import { Effect } from "effect";
import { createPuzzle } from "./createPuzzleProgram";

const dimensionsConfig = document.getElementById(
	"select-piece-dimensions",
) as HTMLFormElement;

const resumeSavedPuzzle = () =>
	Effect.runPromise(resumePuzzleProgram).catch((error) => {
		Effect.logDebug(error);
		createPuzzle();
	});

dimensionsConfig.addEventListener("submit", (event: SubmitEvent) => {
	event.preventDefault();
	clearBoardContainer();
	createPuzzle();
});

resumeSavedPuzzle();
