import {
	addPieceToGroupBottomConnection,
	addPieceToGroupLeftConnection,
	addPieceToGroupRightConnection,
	addPieceToGroupTopConnection,
} from "./addPieceToGroup";
import {
	getCombineParams,
	expandPieceGroupTop,
	expandPieceGroupRight,
	expandPieceGroupBottom,
	expandPieceGroupLeft,
	PlaceAndCombineResult,
} from "./clickIntoPlaceAndCombine";
import { clickIntoPlaceAndCombineWithGrid } from "./clickIntoPlaceAndCombineGridApproach";
import { HIT_OFFSET, type HtmlPieceElement } from "./clickPieceInPlace";
import type { PieceEntity } from "./makeBoard";
import type { PieceDragger } from "./makePieceDraggable";
import {
	checkOverLapOnTop,
	checkOverlapOnRight,
	checkOverlapOnBottom,
	checkOverlapOnLeft,
} from "./overlap";
import {
	type Piece,
	PIECE_DIMENSIONS,
	pieceDefinitionLookup,
} from "./pieceDefintions";
import { topConnectionCalculateShiftXY } from "./shiftPieceIntoCombined";
import type { SavedBoard } from "./storeState";
import { checkCollision } from "./utils";

export function findAllPiecesTouchingCombinedDiv(
	combinedPieceDiv: HTMLDivElement,
	hitOffset: number,
) {
	const allPieces =
		document.querySelectorAll<HtmlPieceElement>("div[id^=piece]");
	const piecesInside = [];
	const rect = combinedPieceDiv.getBoundingClientRect();
	for (const element of allPieces) {
		const box = element.getBoundingClientRect();
		const alreadyInCombinedDiv =
			combinedPieceDiv.id === element.parentElement?.id;
		if (alreadyInCombinedDiv) continue;

		if (
			checkCollision(
				{
					top: rect.top,
					right: rect.right,
					bottom: rect.bottom,
					left: rect.left,
				},
				{
					top: box.top - hitOffset,
					right: box.right + hitOffset,
					bottom: box.bottom + hitOffset,
					left: box.left - hitOffset,
				},
			)
		) {
			piecesInside.push(element);
		}
	}
	return piecesInside;
}

interface OnPieceGroupMouseUpParams {
	combinedPiecesLookup: Map<number, { pieceIds: Set<number> }>;
	id: number;
	combinedPieceDiv: HTMLDivElement;
	savedBoard: SavedBoard;
	pieceSize: number;
}

// export function onPieceGroupMouseUp({
// 	combinedPiecesLookup,
// 	id,
// 	combinedPieceDiv: droppedPieceGroupDiv,
// 	savedBoard,
// 	pieceSize,
// }: OnPieceGroupMouseUpParams) {
// 	const combinedPiece = combinedPiecesLookup.get(id)!;
// 	const pieces = findAllPiecesTouchingCombinedDiv(droppedPieceGroupDiv);
// 	// console.log({ pieces })

// 	for (const pieceDiv of pieces) {
// 		const combinedPieceParent = pieceDiv.parentElement?.parentElement;
// 		const hasCombinedDiv =
// 			!!combinedPieceParent &&
// 			combinedPieceParent.id.startsWith("combined-piece");
// 		console.log({ pieceDiv, combinedPieceParent });
// 		if (!hasCombinedDiv) {
// 			const pieceToTry = savedBoard
// 				.flat()
// 				.find((p) => p.id === Number.parseInt(pieceDiv.dataset.pieceId))!;
// 			const definition = pieceDefinitionLookup.get(pieceToTry.definitionId)!;

// 			if (combinedPiece.pieceIds.has(pieceToTry.connections.top ?? -1)) {
// 				const { pieceDomRect, hitOffsetForEar, pieceDiv } = getCombineParams(
// 					{ ...pieceToTry, definition },
// 					pieceSize,
// 				);
// 				const { isOverlapping, wantedPieceDomRect, wantedPiece } =
// 					checkOverLapOnTop({
// 						connections: pieceToTry.connections,
// 						pieceDomRect,
// 						hitOffsetForEar,
// 					});
// 				if (isOverlapping) {
// 					const { newCombinedLeft, newCombinedTop } = expandPieceGroupTop({
// 						combinedParentDiv: droppedPieceGroupDiv,
// 						piece: { ...pieceToTry, definition },
// 						pieceDiv,
// 						pieceDomRect,
// 						pieceSize,
// 						wantedPiece,
// 						wantedPieceDomRect,
// 					});
// 					droppedPieceGroupDiv.style.left = `${newCombinedLeft}px`;
// 					droppedPieceGroupDiv.style.top = `${newCombinedTop}px`;
// 					combinedPiece.pieceIds.add(pieceToTry.id);
// 					combinedPiecesLookup.set(id, combinedPiece);
// 					continue;
// 				}
// 			}
// 			if (combinedPiece.pieceIds.has(pieceToTry.connections.right ?? -1)) {
// 				const { pieceDomRect, hitOffsetForEar, pieceDiv } = getCombineParams(
// 					{ ...pieceToTry, definition },
// 					pieceSize,
// 				);
// 				const { isOverlapping, wantedPieceDomRect, wantedPiece } =
// 					checkOverlapOnRight({
// 						connections: pieceToTry.connections,
// 						pieceDomRect,
// 						hitOffsetForEar,
// 					});
// 				if (isOverlapping) {
// 					const { newCombinedLeft, newCombinedTop } = expandPieceGroupRight({
// 						combinedParentDiv: droppedPieceGroupDiv,
// 						piece: { ...pieceToTry, definition },
// 						pieceDiv,
// 						pieceDomRect,
// 						pieceSize,
// 						wantedPiece,
// 						wantedPieceDomRect,
// 					});
// 					droppedPieceGroupDiv.style.left = `${newCombinedLeft}px`;
// 					droppedPieceGroupDiv.style.top = `${newCombinedTop}px`;
// 					combinedPiece.pieceIds.add(pieceToTry.id);
// 					combinedPiecesLookup.set(id, combinedPiece);
// 					continue;
// 				}
// 			}
// 			if (combinedPiece.pieceIds.has(pieceToTry.connections.bottom ?? -1)) {
// 				const { pieceDomRect, hitOffsetForEar, pieceDiv } = getCombineParams(
// 					{ ...pieceToTry, definition },
// 					pieceSize,
// 				);
// 				const { isOverlapping, wantedPieceDomRect, wantedPiece } =
// 					checkOverlapOnBottom({
// 						connections: pieceToTry.connections,
// 						pieceDomRect,
// 						hitOffsetForEar,
// 					});
// 				if (isOverlapping) {
// 					const { newCombinedLeft, newCombinedTop } = expandPieceGroupBottom({
// 						combinedParentDiv: droppedPieceGroupDiv,
// 						piece: { ...pieceToTry, definition },
// 						pieceDiv,
// 						pieceDomRect,
// 						pieceSize,
// 						wantedPiece,
// 						wantedPieceDomRect,
// 					});
// 					droppedPieceGroupDiv.style.left = `${newCombinedLeft}px`;
// 					droppedPieceGroupDiv.style.top = `${newCombinedTop}px`;
// 					combinedPiece.pieceIds.add(pieceToTry.id);
// 					combinedPiecesLookup.set(id, combinedPiece);
// 					continue;
// 				}
// 			}

// 			if (combinedPiece.pieceIds.has(pieceToTry.connections.left ?? -1)) {
// 				const { pieceDomRect, hitOffsetForEar, pieceDiv } = getCombineParams(
// 					{ ...pieceToTry, definition },
// 					pieceSize,
// 				);
// 				const { isOverlapping, wantedPieceDomRect, wantedPiece } =
// 					checkOverlapOnLeft({
// 						connections: pieceToTry.connections,
// 						pieceDomRect,
// 						hitOffsetForEar,
// 					});
// 				if (isOverlapping) {
// 					const { newCombinedLeft, newCombinedTop } = expandPieceGroupLeft({
// 						combinedParentDiv: droppedPieceGroupDiv,
// 						piece: { ...pieceToTry, definition },
// 						pieceDiv,
// 						pieceDomRect,
// 						pieceSize,
// 						wantedPiece,
// 						wantedPieceDomRect,
// 					});
// 					droppedPieceGroupDiv.style.left = `${newCombinedLeft}px`;
// 					droppedPieceGroupDiv.style.top = `${newCombinedTop}px`;
// 					combinedPiece.pieceIds.add(pieceToTry.id);
// 					combinedPiecesLookup.set(id, combinedPiece);
// 				}
// 			}
// 		} else {
// 			console.log("combined");
// 			const pieceToTry = savedBoard
// 				.flat()
// 				.find((p) => p.id === Number.parseInt(pieceDiv.dataset.pieceId))!;
// 			const pieceToTryDefinition = pieceDefinitionLookup.get(
// 				pieceToTry.definitionId,
// 			)!;

// 			const numCols = 1;
// 			const numRows = 1;
// 			const gridTemplateColumns = `repeat( ${numCols}, ${pieceSize}px);`;
// 			const gridTemplateRows = `repeat( ${numRows}, ${pieceSize}px);`;

// 			droppedPieceGroupDiv.style.display = "grid";

// 			console.log({ droppedPieceGroupDiv });

// 			console.log(pieceToTry.id, pieceToTry.connections);
// 			if (combinedPiece.pieceIds.has(pieceToTry.connections.top ?? -1)) {
// 				const { pieceDomRect, hitOffsetForEar, pieceDiv } = getCombineParams(
// 					{ ...pieceToTry, definition: pieceToTryDefinition },
// 					pieceSize,
// 				);
// 				const { isOverlapping, wantedPieceDomRect, wantedPiece } =
// 					checkOverLapOnTop({
// 						connections: pieceToTry.connections,
// 						pieceDomRect,
// 						hitOffsetForEar,
// 					});
// 				if (isOverlapping) {
// 					// const { pieceDivTop, pieceDivLeft } = topConnectionCalculateShiftXY({ combinedParentDiv: droppedPieceGroupDiv, pieceDomRect, pieceSize, sides: pieceToTryDefinition.sides, wantedPiece, wantedPieceDomRect })
// 					// const newCombinedLeft = Math.min(droppedPieceGroupDiv.getBoundingClientRect().left, combinedPieceParent.getBoundingClientRect().left);

// 					const leftMostParent =
// 						droppedPieceGroupDiv.getBoundingClientRect().left <
// 						combinedPieceParent.getBoundingClientRect().left
// 							? droppedPieceGroupDiv
// 							: combinedPieceParent;
// 					const rightMostParent =
// 						droppedPieceGroupDiv.getBoundingClientRect().left <
// 						combinedPieceParent.getBoundingClientRect().left
// 							? combinedPieceParent
// 							: droppedPieceGroupDiv;
// 					const leftMostRect = leftMostParent.getBoundingClientRect();
// 					const rightMostRect = rightMostParent.getBoundingClientRect();
// 					const top = Math.min(leftMostRect.top, rightMostRect.top);

// 					const combinedParentDivRect =
// 						droppedPieceGroupDiv.getBoundingClientRect();
// 					let diffX = 0;
// 					const wantedPieceDef = pieceDefinitionLookup.get(
// 						Number.parseInt(wantedPiece.dataset.definitionId),
// 					)!;
// 					if (wantedPieceDef.sides.left === pieceToTryDefinition.sides.left) {
// 						diffX = rightMostRect.left - leftMostRect.left;
// 					} else if (wantedPieceDef.sides.left === "ear") {
// 						diffX = (15 * pieceSize) / PIECE_DIMENSIONS;
// 					} else {
// 						diffX =
// 							rightMostRect.left -
// 							leftMostRect.left +
// 							(15 * pieceSize) / PIECE_DIMENSIONS;
// 					}

// 					// const diffY = wantedPieceDomRect.bottom - combinedParentDivRect.top - 15 * pieceSize / PIECE_DIMENSIONS
// 					const diffY =
// 						rightMostRect.top -
// 						leftMostRect.bottom +
// 						(15 * pieceSize) / PIECE_DIMENSIONS;

// 					if (pieceToTry.connections.left) {
// 					}
// 					// const diffX = rightMostRect.left - leftMostRect.left + 15 * pieceSize / PIECE_DIMENSIONS

// 					const boardContainer = document.getElementById("board-container");
// 					const children =
// 						rightMostParent.querySelectorAll<HtmlPieceElement>(".piece")!;
// 					console.log({ diffX, diffY });
// 					for (const child of children) {
// 						child.style.left = `${child.getBoundingClientRect().left - leftMostRect.left - diffX}px`;
// 						child.style.top = `${child.getBoundingClientRect().top - top - diffY}px`;
// 						leftMostParent.appendChild(child);
// 					}
// 					boardContainer?.removeChild(rightMostParent);
// 					pieceDiv.ontouchstart = null;
// 					pieceDiv.onmousedown = null;

// 					// leftMostParent.style.left = `${newCombinedLeft}px`;
// 					// leftMostParent.style.top = `${newCombinedTop}px`;
// 					combinedPiece.pieceIds.add(pieceToTry.id);
// 					combinedPiecesLookup.set(id, combinedPiece);

// 					return;
// 				}
// 			}
// 		}
// 		console.log("asdf");
// 	}
// }

interface OnPieceDroppedParams {
	piece: PieceEntity;
	pieceSize: number;
	groupId: number;
	combinedParentDiv: HTMLDivElement;
	combinedPiecesLookup: Map<number, { pieceIds: Set<number> }>;
	savedBoard: SavedBoard;
	pieceDragger: ReturnType<typeof PieceDragger>;
	boardContainer: HTMLDivElement;
}
export function onPieceGroupDropped({
	pieceSize,
	combinedPiecesLookup,
	savedBoard,
	combinedParentDiv: droppedPieceGroupDiv,
	groupId,
	boardContainer,
}: OnPieceDroppedParams) {
	const combinedPiece = combinedPiecesLookup.get(groupId)!;
	const hitOffsetForEar = (15 * pieceSize) / PIECE_DIMENSIONS + HIT_OFFSET;
	const pieces = findAllPiecesTouchingCombinedDiv(
		droppedPieceGroupDiv,
		hitOffsetForEar,
	);
	console.log("dropped group", { pieces });

	for (const pieceToTryDiv of pieces) {
		const pieceToTry = savedBoard
			.flat()
			.find((p) => p.id === Number.parseInt(pieceToTryDiv.dataset.pieceId))!;
		const pieceDomRect = pieceToTryDiv.getBoundingClientRect();

		const combinedParentDiv = pieceToTryDiv.parentElement;
		const hasCombinedParent =
			!!combinedParentDiv &&
			combinedParentDiv?.classList.contains("combined-piece");
		console.log({ combinedParentDiv });
		if (hasCombinedParent) {
			console.log("oi");
			// TODO: combine group divs
			continue;
		}
		if (pieceToTry.connections.top !== null) {
			const { isOverlapping, wantedPiece, wantedPieceDomRect, wantedPieceId } =
				checkOverLapOnTop({
					connections: pieceToTry.connections,
					pieceDomRect,
					hitOffsetForEar,
				});
			if (isOverlapping) {
				droppedPieceGroupDiv.style.height = `${droppedPieceGroupDiv.getBoundingClientRect().height + pieceSize}px`;
				return addPieceToGroupTopConnection({
					boardContainer,
					combinedParentDiv: droppedPieceGroupDiv,
					pieceDiv: pieceToTryDiv,
					wantedPiece,
				});
			}
		}
		if (pieceToTry.connections.right !== null) {
			const { isOverlapping, wantedPiece, wantedPieceDomRect, wantedPieceId } =
				checkOverlapOnRight({
					connections: pieceToTry.connections,
					pieceDomRect,
					hitOffsetForEar,
				});
			if (isOverlapping) {
				droppedPieceGroupDiv.style.width = `${droppedPieceGroupDiv.getBoundingClientRect().width + pieceSize}px`;
				return addPieceToGroupRightConnection({
					boardContainer,
					combinedParentDiv: droppedPieceGroupDiv,
					pieceDiv: pieceToTryDiv,
					wantedPiece,
				});
			}
		}
		if (pieceToTry.connections.bottom !== null) {
			const { isOverlapping, wantedPiece, wantedPieceDomRect, wantedPieceId } =
				checkOverlapOnBottom({
					connections: pieceToTry.connections,
					pieceDomRect,
					hitOffsetForEar,
				});
			if (isOverlapping) {
				droppedPieceGroupDiv.style.height = `${droppedPieceGroupDiv.getBoundingClientRect().height + pieceSize}px`;
				droppedPieceGroupDiv.style.top = pieceToTryDiv.style.top;
				return addPieceToGroupBottomConnection({
					boardContainer,
					combinedParentDiv: droppedPieceGroupDiv,
					pieceDiv: pieceToTryDiv,
					wantedPiece,
				});
			}
		}
		if (pieceToTry.connections.left !== null) {
			const { isOverlapping, wantedPiece, wantedPieceDomRect, wantedPieceId } =
				checkOverlapOnLeft({
					connections: pieceToTry.connections,
					pieceDomRect,
					hitOffsetForEar,
				});
			if (isOverlapping) {
				droppedPieceGroupDiv.style.width = `${droppedPieceGroupDiv.getBoundingClientRect().width + pieceSize}px`;
				return addPieceToGroupLeftConnection({
					boardContainer,
					combinedParentDiv: droppedPieceGroupDiv,
					pieceDiv: pieceToTryDiv,
					wantedPiece,
				});
			}
		}
	}
}
