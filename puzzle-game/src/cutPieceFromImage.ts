import type { PieceEntity } from "./pieceCreator";

export function cutPieceFromImage(piece: PieceEntity, pieceSize: number) {
	return new Promise<HTMLDivElement>((res) => {
		const img1 = new Image();
		img1.src = (document.getElementById("image") as HTMLImageElement)!.src;

		const canvasForCropping = document.getElementById(
			"canvasForCropping",
		)! as HTMLCanvasElement;

		const croppingContext = canvasForCropping.getContext("2d")!;
		img1.onload = () => {
			croppingContext.drawImage(
				img1,
				piece.boundingBox[0].x,
				piece.boundingBox[0].y,
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
				const left = Math.max(
					0,
					piece.boundingBox[0].x -
						(piece.definition.width !== pieceSize ? 15 : 0),
				);
				const top = Math.max(
					0,
					piece.boundingBox[0].y -
						(piece.definition.height !== pieceSize ? 15 : 0),
				);
				console.dir({ left, top, box: piece.boundingBox });
				const style = `
				background-image: url(${croppedImageDataUrl});
				background-image: center;
				clip-path: path("${piece.definition.path}");
				top: ${top}px;
				left: ${left}px;
				width: ${piece.definition.width}px;
				height: ${piece.definition.height}px;
			`;
				document.getElementById("firstDiv")?.setAttribute(
					"style",
					`
					background-image: url(${croppedImageDataUrl});
					clip-path: path("${piece.definition.path}");
						`,
				);

				const newPiece = document.createElement("div");
				newPiece.setAttribute("style", style);
				newPiece.setAttribute("draggable", "");

				return res(newPiece);
			};
		};
	});
}
