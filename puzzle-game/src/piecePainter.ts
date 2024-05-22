import {
	centerPiece1,
	centerPiece1Eared_180deg,
	centerPiece1_90deg,
	centerPiece3Eared,
	cornerPiece,
	sidePiece1,
	sidePiece2,
	sidePiece2Eared_180deg,
	sidePiece2Eared,
	sidePiece3,
	sidePiece4,
	sidePiece5,
	cornerPiece_270deg,
	sidePiece2Eared_270deg,
	cornerPiece2Eared,
	sidePiece2Holed,
	cornerPiece_90deg,
} from "./pieces";

interface FillRowWithPiecesParams {
	ctx: CanvasRenderingContext2D;
	startPiece: string;
	middlePieces: string[];
	numMiddlePieces: number;
	rowIndex: number;
}

const pieceSize = 50;
const pieceGap = 0.0;

export interface PieceEntity {
	boundingBox: [{ x: number; y: number }, { x: number; y: number }];
	path: string;
}

export function fillRowWithPieces({
	ctx,
	startPiece,
	middlePieces,
	numMiddlePieces,
	rowIndex,
}: FillRowWithPiecesParams) {
	const cornerPiecePath = new Path2D(startPiece);
	ctx.translate(25, 25 + 50 * rowIndex + pieceGap);
	ctx.fill(cornerPiecePath);

	const piecesPlaced: PieceEntity[] = [
		{
			boundingBox: [
				// TODO: account for scaleFactor
				{ x: 0, y: rowIndex * 50 },
				{ x: 50, y: (rowIndex + 1) * 50 },
			],
			path: startPiece,
		},
	];
	for (let i = 0; i < numMiddlePieces; i++) {
		const piece = middlePieces[i % middlePieces.length];
		const piecePath = new Path2D(piece);
		ctx.translate(50 + pieceGap, 0);
		piecesPlaced.push({
			boundingBox: [
				[50 * (i + 1), rowIndex * 50],
				[50 * (i + 2), (rowIndex + 1) * 50],
			],
			path: piece,
		});
		ctx.fill(piecePath);
	}
	return { piecesPlaced };
}

export function fillFirstRow({
	ctx,
	numMiddlePieces,
}: Pick<FillRowWithPiecesParams, "ctx" | "numMiddlePieces">) {
	const { piecesPlaced } = fillRowWithPieces({
		ctx,
		numMiddlePieces,
		rowIndex: 0,
		startPiece: cornerPiece,
		middlePieces: [sidePiece4, sidePiece1],
	});
	const endPiecePath = new Path2D(cornerPiece_90deg);
	ctx.translate(50 + pieceGap, 0);
	// ctx.rotate((90 * Math.PI) / 180);
	ctx.fill(endPiecePath);
	ctx.resetTransform();
	piecesPlaced.push({
		boundingBox: [
			// TODO: account for scalefactor
			[(numMiddlePieces + 1) * 50, 0],
			[(numMiddlePieces + 2) * 50, 50],
		],
		path: cornerPiece_90deg,
	});
	return piecesPlaced;
}

export function getFitBoardDimensions({
	length,
	pieceSize,
	pieceGap,
}: { pieceGap: number; length: number; pieceSize: number }) {
	const numPiecesHeight = length / (pieceSize + pieceGap);

	const numWholePieces = Math.floor(numPiecesHeight);
	const rest = numPiecesHeight - numWholePieces;
	const scaleToFitLengthFactor =
		1 + rest / numWholePieces - pieceGap / (numWholePieces - 4);
	const numMiddlePieces = Math.floor(numPiecesHeight) - 2;
	return { scaleToFitLengthFactor, numMiddlePieces };
}
export function fillBoardWithPieces({
	canvasWidth,
	canvasHeight,
	ctx,
}: Pick<FillRowWithPiecesParams, "ctx"> & {
	canvasHeight: number;
	canvasWidth: number;
}) {
	const widthDimenions = getFitBoardDimensions(canvasWidth, pieceSize);
	const heightDimensions = getFitBoardDimensions(canvasHeight, pieceSize);

	ctx.scale(
		widthDimenions.scaleToFitLengthFactor,
		heightDimensions.scaleToFitLengthFactor,
	);
	const allPiecesPlaced = fillFirstRow({
		numMiddlePieces: widthDimenions.numMiddlePieces,
		ctx,
	});
	ctx.scale(
		widthDimenions.scaleToFitLengthFactor,
		heightDimensions.scaleToFitLengthFactor,
	);

	const numRows = heightDimensions.numMiddlePieces;
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

	for (let i = 0; i < numRows; i++) {
		const { endPiece, middlePieces, startPiece } =
			rowPieces[i % rowPieces.length];

		const { piecesPlaced } = fillRowWithPieces({
			ctx,
			numMiddlePieces: widthDimenions.numMiddlePieces,
			middlePieces,
			startPiece,
			rowIndex: i + 1,
		});

		const endPiecePath = new Path2D(endPiece);
		ctx.translate(50, 0);
		ctx.fill(endPiecePath);
		ctx.resetTransform();
		ctx.scale(
			widthDimenions.scaleToFitLengthFactor,
			heightDimensions.scaleToFitLengthFactor,
		);

		allPiecesPlaced.push(...piecesPlaced);
		allPiecesPlaced.push({
			boundingBox: [
				[(widthDimenions.numMiddlePieces + 1) * 50, i * 50],
				[(widthDimenions.numMiddlePieces + 2) * 50, (i + 1) * 50],
			],
			path: endPiece,
		});
	}

	const { piecesPlaced } = fillRowWithPieces({
		ctx,
		numMiddlePieces: widthDimenions.numMiddlePieces,
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
	const endPiecePath = new Path2D(cornerPiece2Eared);
	ctx.translate(50 + pieceGap, 0);
	ctx.rotate((-90 * Math.PI) / 180);
	ctx.fill(endPiecePath);
	ctx.resetTransform();

	allPiecesPlaced.push(...piecesPlaced);
	allPiecesPlaced.push({
		boundingBox: [
			[
				(widthDimenions.numMiddlePieces + 1) *
					50 *
					widthDimenions.scaleToFitLengthFactor,
				(widthDimenions.numMiddlePieces + 1) *
					50 *
					heightDimensions.scaleToFitLengthFactor,
			],
			[
				(widthDimenions.numMiddlePieces + 2) *
					50 *
					widthDimenions.scaleToFitLengthFactor,
				(widthDimenions.numMiddlePieces + 2) *
					50 *
					heightDimensions.scaleToFitLengthFactor,
			],
		],
		path: cornerPiece2Eared,
	});

	return allPiecesPlaced;
}
