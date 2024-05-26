import { PIECE_DIMENSIONS } from "./divPieces";
import type { PieceEntity } from "./pieceCreator";

interface CutPieceFromImageParams {
	piece: PieceEntity;
	pieceSize: number;
	scaleFactorX: number;
	scaleFactorY: number;
}
let uniqueCounter = 0;
export function cutPieceFromImage({
	piece,
	pieceSize,
	scaleFactorX,
	scaleFactorY,
}: CutPieceFromImageParams) {
	return new Promise<HTMLDivElement>((res) => {
		const img1 = new Image();
		img1.src = (document.getElementById("image") as HTMLImageElement)!.src;

		const canvasForCropping = document.getElementById(
			"canvasForCropping",
		)! as HTMLCanvasElement;

		const croppingContext = canvasForCropping.getContext("2d")!;
		const shiftLeftBy = piece.definition.sidesWithEars.includes("left")
			? (15 * scaleFactorX * pieceSize) / PIECE_DIMENSIONS
			: 0;
		const shiftTopBy = piece.definition.sidesWithEars.includes("top")
			? (15 * scaleFactorY * pieceSize) / PIECE_DIMENSIONS
			: 0;
		const shiftedLeftX = Math.max(0, piece.boundingBox[0].x - shiftLeftBy);
		const shiftedTopY = Math.max(0, piece.boundingBox[0].y - shiftTopBy);

		console.log({ shiftLeftBy, shiftedLeftX });
		console.log(piece.boundingBox[0]);
		const scaledUpWidth =
			(piece.definition.width * pieceSize) / PIECE_DIMENSIONS;
		const scaledUpHeight =
			(piece.definition.height * pieceSize) / PIECE_DIMENSIONS;
		img1.onload = () => {
			croppingContext.drawImage(
				img1,
				shiftedLeftX,
				shiftedTopY,
				scaledUpWidth,
				scaledUpHeight,
				0,
				0,
				Math.max(piece.definition.width, canvasForCropping.width),
				Math.max(piece.definition.height, canvasForCropping.height),
				// canvasForCropping.width,
				// canvasForCropping.height,
				// piece.definition.width,
				// piece.definition.height,
			);
			const croppedImageDataUrl = canvasForCropping.toDataURL();

			const croppedImage = new Image();
			croppedImage.src = croppedImageDataUrl;

			const clipPathId = `pieceClipPath_${uniqueCounter++}`;

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
					`scale(${(pieceSize / PIECE_DIMENSIONS).toString()} ${(
						pieceSize / PIECE_DIMENSIONS
					).toString()})`,
				);
				clipPathEl.appendChild(pathEl);
				svgElement.appendChild(clipPathEl);

				const newPiece = document.createElement("div");
				newPiece.appendChild(svgElement);
				newPiece.appendChild(croppedImage);
				newPiece.setAttribute("style", style);
				newPiece.setAttribute("draggable", "");
				newPiece.setAttribute("data-piece-name", piece.definition.path);

				return res(newPiece);
			};
		};
	});
}
