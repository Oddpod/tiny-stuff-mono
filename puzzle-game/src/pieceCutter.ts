import { PIECE_DIMENSIONS } from "./divPieces";
import type { PieceEntity } from "./pieceCreator";

interface PieceCutterParams {
	imageElement: HTMLImageElement;
	scaleFactorX: number;
	scaleFactorY: number;
	pieceSize: number;
}

export class PieceCutter {
	private image: HTMLImageElement;
	private canvasForCropping: HTMLCanvasElement;
	private uniqueCounter: number;
	private scaleFactorX: number;
	private scaleFactorY: number;
	private pieceSize: number;

	constructor({
		imageElement,
		scaleFactorX,
		scaleFactorY,
		pieceSize,
	}: PieceCutterParams) {
		this.image = imageElement;
		this.scaleFactorX = scaleFactorX;
		this.scaleFactorY = scaleFactorY;
		this.pieceSize = pieceSize;
		const canvasForCropping = document.createElement("canvas");
		canvasForCropping.width = 300;
		canvasForCropping.height = 200;
		this.canvasForCropping = canvasForCropping;
		this.uniqueCounter = 0;
	}
	cutPieceFromImage(piece: PieceEntity) {
		return new Promise<HTMLDivElement>((res) => {
			const img1 = new Image();
			img1.src = (document.getElementById("image") as HTMLImageElement)!.src;

			const croppingContext = this.canvasForCropping.getContext("2d")!;
			const shiftLeftBy =
				piece.definition.sides.left === "ear"
					? (15 * this.scaleFactorX * this.pieceSize) / PIECE_DIMENSIONS
					: 0;
			const shiftTopBy =
				piece.definition.sides.top === "ear"
					? (15 * this.scaleFactorY * this.pieceSize) / PIECE_DIMENSIONS
					: 0;
			const shiftedLeftX = Math.max(0, piece.boundingBox[0].x - shiftLeftBy);
			const shiftedTopY = Math.max(0, piece.boundingBox[0].y - shiftTopBy);

			const scaledUpWidth =
				(piece.definition.width * this.pieceSize) / PIECE_DIMENSIONS;
			const scaledUpHeight =
				(piece.definition.height * this.pieceSize) / PIECE_DIMENSIONS;

			croppingContext.drawImage(
				this.image,
				shiftedLeftX,
				shiftedTopY,
				scaledUpWidth,
				scaledUpHeight,
				0,
				0,
				Math.max(piece.definition.width, this.canvasForCropping.width),
				Math.max(piece.definition.height, this.canvasForCropping.height),
			);
			const croppedImageDataUrl = this.canvasForCropping.toDataURL();

			const croppedImage = new Image();
			croppedImage.src = croppedImageDataUrl;

			const clipPathId = `pieceClipPath_${this.uniqueCounter++}`;

			// 		clip-path: path("${piece.definition.path}");
			croppedImage.onload = () => {
				const style = `
					top: ${shiftedTopY}px;
					left: ${shiftedLeftX}px;
					width: ${scaledUpWidth}px;
					height: ${scaledUpHeight}px;
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
				const pathEl = document.createElementNS(
					"http://www.w3.org/2000/svg",
					"path",
				);
				pathEl.setAttribute("d", piece.definition.path);
				pathEl.setAttribute(
					"transform",
					`scale(${(this.pieceSize / PIECE_DIMENSIONS).toString()} ${(
						this.pieceSize / PIECE_DIMENSIONS
					).toString()})`,
				);
				clipPathEl.appendChild(pathEl);
				svgElement.appendChild(clipPathEl);

				const newPiece = document.createElement("div");
				newPiece.appendChild(svgElement);
				newPiece.appendChild(croppedImage);
				newPiece.setAttribute("style", style);
				newPiece.setAttribute("draggable", "");
				// newPiece.setAttribute("data-piece-name", piece.definition.path);

				return res(newPiece);
			};
		});
	}
}
