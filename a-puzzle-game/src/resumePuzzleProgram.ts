import { Effect, LogLevel, Logger } from "effect";
import { cutPiece } from "./cutPiece";
import { setChosenImage } from "./input";
import { loadImage } from "./utils";
import { pieceDefinitionLookup } from "./pieceDefinitions";
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
import {
	clickIntoPlaceAndCombineWithGrid,
	PlaceAndCombineResult,
} from "./clickIntoPlaceAndCombineGridApproach";
import { createAndPlacePieceGroups } from "./createAndPlacePieceGroups";
import { PieceGroupCallbackHandler } from "./onPieceGroupMouseUpCallback";

export const boardContainer = document.getElementById(
	"board-container",
) as HTMLDivElement;
export const appElement = document.getElementById("app") as HTMLDivElement;

export const resumePuzzleProgram = Effect.gen(function* (_) {
	yield* Effect.logDebug("Running Resume Puzzle Program");
	let savedImageSrc = yield* Effect.try(() => getSavedImage());
	if (!savedImageSrc) {
		savedImageSrc = resetToDefaultImage();
	}

	const image = yield* Effect.tryPromise(() => loadImage(savedImageSrc));

	const { widthInPieces } = yield* Effect.try(() =>
		loadSavedPuzzleDimensions(),
	);
	const heightInPieces = yield* Effect.tryPromise(() =>
		setChosenImage(image, widthInPieces),
	);

	yield* Effect.logDebug(JSON.stringify({ heightInPieces }));

	const { boardHeight, boardWidth, pieceSize } = calculateBoardDimensions({
		image,
		widthInPieces,
		heightInPieces,
	});

	yield* Effect.logDebug(
		JSON.stringify({ boardHeight, boardWidth, pieceSize }),
	);
	setBoardDimensions({ boardHeight, boardWidth });

	const savedBoard = yield* Effect.try(() => loadSavedBoard());
	if (!savedBoard[0][0].connections) {
		Effect.fail(new Error("Old format"));
	}

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

	const onPieceGroupMouseUpCallback = PieceGroupCallbackHandler({
		boardContainer,
		pieceDragger,
		pieceSize,
		savedBoard,
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

					piecePositions.delete(piece.id);
					piecePositions.delete(res.combinedWithPieceId);
					savePiecePositions(piecePositions, combinedPiecesLookup);

					pieceDragger.makePieceDraggable({
						divElement: res.newCombinedDiv,
						onMouseUpCallback: (p) =>
							onPieceGroupMouseUpCallback({
								...p,
								combinedParentDiv: res.newCombinedDiv,
								combinedPiecesLookup,
								groupId: res.id,
								piecePositions,
							}),
					});
				},
			});
		}
	}
}).pipe(
	Logger.withMinimumLogLevel(
		import.meta.env.MODE === "dev" ? LogLevel.Debug : LogLevel.Error,
	),
);
