import {
	addPieceToGroupBottomConnection,
	addPieceToGroupLeftConnection,
	addPieceToGroupRightConnection,
	addPieceToGroupTopConnection,
} from "./addPieceToGroup";
import { HIT_OFFSET, type HtmlPieceElement } from "./constants";
import {
	combineUsingBottomConnection,
	combineUsingLeftConnection,
	combineUsingRightConnection,
	combineUsingTopConnection,
	type PieceGroupDivElement,
} from "./createCombinedUsingConnection";
import type { PieceEntity } from "./makeBoard";
import {
	checkOverLapOnTop,
	checkOverlapOnBottom,
	checkOverlapOnLeft,
	checkOverlapOnRight,
} from "./overlap";
import { PIECE_DIMENSIONS } from "./pieceDefinitions";

export enum PlaceAndCombineResult {
	Combined = 0,
	ExpandedGroup = 1,
	Nothing = 2,
}

export interface ClickIntoPlaceAndCombineParams {
	piece: PieceEntity;
	pieceSize: number;
}

export type CombinedPieceResult = {
	result: PlaceAndCombineResult.Combined;
	newCombinedDiv: PieceGroupDivElement;
	combinedWithPieceId: number;
	id: string;
};

export type ExpandPieceGroupResult = {
	result: PlaceAndCombineResult.ExpandedGroup;
	groupDivId: string;
};
type ReturnType =
	| { result: PlaceAndCombineResult.Nothing }
	| ExpandPieceGroupResult
	| CombinedPieceResult;

export function clickIntoPlaceAndCombineWithGrid({
	piece,
	pieceSize,
}: ClickIntoPlaceAndCombineParams): ReturnType {
	const boardContainer = document.getElementById(
		"board-container",
	) as HTMLDivElement;

	const { pieceDomRect, hitOffsetForEar, pieceDiv } = getCombineParams(
		piece,
		pieceSize,
	);

	if (piece.connections.top !== null) {
		const { isOverlapping, wantedPiece, wantedPieceDomRect, wantedPieceId } =
			checkOverLapOnTop({
				connections: piece.connections,
				pieceDomRect,
				hitOffsetForEar,
			});
		if (isOverlapping) {
			const combinedParentDiv = wantedPiece.parentElement;
			const hasCombinedParent =
				!!combinedParentDiv &&
				combinedParentDiv?.classList.contains("combined-piece");

			if (hasCombinedParent) {
				// TODO:
				// combinedParentDiv.style.height = `${combinedParentDiv.getBoundingClientRect().height + pieceSize}px`;

				return addPieceToGroupTopConnection({
					wantedPiece,
					pieceDiv,
					boardContainer,
					combinedParentDiv,
				});
			}
			return combineUsingTopConnection(
				pieceSize,
				wantedPiece,
				pieceDiv,
				wantedPieceDomRect,
				boardContainer,
				wantedPieceId,
			);
		}
	}
	if (piece.connections.right !== null) {
		const { isOverlapping, wantedPiece, wantedPieceId } = checkOverlapOnRight({
			connections: piece.connections,
			pieceDomRect,
			hitOffsetForEar,
		});
		if (isOverlapping) {
			const combinedParentDiv = wantedPiece.parentElement;
			const hasCombinedParent =
				!!combinedParentDiv &&
				combinedParentDiv?.classList.contains("combined-piece");

			if (hasCombinedParent) {
				// TODO:
				// combinedParentDiv.style.width = `${combinedParentDiv.getBoundingClientRect().width + pieceSize}`;
				combinedParentDiv.style.left = pieceDiv.style.left;
				return addPieceToGroupRightConnection({
					boardContainer,
					combinedParentDiv,
					pieceDiv,
					wantedPiece,
				});
			}
			return combineUsingRightConnection(
				pieceSize,
				pieceDomRect,
				pieceDiv,
				wantedPiece,
				boardContainer,
				wantedPieceId,
			);
		}
	}
	if (piece.connections.bottom !== null) {
		const { isOverlapping, wantedPiece, wantedPieceDomRect, wantedPieceId } =
			checkOverlapOnBottom({
				connections: piece.connections,
				pieceDomRect,
				hitOffsetForEar,
			});
		if (isOverlapping) {
			const combinedParentDiv = wantedPiece.parentElement;
			const hasCombinedParent =
				!!combinedParentDiv &&
				combinedParentDiv?.classList.contains("combined-piece");

			if (hasCombinedParent) {
				// TODO:
				// combinedParentDiv.style.height = `${combinedParentDiv.getBoundingClientRect().height + pieceSize}px`;
				combinedParentDiv.style.top = pieceDiv.style.top;
				return addPieceToGroupBottomConnection({
					boardContainer,
					combinedParentDiv,
					pieceDiv,
					wantedPiece,
				});
			}
			return combineUsingBottomConnection({
				boardContainer,
				pieceDiv,
				pieceSize,
				wantedPiece,
				wantedPieceDomRect,
				wantedPieceId,
			});
		}
	}

	if (piece.connections.left !== null) {
		const { isOverlapping, wantedPiece, wantedPieceDomRect, wantedPieceId } =
			checkOverlapOnLeft({
				connections: piece.connections,
				pieceDomRect,
				hitOffsetForEar,
			});
		if (isOverlapping) {
			const combinedParentDiv = wantedPiece.parentElement;
			const hasCombinedParent =
				!!combinedParentDiv &&
				combinedParentDiv?.classList.contains("combined-piece");

			if (hasCombinedParent) {
				// TODO:
				// combinedParentDiv.style.width = `${combinedParentDiv.getBoundingClientRect().width + pieceSize}`;
				return addPieceToGroupLeftConnection({
					boardContainer,
					combinedParentDiv,
					pieceDiv,
					wantedPiece,
				});
			}
			return combineUsingLeftConnection({
				boardContainer,
				pieceDiv,
				pieceSize,
				wantedPiece,
				wantedPieceDomRect,
				wantedPieceId,
			});
		}
	}
	return { result: PlaceAndCombineResult.Nothing };
}

export function adjustPiecesAndAddToCombined(
	pieceDiv: HtmlPieceElement,
	wantedPiece: HtmlPieceElement,
	boardContainer: HTMLDivElement,
	newCombinedDiv: HTMLDivElement,
) {
	pieceDiv.style.removeProperty("left");
	pieceDiv.style.removeProperty("top");
	pieceDiv.style.removeProperty("z-index");
	pieceDiv.classList.remove("piece");
	pieceDiv.ontouchstart = null;
	pieceDiv.onmousedown = null;
	wantedPiece.style.removeProperty("z-index");
	wantedPiece.style.removeProperty("left");
	wantedPiece.style.removeProperty("top");
	wantedPiece.classList.remove("piece");
	wantedPiece.ontouchstart = null;
	wantedPiece.onmousedown = null;
	// boardContainer.removeChild(wantedPiece);
	// boardContainer.removeChild(pieceDiv);
	newCombinedDiv.appendChild(pieceDiv);
	newCombinedDiv.appendChild(wantedPiece);
}

export function getCombineParams(piece: PieceEntity, pieceSize: number) {
	const pieceDiv = document.getElementById(
		`piece-${piece.id}`,
	) as HtmlPieceElement;

	const pieceDomRect = pieceDiv.getBoundingClientRect();
	const hitOffsetForEar = (15 * pieceSize) / PIECE_DIMENSIONS + HIT_OFFSET;
	return { pieceDomRect, hitOffsetForEar, pieceDiv };
}
