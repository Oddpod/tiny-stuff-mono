import { Effect, LogLevel, Logger } from "effect";
import { cutPiece } from "./cutPiece";
import { setChosenImage } from "./input";
import { loadImage } from "./utils";
import { pieceDefinitionLookup } from "./pieceDefintions";
import { PieceDragger } from "./makePieceDraggable";
import { resetToDefaultImage } from "./previewFile";
import {
	getSavedImage,
	loadPiecePositions,
	loadSavedBoard,
	loadSavedPuzzleDimensions,
	savePiecePositions,
} from "./storeState";
import { calculateBoardDimensions, setBoardDimensions } from "./board";
import { PlaceAndCombineResult } from "./clickIntoPlaceAndCombine";
import { onPieceGroupDropped } from "./onPieceGroupDropped";
import { clickIntoPlaceAndCombineWithGrid } from "./clickIntoPlaceAndCombineGridApproach";
import { createPuzzleProgram } from "./createPuzzleProgram";
import { createAndPlacePieceGroups } from "./createAndPlacePieceGroups";

export const boardContainer = document.getElementById(
	"board-container",
) as HTMLDivElement;
export const appElement = document.getElementById("app") as HTMLDivElement;

const resumePuzzleProgram = Effect.gen(function* (_) {
	let savedImageSrc = yield* Effect.try(() => getSavedImage());
	if (!savedImageSrc) {
		savedImageSrc = resetToDefaultImage();
	}

	const image = yield* Effect.tryPromise(() => loadImage(savedImageSrc));

	const [widthInPieces] = yield* Effect.try(() => loadSavedPuzzleDimensions());
	const heightInPieces = setChosenImage(image, widthInPieces);

	const { boardHeight, boardWidth, pieceSize } = calculateBoardDimensions({
		image,
		widthInPieces,
		heightInPieces,
	});
	setBoardDimensions({ boardHeight, boardWidth });

	const savedBoard = yield* Effect.try(() => loadSavedBoard());
	if (!savedBoard[0][0].connections) {
		throw new Error("Old format");
	}

	yield* Effect.logDebug({ boardHeight, boardWidth, pieceSize });

	const pieceDragger = PieceDragger({
		boardContainer,
		boardElement: appElement,
	});
	const { piecePositions, pieceGroupPositions: combinedPiecesLookup } =
		yield* Effect.try(() => loadPiecePositions());

	yield* createAndPlacePieceGroups({
		combinedPiecesLookup,
		pieceSize,
		savedBoard,
		image,
		boardHeight,
		boardWidth,
		pieceDragger,
		piecePositions,
	});

	for (const row of savedBoard) {
		for (const piece of row) {
			const placement = piecePositions.get(piece.id)!;
			// Skip pieces in combinedDiv
			if (!placement) continue;

			const definition = pieceDefinitionLookup.get(piece.definitionId)!;
			const newPiece = yield* Effect.promise(() =>
				cutPiece({
					piece: { ...piece, definition },
					image,
					pieceSize,
					boardHeight,
					boardWidth,
				}),
			);
			newPiece.style.left = `${placement.left}px`;
			newPiece.style.top = `${placement.top}px`;
			newPiece.id = `piece-${piece.id}`;
			newPiece.setAttribute("data-definition-id", definition.id.toString());
			boardContainer.appendChild(newPiece);
			pieceDragger.makePieceDraggable({
				divElement: newPiece,
				onMouseUpCallback: ({ left, top }) => {
					const res = clickIntoPlaceAndCombineWithGrid({
						piece: { ...piece, definition },
						pieceSize,
					});

					if (res.result === PlaceAndCombineResult.Nothing) return;

					if (res.result === PlaceAndCombineResult.ExpandedGroup) {
						// TODO
						const parent = combinedPiecesLookup.get(res.groupDivId)!;
						parent.pieceIds.add(piece.id);
						piecePositions.delete(piece.id);
						savePiecePositions(piecePositions, combinedPiecesLookup);
						return;
					}

					combinedPiecesLookup.set(res.id, {
						pieceIds: new Set([piece.id, res.combinedWithPieceId]),
						position: { left, top },
					});
					console.log({ pieceId: piece.id, otherId: res.combinedWithPieceId });
					piecePositions.delete(piece.id);
					piecePositions.delete(res.combinedWithPieceId);
					savePiecePositions(piecePositions, combinedPiecesLookup);

					const onPieceGroupMouseUpCallback = ({
						left,
						top,
					}: { left: number; top: number }) => {
						// TODO: refactor into own method
						const result = onPieceGroupDropped({
							boardContainer,
							pieceDragger,
							savedBoard,
							groupId: res.id,
							combinedParentDiv: res.newCombinedDiv,
							piece: { ...piece, definition },
							combinedPiecesLookup,
							pieceSize,
						});
						if (!!result && "mergedGroups" in result) {
							const { newCombinedDiv, removedIds, newCombinedDivId } = result;
							const ids1 = combinedPiecesLookup.get(removedIds[0])!.pieceIds;
							const ids2 = combinedPiecesLookup.get(removedIds[1])!.pieceIds;

							combinedPiecesLookup.set(newCombinedDivId, {
								pieceIds: new Set([...ids1, ...ids2]),
								position: { left, top },
							});
							combinedPiecesLookup.delete(removedIds[0]);
							combinedPiecesLookup.delete(removedIds[1]);
							pieceDragger.makePieceDraggable({
								divElement: newCombinedDiv,
								onMouseUpCallback: onPieceGroupMouseUpCallback,
							});

							savePiecePositions(piecePositions, combinedPiecesLookup);
							// TODO: Check if puzzle is finished
						} else {
							const combinedPieceData = combinedPiecesLookup.get(res.id)!;
							combinedPieceData.position = { left, top };
							savePiecePositions(piecePositions, combinedPiecesLookup);
						}
					};

					pieceDragger.makePieceDraggable({
						divElement: res.newCombinedDiv,
						onMouseUpCallback: onPieceGroupMouseUpCallback,
					});
				},
			});
		}
	}
}).pipe(Logger.withMinimumLogLevel(LogLevel.Debug));

export const resumeSavedPuzzle = () =>
	Effect.runPromise(resumePuzzleProgram).catch((error) => {
		console.log({ error });
		createPuzzle();
	});
export const createPuzzle = () => Effect.runPromise(createPuzzleProgram);
