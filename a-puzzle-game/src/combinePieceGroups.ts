import type { HtmlPieceElement } from "./constants";
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
	pieceDomRect: DOMRect;
	combinedParentDiv: PieceGroupDivElement;
	droppedPieceGroupDiv: PieceGroupDivElement;
	pieceSize: number;
	boardContainer: HTMLDivElement;
}

type ReturnType =
	| { noOverLap: true }
	| {
			mergedGroups: true;
			newCombinedDiv: PieceGroupDivElement;
			newCombinedDivId: number;
			removedIds: [number, number];
	  };
export function combinePieceGroups({
	pieceToTry,
	hitOffsetForEar,
	pieceDomRect,
	combinedParentDiv,
	droppedPieceGroupDiv,
	pieceSize,
	boardContainer,
}: CombinePieceGroupsParams): ReturnType {
	console.log("oi");
	// TODO: combine group divs
	if (!isOverlapping(pieceToTry, hitOffsetForEar, pieceDomRect)) {
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
	const { newCombinedDiv, id } = createCombinedPieceDiv(pieceSize);

	newCombinedDiv.style.left = leftMostGroupDiv.style.left;
	newCombinedDiv.style.top = topMostGroupDiv.style.top;

	// Start at a higher number than puzzle dimensions
	let minCol = 10000;
	let minRow = 10000;
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
	console.log({
		dataset1: combinedParentDiv.dataset,
		dataset2: droppedPieceGroupDiv.dataset,
	});
	return {
		mergedGroups: true,
		newCombinedDiv,
		newCombinedDivId: id,
		removedIds: [
			Number.parseInt(combinedParentDiv.dataset.id),
			Number.parseInt(droppedPieceGroupDiv.dataset.id),
		] as const,
	} as const;
}

function isOverlapping(
	pieceToTry: SavedBoard[number][number],
	hitOffsetForEar: number,
	pieceDomRect: DOMRect,
) {
	return (
		(pieceToTry.connections.top &&
			checkOverLapOnTop({
				connections: pieceToTry.connections,
				hitOffsetForEar,
				pieceDomRect,
			}).isOverlapping) ||
		(pieceToTry.connections.right &&
			checkOverlapOnRight({
				connections: pieceToTry.connections,
				hitOffsetForEar,
				pieceDomRect,
			}).isOverlapping) ||
		(pieceToTry.connections.bottom &&
			checkOverlapOnBottom({
				connections: pieceToTry.connections,
				hitOffsetForEar,
				pieceDomRect,
			}).isOverlapping) ||
		(pieceToTry.connections.left &&
			checkOverlapOnLeft({
				connections: pieceToTry.connections,
				hitOffsetForEar,
				pieceDomRect,
			}).isOverlapping)
	);
}
