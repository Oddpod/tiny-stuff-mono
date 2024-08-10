import type { PiecePositionLookup } from "./board";
import type { PieceEntity } from "./makeBoard";
import { deserialize, serialize } from "./serilizationUtils";

export type SavedBoard = {
	id: number;
	definitionId: number;
	coords: PieceEntity["coords"];
	boundingBox: PieceEntity["boundingBox"];
	connections: PieceEntity["connections"];
}[][];

export function savePiecePositions(piecePositions: PiecePositionLookup) {
	localStorage.setItem("piece-positions", serialize(piecePositions));
}

export function loadPiecePositions() {
	const savedPiecePositions = localStorage.getItem("piece-positions");
	return deserialize<PiecePositionLookup>(savedPiecePositions);
}

type SavedDimensions = [number, number];

export function savePuzzleDimensions(dimensions: [number, number]) {
	localStorage.setItem("saved-dimensions", serialize(dimensions));
}

export function loadSavedPuzzleDimensions() {
	return deserialize<SavedDimensions>(localStorage.getItem("saved-dimensions"));
}

export function saveBoard(board: PieceEntity[][]) {
	const savedBoard: SavedBoard = board.map((row) =>
		row.map(({ id, definition, boundingBox, connections, coords }) => ({
			id,
			coords,
			definitionId: definition.id,
			boundingBox,
			connections,
		})),
	);
	localStorage.setItem("saved-board", serialize(savedBoard));
}

export function loadSavedBoard() {
	const savedBoard = localStorage.getItem("saved-board");
	const savedBoardDeserialized = deserialize<SavedBoard>(savedBoard);
	return savedBoardDeserialized;
}

export function saveImage(imageSrc: string) {
	localStorage.setItem("saved-image", imageSrc);
}

export function getSavedImage() {
	return localStorage.getItem("saved-image");
}
