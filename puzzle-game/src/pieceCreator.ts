import { getFitBoardDimensions } from "./piecePainter";
import { pieceDefinitions } from "./divPieces";

type PieceDefition = (typeof pieceDefinitions)[keyof typeof pieceDefinitions];
interface CreateRowWithPiecesParams {
	startPiece: PieceDefition;
	middlePieces: PieceDefition[];
	numMiddlePieces: number;
	rowIndex: number;
}

export interface PieceEntity {
	boundingBox: [{ x: number; y: number }, { x: number; y: number }];
	definition: PieceDefition;
}

interface PieceCreatorParams {
	canvasWidth: number;
	canvasHeight: number;
	pieceSize: number;
	pieceGap?: number;
}

export class PieceCreator {
	widthDimensions: { scaleToFitLengthFactor: number; numMiddlePieces: number };
	heightDimensions: { scaleToFitLengthFactor: number; numMiddlePieces: number };
	pieceSize: number;
	pieceGap: number;
	constructor({
		canvasWidth,
		canvasHeight,
		pieceSize,
		pieceGap = 0.0,
	}: PieceCreatorParams) {
		this.pieceSize = pieceSize;
		this.pieceGap = pieceGap;
		this.widthDimensions = getFitBoardDimensions({
			length: canvasWidth,
			pieceSize,
			pieceGap,
		});
		this.heightDimensions = getFitBoardDimensions({
			length: canvasHeight,
			pieceSize,
			pieceGap,
		});
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
				definition: startPiece,
			},
		];
		for (let i = 0; i < numMiddlePieces; i++) {
			const piece = middlePieces[i % middlePieces.length];
			piecesPlaced.push({
				boundingBox: [
					{
						x: this.pieceSize * (i + 1) + this.pieceGap,
						y: rowIndex * this.pieceSize,
					},
					{
						x: this.pieceSize * (i + 2) + this.pieceGap,
						y: (rowIndex + 1) * this.pieceSize + this.pieceGap,
					},
				],
				definition: piece,
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
			startPiece: pieceDefinitions.cornerPiece,
			middlePieces: [pieceDefinitions.sidePiece4, pieceDefinitions.sidePiece1],
		});
		piecesPlaced.push({
			boundingBox: [
				{
					x:
						(numMiddlePieces + 1) *
							this.pieceSize *
							this.widthDimensions.scaleToFitLengthFactor +
						this.pieceGap,
					y: 0,
				},
				{
					x:
						(numMiddlePieces + 2) * this.widthDimensions.scaleToFitLengthFactor,
					y: this.pieceSize * this.heightDimensions.scaleToFitLengthFactor,
				},
			],
			definition: pieceDefinitions.cornerPiece_90deg,
		});
		return piecesPlaced;
	};

	create() {
		const allPieces = this.createFirstRow(this.widthDimensions.numMiddlePieces);

		const numRows = this.heightDimensions.numMiddlePieces;
		const rowPieces = [
			{
				startPiece: pieceDefinitions.sidePiece2,
				middlePieces: [
					pieceDefinitions.centerPiece1,
					pieceDefinitions.centerPiece1_90deg,
				],
				endPiece: pieceDefinitions.sidePiece3,
			},
			{
				startPiece: pieceDefinitions.sidePiece3Eared,
				middlePieces: [
					pieceDefinitions.centerPiece1Eared_180deg,
					pieceDefinitions.centerPiece3Eared,
				],
				endPiece: pieceDefinitions.sidePiece3,
			},
			{
				startPiece: pieceDefinitions.sidePiece2Eared,
				middlePieces: [
					pieceDefinitions.centerPiece1_90deg,
					pieceDefinitions.centerPiece1,
				],
				endPiece: pieceDefinitions.sidePiece2Eared_180deg,
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
		// 		piece: endPiece,
		// 	});
		// }

		const { piecesPlaced } = this.createRowWithPieces({
			numMiddlePieces: this.widthDimensions.numMiddlePieces,
			rowIndex: numRows + 1,
			startPiece: pieceDefinitions.cornerPiece_270deg,
			middlePieces: [
				pieceDefinitions.sidePiece2Eared_270deg,
				// sidePiece3Holed,
				pieceDefinitions.sidePiece2Holed,
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
			definition: pieceDefinitions.cornerPiece2Eared,
		});

		return allPieces;
	}
}
