import { Effect } from "effect";
import type { PieceEntity } from "./pieceCreator";
import { findFittingPiece } from "./piecePicker";
import type { DimConfigWithPieceSize } from "./loadAndAddImage";

interface CreateBoardInput extends Omit<DimConfigWithPieceSize, 'imageSrc'> {
    image: HTMLImageElement
}

let uniqueCounter = 0

export const createBoard = ({ widthInPieces: width, heightInPieces: height, pieceSize }: CreateBoardInput): Effect.Effect<PieceEntity[][], Error> => {
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