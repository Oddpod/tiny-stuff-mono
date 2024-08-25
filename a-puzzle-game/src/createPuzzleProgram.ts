import { Effect, LogLevel, Logger } from "effect";
import { cutPiece } from "./cutPiece";
import { loadChosenImage, readConfig } from "./input";
import { loadImage } from "./utils";
import { createBoard } from "./makeBoard";
import { PieceDragger } from "./makePieceDraggable";
import {
	type CombinedPiecePositionLookup,
	saveBoard,
	saveImage,
	savePiecePositions,
	savePuzzleDimensions,
} from "./storeState";
import {
	calculateBoardDimensions,
	getRandomBoardCoordinates,
	type PiecePositionLookup,
	setBoardDimensions,
} from "./board";
import { appElement, boardContainer } from "./resumePuzzleProgram";
import {
	clickIntoPlaceAndCombineWithGrid,
	PlaceAndCombineResult,
} from "./clickIntoPlaceAndCombineGridApproach";
import { PieceGroupCallbackHandler } from "./onPieceGroupMouseUpCallback";

export const createPuzzleProgram = Effect.gen(function* (_) {
	yield* Effect.logDebug("Running createPuzzleProgram");
	const { heightInPieces, widthInPieces, imageSrc } = yield* readConfig();
	yield* Effect.tryPromise(() => loadChosenImage());
	savePuzzleDimensions({ widthInPieces, heightInPieces });

	const image = yield* Effect.tryPromise(() => loadImage(imageSrc));
	saveImage(imageSrc);

	const { boardHeight, boardWidth, pieceSize } = calculateBoardDimensions({
		image,
		widthInPieces,
		heightInPieces,
	});
	setBoardDimensions({ boardWidth, boardHeight });

	const board = yield* createBoard({
		image,
		heightInPieces,
		widthInPieces,
		pieceSize,
	});
	const savedBoard = saveBoard(board);

	const piecePositions: PiecePositionLookup = new Map();
	const pieceDragger = PieceDragger({
		boardContainer,
		boardElement: appElement,
	});

	const combinedPiecesLookup: CombinedPiecePositionLookup = new Map();

	const onPieceGroupMouseUpCallback = PieceGroupCallbackHandler({
		boardContainer,
		pieceDragger,
		pieceSize,
		savedBoard,
	});
	for (const row of board) {
		for (const piece of row) {
			const newPiece = yield* Effect.promise(() =>
				cutPiece({ piece, image, pieceSize, boardHeight, boardWidth }),
			);
			const placement = getRandomBoardCoordinates(
				pieceSize,
				piece.definition.sides,
			);
			newPiece.style.left = `${placement.left}px`;
			newPiece.style.top = `${placement.top}px`;
			newPiece.id = `piece-${piece.id}`;
			newPiece.setAttribute(
				"data-definition-id",
				piece.definition.id.toString(),
			);
			boardContainer.appendChild(newPiece);
			piecePositions.set(piece.id, placement);
			pieceDragger.makePieceDraggable({
				divElement: newPiece,
				onMouseUpCallback: ({ left, top }) => {
					const res = clickIntoPlaceAndCombineWithGrid({
						piece,
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

export const createPuzzle = () => Effect.runPromise(createPuzzleProgram);
