import { previewFile } from "./previewFile";
import type { PieceEntity } from "./pieceCreator";
import type { BoardCreator, PiecePositionLookup } from "./board";
import { deserialize, serialize } from "./serilizationUtils";

type OnLoadedCallbackParams = Parameters<
	typeof BoardCreator.prototype.cutAndPlacePieces
>[0] & { piecePositions: PiecePositionLookup; board: PieceEntity[][] };

type SavedBoardMeta = {
	rowNum: number;
	colNum: number;
} & Pick<OnLoadedCallbackParams, "scaleFactorX" | "scaleFactorY">;
export async function loadSavedState(
	onLoadedCallback: (_: OnLoadedCallbackParams) => void,
	onDefaultImageLoadedCallback: (_: string) => void,
) {
	previewFile(
		async (imageSrc) => {
			const savedBoardStateMeta = localStorage.getItem(
				"saved-board-state-meta",
			);
			if (!savedBoardStateMeta) return;
			const { rowNum, colNum, scaleFactorX, scaleFactorY } =
				deserialize<SavedBoardMeta>(savedBoardStateMeta);

			const savedPiecePositions = localStorage.getItem("piece-positions");
			if (!savedPiecePositions) return;
			const piecePositions =
				deserialize<PiecePositionLookup>(savedPiecePositions);
			const board = [];
			for (let i = 0; i < rowNum; i++) {
				const row = [];
				for (let j = 0; j < colNum; j++) {
					row.push(
						deserialize(
							localStorage.getItem(`saved-board-state-piece-${i}-${j}`)!,
						),
					);
				}
				board.push(row);
			}
			onLoadedCallback({
				board,
				scaleFactorX,
				imageSrc,
				scaleFactorY,
				piecePositions,
			});
		},
		(imageSrc) => onDefaultImageLoadedCallback(imageSrc),
	);
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
	board.forEach((row, rowIndex) => {
		row.forEach((piece, colIndex) => {
			localStorage.setItem(
				`saved-board-state-piece-${rowIndex}-${colIndex}`,
				serialize(piece),
			);
		});
	});
	localStorage.setItem("piece-positions", serialize(piecePositions));
}
