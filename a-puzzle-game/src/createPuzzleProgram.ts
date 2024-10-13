import { Effect, LogLevel, Logger } from "effect";
import { PieceCutter } from "./cutPiece";
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
import { SINGLE_PIECE_ZINDEX } from "./constants";

export const createPuzzleProgram = Effect.gen(function* (_) {
	yield* Effect.logDebug("Running createPuzzleProgram");
	const { imageSrc, ...puzzleDimensions } = yield* readConfig();
	yield* Effect.tryPromise(() => loadChosenImage(imageSrc));
	savePuzzleDimensions(puzzleDimensions);

	const image = yield* Effect.tryPromise(() => loadImage(imageSrc));
	saveImage(imageSrc);

	const { boardHeight, boardWidth, ...pieceDimensions } =
		calculateBoardDimensions({
			image,
			...puzzleDimensions,
		});
	setBoardDimensions({ boardWidth, boardHeight });

	const board = yield* createBoard(puzzleDimensions);
	const savedBoard = saveBoard(board);

	const piecePositions: PiecePositionLookup = new Map();
	const pieceDragger = PieceDragger({
		boardContainer,
		boardElement: appElement,
	});

	const combinedPiecesLookup: CombinedPiecePositionLookup = new Map();

	yield* Effect.logDebug(puzzleDimensions);
	const onPieceGroupMouseUpCallback = PieceGroupCallbackHandler({
		boardContainer,
		pieceDragger,
		pieceDimensions,
		savedBoard,
	});
	const cutPiece = PieceCutter({
		image,
		pieceDimensions,
		puzzleDimensions,
	});
	for (const row of board) {
		for (const piece of row) {
			const newPiece = yield* Effect.promise(() => cutPiece(piece));
			const placement = getRandomBoardCoordinates({
				...pieceDimensions,
				sides: piece.definition.sides,
			});
			newPiece.classList.add("piece");
			newPiece.setAttribute("data-coords", JSON.stringify(piece.coords));
			newPiece.setAttribute("data-piece-id", piece.id.toString());
			newPiece.style.zIndex = SINGLE_PIECE_ZINDEX;
			newPiece.style.left = `${placement.left}px`;
			newPiece.style.top = `${placement.top}px`;
			newPiece.id = `piece-${piece.id}`;
			boardContainer.appendChild(newPiece);
			piecePositions.set(piece.id, placement);
			pieceDragger.makePieceDraggable({
				divElement: newPiece,
				onMouseUpCallback: ({ left, top }) => {
					const res = clickIntoPlaceAndCombineWithGrid({
						piece,
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

export const createPuzzle = () => Effect.runPromise(createPuzzleProgram);
