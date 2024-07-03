import { Effect, Logger, LogLevel } from "effect";
import type { PieceEntity } from "./pieceCreator";
import { findFittingPiece } from "./piecePicker";

const dimensionsConfig = document.getElementById("select-piece-dimensions") as HTMLFormElement

const inputWidth = dimensionsConfig.querySelector('#dim-width') as HTMLInputElement
const inputHeight = dimensionsConfig.querySelector('#dim-height') as HTMLInputElement


dimensionsConfig.addEventListener("submit", (event) => {
    event.preventDefault();
    createPuzzle();
})

type DimConfig = {
    width: number,
    height: number
}

const readDimConfig = (): Effect.Effect<DimConfig, Error> => {
    const width = Number.parseInt(inputWidth.value)
    const height = Number.parseInt(inputHeight.value)

    if (Number.isNaN(width) || Number.isNaN(height)) {
        return Effect.fail(new Error("Invalid user input"))
    }
    return Effect.succeed({
        width,
        height,
    })
}


type DimConfigWithPieceSize = DimConfig & { pieceSize: number }
let uniqueCounter = 0
const createBoard = ({ width, height, pieceSize }: DimConfigWithPieceSize): Effect.Effect<PieceEntity[][], Error> => {
    const pieces: PieceEntity[][] = [];
    for (let j = 0; j < height; j++) {
        const row: PieceEntity[] = [];
        let toTheLeft = undefined;
        let toTheTop = undefined;
        const isLastRow = j === height
        for (let i = 0; i < width; i++) {
            toTheTop = pieces[j - 1]?.[i]?.definition.sides.bottom
            const pieceDef = findFittingPiece({
                toTheLeft,
                toTheTop,
                lastInRow: i === width,
                isLastRow,
            });
            row.push({
                id: uniqueCounter++,
                boundingBox: [
                    {
                        x: i * pieceSize,
                        y: j * pieceSize
                    },
                    {
                        x: (i + 1) * pieceSize,
                        y: (j + 1) * pieceSize
                    }
                ],
                definition: pieceDef
            })

            toTheLeft = pieceDef.sides.right;
        }
        pieces.push(row)
    }
    return Effect.succeed(pieces)
}

const calculateAndAddPieceSize = Effect.flatMap(({ width, height }: DimConfig) => {
    // TODO: Calculate actual pieceSize
    return Effect.succeed({ width, height, pieceSize: 50 } as DimConfigWithPieceSize)
})

const placePieces = (board: PieceEntity[][]) => {
    // TODO: place pieces
    return Effect.succeed(1)
}

export const createPuzzle = () => Effect.runSync(
    readDimConfig().pipe(
        Effect.tap((dim) => Effect.logDebug({ dim })),
        calculateAndAddPieceSize,
        Effect.tap((withPieceSize) => Effect.logDebug({ withPieceSize })),
        Effect.flatMap(createBoard),
        Effect.tap((board) => Effect.logDebug({ board })),
        Effect.flatMap(placePieces),
        Logger.withMinimumLogLevel(LogLevel.Debug)
    ))