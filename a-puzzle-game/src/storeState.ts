import { previewFile } from "./previewFile";
import type { PieceEntity } from "./pieceCreator";
import type { BoardCreator, PiecePositionLookup } from "./board";
import { deserialize, serialize } from "./serilizationUtils";
import { pieceDefinitionLookup } from "./pieceDefintions";

type OnLoadedCallbackParams = Parameters<
	typeof BoardCreator.prototype.cutAndPlacePieces
>[0] & { piecePositions: PiecePositionLookup; board: PieceEntity[][] };

export type SavedBoard = {
	id: number;
	definitionId: number;
	boundingBox: PieceEntity["boundingBox"];
}[][];
type SavedBoardMeta = {
	rowNum: number;
	colNum: number;
} & Pick<OnLoadedCallbackParams, "scaleFactorX" | "scaleFactorY">;

// export async function loadSavedState(
// 	onLoadedCallback: (_: OnLoadedCallbackParams) => void,
// 	onDefaultImageLoadedCallback: (_: string) => void,
// ) {
// 	previewFile(async (imageSrc) => {
// 		const savedBoardStateMeta = localStorage.getItem("saved-board-state-meta");
// 		const savedPiecePositions = localStorage.getItem("piece-positions");
// 		const savedBoard = localStorage.getItem("saved-board");
// 		if (!savedBoardStateMeta || !savedPiecePositions || !savedBoard)
// 			return onDefaultImageLoadedCallback(imageSrc);

// 		const { scaleFactorX, scaleFactorY } =
// 			deserialize<SavedBoardMeta>(savedBoardStateMeta);

// 		const piecePositions =
// 			deserialize<PiecePositionLookup>(savedPiecePositions);

// 		const savedBoardDeserialized = deserialize<SavedBoard>(savedBoard);

// 		const board: PieceEntity[][] = savedBoardDeserialized.map((row) => {
// 			return row.map(({ boundingBox, definitionId, id }) => ({
// 				boundingBox,
// 				id,
// 				definition: pieceDefinitionLookup.get(definitionId)!,
// 			}));
// 		});
// 		onLoadedCallback({
// 			board,
// 			scaleFactorX,
// 			imageSrc,
// 			scaleFactorY,
// 			piecePositions,
// 		});
// 	});
// }

interface SaveBoardStateParams {
	imageSrc: string;
	board: PieceEntity[][];
	scaleFactorX: number;
	scaleFactorY: number;
	piecePositions: PiecePositionLookup;
}
// export function saveBoardState({
// 	imageSrc,
// 	scaleFactorX,
// 	scaleFactorY,
// 	board,
// 	piecePositions,
// }: SaveBoardStateParams) {
// 	localStorage.setItem("saved-image", imageSrc);
// 	localStorage.setItem(
// 		"saved-board-state-meta",
// 		serialize({
// 			rowNum: board.length,
// 			colNum: board[0].length,
// 			scaleFactorX,
// 			scaleFactorY,
// 		} satisfies SavedBoardMeta),
// 	);
// 	const pieceMeta = new Map<
// 		number,
// 		{ boundingBox: PieceEntity["boundingBox"]; definitionId: number }
// 	>();
// 	for (const row of board) {
// 		for (const { id, definition, boundingBox } of row) {
// 			pieceMeta.set(id, { definitionId: definition.id, boundingBox });
// 		}
// 	}
// 	const savedBoard = board.map((row) =>
// 		row.map(({ id, definition, boundingBox }) => ({
// 			id,
// 			definitionId: definition.id,
// 			boundingBox,
// 		})),
// 	);
// 	localStorage.setItem("saved-board", serialize(savedBoard));
// 	localStorage.setItem("piece-positions", serialize(piecePositions));
// }

export function savePiecePositions(piecePositions: PiecePositionLookup) {
	localStorage.setItem("piece-positions", serialize(piecePositions))
}

export function loadPiecePositions() {
	const savedPiecePositions = localStorage.getItem("piece-positions");
	return deserialize<PiecePositionLookup>(savedPiecePositions);
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