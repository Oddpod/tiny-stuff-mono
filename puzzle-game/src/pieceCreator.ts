import type { pieceDefinitions } from "./pieceDefintions";
import { findFittingPiece } from "./piecePicker";

type PieceDefinition = (typeof pieceDefinitions)[keyof typeof pieceDefinitions];
export interface PieceEntity {
	id: number;
	boundingBox: [{ x: number; y: number }, { x: number; y: number }];
	definition: PieceDefinition;
}

interface PieceCreatorParams {
	boardWidth: number;
	boardHeight: number;
	pieceSize: number;
	pieceGap?: number;
}

export function getFitBoardDimensions({
	length,
	pieceSize,
	pieceGap,
}: { pieceGap: number; length: number; pieceSize: number }) {
	const numPiecesHeight = length / (pieceSize + pieceGap);

	const numWholePieces = Math.floor(numPiecesHeight);
	const rest = numPiecesHeight - numWholePieces;
	const scaleToFitLengthFactor = 1 + (rest - pieceGap) / numWholePieces;
	const numMiddlePieces = numWholePieces - 2;

	// TODO: Fix imprecise cuttong when using scalefactor != 1
	return { scaleToFitLengthFactor: 1, numMiddlePieces };
}

export class PieceCreator {
	widthDimensions: { scaleToFitLengthFactor: number; numMiddlePieces: number };
	heightDimensions: { scaleToFitLengthFactor: number; numMiddlePieces: number };
	pieceSize: number;
	pieceGap: number;
	uniqueCounter: number;
	constructor({
		boardWidth,
		boardHeight,
		pieceSize,
		pieceGap = 0.0,
	}: PieceCreatorParams) {
		this.pieceSize = pieceSize;
		this.pieceGap = pieceGap;
		this.widthDimensions = getFitBoardDimensions({
			length: boardWidth,
			pieceSize,
			pieceGap,
		});
		this.heightDimensions = getFitBoardDimensions({
			length: boardHeight,
			pieceSize,
			pieceGap,
		});
		this.uniqueCounter = 0;
	}

	private scaleToFitWidth = () => {
		return (
			(this.pieceSize + this.pieceGap) *
			this.widthDimensions.scaleToFitLengthFactor
		);
	};
	private scaleToFitHeight = () => {
		return this.pieceSize * this.heightDimensions.scaleToFitLengthFactor;
	};

	createRandom = () => {
		const pieces: PieceEntity[][] = [];
		for (let j = 0; j < this.heightDimensions.numMiddlePieces + 2; j++) {
			const row: PieceEntity[] = [];
			let toTheLeft = undefined;
			let toTheTop = undefined;
			const isLastRow = j === this.heightDimensions.numMiddlePieces + 1;
			for (let i = 0; i < this.widthDimensions.numMiddlePieces + 2; i++) {
				toTheTop = pieces[j - 1]?.[i]?.definition.sides.bottom;
				const pieceDef = findFittingPiece({
					toTheLeft,
					toTheTop,
					lastInRow: i === this.widthDimensions.numMiddlePieces + 1,
					isLastRow,
				});
				row.push({
					id: this.uniqueCounter++,
					boundingBox: [
						{
							x: i * this.scaleToFitWidth(),
							y:
								j *
								this.pieceSize *
								this.heightDimensions.scaleToFitLengthFactor,
						},
						{
							x: (i + 1) * this.scaleToFitWidth(),
							y: (j + 1) * this.scaleToFitHeight(),
						},
					],
					definition: pieceDef,
				});
				toTheLeft = pieceDef.sides.right;
			}
			pieces.push(row);
		}
		return pieces;
	};
}
