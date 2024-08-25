import type { HtmlPieceElement } from "./constants";
import {
	type CombinedPieceResult,
	PlaceAndCombineResult,
	adjustPiecesAndAddToCombined,
} from "./clickIntoPlaceAndCombineGridApproach";

interface CombineUsingBottomConnectionParams {
	pieceSize: number;
	wantedPiece: HtmlPieceElement;
	pieceDiv: HtmlPieceElement;
	wantedPieceDomRect: DOMRect;
	boardContainer: HTMLDivElement;
	wantedPieceId: number;
}

export function combineUsingTopConnection(
	pieceSize: number,
	wantedPiece: HtmlPieceElement,
	pieceDiv: HtmlPieceElement,
	wantedPieceDomRect: DOMRect,
	boardContainer: HTMLDivElement,
	wantedPieceId: number,
): CombinedPieceResult {
	const { newCombinedDiv, id } = createCombinedPieceDiv(pieceSize);
	const { marginTop, marginLeft } = getMargins(pieceDiv);

	newCombinedDiv.style.top = `${wantedPieceDomRect.top - marginTop}px`;
	newCombinedDiv.style.left = `${wantedPieceDomRect.left - marginLeft}px`;

	// newCombinedDiv.style.height = `${pieceSize * 2}px`;
	// newCombinedDiv.style.width = `${pieceSize}px`;

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
		id,
	};
}

export function combineUsingRightConnection(
	pieceSize: number,
	pieceDomRect: DOMRect,
	pieceDiv: HtmlPieceElement,
	wantedPiece: HtmlPieceElement,
	boardContainer: HTMLDivElement,
	wantedPieceId: number,
): CombinedPieceResult {
	const { newCombinedDiv, id } = createCombinedPieceDiv(pieceSize);
	const { marginTop, marginLeft } = getMargins(pieceDiv);

	newCombinedDiv.style.top = `${pieceDomRect.top - marginTop}px`;
	newCombinedDiv.style.left = `${pieceDomRect.left - marginLeft}px`;

	// newCombinedDiv.style.height = `${pieceSize}px`;
	// newCombinedDiv.style.width = `${pieceSize * 2}px`;

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
		id,
	};
}

export function combineUsingBottomConnection({
	pieceSize,
	wantedPiece,
	pieceDiv,
	boardContainer,
	wantedPieceId,
}: CombineUsingBottomConnectionParams): CombinedPieceResult {
	const { newCombinedDiv, id } = createCombinedPieceDiv(pieceSize);
	const { marginTop, marginLeft } = getMargins(pieceDiv);

	newCombinedDiv.style.top = `${pieceDiv.getBoundingClientRect().top - marginTop}px`;
	newCombinedDiv.style.left = `${pieceDiv.getBoundingClientRect().left - marginLeft}px`;

	// newCombinedDiv.style.height = `${pieceSize * 2}px`;
	// newCombinedDiv.style.width = `${pieceSize}px`;

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
		id,
	};
}

export function combineUsingLeftConnection({
	pieceSize,
	wantedPiece,
	pieceDiv,
	wantedPieceDomRect,
	boardContainer,
	wantedPieceId,
}: CombineUsingBottomConnectionParams): CombinedPieceResult {
	const { newCombinedDiv, id } = createCombinedPieceDiv(pieceSize);
	const { marginTop, marginLeft } = getMargins(pieceDiv);

	newCombinedDiv.style.top = `${wantedPieceDomRect.top - marginTop}px`;
	newCombinedDiv.style.left = `${wantedPieceDomRect.left - marginLeft}px`;

	// newCombinedDiv.style.height = `${pieceSize}px`;
	// newCombinedDiv.style.width = `${pieceSize * 2}px`;

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
	pieceSize: number,
	id: string = crypto.randomUUID(),
) {
	const newCombinedDiv = document.createElement("div") as PieceGroupDivElement;
	newCombinedDiv.classList.add("combined-piece");
	newCombinedDiv.style.gridAutoColumns = `${pieceSize}px`;
	newCombinedDiv.style.gridAutoRows = `${pieceSize}px`;
	newCombinedDiv.style.position = "absolute";
	newCombinedDiv.setAttribute("id", `combine-piece-${id}`);
	newCombinedDiv.setAttribute("data-id", `${id}`);
	newCombinedDiv.style.zIndex = "100";
	return { newCombinedDiv, id };
}
