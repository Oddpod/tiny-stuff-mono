import { previewFile } from "./previewFile";
import type { PieceEntity } from "./pieceCreator";
import type { BoardCreator, PiecePositionLookup } from "./board";
import { deserialize, serialize } from "./serilizationUtils";
import { pieceDefinitions } from "./pieceDefintions";

type OnLoadedCallbackParams = Parameters<
	typeof BoardCreator.prototype.cutAndPlacePieces
>[0] & { piecePositions: PiecePositionLookup; board: PieceEntity[][] };

type PieceMetaMap = Map<
	number,
	{ boundingBox: PieceEntity["boundingBox"]; definitionId: number }
>;

type SavedBoard = {
	id: number;
	definitionId: number;
	boundingBox: PieceEntity["boundingBox"];
}[][];
type SavedBoardMeta = {
	rowNum: number;
	colNum: number;
} & Pick<OnLoadedCallbackParams, "scaleFactorX" | "scaleFactorY">;

// TODO: Use a map
const pieceDefintionsList = Object.values(pieceDefinitions);
export async function loadSavedState(
	onLoadedCallback: (_: OnLoadedCallbackParams) => void,
	onDefaultImageLoadedCallback: (_: string) => void,
) {
	previewFile(async (imageSrc) => {
		const savedBoardStateMeta = localStorage.getItem("saved-board-state-meta");
		const savedPiecePositions = localStorage.getItem("piece-positions");
		const savedBoard = localStorage.getItem("saved-board");
		if (!savedBoardStateMeta || !savedPiecePositions || !savedBoard)
			return onDefaultImageLoadedCallback(imageSrc);

		const { rowNum, colNum, scaleFactorX, scaleFactorY } =
			deserialize<SavedBoardMeta>(savedBoardStateMeta);

		const piecePositions =
			deserialize<PiecePositionLookup>(savedPiecePositions);

		const savedBoardDeserialized = deserialize<SavedBoard>(savedBoard);

		const board: PieceEntity[][] = savedBoardDeserialized.map((row) => {
			return row.map(({ boundingBox, definitionId, id }) => ({
				boundingBox,
				id,
				definition: pieceDefintionsList.find((def) => def.id === definitionId)!,
			}));
		});
		onLoadedCallback({
			board,
			scaleFactorX,
			imageSrc,
			scaleFactorY,
			piecePositions,
		});
	});
}

interface SaveBoardStateParams {
	imageSrc: string;
	board: PieceEntity[][];
	scaleFactorX: number;
	scaleFactorY: number;
	piecePositions: PiecePositionLookup;
}
export function saveBoardState({
	imageSrc,
	scaleFactorX,
	scaleFactorY,
	board,
	piecePositions,
}: SaveBoardStateParams) {
	console.log({ board });
	localStorage.setItem("saved-image", imageSrc);
	localStorage.setItem(
		"saved-board-state-meta",
		serialize({
			rowNum: board.length,
			colNum: board[0].length,
			scaleFactorX,
			scaleFactorY,
		} satisfies SavedBoardMeta),
	);
	const pieceMeta = new Map<
		number,
		{ boundingBox: PieceEntity["boundingBox"]; definitionId: number }
	>();
	for (const row of board) {
		for (const { id, definition, boundingBox } of row) {
			pieceMeta.set(id, { definitionId: definition.id, boundingBox });
		}
	}
	const savedBoard = board.map((row) =>
		row.map(({ id, definition, boundingBox }) => ({
			id,
			definitionId: definition.id,
			boundingBox,
		})),
	);
	localStorage.setItem("saved-board", serialize(savedBoard));
	localStorage.setItem("piece-positions", serialize(piecePositions));
}
