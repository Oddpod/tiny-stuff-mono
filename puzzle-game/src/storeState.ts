import { previewFile } from "./previewFile";
import type { PieceEntity } from "./pieceCreator";
import type { BoardCreator } from "./board";

type OnLoadedCallbackParams = Parameters<
	ReturnType<typeof BoardCreator>["cutAndPlacePieces"]
>[0];

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
			const { rowNum, colNum, scaleFactorX, scaleFactorY } = JSON.parse(
				savedBoardStateMeta,
			) as SavedBoardMeta;
			const board = [];
			for (let i = 0; i < rowNum; i++) {
				const row = [];
				for (let j = 0; j < colNum; j++) {
					row.push(
						JSON.parse(
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
}
export function saveBoardState({
	imageSrc,
	scaleFactorX,
	scaleFactorY,
	board,
}: SaveBoardStateParams) {
	localStorage.setItem("saved-image", imageSrc);
	localStorage.setItem(
		"saved-board-state-meta",
		JSON.stringify({
			rowNum: board.length,
			colNum: board[1].length,
			scaleFactorX,
			scaleFactorY,
		} satisfies SavedBoardMeta),
	);
	board.forEach((row, rowIndex) => {
		row.forEach((piece, colIndex) => {
			localStorage.setItem(
				`saved-board-state-piece-${rowIndex}-${colIndex}`,
				JSON.stringify(piece),
			);
		});
	});
}
