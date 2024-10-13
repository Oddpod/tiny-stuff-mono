import { Effect } from "effect";
import type { PieceDimensions, PiecePositionLookup } from "./board";
import { boardContainer } from "./resumePuzzleProgram";
import { createCombinedPieceDiv } from "./createCombinedUsingConnection";
import { PieceCutter, type PuzzleDimensions } from "./cutPiece";
import { pieceDefinitionLookup } from "./pieceDefinitions";
import type { CombinedPiecePositionLookup, SavedBoard } from "./storeState";
import type { PieceDragger } from "./makePieceDraggable";
import { PieceGroupCallbackHandler } from "./onPieceGroupMouseUpCallback";
import { MAX_DIM_XY } from "./constants";

interface CreateAndPlacePieceGroupsParams {
	combinedPiecesLookup: CombinedPiecePositionLookup;
	pieceDimensions: PieceDimensions;
	savedBoard: SavedBoard;
	image: HTMLImageElement;
	puzzleDimensions: PuzzleDimensions;
	pieceDragger: ReturnType<typeof PieceDragger>;
	piecePositions: PiecePositionLookup;
}

export function* createAndPlacePieceGroups({
	combinedPiecesLookup,
	pieceDimensions,
	savedBoard,
	image,
	puzzleDimensions,
	pieceDragger,
	piecePositions,
}: CreateAndPlacePieceGroupsParams) {
	for (const [combinedPieceId, combinedPieceData] of combinedPiecesLookup) {
		const { newCombinedDiv, id: groupId } = createCombinedPieceDiv(
			pieceDimensions,
			combinedPieceId,
		);
		newCombinedDiv.style.left = `${combinedPieceData.position.left}px`;
		newCombinedDiv.style.top = `${combinedPieceData.position.top}px`;
		const { piecesToAppend, minRow, minCol } = yield* cutPiecesForGroup({
			combinedPieceData,
			savedBoard,
			image,
			pieceDimensions,
			puzzleDimensions,
		});

		const onPieceGroupMouseUpCallback = PieceGroupCallbackHandler({
			boardContainer,
			pieceDragger,
			pieceDimensions,
			savedBoard,
		});
		for (const {
			pieceDiv,
			coords: { row, col },
		} of piecesToAppend) {
			pieceDragger.makePieceDraggable({
				divElement: newCombinedDiv,
				onMouseUpCallback: (p) =>
					onPieceGroupMouseUpCallback({
						...p,
						combinedParentDiv: newCombinedDiv,
						combinedPiecesLookup,
						groupId,
						piecePositions,
					}),
			});
			pieceDiv.style.gridRowStart = (row + 1 - minRow).toString();
			pieceDiv.style.gridColumnStart = (col + 1 - minCol).toString();
			newCombinedDiv.appendChild(pieceDiv);
		}
		boardContainer.appendChild(newCombinedDiv);
	}
}

interface CutPiecesForGroupParams {
	combinedPieceData: {
		pieceIds: Set<number>;
		position: { top: number; left: number };
	};
	savedBoard: SavedBoard;
	image: HTMLImageElement;
	pieceDimensions: PieceDimensions;
	puzzleDimensions: PuzzleDimensions;
}

function* cutPiecesForGroup({
	combinedPieceData,
	savedBoard,
	image,
	pieceDimensions,
	puzzleDimensions,
}: CutPiecesForGroupParams) {
	// Start at a higher number than puzzle dimensions
	let minCol = MAX_DIM_XY + 1;
	let minRow = MAX_DIM_XY + 1;
	const piecesToAppend = [];
	const cutPiece = PieceCutter({ image, pieceDimensions, puzzleDimensions });
	for (const pieceId of combinedPieceData.pieceIds) {
		const piece = savedBoard.flat().find((p) => p.id === pieceId)!;
		const definition = pieceDefinitionLookup.get(piece.definitionId)!;
		const newPiece = yield* Effect.promise(() =>
			cutPiece({ ...piece, definition }),
		);
		newPiece.id = `piece-${piece.id}`;
		newPiece.removeAttribute("class");

		minCol = Math.min(piece.coords.col, minCol);
		minRow = Math.min(piece.coords.row, minRow);
		piecesToAppend.push({
			pieceDiv: newPiece,
			coords: piece.coords,
		});
	}
	return { piecesToAppend, minRow, minCol };
}
