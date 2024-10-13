import { Effect, LogLevel, Logger } from "effect";
import { PieceCutter } from "./cutPiece";
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
import { SINGLE_PIECE_ZINDEX } from "./constants";

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

	const { widthInPieces, heightInPieces } = yield* Effect.try(() =>
		loadSavedPuzzleDimensions(),
	);
	yield* Effect.tryPromise(() =>
		setChosenImage(image, widthInPieces, heightInPieces),
	);

	const { boardHeight, boardWidth, ...pieceDimensions } =
		calculateBoardDimensions({
			image,
			widthInPieces,
			heightInPieces,
		});

	yield* Effect.logDebug({ boardHeight, boardWidth });

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
		pieceDimensions,
		savedBoard,
		image,
		puzzleDimensions: { heightInPieces, widthInPieces },
		pieceDragger,
		piecePositions,
	});

	const onPieceGroupMouseUpCallback = PieceGroupCallbackHandler({
		boardContainer,
		pieceDragger,
		pieceDimensions,
		savedBoard,
	});

	const cutPiece = PieceCutter({
		puzzleDimensions: { widthInPieces, heightInPieces },
		image,
		pieceDimensions,
	});
	for (const row of savedBoard) {
		for (const piece of row) {
			const placement = piecePositions.get(piece.id)!;
			// Skip pieces in combinedDiv
			if (!placement) continue;

			const definition = pieceDefinitionLookup.get(piece.definitionId)!;
			const newPiece = yield* Effect.promise(() =>
				cutPiece({ ...piece, definition }),
			);
			newPiece.classList.add("piece");
			newPiece.setAttribute("data-coords", JSON.stringify(piece.coords));
			newPiece.setAttribute("data-piece-id", piece.id.toString());
			newPiece.style.zIndex = SINGLE_PIECE_ZINDEX;
			newPiece.style.left = `${placement.left}px`;
			newPiece.style.top = `${placement.top}px`;
			newPiece.id = `piece-${piece.id}`;
			boardContainer.appendChild(newPiece);
			pieceDragger.makePieceDraggable({
				divElement: newPiece,
				onMouseUpCallback: ({ left, top }) => {
					const res = clickIntoPlaceAndCombineWithGrid({
						piece: { ...piece, definition },
						pieceDimensions,
					});

					if (res.result === PlaceAndCombineResult.Nothing) return;

					if (res.result === PlaceAndCombineResult.ExpandedGroup) {
						const parent = combinedPiecesLookup.get(res.groupDivId)!;
						parent.pieceIds.add(piece.id);
						piecePositions.delete(piece.id);
						savePiecePositions(piecePositions, combinedPiecesLookup);
						return;
					}

					boardContainer.appendChild(res.newCombinedDiv);
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
		import.meta.env.MODE === "development" ? LogLevel.Debug : LogLevel.Error,
	),
);
