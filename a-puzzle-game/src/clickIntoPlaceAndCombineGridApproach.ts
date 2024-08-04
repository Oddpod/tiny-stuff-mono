import {
	PlaceAndCombineResult,
	getCombineParams,
} from "./clickIntoPlaceAndCombine";
import type { HtmlPieceElement } from "./clickPieceInPlace";
import type { PieceEntity } from "./makeBoard";
import {
	checkOverLapOnTop,
	checkOverlapOnBottom,
	checkOverlapOnLeft,
	checkOverlapOnRight,
} from "./overlap";

export interface ClickIntoPlaceAndCombineParams {
	piece: PieceEntity;
	pieceSize: number;
}

type CombinedPieceResult = {
	result: PlaceAndCombineResult.Combined;
	newCombinedDiv: HTMLDivElement;
	combinedWithPieceId: number;
};
type ReturnType =
	| { result: PlaceAndCombineResult.Nothing }
	| {
			result: PlaceAndCombineResult.ExpandedGroup;
			groupDivId: number;
			newCombinedTop: number;
			newCombinedLeft: number;
	  }
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
			const combinedParentDiv = wantedPiece.parentElement?.parentElement;
			const hasCombinedParent =
				!!combinedParentDiv &&
				combinedParentDiv?.id.startsWith("combined-piece");

			if (hasCombinedParent) {
				// TODO:
				return { result: PlaceAndCombineResult.Nothing };
			}
			return combineWithTopConnection(
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
		const { isOverlapping, wantedPiece, wantedPieceDomRect, wantedPieceId } =
			checkOverlapOnRight({
				connections: piece.connections,
				pieceDomRect,
				hitOffsetForEar,
			});
		if (isOverlapping) {
			const newCombinedDiv = createCombinedPieceDiv(pieceSize);
			console.log({ pieceDomRect });
			const marginTop = pieceDiv.style.marginTop
				? Number.parseInt(pieceDiv.style.marginTop.slice(0, -2))
				: 0;
			const marginLeft = pieceDiv.style.marginLeft
				? Number.parseInt(pieceDiv.style.marginLeft.slice(0, -2))
				: 0;

			newCombinedDiv.style.top = `${pieceDomRect.top - marginTop}px`;
			newCombinedDiv.style.left = `${pieceDomRect.left - marginLeft}px`;
			console.log({ marginLeft, marginTop });

			newCombinedDiv.style.height = `${pieceSize * 2}px`;
			newCombinedDiv.style.width = `${pieceSize}px`;
			newCombinedDiv.style.zIndex = "100";
			wantedPiece.style.gridRowStart = "1";
			wantedPiece.style.gridColumnStart = "2";
			pieceDiv.style.gridRowStart = "1";
			pieceDiv.style.gridColumnStart = "1";
			adjustPiecesAndAddToCombined(
				pieceDiv,
				wantedPiece,
				boardContainer,
				newCombinedDiv,
			);
			boardContainer.appendChild(newCombinedDiv);
			return {
				result: PlaceAndCombineResult.Combined,
				newCombinedDiv,
				combinedWithPieceId: wantedPieceId,
			};
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
			const newCombinedDiv = createCombinedPieceDiv(pieceSize);
			console.log({ pieceDomRect });
			const marginTop = pieceDiv.style.marginTop
				? Number.parseInt(pieceDiv.style.marginTop.slice(0, -2))
				: 0;
			const marginLeft = pieceDiv.style.marginLeft
				? Number.parseInt(pieceDiv.style.marginLeft.slice(0, -2))
				: 0;

			newCombinedDiv.style.top = `${pieceDomRect.top - marginTop}px`;
			newCombinedDiv.style.left = `${pieceDomRect.left - marginLeft}px`;
			console.log({
				marginLeft,
				marginTop,
				newTop: pieceDomRect.top - marginLeft,
				newLeft: pieceDomRect.left - marginTop,
			});

			newCombinedDiv.style.height = `${pieceSize * 2}px`;
			newCombinedDiv.style.width = `${pieceSize}px`;
			newCombinedDiv.style.zIndex = "100";
			wantedPiece.style.gridRowStart = "2";
			wantedPiece.style.gridColumnStart = "1";
			pieceDiv.style.gridRowStart = "1";
			pieceDiv.style.gridColumnStart = "1";
			adjustPiecesAndAddToCombined(
				pieceDiv,
				wantedPiece,
				boardContainer,
				newCombinedDiv,
			);
			boardContainer.appendChild(newCombinedDiv);
			return {
				result: PlaceAndCombineResult.Combined,
				newCombinedDiv,
				combinedWithPieceId: wantedPieceId,
			};
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
			const newCombinedDiv = createCombinedPieceDiv(pieceSize);
			console.log({ pieceDomRect });
			const marginTop = pieceDiv.style.marginTop
				? Number.parseInt(pieceDiv.style.marginTop.slice(0, -2))
				: 0;
			const marginLeft = pieceDiv.style.marginLeft
				? Number.parseInt(pieceDiv.style.marginLeft.slice(0, -2))
				: 0;

			newCombinedDiv.style.top = `${wantedPieceDomRect.top - marginTop}px`;
			newCombinedDiv.style.left = `${wantedPieceDomRect.left - marginLeft}px`;
			console.log({ marginLeft, marginTop });

			newCombinedDiv.style.height = `${pieceSize * 2}px`;
			newCombinedDiv.style.width = `${pieceSize}px`;
			newCombinedDiv.style.zIndex = "100";
			wantedPiece.style.gridRowStart = "1";
			wantedPiece.style.gridColumnStart = "1";
			pieceDiv.style.gridRowStart = "1";
			pieceDiv.style.gridColumnStart = "2";
			adjustPiecesAndAddToCombined(
				pieceDiv,
				wantedPiece,
				boardContainer,
				newCombinedDiv,
			);
			boardContainer.appendChild(newCombinedDiv);
			return {
				result: PlaceAndCombineResult.Combined,
				newCombinedDiv,
				combinedWithPieceId: wantedPieceId,
			};
		}
	}
	return { result: PlaceAndCombineResult.Nothing };
}

function combineWithTopConnection(
	pieceSize: number,
	wantedPiece: HtmlPieceElement,
	pieceDiv: HtmlPieceElement,
	wantedPieceDomRect: DOMRect,
	boardContainer: HTMLDivElement,
	wantedPieceId: number,
): CombinedPieceResult {
	const newCombinedDiv = createCombinedPieceDiv(pieceSize);
	const marginTop = wantedPiece.style.marginTop
		? Number.parseInt(wantedPiece.style.marginTop.slice(0, -2))
		: 0;
	const marginLeft = pieceDiv.style.marginLeft
		? Number.parseInt(pieceDiv.style.marginLeft.slice(0, -2))
		: 0;

	newCombinedDiv.style.top = `${wantedPieceDomRect.top - marginTop}px`;
	newCombinedDiv.style.left = `${wantedPieceDomRect.left - marginLeft}px`;

	newCombinedDiv.style.height = `${pieceSize * 2}px`;
	newCombinedDiv.style.width = `${pieceSize}px`;
	newCombinedDiv.style.zIndex = "100";
	wantedPiece.style.gridRowStart = "1";
	wantedPiece.style.gridColumnStart = "1";
	pieceDiv.style.gridRowStart = "2";
	pieceDiv.style.gridColumnStart = "1";
	adjustPiecesAndAddToCombined(
		pieceDiv,
		wantedPiece,
		boardContainer,
		newCombinedDiv,
	);
	boardContainer.appendChild(newCombinedDiv);
	return {
		result: PlaceAndCombineResult.Combined,
		newCombinedDiv,
		combinedWithPieceId: wantedPieceId,
	};
}

function createCombinedPieceDiv(pieceSize: number) {
	const newCombinedDiv = document.createElement("div");
	newCombinedDiv.classList.add("combined-piece");
	newCombinedDiv.style.gridAutoColumns = `${pieceSize}px`;
	newCombinedDiv.style.gridAutoRows = `${pieceSize}px`;
	newCombinedDiv.style.position = "absolute";
	return newCombinedDiv;
}

function adjustPiecesAndAddToCombined(
	pieceDiv: HtmlPieceElement,
	wantedPiece: HtmlPieceElement,
	boardContainer: HTMLDivElement,
	newCombinedDiv: HTMLDivElement,
) {
	pieceDiv.style.removeProperty("left");
	pieceDiv.style.removeProperty("top");
	pieceDiv.style.removeProperty("z-index");
	pieceDiv.classList.remove("piece");
	wantedPiece.style.removeProperty("z-index");
	wantedPiece.style.removeProperty("left");
	wantedPiece.style.removeProperty("top");
	wantedPiece.classList.remove("piece");
	wantedPiece.ontouchstart = null;
	wantedPiece.onmousedown = null;
	pieceDiv.ontouchstart = null;
	pieceDiv.onmousedown = null;
	boardContainer.removeChild(wantedPiece);
	boardContainer.removeChild(pieceDiv);
	newCombinedDiv.appendChild(pieceDiv);
	newCombinedDiv.appendChild(wantedPiece);
}
