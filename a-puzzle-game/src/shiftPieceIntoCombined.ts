import type { HtmlPieceElement } from "./constants";
import type { PieceEntity } from "./makeBoard";
import { PIECE_DIMENSIONS, pieceDefinitionLookup } from "./pieceDefinitions";

interface BottomConnectionCalcPosParams {
	combinedParentDiv: HTMLElement;
	wantedPiece: HtmlPieceElement;
	wantedPieceDomRect: DOMRect;
	sides: PieceEntity["definition"]["sides"];
	pieceSize: number;
	pieceDomRect: DOMRect;
}

interface LeftConnectionCalcPosParams extends BottomConnectionCalcPosParams {}

export function topConnectionCalculateShiftXY({
	combinedParentDiv,
	wantedPieceDomRect,
	pieceSize,
	wantedPiece,
	sides,
}: BottomConnectionCalcPosParams) {
	const combinedParentDivRect = combinedParentDiv.getBoundingClientRect();
	let pieceDivLeft = 0;
	const wantedPieceDef = pieceDefinitionLookup.get(
		Number.parseInt(wantedPiece.dataset.definitionId),
	)!;
	if (wantedPieceDef.sides.left === sides.left) {
		pieceDivLeft = wantedPieceDomRect.left - combinedParentDivRect.left;
	} else if (wantedPieceDef.sides.left === "ear") {
		pieceDivLeft = (15 * pieceSize) / PIECE_DIMENSIONS;
	} else {
		pieceDivLeft =
			wantedPieceDomRect.left -
			combinedParentDivRect.left -
			(15 * pieceSize) / PIECE_DIMENSIONS;
	}

	// Should be good :)
	const pieceDivTop =
		wantedPieceDomRect.bottom -
		combinedParentDivRect.top -
		(15 * pieceSize) / PIECE_DIMENSIONS;

	return { pieceDivTop, pieceDivLeft };
}

export function leftConnectionCalcPos({
	combinedParentDiv,
	sides,
	pieceSize,
	wantedPiece,
	wantedPieceDomRect,
}: LeftConnectionCalcPosParams) {
	const combinedParentDivRect = combinedParentDiv.getBoundingClientRect();
	const wantedPieceDef = pieceDefinitionLookup.get(
		Number.parseInt(wantedPiece.dataset.definitionId),
	)!;
	let pieceDivTop = 0;
	if (wantedPieceDef.sides.top === sides.top) {
		pieceDivTop = wantedPieceDomRect.top - combinedParentDivRect.top;
	} else if (wantedPieceDef.sides.top === "ear") {
		pieceDivTop =
			wantedPieceDomRect.top -
			combinedParentDivRect.top +
			(15 * pieceSize) / PIECE_DIMENSIONS;
	} else {
		pieceDivTop =
			wantedPieceDomRect.top -
			combinedParentDivRect.top -
			(15 * pieceSize) / PIECE_DIMENSIONS;
	}
	// Should be fine :)
	const pieceDivLeft =
		wantedPieceDomRect.right -
		combinedParentDivRect.left -
		(15 * pieceSize) / PIECE_DIMENSIONS;
	return { pieceDivLeft, pieceDivTop };
}

export function bottomConnectionCalcPos({
	combinedParentDiv,
	wantedPiece,
	wantedPieceDomRect,
	sides,
	pieceSize,
	pieceDomRect,
}: BottomConnectionCalcPosParams) {
	const combinedParentDivRect = combinedParentDiv.getBoundingClientRect();
	const wantedPieceDef = pieceDefinitionLookup.get(
		Number.parseInt(wantedPiece.dataset.definitionId),
	)!;
	let pieceDivLeft = 0;
	if (wantedPieceDef.sides.left === sides.left) {
		pieceDivLeft = wantedPieceDomRect.left - combinedParentDivRect.left;
	} else if (wantedPieceDef.sides.left === "ear") {
		pieceDivLeft =
			wantedPieceDomRect.left -
			combinedParentDivRect.left +
			(15 * pieceSize) / PIECE_DIMENSIONS;
	} else {
		pieceDivLeft =
			wantedPieceDomRect.left -
			combinedParentDivRect.left -
			(15 * pieceSize) / PIECE_DIMENSIONS;
	}
	// TODO ?
	const pieceDivTop =
		wantedPieceDomRect.top -
		combinedParentDivRect.top -
		pieceDomRect.height +
		(15 * pieceSize) / PIECE_DIMENSIONS;
	return { pieceDivTop, pieceDivLeft };
}

export function rightConnectionCalcPos({
	wantedPieceDomRect,
	combinedParentDiv,
	wantedPiece,
	sides,
	pieceSize,
	pieceDomRect,
}: BottomConnectionCalcPosParams) {
	const combinedParentDivRect = combinedParentDiv.getBoundingClientRect();
	const wantedPieceDef = pieceDefinitionLookup.get(
		Number.parseInt(wantedPiece.dataset.definitionId),
	)!;
	let pieceDivTop = 0;
	if (wantedPieceDef.sides.top === sides.top) {
		pieceDivTop = wantedPieceDomRect.top - combinedParentDivRect.top;
	} else if (wantedPieceDef.sides.top === "ear") {
		pieceDivTop =
			wantedPieceDomRect.top -
			combinedParentDivRect.top +
			(15 * pieceSize) / PIECE_DIMENSIONS;
	} else {
		pieceDivTop =
			wantedPieceDomRect.top -
			combinedParentDivRect.top -
			(15 * pieceSize) / PIECE_DIMENSIONS;
	}

	// Should be good :)
	const pieceDivLeft =
		combinedParentDivRect.left - pieceDomRect.left > 0
			? wantedPieceDomRect.left -
				combinedParentDivRect.left -
				pieceDomRect.width +
				(15 * pieceSize) / PIECE_DIMENSIONS
			: 0;
	return { pieceDivLeft, pieceDivTop };
}

interface AdjustAndAddPieceToCombinedParams {
	pieceDiv: HtmlPieceElement;
	pieceDivTop: number;
	pieceDivLeft: number;
	combinedParentDiv: HTMLElement;
	pieceDomRect: DOMRect;
}

export function adjustAndAddPieceToCombined({
	pieceDiv,
	pieceDivTop,
	pieceDivLeft,
	combinedParentDiv,
	pieceDomRect,
}: AdjustAndAddPieceToCombinedParams) {
	pieceDiv.ontouchstart = null;
	pieceDiv.onmousedown = null;
	const combinedParentDomRect = combinedParentDiv.getBoundingClientRect();
	let newCombinedLeft = combinedParentDomRect.left;
	let newCombinedTop = combinedParentDomRect.top;
	if (pieceDivLeft < 0) {
		const children =
			combinedParentDiv.querySelectorAll<HtmlPieceElement>(".piece");
		for (const child of children) {
			child.style.left = `${child.getBoundingClientRect().left - combinedParentDomRect.left + Math.abs(pieceDivLeft)}px`;
		}
		newCombinedLeft = pieceDomRect.left;
		pieceDivLeft = 0;
	}
	if (pieceDivTop < 0) {
		const children =
			combinedParentDiv.querySelectorAll<HtmlPieceElement>(".piece");
		for (const child of children) {
			child.style.top = `${child.getBoundingClientRect().top - combinedParentDomRect.top + Math.abs(pieceDivTop)}px`;
		}
		newCombinedTop = pieceDomRect.top;
		pieceDivTop = 0;
	}
	pieceDiv.style.top = `${pieceDivTop}px`;
	pieceDiv.style.left = `${pieceDivLeft}px`;
	combinedParentDiv.firstChild!.appendChild(pieceDiv);
	return { newCombinedLeft, newCombinedTop };
}
