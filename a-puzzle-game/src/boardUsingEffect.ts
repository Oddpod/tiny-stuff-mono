import { Effect, LogLevel, Logger } from "effect";
import { cutPiece } from "./cutPiece";
import { loadChosenImage, readConfig, setChosenImage } from "./input";
import { isWithinRangeInclusive, loadImage } from "./utils";
import { Piece, PIECE_DIMENSIONS, pieceDefinitionLookup } from "./pieceDefintions";
import { createBoard, PieceEntity } from "./makeBoard";
import { PieceDragger } from "./makePieceDraggable";
import { resetToDefaultImage } from "./previewFile";
import { getSavedImage, loadPiecePositions, loadSavedBoard, loadSavedPuzzleDimensions, saveBoard, saveImage, savePiecePositions, savePuzzleDimensions } from "./storeState";
import { calculateBoardDimensions, getRandomCoordinatesOutsideBoard, type PiecePositionLookup, setBoardDimensions } from "./board";
import { clickIntoPlaceAndCombine, clickPieceIntoPlace } from "./clickPieceInPlace";

const boardContainer = document.getElementById("board-container") as HTMLDivElement
const appElement = document.getElementById("app") as HTMLDivElement

const createPuzzleProgram = Effect.gen(function* (_) {
    const { heightInPieces, widthInPieces, imageSrc } = yield* readConfig()
    yield* Effect.tryPromise(() => loadChosenImage())
    savePuzzleDimensions([widthInPieces, heightInPieces])

    const image = yield* Effect.tryPromise(() => loadImage(imageSrc))
    saveImage(imageSrc)

    const { boardHeight, boardWidth, pieceSize } = calculateBoardDimensions({ image, widthInPieces, heightInPieces })
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
            newPiece.id = `piece-${piece.id}`
            newPiece.setAttribute("data-definition-id", piece.definition.id.toString())
            piecePositions.set(piece.id, placement)
            boardContainer.appendChild(newPiece);
            pieceDragger.makePieceDraggable({
                divElement: newPiece, onMouseUpCallback: ({ left, top }) => {
                    const combinedPiece = clickIntoPlaceAndCombine({ piece, pieceSize })
                    if (combinedPiece) {
                        pieceDragger.makePieceDraggable({ divElement: combinedPiece })
                        boardContainer.appendChild(combinedPiece)
                    }
                    piecePositions.set(piece.id, { left, top })
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
    if (!savedBoard[0][0].connections) {
        throw new Error("Old format")
    }

    yield* Effect.logDebug({ boardHeight, boardWidth, pieceSize })

    const pieceDragger = PieceDragger({ boardContainer, boardElement: appElement })
    const piecePositions = yield* Effect.try(() => loadPiecePositions())

    function findAllPiecesTouchingRect(rect: DOMRect, offset: number) {
        const allPieces = document.querySelectorAll(".piece")
        console.log({ allPieces })
        const piecesInside = [];
        for (const element of allPieces) {
            const box = element.getBoundingClientRect();
            const isTouchingRect =
                box.right >= rect.left && rect.top <= box.top ||
                box.left <= rect.right && box.top <= rect.top ||
                box.bottom >= rect.top && box.left
            if (
                isTouchingRect
            ) {
                piecesInside.push(element);
            }
        };
        return piecesInside;
    }
    const combinedPiecesLookup = new Map<number, number[]>()
    for (const row of savedBoard) {
        for (const piece of row) {
            const definition = pieceDefinitionLookup.get(piece.definitionId)!
            const newPiece = yield* Effect.promise(() => cutPiece({ piece: { ...piece, definition }, image, pieceSize, boardHeight, boardWidth }))
            const placement = piecePositions.get(piece.id)!
            newPiece.style.left = `${placement.left}px`;
            newPiece.style.top = `${placement.top}px`;
            newPiece.id = `piece-${piece.id}`
            newPiece.setAttribute("data-definition-id", definition.id.toString())
            newPiece.dataset.boundingbox = JSON.stringify(piece.boundingBox)
            boardContainer.appendChild(newPiece);
            pieceDragger.makePieceDraggable({
                divElement: newPiece,
                onMouseUpCallback: ({ left, top }) => {
                    // clickPieceIntoPlace({ boundingBox: piece.boundingBox, left, top, pieceId, definition, pieceSize })
                    const result = clickIntoPlaceAndCombine({ piece: { ...piece, definition }, pieceSize })
                    if (result) {
                        const { combinedPieceDiv, pieceIds, id } = result
                        combinedPiecesLookup.set(id, pieceIds)
                        pieceDragger.makePieceDraggable({
                            divElement: combinedPieceDiv, onMouseUpCallback: (_) => {
                                const pieces = findAllPiecesTouchingRect(combinedPieceDiv.getBoundingClientRect(), id)
                                const combinedPieceEntity = combinedPiecesLookup.get(id)!

                                console.log({ pieces })
                                // const domRect = combinedPiece.getBoundingClientRect()
                                // const elements = document.elementsFromPoint(domRect.x, domRect.y)
                                // console.log({ elements })
                            }
                        })
                        boardContainer.appendChild(combinedPieceDiv)
                    }
                    piecePositions.set(piece.id, { left, top })
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