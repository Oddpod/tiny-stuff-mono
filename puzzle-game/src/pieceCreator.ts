import { getFitBoardDimensions, type PieceEntity } from "./piecePainter";
import {
	centerPiece1,
	centerPiece1Eared_180deg,
	centerPiece1_90deg,
	centerPiece3Eared,
	cornerPiece,
	cornerPiece2Eared,
	cornerPiece_270deg,
	cornerPiece_90deg,
	sidePiece1,
	sidePiece2,
	sidePiece2Eared,
	sidePiece2Eared_180deg,
	sidePiece2Eared_270deg,
	sidePiece2Holed,
	sidePiece3,
	sidePiece4,
	sidePiece5,
} from "./pieces";

interface CreateRowWithPiecesParams {
	startPiece: string;
	middlePieces: string[];
	numMiddlePieces: number;
	rowIndex: number;
}

interface PieceCreatorParams {
	canvasWidth: number;
	canvasHeight: number;
	pieceSize: number;
}

export class PieceCreator {
	widthDimensions: { scaleToFitLengthFactor: number; numMiddlePieces: number };
	heightDimensions: { scaleToFitLengthFactor: number; numMiddlePieces: number };
	pieceSize: number;
	constructor({ canvasWidth, canvasHeight, pieceSize }: PieceCreatorParams) {
		this.pieceSize = pieceSize;
		const pieceGap = 0.0;
		this.widthDimensions = getFitBoardDimensions(canvasWidth, this.pieceSize);
		this.heightDimensions = getFitBoardDimensions(canvasHeight, this.pieceSize);
		console.log(this.widthDimensions);
		console.log(this.heightDimensions);
	}
	createRowWithPieces = ({
		startPiece,
		middlePieces,
		numMiddlePieces,
		rowIndex,
	}: CreateRowWithPiecesParams) => {
		const piecesPlaced: PieceEntity[] = [
			{
				boundingBox: [
					{
						x: 0,
						y:
							rowIndex *
							this.pieceSize *
							this.heightDimensions.scaleToFitLengthFactor,
					},
					{
						x: this.pieceSize * this.widthDimensions.scaleToFitLengthFactor,
						y:
							(rowIndex + 1) *
							this.pieceSize *
							this.heightDimensions.scaleToFitLengthFactor,
					},
				],
				path: startPiece,
			},
		];
		for (let i = 0; i < numMiddlePieces; i++) {
			const piece = middlePieces[i % middlePieces.length];
			piecesPlaced.push({
				boundingBox: [
					{ x: this.pieceSize * (i + 1), y: rowIndex * this.pieceSize },
					{ x: this.pieceSize * (i + 2), y: (rowIndex + 1) * this.pieceSize },
				],
				path: piece,
			});
		}
		return { piecesPlaced };
	};

	createFirstRow = (
		numMiddlePieces: CreateRowWithPiecesParams["numMiddlePieces"],
	) => {
		const { piecesPlaced } = this.createRowWithPieces({
			numMiddlePieces,
			rowIndex: 0,
			startPiece: cornerPiece,
			middlePieces: [sidePiece4, sidePiece1],
		});
		piecesPlaced.push({
			boundingBox: [
				// TODO: account for scalefactor
				{
					x:
						(numMiddlePieces + 1) *
						this.pieceSize *
						this.widthDimensions.scaleToFitLengthFactor,
					y: 0,
				},
				{
					x:
						(numMiddlePieces + 2) *
						this.pieceSize *
						this.widthDimensions.scaleToFitLengthFactor,
					y: this.pieceSize * this.heightDimensions.scaleToFitLengthFactor,
				},
			],
			path: cornerPiece_90deg,
		});
		return piecesPlaced;
	};

	create() {
		const allPieces = this.createFirstRow(this.widthDimensions.numMiddlePieces);

		const numRows = this.heightDimensions.numMiddlePieces;
		const rowPieces = [
			{
				startPiece: sidePiece2,
				middlePieces: [centerPiece1, centerPiece1_90deg],
				endPiece: sidePiece3,
			},
			{
				startPiece: sidePiece5,
				middlePieces: [centerPiece1Eared_180deg, centerPiece3Eared],
				endPiece: sidePiece3,
			},
			{
				startPiece: sidePiece2Eared,
				middlePieces: [centerPiece1_90deg, centerPiece1],
				endPiece: sidePiece2Eared_180deg,
			},
		];

		// for (let i = 0; i < numRows; i++) {
		// 	const { endPiece, middlePieces, startPiece } =
		// 		rowPieces[i % rowPieces.length];

		// 	const { piecesPlaced } = this.createRowWithPieces({
		// 		numMiddlePieces: this.widthDimensions.numMiddlePieces,
		// 		middlePieces,
		// 		startPiece,
		// 		rowIndex: i + 1,
		// 	});

		// 	allPieces.push(...piecesPlaced);
		// 	allPieces.push({
		// 		boundingBox: [
		// 			[
		// 				(this.widthDimensions.numMiddlePieces + 1) *
		// 					this.pieceSize *
		// 					this.widthDimensions.scaleToFitLengthFactor,
		// 				i * this.pieceSize * this.heightDimensions.scaleToFitLengthFactor,
		// 			],
		// 			[
		// 				(this.widthDimensions.numMiddlePieces + 2) *
		// 					this.pieceSize *
		// 					this.widthDimensions.scaleToFitLengthFactor,
		// 				(i + 1) * this.pieceSize * this.heightDimensions.scaleToFitLengthFactor,
		// 			],
		// 		],
		// 		path: endPiece,
		// 	});
		// }

		const { piecesPlaced } = this.createRowWithPieces({
			numMiddlePieces: this.widthDimensions.numMiddlePieces,
			rowIndex: numRows + 1,
			startPiece: cornerPiece_270deg,
			middlePieces: [
				sidePiece2Eared_270deg,
				// sidePiece3Holed,
				sidePiece2Holed,
				// sidePiece3Holed,
				// sidePiece4_180deg,
			],
		});

		allPieces.push(...piecesPlaced);
		allPieces.push({
			boundingBox: [
				{
					x:
						(this.widthDimensions.numMiddlePieces + 1) *
						this.pieceSize *
						this.widthDimensions.scaleToFitLengthFactor,
					y:
						(this.heightDimensions.numMiddlePieces + 1) *
						this.pieceSize *
						this.heightDimensions.scaleToFitLengthFactor,
				},
				{
					x:
						(this.widthDimensions.numMiddlePieces + 2) *
						this.pieceSize *
						this.widthDimensions.scaleToFitLengthFactor,
					y:
						(this.heightDimensions.numMiddlePieces + 2) *
						this.pieceSize *
						this.heightDimensions.scaleToFitLengthFactor,
				},
			],
			path: cornerPiece2Eared,
		});

		return allPieces;
	}
}
