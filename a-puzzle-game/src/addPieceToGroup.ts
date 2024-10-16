import type { HtmlPieceElement } from "./constants";
import {
	PlaceAndCombineResult,
	type ExpandPieceGroupResult,
} from "./clickIntoPlaceAndCombineGridApproach";

interface AddPieceToGroupParams {
	wantedPiece: HtmlPieceElement;
	pieceDiv: HtmlPieceElement;
	combinedParentDiv: HTMLElement;
}

export function addPieceToGroupTopConnection({
	wantedPiece,
	pieceDiv,
	combinedParentDiv,
}: AddPieceToGroupParams): ExpandPieceGroupResult {
	const gridRowStart = +wantedPiece.style.gridRowStart + 1;
	pieceDiv.style.gridRowStart = gridRowStart.toString();
	pieceDiv.style.gridColumnStart = wantedPiece.style.gridColumnStart;
	adjustPieceAndAddToGroup(pieceDiv, combinedParentDiv);

	return {
		result: PlaceAndCombineResult.ExpandedGroup,
		groupDivId: combinedParentDiv.dataset.id!,
	};
}

export function addPieceToGroupRightConnection({
	wantedPiece,
	pieceDiv,

	combinedParentDiv,
}: AddPieceToGroupParams): ExpandPieceGroupResult {
	let gridColumnStart = +wantedPiece.style.gridColumnStart - 1;
	if (gridColumnStart <= 0) {
		// Shove all pieces in group right
		for (const piece of combinedParentDiv.children) {
			const pieceElement = piece as HtmlPieceElement;
			pieceElement.style.gridColumnStart = (
				+pieceElement.style.gridColumnStart + 1
			).toString();
		}
		gridColumnStart = 1;
	}
	pieceDiv.style.gridRowStart = wantedPiece.style.gridRowStart;
	pieceDiv.style.gridColumnStart = gridColumnStart.toString();
	adjustPieceAndAddToGroup(pieceDiv, combinedParentDiv);

	return {
		result: PlaceAndCombineResult.ExpandedGroup,
		groupDivId: combinedParentDiv.dataset.id!,
	};
}

export function addPieceToGroupBottomConnection({
	wantedPiece,
	pieceDiv,
	combinedParentDiv,
}: AddPieceToGroupParams): ExpandPieceGroupResult {
	let gridRowStart = +wantedPiece.style.gridRowStart - 1;
	if (gridRowStart <= 0) {
		// Shove all pieces in group down
		for (const piece of combinedParentDiv.children) {
			const pieceElement = piece as HtmlPieceElement;
			pieceElement.style.gridRowStart = (
				+pieceElement.style.gridRowStart + 1
			).toString();
			gridRowStart = 1;
		}
	}
	pieceDiv.style.gridRowStart = gridRowStart.toString();
	pieceDiv.style.gridColumnStart = wantedPiece.style.gridColumnStart;
	adjustPieceAndAddToGroup(pieceDiv, combinedParentDiv);

	return {
		result: PlaceAndCombineResult.ExpandedGroup,
		groupDivId: combinedParentDiv.dataset.id!,
	};
}

export function addPieceToGroupLeftConnection({
	wantedPiece,
	pieceDiv,
	combinedParentDiv,
}: AddPieceToGroupParams): ExpandPieceGroupResult {
	const gridColumnStart = +wantedPiece.style.gridColumnStart + 1;
	pieceDiv.style.gridRowStart = wantedPiece.style.gridRowStart;
	pieceDiv.style.gridColumnStart = gridColumnStart.toString();
	adjustPieceAndAddToGroup(pieceDiv, combinedParentDiv);

	return {
		result: PlaceAndCombineResult.ExpandedGroup,
		groupDivId: combinedParentDiv.dataset.id!,
	};
}

function adjustPieceAndAddToGroup(
	pieceDiv: HtmlPieceElement,
	combinedParentDiv: HTMLElement,
) {
	pieceDiv.style.removeProperty("left");
	pieceDiv.style.removeProperty("top");
	pieceDiv.style.removeProperty("z-index");
	pieceDiv.classList.remove("piece");
	pieceDiv.ontouchstart = null;
	pieceDiv.onmousedown = null;
	combinedParentDiv.appendChild(pieceDiv);
}
