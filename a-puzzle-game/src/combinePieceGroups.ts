import type { PieceDimensions } from "./board";
import { MAX_DIM_XY, type HtmlPieceElement } from "./constants";
import {
	type PieceGroupDivElement,
	createCombinedPieceDiv,
} from "./createCombinedUsingConnection";
import type { PieceEntity } from "./makeBoard";
import {
	checkOverLapOnTop,
	checkOverlapOnRight,
	checkOverlapOnBottom,
	checkOverlapOnLeft,
} from "./overlap";
import { deserialize } from "./serilizationUtils";
import type { SavedBoard } from "./storeState";
import { groupBy } from "./utils";

interface CombinePieceGroupsParams {
	pieceToTry: SavedBoard[number][number];
	hitOffsetForEar: number;
	pieceToTryDiv: HtmlPieceElement;
	combinedParentDiv: PieceGroupDivElement;
	droppedPieceGroupDiv: PieceGroupDivElement;
	pieceDimensions: PieceDimensions;
	boardContainer: HTMLDivElement;
}

type ReturnType =
	| { noOverLap: true }
	| {
			mergedGroups: true;
			newCombinedDiv: PieceGroupDivElement;
			newCombinedDivId: string;
			removedIds: [string, string];
	  };
export function combinePieceGroups({
	pieceToTry,
	hitOffsetForEar,
	pieceToTryDiv,
	combinedParentDiv,
	droppedPieceGroupDiv,
	pieceDimensions,
	boardContainer,
}: CombinePieceGroupsParams): ReturnType {
	const pieceDomRect = pieceToTryDiv.getBoundingClientRect();

	const { isOverlapping } = checkOverlap(
		pieceToTry,
		hitOffsetForEar,
		pieceDomRect,
		pieceToTryDiv,
	);

	if (!isOverlapping) {
		return { noOverLap: true } as const;
	}

	const { topMostGroupDiv, bottomMostGroupDiv } =
		combinedParentDiv.getBoundingClientRect().top <
		droppedPieceGroupDiv.getBoundingClientRect().top
			? {
					topMostGroupDiv: combinedParentDiv,
					bottomMostGroupDiv: droppedPieceGroupDiv,
				}
			: {
					topMostGroupDiv: droppedPieceGroupDiv,
					bottomMostGroupDiv: combinedParentDiv,
				};
	const leftMostGroupDiv =
		combinedParentDiv.getBoundingClientRect().left <
		droppedPieceGroupDiv.getBoundingClientRect().left
			? combinedParentDiv
			: droppedPieceGroupDiv;

	const allRelevantPieces = [
		...bottomMostGroupDiv.querySelectorAll<HtmlPieceElement>("div[id^=piece]"),
		...topMostGroupDiv.querySelectorAll<HtmlPieceElement>("div[id^=piece]"),
	];
	const { newCombinedDiv, id } = createCombinedPieceDiv(pieceDimensions);

	newCombinedDiv.style.left = leftMostGroupDiv.style.left;
	newCombinedDiv.style.top = topMostGroupDiv.style.top;

	// Start at a higher number than puzzle dimensions
	let minCol = MAX_DIM_XY + 1;
	let minRow = MAX_DIM_XY + 1;
	const pieceByRow = groupBy(
		allRelevantPieces.map((p) => ({
			pieceDiv: p,
			deserializedCoords: deserialize<PieceEntity["coords"]>(p.dataset.coords),
		})),
		({ deserializedCoords }) => {
			minCol = Math.min(deserializedCoords.col, minCol);
			minRow = Math.min(deserializedCoords.row, minRow);
			return deserializedCoords.row;
		},
	);

	for (const [row, piecesToAdjust] of pieceByRow) {
		piecesToAdjust.sort(
			(p1, p2) => p1.deserializedCoords.col - p2.deserializedCoords.col,
		);
		for (let i = 0; i < piecesToAdjust.length; i++) {
			const { pieceDiv, deserializedCoords } = piecesToAdjust[i];

			// TODO: verify
			pieceDiv.style.gridRowStart = (row + 1 - minRow).toString();
			pieceDiv.style.gridColumnStart = (
				deserializedCoords.col +
				1 -
				minCol
			).toString();
			newCombinedDiv.appendChild(pieceDiv);
		}
	}
	boardContainer.removeChild(combinedParentDiv);
	boardContainer.removeChild(droppedPieceGroupDiv);
	boardContainer.appendChild(newCombinedDiv);

	return {
		mergedGroups: true,
		newCombinedDiv,
		newCombinedDivId: id,
		removedIds: [
			combinedParentDiv.dataset.id,
			droppedPieceGroupDiv.dataset.id,
		] as const,
	} as const;
}

function hasSameParent(pieceOne: HtmlPieceElement, pieceTwo: HtmlPieceElement) {
	return pieceOne?.parentElement?.id === pieceTwo.parentElement?.id;
}

function checkOverlap(
	pieceToTry: SavedBoard[number][number],
	hitOffsetForEar: number,
	pieceDomRect: DOMRect,
	pieceToTryDiv: HtmlPieceElement,
) {
	if (pieceToTry.connections.top) {
		const { isOverlapping, wantedPiece } = checkOverLapOnTop({
			connections: pieceToTry.connections,
			hitOffsetForEar,
			pieceDomRect,
		});
		if (isOverlapping && !hasSameParent(pieceToTryDiv, wantedPiece))
			return { isOverlapping, wantedPiece };
	}

	if (pieceToTry.connections.right) {
		const { isOverlapping, wantedPiece } = checkOverlapOnRight({
			connections: pieceToTry.connections,
			hitOffsetForEar,
			pieceDomRect,
		});
		if (isOverlapping && !hasSameParent(pieceToTryDiv, wantedPiece))
			return { isOverlapping, wantedPiece };
	}
	if (pieceToTry.connections.bottom) {
		const { isOverlapping, wantedPiece } = checkOverlapOnBottom({
			connections: pieceToTry.connections,
			hitOffsetForEar,
			pieceDomRect,
		});
		if (isOverlapping && !hasSameParent(pieceToTryDiv, wantedPiece))
			return { isOverlapping, wantedPiece };
	}
	if (pieceToTry.connections.left) {
		const { isOverlapping, wantedPiece } = checkOverlapOnLeft({
			connections: pieceToTry.connections,
			hitOffsetForEar,
			pieceDomRect,
		});
		if (isOverlapping && !hasSameParent(pieceToTryDiv, wantedPiece))
			return { isOverlapping, wantedPiece };
	}
	return { isOverlapping: false };
}
