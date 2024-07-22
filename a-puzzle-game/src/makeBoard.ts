import { Effect } from "effect";
import { findFittingPiece } from "./piecePicker";
import type { InputConfig } from "./input";

interface CreateBoardInput extends Omit<InputConfig, 'imageSrc'> {
    image: HTMLImageElement
    pieceSize: number
}

import type { Piece } from "./pieceDefintions";

export interface PieceEntity {
    id: number;
    boundingBox: [{ x: number; y: number }, { x: number; y: number }];
    definition: Piece;
    connections: {
        top: number | null,
        bottom: number | null,
        right: number | null,
        left: number | null
    }
}

let uniqueCounter = 0

export const createBoard = ({ widthInPieces: width, heightInPieces: height, pieceSize }: CreateBoardInput): Effect.Effect<PieceEntity[][], Error> => {
    const pieces: PieceEntity[][] = [];
    for (let j = 0; j < height; j++) {
        const row: PieceEntity[] = [];
        let toTheLeft = undefined;
        let toTheTop = undefined;
        const isLastRow = j === height - 1
        for (let i = 0; i < width; i++) {
            toTheTop = pieces[j - 1]?.[i]?.definition.sides.bottom
            const pieceDef = findFittingPiece({
                toTheLeft,
                toTheTop,
                lastInRow: i === width - 1,
                isLastRow,
            });
            row.push({
                id: uniqueCounter,
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
                connections: {
                    top: uniqueCounter - width >= 0 ? uniqueCounter - width : null,
                    left: uniqueCounter - 1 >= 0 ? uniqueCounter - 1 : null,
                    right: i === width - 1 ? null : uniqueCounter + 1,
                    bottom: isLastRow ? null : uniqueCounter + width
                },
                definition: pieceDef
            })

            uniqueCounter++;
            toTheLeft = pieceDef.sides.right;
        }
        pieces.push(row)
    }
    return Effect.succeed(pieces)
}