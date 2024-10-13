import { COMBINED_PIECE_ZINDEX, type HtmlPieceElement } from "./constants";
import {
	type CombinedPieceResult,
	PlaceAndCombineResult,
	adjustPiecesAndAddToCombined,
} from "./clickIntoPlaceAndCombineGridApproach";
import type { PieceDimensions } from "./board";

interface CombineUsingBottomConnectionParams {
	pieceDimensions: PieceDimensions;
	wantedPiece: HtmlPieceElement;
	pieceDiv: HtmlPieceElement;
	wantedPieceDomRect: DOMRect;
	wantedPieceId: number;
}

export function combineUsingTopConnection({
	pieceDimensions,
	wantedPiece,
	pieceDiv,
	wantedPieceDomRect,
	wantedPieceId,
}: CombineUsingBottomConnectionParams): CombinedPieceResult {
	const { newCombinedDiv, id } = createCombinedPieceDiv(pieceDimensions);
	const { marginTop, marginLeft } = getMargins(pieceDiv);

	newCombinedDiv.style.top = `${wantedPieceDomRect.top - marginTop}px`;
	newCombinedDiv.style.left = `${wantedPieceDomRect.left - marginLeft}px`;

	wantedPiece.style.gridRowStart = "1";
	wantedPiece.style.gridColumnStart = "1";
	pieceDiv.style.gridRowStart = "2";
	pieceDiv.style.gridColumnStart = "1";
	adjustPiecesAndAddToCombined({
		pieceDiv,
		wantedPiece,
		newCombinedDiv,
	});

	return {
		result: PlaceAndCombineResult.Combined,
		newCombinedDiv,
		combinedWithPieceId: wantedPieceId,
		id,
	};
}

interface CombineUsingRightConnection {
	pieceDimensions: PieceDimensions;
	pieceDomRect: DOMRect;
	pieceDiv: HtmlPieceElement;
	wantedPiece: HtmlPieceElement;
	wantedPieceId: number;
}
export function combineUsingRightConnection({
	pieceDimensions,
	pieceDomRect,
	pieceDiv,
	wantedPiece,
	wantedPieceId,
}: CombineUsingRightConnection): CombinedPieceResult {
	const { newCombinedDiv, id } = createCombinedPieceDiv(pieceDimensions);
	const { marginTop, marginLeft } = getMargins(pieceDiv);

	newCombinedDiv.style.top = `${pieceDomRect.top - marginTop}px`;
	newCombinedDiv.style.left = `${pieceDomRect.left - marginLeft}px`;

	wantedPiece.style.gridRowStart = "1";
	wantedPiece.style.gridColumnStart = "2";
	pieceDiv.style.gridRowStart = "1";
	pieceDiv.style.gridColumnStart = "1";
	adjustPiecesAndAddToCombined({
		pieceDiv,
		wantedPiece,
		newCombinedDiv,
	});
	return {
		result: PlaceAndCombineResult.Combined,
		newCombinedDiv,
		combinedWithPieceId: wantedPieceId,
		id,
	};
}

export function combineUsingBottomConnection({
	pieceDimensions,
	wantedPiece,
	pieceDiv,
	wantedPieceId,
}: CombineUsingBottomConnectionParams): CombinedPieceResult {
	const { newCombinedDiv, id } = createCombinedPieceDiv(pieceDimensions);
	const { marginTop, marginLeft } = getMargins(pieceDiv);

	newCombinedDiv.style.top = `${pieceDiv.getBoundingClientRect().top - marginTop}px`;
	newCombinedDiv.style.left = `${pieceDiv.getBoundingClientRect().left - marginLeft}px`;

	wantedPiece.style.gridRowStart = "2";
	wantedPiece.style.gridColumnStart = "1";
	pieceDiv.style.gridRowStart = "1";
	pieceDiv.style.gridColumnStart = "1";
	adjustPiecesAndAddToCombined({
		pieceDiv,
		wantedPiece,
		newCombinedDiv,
	});
	return {
		result: PlaceAndCombineResult.Combined,
		newCombinedDiv,
		combinedWithPieceId: wantedPieceId,
		id,
	};
}

export function combineUsingLeftConnection({
	pieceDimensions,
	wantedPiece,
	pieceDiv,
	wantedPieceDomRect,
	wantedPieceId,
}: CombineUsingBottomConnectionParams): CombinedPieceResult {
	const { newCombinedDiv, id } = createCombinedPieceDiv(pieceDimensions);
	const { marginTop, marginLeft } = getMargins(pieceDiv);

	newCombinedDiv.style.top = `${wantedPieceDomRect.top - marginTop}px`;
	newCombinedDiv.style.left = `${wantedPieceDomRect.left - marginLeft}px`;

	wantedPiece.style.gridRowStart = "1";
	wantedPiece.style.gridColumnStart = "1";
	pieceDiv.style.gridRowStart = "1";
	pieceDiv.style.gridColumnStart = "2";
	adjustPiecesAndAddToCombined({
		pieceDiv,
		wantedPiece,
		newCombinedDiv,
	});

	return {
		result: PlaceAndCombineResult.Combined,
		newCombinedDiv,
		combinedWithPieceId: wantedPieceId,
		id,
	};
}

function getMargins(pieceDiv: HtmlPieceElement) {
	const marginTop = pieceDiv.style.marginTop
		? Number.parseInt(pieceDiv.style.marginTop.slice(0, -2))
		: 0;
	const marginLeft = pieceDiv.style.marginLeft
		? Number.parseInt(pieceDiv.style.marginLeft.slice(0, -2))
		: 0;
	return { marginTop, marginLeft };
}

export interface PieceGroupDivElement extends HTMLDivElement {
	dataset: {
		id: string;
	};
}
export function createCombinedPieceDiv(
	{ pieceHeight, pieceWidth }: PieceDimensions,
	id: string = crypto.randomUUID(),
) {
	const newCombinedDiv = document.createElement("div") as PieceGroupDivElement;
	newCombinedDiv.classList.add("combined-piece");
	newCombinedDiv.style.gridAutoColumns = `${pieceWidth}px`;
	newCombinedDiv.style.gridAutoRows = `${pieceHeight}px`;
	newCombinedDiv.style.position = "absolute";
	newCombinedDiv.setAttribute("id", `combine-piece-${id}`);
	newCombinedDiv.setAttribute("data-id", `${id}`);
	newCombinedDiv.style.zIndex = COMBINED_PIECE_ZINDEX;
	return { newCombinedDiv, id };
}
