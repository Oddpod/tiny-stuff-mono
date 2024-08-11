import { Effect, LogLevel, Logger } from "effect";
import { cutPiece } from "./cutPiece";
import { loadChosenImage, readConfig } from "./input";
import { loadImage } from "./utils";
import { createBoard } from "./makeBoard";
import { PieceDragger } from "./makePieceDraggable";
import {
	CombinedPiecePositionLookup,
	saveBoard,
	saveImage,
	savePiecePositions,
	savePuzzleDimensions,
} from "./storeState";
import {
	calculateBoardDimensions,
	getRandomCoordinatesOutsideBoard,
	type PiecePositionLookup,
	setBoardDimensions,
} from "./board";
import {
	clickIntoPlaceAndCombine,
	PlaceAndCombineResult,
} from "./clickIntoPlaceAndCombine";
import { appElement, boardContainer } from "./boardUsingEffect";
import { clickIntoPlaceAndCombineWithGrid } from "./clickIntoPlaceAndCombineGridApproach";
import { onPieceGroupDropped } from "./onPieceGroupDropped";

export const createPuzzleProgram = Effect.gen(function* (_) {
	yield* Effect.logDebug("Running createPuzzleProgram");
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
	const savedBoard = saveBoard(board);

	yield* Effect.logDebug({ boardHeight, boardWidth, pieceSize });

	const piecePositions: PiecePositionLookup = new Map();
	const pieceDragger = PieceDragger({
		boardContainer,
		boardElement: appElement,
	});

	const combinedPiecesLookup: CombinedPiecePositionLookup = new Map();
	for (const row of board) {
		for (const piece of row) {
			const newPiece = yield* Effect.promise(() =>
				cutPiece({ piece, image, pieceSize, boardHeight, boardWidth }),
			);
			const placement = getRandomCoordinatesOutsideBoard(
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
			console.log({ newPiece });
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
					savePiecePositions(piecePositions, combinedPiecesLookup);

					const onPieceGroupMouseUpCallback = ({
						left,
						top,
					}: { left: number; top: number }) => {
						const result = onPieceGroupDropped({
							boardContainer,
							pieceDragger,
							savedBoard,
							groupId: res.id,
							combinedParentDiv: res.newCombinedDiv,
							piece,
							combinedPiecesLookup,
							pieceSize,
						});
						if (!!result && "mergedGroups" in result) {
							const { newCombinedDiv, removedIds, newCombinedDivId } = result;
							console.log({ result });
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
