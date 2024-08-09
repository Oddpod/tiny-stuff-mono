import { PlaceAndCombineResult } from "./clickIntoPlaceAndCombine";
import type { HtmlPieceElement } from "./clickPieceInPlace";
import type { ExpandPieceGroupResult } from "./clickIntoPlaceAndCombineGridApproach";

interface AddPieceToGroupParams {
	wantedPiece: HtmlPieceElement;
	pieceDiv: HtmlPieceElement;
	boardContainer: HTMLDivElement;
	combinedParentDiv: HTMLElement;
}

export function addPieceToGroupTopConnection({
	wantedPiece,
	pieceDiv,
	boardContainer,
	combinedParentDiv,
}: AddPieceToGroupParams): ExpandPieceGroupResult {
	const gridRowStart = +wantedPiece.style.gridRowStart + 1;
	pieceDiv.style.gridRowStart = gridRowStart.toString();
	pieceDiv.style.gridColumnStart = wantedPiece.style.gridColumnStart;
	adjustPieceAndAddToGroup(pieceDiv, boardContainer, combinedParentDiv);

	return {
		result: PlaceAndCombineResult.ExpandedGroup,
		groupDivId: Number.parseInt(combinedParentDiv.dataset.id!),
	};
}

export function addPieceToGroupRightConnection({
	wantedPiece,
	pieceDiv,
	boardContainer,
	combinedParentDiv,
}: AddPieceToGroupParams): ExpandPieceGroupResult {
	let gridColumnStart = +wantedPiece.style.gridColumnStart - 1;
	if (gridColumnStart <= 0) {
		// TODO: Shove all pieces in group right
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
	adjustPieceAndAddToGroup(pieceDiv, boardContainer, combinedParentDiv);

	return {
		result: PlaceAndCombineResult.ExpandedGroup,
		groupDivId: Number.parseInt(combinedParentDiv.dataset.id!),
	};
}

export function addPieceToGroupBottomConnection({
	wantedPiece,
	pieceDiv,
	boardContainer,
	combinedParentDiv,
}: AddPieceToGroupParams): ExpandPieceGroupResult {
	let gridRowStart = +wantedPiece.style.gridRowStart - 1;
	if (gridRowStart <= 0) {
		// TODO: Shove all pieces in group down
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
	adjustPieceAndAddToGroup(pieceDiv, boardContainer, combinedParentDiv);

	return {
		result: PlaceAndCombineResult.ExpandedGroup,
		groupDivId: Number.parseInt(combinedParentDiv.dataset.id!),
	};
}

export function addPieceToGroupLeftConnection({
	wantedPiece,
	pieceDiv,
	boardContainer,
	combinedParentDiv,
}: AddPieceToGroupParams): ExpandPieceGroupResult {
	const gridColumnStart = +wantedPiece.style.gridColumnStart + 1;
	pieceDiv.style.gridRowStart = wantedPiece.style.gridRowStart;
	pieceDiv.style.gridColumnStart = gridColumnStart.toString();
	adjustPieceAndAddToGroup(pieceDiv, boardContainer, combinedParentDiv);

	return {
		result: PlaceAndCombineResult.ExpandedGroup,
		groupDivId: Number.parseInt(combinedParentDiv.dataset.id!),
	};
}

function adjustPieceAndAddToGroup(
	pieceDiv: HtmlPieceElement,
	boardContainer: HTMLDivElement,
	combinedParentDiv: HTMLElement,
) {
	pieceDiv.style.removeProperty("left");
	pieceDiv.style.removeProperty("top");
	pieceDiv.style.removeProperty("z-index");
	pieceDiv.classList.remove("piece");
	pieceDiv.ontouchstart = null;
	pieceDiv.onmousedown = null;
	boardContainer.removeChild(pieceDiv);
	combinedParentDiv.appendChild(pieceDiv);
}
