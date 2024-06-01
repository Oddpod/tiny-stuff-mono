import { pieceDefinitions } from "./divPieces";
import { findFittingPiece } from "./piecePicker";

type PieceDefinition = (typeof pieceDefinitions)[keyof typeof pieceDefinitions];
interface CreateRowWithPiecesParams {
	startPiece: PieceDefinition;
	middlePieces: PieceDefinition[];
	numMiddlePieces: number;
	rowIndex: number;
}

export interface PieceEntity {
	boundingBox: [{ x: number; y: number }, { x: number; y: number }];
	definition: PieceDefinition;
}

interface PieceCreatorParams {
	canvasWidth: number;
	canvasHeight: number;
	pieceSize: number;
	pieceGap?: number;
}

function getFitBoardDimensions({
	length,
	pieceSize,
	pieceGap,
}: { pieceGap: number; length: number; pieceSize: number }) {
	const numPiecesHeight = length / (pieceSize + pieceGap);

	const numWholePieces = Math.floor(numPiecesHeight);
	const rest = numPiecesHeight - numWholePieces;
	const scaleToFitLengthFactor = 1 + (rest - pieceGap) / numWholePieces;
	const numMiddlePieces = numWholePieces - 2;

	return { scaleToFitLengthFactor, numMiddlePieces };
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

	private scaleToFitWidth() {
		return (
			(this.pieceSize + this.pieceGap) *
			this.widthDimensions.scaleToFitLengthFactor
		);
	}
	private createRowWithPieces = ({
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
						x:
							this.pieceSize * this.widthDimensions.scaleToFitLengthFactor +
							this.pieceGap,
						y:
							(rowIndex + 1) *
								this.pieceSize *
								this.heightDimensions.scaleToFitLengthFactor +
							this.pieceGap,
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
						x: (i + 1) * this.scaleToFitWidth(),
						y: rowIndex * (this.pieceSize + this.pieceGap),
					},
					{
						x:
							(this.pieceSize + this.pieceGap) *
							(i + 2) *
							this.widthDimensions.scaleToFitLengthFactor,
						y: (rowIndex + 1) * (this.pieceSize + this.pieceGap),
					},
				],
				definition: piece,
			});
		}
		return { piecesPlaced };
	};

	private createFirstRow = (
		numMiddlePieces: CreateRowWithPiecesParams["numMiddlePieces"],
	) => {
		const { piecesPlaced } = this.createRowWithPieces({
			numMiddlePieces,
			rowIndex: 0,
			startPiece: pieceDefinitions.cornerPieceLeftTop1,
			middlePieces: [
				pieceDefinitions.sidePieceTop4,
				pieceDefinitions.sidePieceTop1,
			],
		});
		piecesPlaced.push({
			boundingBox: [
				{
					x: (numMiddlePieces + 1) * this.scaleToFitWidth() + this.pieceGap,
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
			definition: pieceDefinitions.cornerPieceTopRight1,
		});
		return piecesPlaced;
	};

	createRandom() {
		const pieces: ReturnType<typeof this.create>[] = [];
		for (let j = 0; j < this.heightDimensions.numMiddlePieces + 2; j++) {
			// for (let j = 0; j < 5; j++) {
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
				if(!pieceDef){
					console.log({ i, j, pieceDef });
				}
				row.push({
					boundingBox: [
						{
							x:
								i *
								this.pieceSize *
								this.widthDimensions.scaleToFitLengthFactor,
							y:
								j *
								this.pieceSize *
								this.heightDimensions.scaleToFitLengthFactor,
						},
						{
							x:
								(i + 1) *
								this.pieceSize *
								this.widthDimensions.scaleToFitLengthFactor,
							y:
								(j + 1) *
								this.pieceSize *
								this.heightDimensions.scaleToFitLengthFactor,
						},
					],
					definition: pieceDef,
				});
				toTheLeft = pieceDef.sides.right;
			}
			pieces.push(row);
		}
		return pieces;
	}
	create() {
		const allPieces = this.createFirstRow(this.widthDimensions.numMiddlePieces);

		const numRows = this.createMiddleRows(allPieces);

		// this.createLastRow(numRows, allPieces);

		return allPieces;
	}

	private createLastRow(numRows: number, allPieces: PieceEntity[]) {
		const { piecesPlaced } = this.createRowWithPieces({
			numMiddlePieces: this.widthDimensions.numMiddlePieces,
			rowIndex: numRows + 1,
			startPiece: pieceDefinitions.cornerPieceLeftBottom1,
			middlePieces: [
				pieceDefinitions.sidePieceBottom2,
				// sidePiece3Holed,
				pieceDefinitions.sidePieceBottom1,
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
			definition: pieceDefinitions.cornerPieceRightBottom1,
		});
	}

	private createMiddleRows(allPieces: PieceEntity[]) {
		const numRows = this.heightDimensions.numMiddlePieces;
		const rowPieces = [
			{
				startPiece: pieceDefinitions.sidePieceLeft2,
				middlePieces: [
					pieceDefinitions.centerPiece1,
					pieceDefinitions.centerPiece8,
				],
				endPiece: pieceDefinitions.sidePieceRight3,
			},
			{
				startPiece: pieceDefinitions.sidePieceLeft1,
				middlePieces: [
					pieceDefinitions.centerPiece7,
					pieceDefinitions.centerPiece10,
				],
				endPiece: pieceDefinitions.sidePieceRight3,
			},
			{
				startPiece: pieceDefinitions.sidePieceLeft6,
				middlePieces: [
					pieceDefinitions.centerPiece8,
					pieceDefinitions.centerPiece1,
				],
				endPiece: pieceDefinitions.sidePieceRight4,
			},
		];

		for (let i = 0; i < rowPieces.length; i++) {
			const { endPiece, middlePieces, startPiece } =
				rowPieces[i % rowPieces.length];

			const { piecesPlaced } = this.createRowWithPieces({
				numMiddlePieces: this.widthDimensions.numMiddlePieces,
				middlePieces,
				startPiece,
				rowIndex: i + 1,
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
							(i + 1) *
							this.pieceSize *
							this.heightDimensions.scaleToFitLengthFactor,
					},
					{
						x:
							(this.widthDimensions.numMiddlePieces + 2) *
							this.pieceSize *
							this.widthDimensions.scaleToFitLengthFactor,
						y:
							(i + 2) *
							this.pieceSize *
							this.heightDimensions.scaleToFitLengthFactor,
					},
				],
				definition: endPiece,
			});
		}
		return numRows;
	}
}
