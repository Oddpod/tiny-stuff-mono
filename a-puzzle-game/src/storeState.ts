import type { PieceEntity } from "./pieceCreator";
import type { PiecePositionLookup } from "./board";
import { deserialize, serialize } from "./serilizationUtils";

export type SavedBoard = {
	id: number;
	definitionId: number;
	boundingBox: PieceEntity["boundingBox"];
}[][];

export function savePiecePositions(piecePositions: PiecePositionLookup) {
	localStorage.setItem("piece-positions", serialize(piecePositions))
}

export function loadPiecePositions() {
	const savedPiecePositions = localStorage.getItem("piece-positions");
	return deserialize<PiecePositionLookup>(savedPiecePositions);
}

type SavedDimensions = [number, number]

export function savePuzzleDimensions(dimensions: [number, number]) {
	localStorage.setItem("saved-dimensions", serialize(dimensions))
}

export function loadSavedPuzzleDimensions(){
	return deserialize<SavedDimensions>(localStorage.getItem("saved-dimensions"))
}

export function savePieceSize(pieceSize: number) {
	localStorage.setItem("saved-piece-size", pieceSize.toString())
}


export function loadSavedPieceSize() {
	const savedPieceSize = Number.parseInt(localStorage.getItem("saved-piece-size") ?? "")
	if (Number.isNaN(savedPieceSize)) throw new Error("Couldn't read saved-piece-size")
	return savedPieceSize
}

export function saveBoard(board: PieceEntity[][]) {
	const savedBoard = board.map((row) =>
		row.map(({ id, definition, boundingBox }) => ({
			id,
			definitionId: definition.id,
			boundingBox,
		})),
	);
	localStorage.setItem("saved-board", serialize(savedBoard));
}

export function loadSavedBoard() {
	const savedBoard = localStorage.getItem("saved-board");
	const savedBoardDeserialized = deserialize<SavedBoard>(savedBoard);
	return savedBoardDeserialized
}

export function saveImage(imageSrc: string) {
    localStorage.setItem("saved-image", imageSrc)
}

export function getSavedImage() {
    return localStorage.getItem("saved-image")
}