import type { PieceDimensions, PiecePositionLookup } from "./board";
import type { PieceGroupDivElement } from "./createCombinedUsingConnection";
import type { PieceDragger } from "./makePieceDraggable";
import { onPieceGroupDropped } from "./onPieceGroupDropped";
import {
	savePiecePositions,
	type CombinedPiecePositionLookup,
	type SavedBoard,
} from "./storeState";

interface PieceGroupCallbackHandlerParams {
	pieceDragger: ReturnType<typeof PieceDragger>;
	boardContainer: HTMLDivElement;
	savedBoard: SavedBoard;
	pieceDimensions: PieceDimensions;
}

interface OnPieceGroupMouseUpCallbackParams {
	left: number;
	top: number;
	combinedParentDiv: PieceGroupDivElement;
	combinedPiecesLookup: CombinedPiecePositionLookup;
	groupId: string;
	piecePositions: PiecePositionLookup;
}
export function PieceGroupCallbackHandler({
	pieceDragger,
	boardContainer,
	pieceDimensions,
	savedBoard,
}: PieceGroupCallbackHandlerParams) {
	const onPieceGroupMouseUpCallback = ({
		left,
		top,
		combinedParentDiv,
		combinedPiecesLookup,
		piecePositions,
		groupId,
	}: OnPieceGroupMouseUpCallbackParams) => {
		const result = onPieceGroupDropped({
			boardContainer,
			savedBoard,
			combinedParentDiv,
			pieceDimensions,
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
				onMouseUpCallback: (p) =>
					onPieceGroupMouseUpCallback({
						...p,
						combinedParentDiv,
						combinedPiecesLookup,
						groupId: newCombinedDivId,
						piecePositions,
					}),
			});

			savePiecePositions(piecePositions, combinedPiecesLookup);
			// TODO: Check if puzzle is finished
		} else {
			const combinedPieceData = combinedPiecesLookup.get(groupId)!;
			combinedPieceData.position = { left, top };
			savePiecePositions(piecePositions, combinedPiecesLookup);
		}
	};
	return onPieceGroupMouseUpCallback;
}
