import { PIECE_DIMENSIONS } from "./pieceDefinitions";
import type { PieceEntity } from "./makeBoard";
import { loadImage } from "./utils";
import { SINGLE_PIECE_ZINDEX, type HtmlPieceElement } from "./constants";

const canvasForCropping = document.createElement("canvas");
canvasForCropping.width = 300;
canvasForCropping.height = 200;
const croppingContext = canvasForCropping.getContext("2d")!;

let uniqueCounter = 0;

export interface CutPieceParams {
	pieceSize: number;
	piece: PieceEntity;
	image: HTMLImageElement;
	boardWidth: number;
	boardHeight: number;
}
const cutPiece = async ({
	piece,
	pieceSize,
	image,
	boardHeight,
	boardWidth,
}: CutPieceParams) => {
	const shiftLeftBy =
		piece.definition.sides.left === "ear"
			? (15 * pieceSize) / PIECE_DIMENSIONS
			: 0;
	const shiftTopBy =
		piece.definition.sides.top === "ear"
			? (15 * pieceSize) / PIECE_DIMENSIONS
			: 0;
	const shiftedLeftX =
		(Math.max(0, piece.coords.col * pieceSize - shiftLeftBy) * image.width) /
		boardWidth;
	const shiftedTopY =
		(Math.max(0, piece.coords.row * pieceSize - shiftTopBy) * image.height) /
		boardHeight;

	const scaledUpWidth =
		(((piece.definition.width * pieceSize) / PIECE_DIMENSIONS) * image.width) /
		boardWidth;
	const scaledUpHeight =
		(((piece.definition.height * pieceSize) / PIECE_DIMENSIONS) *
			image.height) /
		boardHeight;

	const pieceWidth = (piece.definition.width * pieceSize) / PIECE_DIMENSIONS;
	const pieceHeight = (piece.definition.height * pieceSize) / PIECE_DIMENSIONS;

	canvasForCropping.width = pieceWidth;
	canvasForCropping.height = pieceHeight;

	croppingContext.drawImage(
		image,
		shiftedLeftX,
		shiftedTopY,
		scaledUpWidth,
		scaledUpHeight,
		0,
		0,
		pieceWidth,
		pieceHeight,
	);
	const croppedImageDataUrl = canvasForCropping.toDataURL();

	const clipPathId = `pieceClipPath_${uniqueCounter++}`;

	const croppedImage = await loadImage(croppedImageDataUrl);
	const style = `
        width: ${pieceWidth}px;
        height: ${pieceHeight}px;
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

	const scaleToFitBoardX = pieceSize / PIECE_DIMENSIONS;
	const scaleToFitBoardY = pieceSize / PIECE_DIMENSIONS;
	pathEl.setAttribute(
		"transform",
		`scale(${scaleToFitBoardX.toString()} ${scaleToFitBoardY.toString()})`,
	);
	clipPathEl.appendChild(pathEl);
	svgElement.appendChild(clipPathEl);

	const newPiece = document.createElement("div");
	newPiece.appendChild(svgElement);
	newPiece.appendChild(croppedImage);
	newPiece.setAttribute("data-piece-id", piece.id.toString());
	newPiece.setAttribute("style", style);
	if (shiftLeftBy >= 0) {
		newPiece.style.marginLeft = `-${shiftLeftBy}px`;
	}
	if (shiftTopBy >= 0) {
		newPiece.style.marginTop = `-${shiftTopBy}px`;
	}
	// TODO: Not needed for pieces in combinedDiv
	// ----
	newPiece.classList.add("piece");
	newPiece.setAttribute("data-coords", JSON.stringify(piece.coords));
	newPiece.style.zIndex = SINGLE_PIECE_ZINDEX;
	// ----

	return newPiece as HtmlPieceElement;
};

interface PieceCutterParams {
	pieceSize: number;
	image: HTMLImageElement;
	boardWidth: number;
	boardHeight: number;
}

export function PieceCutter(params: PieceCutterParams) {
	return (piece: PieceEntity) => cutPiece({ piece, ...params });
}
