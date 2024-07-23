import { Effect, LogLevel, Logger } from "effect";
import { cutPiece } from "./cutPiece";
import { loadChosenImage, readConfig, setChosenImage } from "./input";
import { checkCollision, isWithinRangeInclusive, loadImage } from "./utils";
import { Piece, PIECE_DIMENSIONS, pieceDefinitionLookup } from "./pieceDefintions";
import { createBoard, PieceEntity } from "./makeBoard";
import { PieceDragger } from "./makePieceDraggable";
import { resetToDefaultImage } from "./previewFile";
import { getSavedImage, loadPiecePositions, loadSavedBoard, loadSavedPuzzleDimensions, saveBoard, SavedBoard, saveImage, savePiecePositions, savePuzzleDimensions } from "./storeState";
import { calculateBoardDimensions, getRandomCoordinatesOutsideBoard, type PiecePositionLookup, setBoardDimensions } from "./board";
import { clickPieceIntoPlace, HtmlPieceElement } from "./clickPieceInPlace";
import { clickIntoPlaceAndCombine, expandPieceGroupTop, getCombineParams, PlaceAndCombineResult } from "./clickIntoPlaceAndCombine";
import { checkOverLapOnTop } from "./overlap";

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

    const combinedPiecesLookup = new Map<number, { pieceIds: Set<number> }>()
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
                    const res = clickIntoPlaceAndCombine({ piece: { ...piece, definition }, pieceSize })
                    if (res.result === PlaceAndCombineResult.Nothing) return

                    if (res.result === PlaceAndCombineResult.ExpandedGroup) {
                        const { groupDivId } = res
                        const groupPiece = combinedPiecesLookup.get(groupDivId)!
                        groupPiece.pieceIds.add(piece.id)
                        combinedPiecesLookup.set(groupDivId!, groupPiece)
                        return
                    }

                    const { combinedPieceDiv, connectedPieceId, id } = res

                    combinedPiecesLookup.set(id, { pieceIds: new Set([connectedPieceId, piece.id]) })
                    pieceDragger.makePieceDraggable({
                        divElement: combinedPieceDiv, onMouseUpCallback: (_) => {
                            onPieceGroupMouseUp(combinedPiecesLookup, id, combinedPieceDiv, savedBoard, definition, pieceSize);
                            // const domRect = combinedPiece.getBoundingClientRect()
                            // const elements = document.elementsFromPoint(domRect.x, domRect.y)
                            // console.log({ elements })
                        }
                    })
                    boardContainer.appendChild(combinedPieceDiv)
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

function findAllPiecesTouchingCombinedDiv(combinedPieceDiv: HTMLDivElement) {
    const allPieces = document.querySelectorAll<HtmlPieceElement>(".piece")
    console.log({ allPieces })
    const piecesInside = [];
    const rect = combinedPieceDiv.getBoundingClientRect()
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

function onPieceGroupMouseUp(combinedPiecesLookup: Map<number, { pieceIds: Set<number>; }>, id: number, combinedPieceDiv: HTMLDivElement, savedBoard: SavedBoard, definition: Piece, pieceSize: number) {
    const combinedPiece = combinedPiecesLookup.get(id)!;
    const pieces = findAllPiecesTouchingCombinedDiv(combinedPieceDiv);

    console.log({ pieces });
    for (const pieceDiv of pieces) {
        const hasCombinedDiv = pieceDiv.parentElement !== null && pieceDiv.parentElement?.id !== "board-container";
        if (!hasCombinedDiv) {
            const pieceToTry = savedBoard.flat().find(p => p.id === Number.parseInt(pieceDiv.dataset.pieceId))!;

            // TODO: Same for right, bottom and left connections
            if (combinedPiece.pieceIds.has(pieceToTry.connections.top ?? -1)) {
                const { pieceDomRect, hitOffsetForEar, pieceDiv } = getCombineParams({ ...pieceToTry, definition }, pieceSize);
                const { isOverLapping, wantedPieceDomRect, wantedPiece } = checkOverLapOnTop({ connections: pieceToTry.connections, pieceDomRect, hitOffsetForEar });
                if (isOverLapping) {
                    expandPieceGroupTop({ combinedParentDiv: combinedPieceDiv, piece: { ...pieceToTry, definition }, pieceDiv, pieceDomRect, pieceSize, wantedPiece, wantedPieceDomRect });
                    combinedPiece.pieceIds.add(pieceToTry.id);
                    combinedPiecesLookup.set(id, combinedPiece);
                }
            }
            // const pieceDefinition = pieceDefinitionLookup.get(Number.parseInt(pieceDiv.dataset.definitionId))!
            // const res = clickIntoPlaceAndCombine({ piece: { ...pieceToTry, definition: pieceDefinition }, pieceSize })
            // if (res.result === PlaceAndCombineResult.ExpandedGroup) {
            //     combinedPiece.pieceIds.add(pieceToTry.id)
            //     combinedPiecesLookup.set(id, combinedPiece)
            // }
        }
    }

    console.log({ pieces });
}
