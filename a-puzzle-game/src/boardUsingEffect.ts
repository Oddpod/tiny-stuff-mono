import { Effect, LogLevel, Logger } from "effect";
import { cutPiece } from "./cutPiece";
import { type InputConfig, readConfig, loadChosenImage } from "./input";
import { clamp, loadImage } from "./utils";
import { PIECE_DIMENSIONS, PIECE_EAR_SIZE } from "./pieceDefintions";
import { createBoard } from "./makeBoard";
import { PieceDragger } from "./makePieceDraggable";

const boardContainer = document.getElementById("board-container") as HTMLDivElement
const boardElement = document.getElementById("board") as HTMLDivElement

interface CalculatePieceSizeParams extends Pick<InputConfig, 'heightInPieces' | 'widthInPieces'> {
    imageWidth: number;
    imageHeight: number;
}

const calculatePieceSize = ({ widthInPieces, heightInPieces, imageWidth, imageHeight }: CalculatePieceSizeParams) => {
    let pieceSize = 50;
    if (widthInPieces > heightInPieces) {
        pieceSize = boardElement.clientWidth / widthInPieces
    } else {
        pieceSize = boardElement.clientHeight / heightInPieces
    }
    Effect.logDebug({ pieceSize, widthInPieces, heightInPieces })
    return Effect.succeed(Math.round(pieceSize))
}

function getRandomBoardCoordinates({
    width,
    height,
    pieceSize,
}: { width: number; height: number; pieceSize: number }) {
    const shiftXY =
        pieceSize + (2 * PIECE_EAR_SIZE * pieceSize) / PIECE_DIMENSIONS;
    const left = clamp(0, Math.random() * (width - shiftXY), width - shiftXY);
    const top = clamp(0, Math.random() * (height - shiftXY), height - shiftXY);
    return { left, top };
}


const createPuzzleProgram = Effect.gen(function* (_) {
    // const { heightInPieces, widthInPieces, imageSrc } = yield* readConfig()
    const { aspectRatio, heightInPieces, image, widthInPieces } = yield* Effect.promise(() => loadChosenImage())
    // const image = yield* Effect.promise(() => loadImage(imageSrc))
    const pieceSize = yield* calculatePieceSize({ heightInPieces, widthInPieces, imageHeight: image.height, imageWidth: image.width })
    const board = yield* createBoard({ image, heightInPieces, widthInPieces, pieceSize })
    yield* Effect.logDebug({ pieceSize, image, boardElement })
    const pieceDragger = PieceDragger({ boardContainer, boardElement })
    for (const row of board) {
        for (const piece of row) {
            const newPiece = yield* Effect.promise(() => cutPiece({ piece, image, pieceSize, boardElement }))
            const placement = getRandomBoardCoordinates({ height: boardElement.clientHeight, pieceSize, width: boardElement.clientWidth })
            newPiece.style.left = `${placement.left}px`;
            newPiece.style.top = `${placement.top}px`;
            boardElement.appendChild(newPiece);
            pieceDragger.makePieceDraggable({ pieceId: piece.id, divElement: newPiece, onMouseUpCallback: () => { } })
        }
    }
}).pipe(Logger.withMinimumLogLevel(LogLevel.Debug))

export const createPuzzle = () => Effect.runPromise(createPuzzleProgram)