import {
	addPieceToGroupBottomConnection,
	addPieceToGroupLeftConnection,
	addPieceToGroupRightConnection,
	addPieceToGroupTopConnection,
} from "./addPieceToGroup";
import type { PieceDimensions } from "./board";
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
	pieceDimensions: PieceDimensions;
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

type FindCombinedParentReturn =
	| {
			hasCombinedParent: true;
			combinedParentDiv: HTMLElement;
	  }
	| { hasCombinedParent: false; combinedParentDiv: null };

function findCombinedParent(
	pieceElement: HtmlPieceElement,
): FindCombinedParentReturn {
	const combinedParentDiv = pieceElement.parentElement;
	const hasCombinedParent =
		!!combinedParentDiv &&
		combinedParentDiv?.classList.contains("combined-piece");
	if (!hasCombinedParent) {
		return { hasCombinedParent: false, combinedParentDiv: null };
	}
	return { combinedParentDiv, hasCombinedParent };
}

export function clickIntoPlaceAndCombineWithGrid({
	piece,
	pieceDimensions,
}: ClickIntoPlaceAndCombineParams): ReturnType {
	const { pieceDomRect, hitOffsetForEar, pieceDiv } = getCombineParams(
		piece,
		pieceDimensions,
	);

	if (piece.connections.top !== null) {
		const { isOverlapping, wantedPiece, wantedPieceDomRect, wantedPieceId } =
			checkOverLapOnTop({
				connections: piece.connections,
				pieceDomRect,
				hitOffsetForEar,
			});
		if (isOverlapping) {
			const { combinedParentDiv, hasCombinedParent } =
				findCombinedParent(wantedPiece);

			if (hasCombinedParent) {
				return addPieceToGroupTopConnection({
					wantedPiece,
					pieceDiv,
					combinedParentDiv,
				});
			}
			return combineUsingTopConnection({
				pieceDimensions,
				wantedPiece,
				pieceDiv,
				wantedPieceDomRect,
				wantedPieceId,
			});
		}
	}
	if (piece.connections.right !== null) {
		const { isOverlapping, wantedPiece, wantedPieceId } = checkOverlapOnRight({
			connections: piece.connections,
			pieceDomRect,
			hitOffsetForEar,
		});
		if (isOverlapping) {
			const { combinedParentDiv, hasCombinedParent } =
				findCombinedParent(wantedPiece);

			if (hasCombinedParent) {
				combinedParentDiv.style.top = `${Math.min(pieceDomRect.top, combinedParentDiv.getBoundingClientRect().top)}px`;
				combinedParentDiv.style.left = `${Math.min(pieceDomRect.left, combinedParentDiv.getBoundingClientRect().left)}px`;
				return addPieceToGroupRightConnection({
					combinedParentDiv,
					pieceDiv,
					wantedPiece,
				});
			}
			return combineUsingRightConnection({
				pieceDimensions,
				pieceDomRect,
				pieceDiv,
				wantedPiece,
				wantedPieceId,
			});
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
			const { combinedParentDiv, hasCombinedParent } =
				findCombinedParent(wantedPiece);

			if (hasCombinedParent) {
				combinedParentDiv.style.top = `${Math.min(pieceDomRect.top, combinedParentDiv.getBoundingClientRect().top)}px`;
				combinedParentDiv.style.left = `${Math.min(pieceDomRect.left, combinedParentDiv.getBoundingClientRect().left)}px`;
				return addPieceToGroupBottomConnection({
					combinedParentDiv,
					pieceDiv,
					wantedPiece,
				});
			}
			return combineUsingBottomConnection({
				pieceDiv,
				pieceDimensions,
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
			const { combinedParentDiv, hasCombinedParent } =
				findCombinedParent(wantedPiece);

			if (hasCombinedParent) {
				return addPieceToGroupLeftConnection({
					combinedParentDiv,
					pieceDiv,
					wantedPiece,
				});
			}
			return combineUsingLeftConnection({
				pieceDiv,
				pieceDimensions,
				wantedPiece,
				wantedPieceDomRect,
				wantedPieceId,
			});
		}
	}
	return { result: PlaceAndCombineResult.Nothing };
}

interface AdjustPiecesAndAddToCombinedParams {
	pieceDiv: HtmlPieceElement;
	wantedPiece: HtmlPieceElement;
	newCombinedDiv: HTMLDivElement;
}

export function adjustPiecesAndAddToCombined({
	pieceDiv,
	wantedPiece,
	newCombinedDiv,
}: AdjustPiecesAndAddToCombinedParams) {
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
	newCombinedDiv.appendChild(pieceDiv);
	newCombinedDiv.appendChild(wantedPiece);
}

export function getCombineParams(
	piece: PieceEntity,
	{ pieceHeight, pieceWidth }: PieceDimensions,
) {
	const pieceDiv = document.getElementById(
		`piece-${piece.id}`,
	) as HtmlPieceElement;

	const pieceDomRect = pieceDiv.getBoundingClientRect();
	const hitOffsetForEar =
		(15 * Math.min(pieceHeight, pieceWidth)) / PIECE_DIMENSIONS + HIT_OFFSET;
	return { pieceDomRect, hitOffsetForEar, pieceDiv };
}
