import { Effect, LogLevel, Logger } from "effect";
import { cutPiece } from "./cutPiece";
import { loadChosenImage, readConfig, setChosenImage } from "./input";
import { loadImage } from "./utils";
import { pieceDefinitionLookup } from "./pieceDefintions";
import { createBoard } from "./makeBoard";
import { PieceDragger } from "./makePieceDraggable";
import { resetToDefaultImage } from "./previewFile";
import { getSavedImage, loadPiecePositions, loadSavedBoard, loadSavedPuzzleDimensions, saveBoard, saveImage, savePiecePositions, savePuzzleDimensions } from "./storeState";
import { calculateBoardDimensions, getRandomCoordinatesOutsideBoard, type PiecePositionLookup, setBoardDimensions } from "./board";

const boardContainer = document.getElementById("board-container") as HTMLDivElement
const appElement = document.getElementById("app") as HTMLDivElement

const createPuzzleProgram = Effect.gen(function* (_) {
    const { heightInPieces, widthInPieces, imageSrc } = yield* readConfig()
    yield* Effect.tryPromise(() => loadChosenImage())
    savePuzzleDimensions([widthInPieces, heightInPieces])

    const image = yield* Effect.tryPromise(() => loadImage(imageSrc))
    saveImage(imageSrc)

    const { boardHeight, boardWidth, pieceSize } = calculateBoardDimensions({image, widthInPieces, heightInPieces})
    setBoardDimensions({ boardWidth, boardHeight })

    yield* Effect.logDebug({ pieceSize, widthInPieces, heightInPieces })

    const board = yield* createBoard({ image, heightInPieces, widthInPieces, pieceSize })
    saveBoard(board)

    yield* Effect.logDebug({ boardHeight, boardWidth, pieceSize })

    const piecePositions: PiecePositionLookup = new Map()
    const pieceDragger = PieceDragger({ boardContainer, boardElement: appElement })
    for (const row of board) {
        for (const piece of row) {
            const newPiece = yield* Effect.promise(() => cutPiece({ piece, image, pieceSize, boardHeight, boardWidth }))
            const placement = getRandomCoordinatesOutsideBoard(pieceSize, piece.definition.sides)
            newPiece.style.left = `${placement.left}px`;
            newPiece.style.top = `${placement.top}px`;
            piecePositions.set(piece.id, placement)
            boardContainer.appendChild(newPiece);
            pieceDragger.makePieceDraggable({
                pieceId: piece.id, divElement: newPiece, onMouseUpCallback: ({ pieceId, left, top }) => {
                    piecePositions.set(pieceId, { left, top })
                    savePiecePositions(piecePositions)
                }
            })
        }
    }
})
    .pipe(Logger.withMinimumLogLevel(LogLevel.Debug))

const resumePuzzleProgram = Effect.gen(function* (_) {
    let savedImageSrc = yield* Effect.try(() => getSavedImage());
    if (!savedImageSrc) {
        savedImageSrc = resetToDefaultImage()
    }

    const image = yield* Effect.tryPromise(() => loadImage(savedImageSrc))

    const [widthInPieces] = yield* Effect.try(() => loadSavedPuzzleDimensions())
    const heightInPieces = setChosenImage(image, widthInPieces)

    const { boardHeight, boardWidth, pieceSize } = calculateBoardDimensions({ image, widthInPieces, heightInPieces })
    setBoardDimensions({ boardHeight, boardWidth })

    const savedBoard = yield* Effect.try(() => loadSavedBoard())

    yield* Effect.logDebug({ boardHeight, boardWidth, pieceSize })

    const pieceDragger = PieceDragger({ boardContainer, boardElement: appElement })
    const piecePositions = yield* Effect.try(() => loadPiecePositions())

    for (const row of savedBoard) {
        for (const piece of row) {
            const definition = pieceDefinitionLookup.get(piece.definitionId)!
            const newPiece = yield* Effect.promise(() => cutPiece({ piece: { ...piece, definition }, image, pieceSize, boardHeight, boardWidth }))
            const placement = piecePositions.get(piece.id)!
            newPiece.style.left = `${placement.left}px`;
            newPiece.style.top = `${placement.top}px`;
            boardContainer.appendChild(newPiece);
            pieceDragger.makePieceDraggable({
                pieceId: piece.id, divElement: newPiece, onMouseUpCallback: ({ pieceId, left, top }) => {
                    piecePositions.set(pieceId, { left, top })
                    savePiecePositions(piecePositions)
                }
            })
        }
    }
})
    .pipe(Logger.withMinimumLogLevel(LogLevel.Debug))

export const resumeSavedPuzzle = () => Effect.runPromise(resumePuzzleProgram).catch(() => {
    createPuzzle()
})
export const createPuzzle = () => Effect.runPromise(createPuzzleProgram)