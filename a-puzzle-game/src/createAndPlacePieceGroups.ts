import { Effect } from "effect";
import type { PiecePositionLookup } from "./board";
import { boardContainer } from "./boardUsingEffect";
import { createCombinedPieceDiv } from "./createCombinedUsingConnection";
import { cutPiece } from "./cutPiece";
import { onPieceGroupDropped } from "./onPieceGroupDropped";
import { pieceDefinitionLookup } from "./pieceDefintions";
import {
	type CombinedPiecePositionLookup,
	type SavedBoard,
	savePiecePositions,
} from "./storeState";

interface CreateAndPlacePieceGroupsParams {
	combinedPiecesLookup: CombinedPiecePositionLookup;
	pieceSize: number;
	savedBoard: SavedBoard;
	image: HTMLImageElement;
	boardHeight: number;
	boardWidth: number;
	pieceDragger: {
		makePieceDraggable: ({
			divElement,
			onMouseUpCallback,
		}: import("c:/Projects/tiny-stuff-mono/a-puzzle-game/src/makePieceDraggable").MakePieceDraggableParams) => void;
	};
	piecePositions: PiecePositionLookup;
}

export function* createAndPlacePieceGroups({
	combinedPiecesLookup,
	pieceSize,
	savedBoard,
	image,
	boardHeight,
	boardWidth,
	pieceDragger,
	piecePositions,
}: CreateAndPlacePieceGroupsParams) {
	for (const [combinedPieceId, combinedPieceData] of combinedPiecesLookup) {
		const { newCombinedDiv, id: groupId } = createCombinedPieceDiv(
			pieceSize,
			combinedPieceId,
		);
		newCombinedDiv.style.left = `${combinedPieceData.position.left}px`;
		newCombinedDiv.style.top = `${combinedPieceData.position.top}px`;
		// Start at a higher number than puzzle dimensions
		let minCol = 10000;
		let minRow = 10000;
		const piecesToAppend = [];
		for (const pieceId of combinedPieceData.pieceIds) {
			const piece = savedBoard.flat().find((p) => p.id === pieceId)!;
			const definition = pieceDefinitionLookup.get(piece.definitionId)!;
			const newPiece = yield* Effect.promise(() =>
				cutPiece({
					piece: { ...piece, definition },
					image,
					pieceSize,
					boardHeight,
					boardWidth,
				}),
			);
			newPiece.id = `piece-${piece.id}`;
			newPiece.setAttribute("data-definition-id", definition.id.toString());
			newPiece.removeAttribute("class");

			minCol = Math.min(piece.coords.col, minCol);
			minRow = Math.min(piece.coords.row, minRow);
			piecesToAppend.push({
				pieceDiv: newPiece,
				coords: piece.coords,
				piece: { ...piece, definition },
			});
		}

		for (const {
			pieceDiv,
			coords: { row, col },
			piece,
		} of piecesToAppend) {
			const onPieceGroupMouseUpCallback = ({
				left,
				top,
			}: { left: number; top: number }) => {
				// TODO: refactor into own method
				const result = onPieceGroupDropped({
					boardContainer,
					pieceDragger,
					savedBoard,
					groupId,
					combinedParentDiv: newCombinedDiv,
					piece,
					combinedPiecesLookup,
					pieceSize,
				});
				if (!!result && "mergedGroups" in result) {
					const { newCombinedDiv, removedIds, newCombinedDivId } = result;
					const ids1 = combinedPiecesLookup.get(removedIds[0])!.pieceIds;
					const ids2 = combinedPiecesLookup.get(removedIds[1])!.pieceIds;

					combinedPiecesLookup.set(newCombinedDivId, {
						pieceIds: new Set([...ids1, ...ids2]),
						position: { left, top },
					});
					combinedPiecesLookup.delete(removedIds[0]);
					combinedPiecesLookup.delete(removedIds[1]);
					pieceDragger.makePieceDraggable({
						divElement: newCombinedDiv,
						onMouseUpCallback: onPieceGroupMouseUpCallback,
					});

					savePiecePositions(piecePositions, combinedPiecesLookup);
					// TODO: Check if puzzle is finished
				} else {
					const combinedPieceData = combinedPiecesLookup.get(groupId)!;
					combinedPieceData.position = { left, top };
					savePiecePositions(piecePositions, combinedPiecesLookup);
				}
			};

			pieceDragger.makePieceDraggable({
				divElement: newCombinedDiv,
				onMouseUpCallback: onPieceGroupMouseUpCallback,
			});
			pieceDiv.style.gridRowStart = (row + 1 - minRow).toString();
			pieceDiv.style.gridColumnStart = (col + 1 - minCol).toString();
			newCombinedDiv.appendChild(pieceDiv);
		}
		boardContainer.appendChild(newCombinedDiv);
	}
}
