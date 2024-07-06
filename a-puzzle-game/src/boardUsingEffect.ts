import { Effect, Logger, LogLevel, pipe } from "effect";
import type { PieceEntity } from "./pieceCreator";
import { findFittingPiece } from "./piecePicker";
import { cutPiece, CutPieceParams } from "./cutPiece";
import { InputConfig, readConfig } from "./input";
import { clamp } from "./utils";
import { PIECE_DIMENSIONS, PIECE_EAR_SIZE } from "./pieceDefintions";
import { createBoard } from "./makeBoard";
import { loadAndAddImage } from "./loadAndAddImage";
import { PieceDragger } from "./makePieceDraggable";

const dimensionsConfig = document.getElementById("select-piece-dimensions") as HTMLFormElement

const boardContainer = document.getElementById("board-container") as HTMLDivElement
const boardElement = document.getElementById("board") as HTMLDivElement

const calculateAndAddPieceSize = ({ widthInPieces: width, heightInPieces: height, ...rest }: InputConfig) => {
    // TODO: Calculate actual pieceSize
    return Effect.succeed({ ...rest, widthInPieces: width, heightInPieces: height, pieceSize: 50 })
}

const placePieces = (board: PieceEntity[][]) => {
    // TODO: place pieces
    return Effect.succeed(1)
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
    const result = yield* readConfig().pipe(
        Effect.tap((dim) => Effect.logDebug({ dim })),
        Effect.flatMap(calculateAndAddPieceSize),
        Effect.tap((withPieceSize) => Effect.logDebug({ withPieceSize })),
        Effect.tap((board) => Effect.logDebug({ board })),
        // Logger.withMinimumLogLevel(LogLevel.Debug)
    )
    const image = yield* Effect.promise(() => loadAndAddImage(result.imageSrc))
    const board = yield* createBoard({ ...result, image })
    const { pieceSize } = result
    const pieceDragger = PieceDragger({ boardContainer, boardElement })
    for (const row of board) {
        for (const piece of row) {
            const newPiece = yield* Effect.promise(() => cutPiece({ piece, image, pieceSize }))
            const placement = getRandomBoardCoordinates({ height: boardElement.clientHeight, pieceSize, width: boardElement.clientWidth })
            newPiece.style.left = `${placement.left}px`;
            newPiece.style.top = `${placement.top}px`;
            boardElement.appendChild(newPiece);
            pieceDragger.makePieceDraggable({ pieceId: piece.id, divElement: newPiece, onMouseUpCallback: () => { } })
        }
    }
})

export const createPuzzle = () => Effect.runPromise(createPuzzleProgram)