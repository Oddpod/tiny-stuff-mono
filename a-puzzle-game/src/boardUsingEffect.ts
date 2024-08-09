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
} from "./storeState";
import { calculateBoardDimensions, setBoardDimensions } from "./board";
import { PlaceAndCombineResult } from "./clickIntoPlaceAndCombine";
import { onPieceGroupDropped } from "./onPieceGroupMouseUp";
import { clickIntoPlaceAndCombineWithGrid } from "./clickIntoPlaceAndCombineGridApproach";
import { createPuzzleProgram } from "./createPuzzleProgram";

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
	const piecePositions = yield* Effect.try(() => loadPiecePositions());

	const combinedPiecesLookup = new Map<number, { pieceIds: Set<number> }>();
	for (const row of savedBoard) {
		for (const piece of row) {
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
			const placement = piecePositions.get(piece.id)!;
			newPiece.style.left = `${placement.left}px`;
			newPiece.style.top = `${placement.top}px`;
			newPiece.id = `piece-${piece.id}`;
			newPiece.setAttribute("data-definition-id", definition.id.toString());
			newPiece.dataset.boundingbox = JSON.stringify(piece.boundingBox);
			boardContainer.appendChild(newPiece);
			pieceDragger.makePieceDraggable({
				divElement: newPiece,
				onMouseUpCallback: ({ left, top }) => {
					const res = clickIntoPlaceAndCombineWithGrid({
						piece: { ...piece, definition },
						pieceSize,
					});

					if (res.result === PlaceAndCombineResult.Nothing) return;

					if (res.result === PlaceAndCombineResult.ExpandedGroup)
						// TODO
						return;

					combinedPiecesLookup.set(res.id, {
						pieceIds: new Set([piece.id, res.combinedWithPieceId]),
					});

					pieceDragger.makePieceDraggable({
						divElement: res.newCombinedDiv,
						onMouseUpCallback: (_) => {
							onPieceGroupDropped({
								boardContainer,
								pieceDragger,
								savedBoard,
								groupId: res.id,
								combinedParentDiv: res.newCombinedDiv,
								piece: { ...piece, definition },
								combinedPiecesLookup,
								pieceSize,
							});
						},
					});
				},
			});
		}
	}
}).pipe(Logger.withMinimumLogLevel(LogLevel.Debug));

export const resumeSavedPuzzle = () =>
	Effect.runPromise(resumePuzzleProgram).catch(() => {
		createPuzzle();
	});
export const createPuzzle = () => Effect.runPromise(createPuzzleProgram);
