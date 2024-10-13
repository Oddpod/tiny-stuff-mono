import { PIECE_DIMENSIONS } from "./pieceDefinitions";
import type { PieceEntity } from "./makeBoard";
import { loadImage } from "./utils";
import type { HtmlPieceElement } from "./constants";
import type { PieceDimensions } from "./board";

const canvasForCropping = document.createElement("canvas");
canvasForCropping.width = 300;
canvasForCropping.height = 200;
const croppingContext = canvasForCropping.getContext("2d")!;

let uniqueCounter = 0;

export interface CutPieceParams {
	pieceDimensions: PieceDimensions;
	piece: Pick<PieceEntity, "definition" | "coords">;
	image: HTMLImageElement;
	toImageHeight: (_: number) => number;
	toImageWidth: (_: number) => number;
}
const cutPiece = async ({
	piece,
	pieceDimensions: { pieceHeight, pieceWidth },
	image,
	toImageHeight,
	toImageWidth,
}: CutPieceParams) => {
	const shiftLeftByFactor =
		piece.definition.sides.left === "ear" ? 15 / PIECE_DIMENSIONS : 0;
	const shiftTopBy =
		piece.definition.sides.top === "ear" ? 15 / PIECE_DIMENSIONS : 0;
	const shiftedLeftX = toImageWidth(
		Math.max(0, piece.coords.col - shiftLeftByFactor),
	);
	const shiftedTopY = toImageHeight(Math.max(0, piece.coords.row - shiftTopBy));

	const scaledUpWidth = toImageWidth(piece.definition.width / PIECE_DIMENSIONS);
	const scaledUpHeight = toImageHeight(
		piece.definition.height / PIECE_DIMENSIONS,
	);

	const boardPieceWidth =
		(piece.definition.width * pieceWidth) / PIECE_DIMENSIONS;
	const boardPieceHeight =
		(piece.definition.height * pieceHeight) / PIECE_DIMENSIONS;

	canvasForCropping.width = boardPieceWidth;
	canvasForCropping.height = boardPieceHeight;

	croppingContext.drawImage(
		image,
		shiftedLeftX,
		shiftedTopY,
		scaledUpWidth,
		scaledUpHeight,
		0,
		0,
		boardPieceWidth,
		boardPieceHeight,
	);
	const croppedImageDataUrl = canvasForCropping.toDataURL();

	const clipPathId = `pieceClipPath_${uniqueCounter++}`;

	const croppedImage = await loadImage(croppedImageDataUrl);
	const style = `
        width: ${boardPieceWidth}px;
        height: ${boardPieceHeight}px;
    `;

	const imgStyle = `
        width: 100%;
        height: 100%;
        clip-path: url(#${clipPathId});
    `;

	croppedImage.setAttribute("style", imgStyle);

	const svgElement = document.createElementNS(
		"http://www.w3.org/2000/svg",
		"svg",
	);
	svgElement.setAttribute("width", "0");
	svgElement.setAttribute("height", "0");
	const clipPathEl = document.createElementNS(
		"http://www.w3.org/2000/svg",
		"clipPath",
	);
	clipPathEl.id = clipPathId;
	const pathEl = document.createElementNS("http://www.w3.org/2000/svg", "path");
	pathEl.setAttribute("d", piece.definition.path);

	const scaleToFitBoardX = pieceWidth / PIECE_DIMENSIONS;
	const scaleToFitBoardY = pieceHeight / PIECE_DIMENSIONS;
	pathEl.setAttribute(
		"transform",
		`scale(${scaleToFitBoardX.toString()} ${scaleToFitBoardY.toString()})`,
	);
	clipPathEl.appendChild(pathEl);
	svgElement.appendChild(clipPathEl);

	const newPiece = document.createElement("div");
	newPiece.appendChild(svgElement);
	newPiece.appendChild(croppedImage);
	newPiece.setAttribute("style", style);
	if (shiftLeftByFactor >= 0) {
		newPiece.style.marginLeft = `-${shiftLeftByFactor * pieceWidth}px`;
	}
	if (shiftTopBy >= 0) {
		newPiece.style.marginTop = `-${shiftTopBy * pieceHeight}px`;
	}

	return newPiece as HtmlPieceElement;
};

export interface PuzzleDimensions {
	widthInPieces: number;
	heightInPieces: number;
}
interface PieceCutterParams
	extends Omit<CutPieceParams, "piece" | "toImageHeight" | "toImageWidth"> {
	puzzleDimensions: PuzzleDimensions;
}

export function PieceCutter({ puzzleDimensions, ...rest }: PieceCutterParams) {
	const toImageWidth = (width: number) =>
		(width * rest.image.width) / puzzleDimensions.widthInPieces;
	const toImageHeight = (height: number) =>
		(height * rest.image.height) / puzzleDimensions.heightInPieces;
	return (piece: Parameters<typeof cutPiece>[0]["piece"]) =>
		cutPiece({ piece, toImageHeight, toImageWidth, ...rest });
}
