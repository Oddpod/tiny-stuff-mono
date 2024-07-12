import "./style.css";
import 'virtual:uno.css'
import './settings'

import { createPuzzle, resumeSavedPuzzle } from "./boardUsingEffect";
import { clearBoardContainer } from "./board";

const dimensionsConfig = document.getElementById("select-piece-dimensions") as HTMLFormElement

dimensionsConfig.addEventListener("submit", (event: SubmitEvent) => {
	event.preventDefault();
	clearBoardContainer();
	createPuzzle()
})

resumeSavedPuzzle()