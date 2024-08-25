import {
	addPieceToGroupBottomConnection,
	addPieceToGroupLeftConnection,
	addPieceToGroupRightConnection,
	addPieceToGroupTopConnection,
} from "./addPieceToGroup";
import { HIT_OFFSET, type HtmlPieceElement } from "./constants";
import { combinePieceGroups } from "./combinePieceGroups";
import type { PieceGroupDivElement } from "./createCombinedUsingConnection";
import {
	checkOverLapOnTop,
	checkOverlapOnRight,
	checkOverlapOnBottom,
	checkOverlapOnLeft,
} from "./overlap";
import { PIECE_DIMENSIONS } from "./pieceDefinitions";
import type { SavedBoard } from "./storeState";
import { checkCollision } from "./utils";

export function findAllPiecesTouchingCombinedDiv(
	combinedPieceDiv: HTMLDivElement,
	hitOffset: number,
) {
	const allPieces =
		document.querySelectorAll<HtmlPieceElement>("div[id^=piece]");
	const piecesInside = [];
	const rect = combinedPieceDiv.getBoundingClientRect();
	for (const element of allPieces) {
		const box = element.getBoundingClientRect();

		const alreadyInCombinedDiv =
			combinedPieceDiv.id === element.parentElement?.id;
		if (alreadyInCombinedDiv) continue;

		if (
			checkCollision(
				{
					top: rect.top,
					right: rect.right,
					bottom: rect.bottom,
					left: rect.left,
				},
				{
					top: box.top - hitOffset,
					right: box.right + hitOffset,
					bottom: box.bottom + hitOffset,
					left: box.left - hitOffset,
				},
			)
		) {
			piecesInside.push(element);
		}
	}
	return piecesInside;
}
interface OnPieceDroppedParams {
	pieceSize: number;
	combinedParentDiv: PieceGroupDivElement;
	savedBoard: SavedBoard;
	boardContainer: HTMLDivElement;
}
export function onPieceGroupDropped({
	pieceSize,
	savedBoard,
	combinedParentDiv: droppedPieceGroupDiv,
	boardContainer,
}: OnPieceDroppedParams) {
	const hitOffsetForEar = (15 * pieceSize) / PIECE_DIMENSIONS + HIT_OFFSET;
	const pieces = findAllPiecesTouchingCombinedDiv(
		droppedPieceGroupDiv,
		hitOffsetForEar,
	);

	for (const pieceToTryDiv of pieces) {
		const pieceToTry = savedBoard
			.flat()
			.find((p) => p.id === Number.parseInt(pieceToTryDiv.dataset.pieceId))!;

		const combinedParentDiv =
			pieceToTryDiv.parentElement as PieceGroupDivElement;
		const hasCombinedParent =
			!!combinedParentDiv &&
			combinedParentDiv?.classList.contains("combined-piece");

		if (hasCombinedParent) {
			const res = combinePieceGroups({
				boardContainer,
				combinedParentDiv,
				droppedPieceGroupDiv,
				hitOffsetForEar,
				pieceToTryDiv,
				pieceSize,
				pieceToTry,
			});
			if ("noOverLap" in res) continue;
			return res;
		}
		const pieceDomRect = pieceToTryDiv.getBoundingClientRect();

		if (pieceToTry.connections.top !== null) {
			const { isOverlapping, wantedPiece } = checkOverLapOnTop({
				connections: pieceToTry.connections,
				pieceDomRect,
				hitOffsetForEar,
			});
			if (isOverlapping) {
				droppedPieceGroupDiv.style.height = `${droppedPieceGroupDiv.getBoundingClientRect().height + pieceSize}px`;
				return addPieceToGroupTopConnection({
					boardContainer,
					combinedParentDiv: droppedPieceGroupDiv,
					pieceDiv: pieceToTryDiv,
					wantedPiece,
				});
			}
		}
		if (pieceToTry.connections.right !== null) {
			const { isOverlapping, wantedPiece } = checkOverlapOnRight({
				connections: pieceToTry.connections,
				pieceDomRect,
				hitOffsetForEar,
			});
			if (isOverlapping) {
				// droppedPieceGroupDiv.style.width = `${droppedPieceGroupDiv.getBoundingClientRect().width + pieceSize}px`;
				return addPieceToGroupRightConnection({
					boardContainer,
					combinedParentDiv: droppedPieceGroupDiv,
					pieceDiv: pieceToTryDiv,
					wantedPiece,
				});
			}
		}
		if (pieceToTry.connections.bottom !== null) {
			const { isOverlapping, wantedPiece } = checkOverlapOnBottom({
				connections: pieceToTry.connections,
				pieceDomRect,
				hitOffsetForEar,
			});
			if (isOverlapping) {
				droppedPieceGroupDiv.style.height = `${droppedPieceGroupDiv.getBoundingClientRect().height + pieceSize}px`;
				droppedPieceGroupDiv.style.top = pieceToTryDiv.style.top;
				return addPieceToGroupBottomConnection({
					boardContainer,
					combinedParentDiv: droppedPieceGroupDiv,
					pieceDiv: pieceToTryDiv,
					wantedPiece,
				});
			}
		}
		if (pieceToTry.connections.left !== null) {
			const { isOverlapping, wantedPiece } = checkOverlapOnLeft({
				connections: pieceToTry.connections,
				pieceDomRect,
				hitOffsetForEar,
			});
			if (isOverlapping) {
				// droppedPieceGroupDiv.style.width = `${droppedPieceGroupDiv.getBoundingClientRect().width + pieceSize}px`;
				return addPieceToGroupLeftConnection({
					boardContainer,
					combinedParentDiv: droppedPieceGroupDiv,
					pieceDiv: pieceToTryDiv,
					wantedPiece,
				});
			}
		}
	}
}
