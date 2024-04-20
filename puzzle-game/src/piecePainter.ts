import {
	centerPiece1,
	centerPiece1Eared_180deg,
	centerPiece1_90deg,
	centerPiece2,
	centerPiece3Eared,
	cornerPiece,
	sidePiece1,
	sidePiece2,
	sidePiece2Eard_180deg,
	sidePiece2Eared,
	sidePiece3,
	sidePiece4,
	sidePiece5,
} from "./pieces";

interface FillRowWithPiecesParams {
	ctx: CanvasRenderingContext2D;
	startPiece: string;
	middlePieces: string[];
	numMiddlePieces: number;
	rowIndex: number;
}

const pieceSize = 50;
const pieceGap = 0.01;

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

	for (let i = 0; i < numMiddlePieces; i++) {
		const piece = middlePieces[i % middlePieces.length];
		const piecePath = new Path2D(piece);
		ctx.translate(50 + pieceGap, 0);
		ctx.fill(piecePath);
	}
	return { piecesPlaced: numMiddlePieces };
}

export function fillFirstRow({
	ctx,
	...params
}: Pick<FillRowWithPiecesParams, "ctx" | "numMiddlePieces">) {
	fillRowWithPieces({
		ctx,
		...params,
		rowIndex: 0,
		startPiece: cornerPiece,
		middlePieces: [sidePiece4, sidePiece1],
	});
	const endPiecePath = new Path2D(cornerPiece);
	ctx.translate(50 + pieceGap, 0);
	ctx.rotate((90 * Math.PI) / 180);
	ctx.fill(endPiecePath);
	ctx.resetTransform();
}

function getMiddlePieceNumber(length: number) {
	const numPiecesHeight = length / pieceSize;

	const numWholePieces = Math.floor(length / pieceSize);
	const rest = numPiecesHeight - numWholePieces;
	const scaleToFitLengthFactor = 1 + (rest - pieceGap) / 24;
	const numMiddlePieces = Math.floor(length / pieceSize) - 2;
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
	const widthDimenions = getMiddlePieceNumber(canvasWidth);
	const heightDimensions = getMiddlePieceNumber(canvasHeight);

	ctx.scale(
		widthDimenions.scaleToFitLengthFactor,
		heightDimensions.scaleToFitLengthFactor,
	);

	fillFirstRow({ numMiddlePieces: widthDimenions.numMiddlePieces, ctx });
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
			endPiece: sidePiece2Eard_180deg,
		},
	];

	for (let i = 0; i < numRows -1; i++) {
		const { endPiece, middlePieces, startPiece } =
			rowPieces[i % rowPieces.length];
		fillMiddleRow({
			ctx,
			endPiece,
			numMiddlePieces: widthDimenions.numMiddlePieces,
			middlePieces,
			startPiece,
			rowIndex: i + 1,
		});
        ctx.scale(
            widthDimenions.scaleToFitLengthFactor,
            heightDimensions.scaleToFitLengthFactor,
        );
	}

    fillRowWithPieces({
		ctx,
        numMiddlePieces: widthDimenions.numMiddlePieces,
		rowIndex: numRows + 1,
		startPiece: cornerPiece,
		middlePieces: [sidePiece4, sidePiece1],
	});
	const endPiecePath = new Path2D(cornerPiece);
	ctx.translate(50 + pieceGap, 0);
	ctx.rotate((90 * Math.PI) / 180);
	ctx.fill(endPiecePath);
	ctx.resetTransform();
}

export function fillMiddleRow({
	ctx,
	endPiece,
	...params
}: FillRowWithPiecesParams & { endPiece: string }) {
	const { piecesPlaced } = fillRowWithPieces({
		ctx,
		...params,
	});

	const endPiecePath = new Path2D(endPiece);
	ctx.translate(50, 0);
	ctx.fill(endPiecePath);
	ctx.resetTransform();
}

export function fillMiddleRows({
	ctx,
	numRows,
	numCols,
}: Pick<FillRowWithPiecesParams, "ctx"> & {
	numRows: number;
	numCols: number;
}) {
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
			endPiece: sidePiece2Eard_180deg,
		},
	];

	for (let i = 0; i < numRows; i++) {
		const { endPiece, middlePieces, startPiece } =
			rowPieces[i % rowPieces.length];
		fillMiddleRow({
			ctx,
			endPiece,
			numMiddlePieces: numCols,
			middlePieces,
			startPiece,
			rowIndex: i + 1,
		});
	}
}
