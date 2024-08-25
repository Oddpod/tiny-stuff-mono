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

export type CombinedPiecePositionLookup = Map<
	string,
	{ pieceIds: Set<number>; position: { top: number; left: number } }
>;

export function savePiecePositions(
	piecePositions: PiecePositionLookup,
	combinedPiecePositions: CombinedPiecePositionLookup,
) {
	// TODO: split into two save methods? Depends on how slow it is
	localStorage.setItem(
		"piece-group-positions",
		serialize(combinedPiecePositions),
	);
	localStorage.setItem("piece-positions", serialize(piecePositions));
}

export function loadPiecePositions() {
	const savedPiecePositions = localStorage.getItem("piece-positions");
	const savedCombinePiecesPositions = localStorage.getItem(
		"piece-group-positions",
	);
	return {
		piecePositions: deserialize<PiecePositionLookup>(savedPiecePositions),
		pieceGroupPositions: deserialize<CombinedPiecePositionLookup>(
			savedCombinePiecesPositions,
		),
	};
}

type SavedDimensions = { heightInPieces: number; widthInPieces: number };

export function savePuzzleDimensions(dimensions: SavedDimensions) {
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
	return savedBoard;
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
