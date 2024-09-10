import { Effect } from "effect";
import { findFittingPiece } from "./piecePicker";
import type { InputConfig } from "./input";

interface CreateBoardInput extends Omit<InputConfig, "imageSrc"> {
	image: HTMLImageElement;
	pieceSize: number;
}

import type { Piece } from "./pieceDefinitions";

export interface PieceEntity {
	id: number;
	definition: Piece;
	coords: {
		row: number;
		col: number;
	};
	connections: {
		top: number | null;
		bottom: number | null;
		right: number | null;
		left: number | null;
	};
}

export const createBoard = ({
	widthInPieces: width,
	heightInPieces: height,
	pieceSize,
}: CreateBoardInput): Effect.Effect<PieceEntity[][], Error> => {
	let uniqueCounter = 0;
	const pieces: PieceEntity[][] = [];
	for (let j = 0; j < height; j++) {
		const row: PieceEntity[] = [];
		let toTheLeft = undefined;
		let toTheTop = undefined;
		const isLastRow = j === height - 1;
		for (let i = 0; i < width; i++) {
			toTheTop = pieces[j - 1]?.[i]?.definition.sides.bottom;
			const pieceDef = findFittingPiece({
				toTheLeft,
				toTheTop,
				lastInRow: i === width - 1,
				isLastRow,
			});
			row.push({
				id: uniqueCounter,
				coords: {
					row: j,
					col: i,
				},
				connections: {
					top: uniqueCounter - width >= 0 ? uniqueCounter - width : null,
					left: row.length !== 0 ? uniqueCounter - 1 : null,
					right: i < width - 1 ? uniqueCounter + 1 : null,
					bottom: isLastRow ? null : uniqueCounter + width,
				},
				definition: pieceDef,
			});

			uniqueCounter++;
			toTheLeft = pieceDef.sides.right;
		}
		pieces.push(row);
	}
	return Effect.succeed(pieces);
};
