import type { PieceEntity } from "./pieceCreator";

interface CutPieceFromImageParams {
	piece: PieceEntity;
	pieceSize: number;
	scaleFactorX: number;
	scaleFactorY: number;
}
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
			? 15 * scaleFactorX
			: 0;
		const shiftTopBy = piece.definition.sidesWithEars.includes("top")
			? 15 * scaleFactorY
			: 0;
		const shiftedLeftX = Math.max(0, piece.boundingBox[0].x - shiftLeftBy);
		const shiftedTopY = Math.max(0, piece.boundingBox[0].y - shiftTopBy);
		img1.onload = () => {
			croppingContext.drawImage(
				img1,
				shiftedLeftX,
				shiftedTopY,
				piece.definition.width,
				piece.definition.height,
				0,
				0,
				piece.definition.width,
				piece.definition.height,
			);
			const croppedImageDataUrl = canvasForCropping.toDataURL();

			const croppedImage = new Image();
			croppedImage.src = croppedImageDataUrl;

			croppedImage.onload = () => {
				const style = `
				background-image: url(${croppedImageDataUrl});
				background-image: center;
				clip-path: path("${piece.definition.path}");
				top: ${shiftedTopY}px;
				left: ${shiftedLeftX}px;
				width: ${piece.definition.width}px;
				height: ${piece.definition.height}px;
			`;
				const newPiece = document.createElement("div");
				newPiece.setAttribute("style", style);
				newPiece.setAttribute("draggable", "");
				newPiece.setAttribute("data-piece-name", piece.definition.path);

				return res(newPiece);
			};
		};
	});
}
