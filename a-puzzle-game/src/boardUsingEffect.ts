import { Effect, LogLevel, Logger } from "effect";
import { cutPiece } from "./cutPiece";
import { loadChosenImage, readConfig, setChosenImage } from "./input";
import { checkCollision, isWithinRangeInclusive, loadImage } from "./utils";
import { Piece, PIECE_DIMENSIONS, pieceDefinitionLookup } from "./pieceDefintions";
import { createBoard, PieceEntity } from "./makeBoard";
import { PieceDragger } from "./makePieceDraggable";
import { resetToDefaultImage } from "./previewFile";
import { getSavedImage, loadPiecePositions, loadSavedBoard, loadSavedPuzzleDimensions, saveBoard, saveImage, savePiecePositions, savePuzzleDimensions } from "./storeState";
import { calculateBoardDimensions, getRandomCoordinatesOutsideBoard, type PiecePositionLookup, setBoardDimensions } from "./board";
import { clickPieceIntoPlace, HtmlPieceElement } from "./clickPieceInPlace";
import { clickIntoPlaceAndCombine } from "./clickIntoPlaceAndCombine";

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
                    const result = clickIntoPlaceAndCombine({ piece, pieceSize })
                    if (result) {
                        const { combinedPieceDiv, id, pieceIds } = result
                        pieceDragger.makePieceDraggable({ divElement: combinedPieceDiv })
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

    function findAllPiecesTouchingCombinedDiv(combinedPieceDiv: HTMLDivElement, boundingBox: PieceEntity["boundingBox"]) {
        const allPieces = document.querySelectorAll<HtmlPieceElement>(".piece")
        console.log({ allPieces })
        const piecesInside = [];
        const boundingRect = combinedPieceDiv.getBoundingClientRect()
        const rect = new DOMRect(boundingRect.x, boundingRect.y, boundingBox[1].x - boundingBox[0].x, boundingBox[1].y - boundingBox[0].y)
        console.log({ rect })
        for (const element of allPieces) {
            const box = element.getBoundingClientRect();
            const alreadyInCombinedDiv = combinedPieceDiv.id === element.parentElement?.parentElement?.id
            if (
                checkCollision(rect, box) && !alreadyInCombinedDiv
            ) {
                piecesInside.push(element);
            }
        };
        return piecesInside;
    }
    const combinedPiecesLookup = new Map<number, { boundingBox: PieceEntity["boundingBox"] }>()
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
                        if (result.didCombine) {
                            return
                        }
                        const { combinedPieceDiv, connectedPieceId, id } = result

                        const connectedPiece = savedBoard.flat().find(p => p.id === connectedPieceId)!
                        const xMin = Math.min(piece.boundingBox[0].x, connectedPiece.boundingBox[0].x)
                        const xMax = Math.max(piece.boundingBox[1].x, connectedPiece.boundingBox[1].x)
                        const yMin = Math.min(piece.boundingBox[0].y, connectedPiece.boundingBox[0].y)
                        const yMax = Math.max(piece.boundingBox[1].y, connectedPiece.boundingBox[1].y)
                        console.log({ xMin, xMax, yMin, yMax })
                        combinedPiecesLookup.set(id, { boundingBox: [{ x: xMin, y: yMin }, { x: xMax, y: yMax }] })
                        // combinedPiecesLookup.set(id, pieceIds)
                        pieceDragger.makePieceDraggable({
                            divElement: combinedPieceDiv, onMouseUpCallback: (_) => {
                                // const allChildPieces = combinedPieceDiv.querySelectorAll<HtmlPieceElement>(".piece")

                                // for (const pieceDiv of allChildPieces) {
                                //     const piece = savedBoard.flat().find(p => p.id === Number.parseInt(pieceDiv.dataset.pieceId))!
                                //     const wantedPieces = [piece.connections.bottom, piece.connections.right, piece.connections.bottom, piece.connections.left]
                                // }
                                const combinedPiece = combinedPiecesLookup.get(id)!
                                const pieces = findAllPiecesTouchingCombinedDiv(combinedPieceDiv, combinedPiece.boundingBox)

                                console.log({ pieces })
                                for (const pieceDiv of pieces) {
                                    const hasCombinedDiv = pieceDiv.parentElement !== null && pieceDiv.parentElement?.id !== "board-container"
                                    if (!hasCombinedDiv) {
                                        const pieceToTry = savedBoard.flat().find(p => p.id === Number.parseInt(pieceDiv.dataset.pieceId))!
                                        const pieceDefinition = pieceDefinitionLookup.get(Number.parseInt(pieceDiv.dataset.definitionId))!
                                        const { didCombine = false } = clickIntoPlaceAndCombine({ piece: { ...pieceToTry, definition: pieceDefinition }, pieceSize })

                                        if (didCombine) {
                                            const xMin = Math.min(combinedPiece.boundingBox[0].x, pieceToTry.boundingBox[0].x)
                                            const xMax = Math.max(combinedPiece.boundingBox[1].x, pieceToTry.boundingBox[1].x)
                                            const yMin = Math.min(combinedPiece.boundingBox[0].y, pieceToTry.boundingBox[0].y)
                                            const yMax = Math.max(combinedPiece.boundingBox[1].y, pieceToTry.boundingBox[1].y)
                                            console.log("new", { xMin, xMax, yMin, yMax })
                                            combinedPiecesLookup.set(id, { boundingBox: [{ x: xMin, y: yMin }, { x: xMax, y: yMax }] })
                                        }
                                    }
                                }

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