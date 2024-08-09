import { Effect, LogLevel, Logger } from "effect";
import { cutPiece } from "./cutPiece";
import { loadChosenImage, readConfig } from "./input";
import { loadImage } from "./utils";
import { createBoard } from "./makeBoard";
import { PieceDragger } from "./makePieceDraggable";
import {
	saveBoard,
	saveImage,
	savePiecePositions,
	savePuzzleDimensions
} from "./storeState";
import {
	calculateBoardDimensions,
	getRandomCoordinatesOutsideBoard,
	type PiecePositionLookup,
	setBoardDimensions
} from "./board";
import { clickIntoPlaceAndCombine } from "./clickIntoPlaceAndCombine";
import { appElement, boardContainer } from "./boardUsingEffect";

export const createPuzzleProgram = Effect.gen(function* (_) {
	const { heightInPieces, widthInPieces, imageSrc } = yield* readConfig();
	yield* Effect.tryPromise(() => loadChosenImage());
	savePuzzleDimensions([widthInPieces, heightInPieces]);

	const image = yield* Effect.tryPromise(() => loadImage(imageSrc));
	saveImage(imageSrc);

	const { boardHeight, boardWidth, pieceSize } = calculateBoardDimensions({
		image,
		widthInPieces,
		heightInPieces,
	});
	setBoardDimensions({ boardWidth, boardHeight });

	yield* Effect.logDebug({ pieceSize, widthInPieces, heightInPieces });

	const board = yield* createBoard({
		image,
		heightInPieces,
		widthInPieces,
		pieceSize,
	});
	saveBoard(board);

	yield* Effect.logDebug({ boardHeight, boardWidth, pieceSize });

	const piecePositions: PiecePositionLookup = new Map();
	const pieceDragger = PieceDragger({
		boardContainer,
		boardElement: appElement,
	});
	for (const row of board) {
		for (const piece of row) {
			const newPiece = yield* Effect.promise(() => cutPiece({ piece, image, pieceSize, boardHeight, boardWidth })
			);
			const placement = getRandomCoordinatesOutsideBoard(
				pieceSize,
				piece.definition.sides
			);
			newPiece.style.left = `${placement.left}px`;
			newPiece.style.top = `${placement.top}px`;
			newPiece.id = `piece-${piece.id}`;
			newPiece.setAttribute(
				"data-definition-id",
				piece.definition.id.toString()
			);
			boardContainer.appendChild(newPiece);
			console.log({ newPiece });
			piecePositions.set(piece.id, placement);
			pieceDragger.makePieceDraggable({
				divElement: newPiece,
				onMouseUpCallback: ({ left, top }) => {
					const result = clickIntoPlaceAndCombine({ piece, pieceSize });
					if (result) {
						const { combinedPieceDiv, id, pieceIds } = result;
						pieceDragger.makePieceDraggable({ divElement: combinedPieceDiv });
						boardContainer.appendChild(combinedPieceDiv);
					}
					piecePositions.set(piece.id, { left, top });
					savePiecePositions(piecePositions);
				},
			});
		}
	}
}).pipe(Logger.withMinimumLogLevel(LogLevel.Debug));
