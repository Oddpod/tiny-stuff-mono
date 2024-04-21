import { type PieceEntity, fillBoardWithPieces } from "./piecePainter";
import "./style.css";

const app = document.querySelector<HTMLDivElement>("#app")!;

let allPiecesPlaced: PieceEntity[] = [];
const canvas = app.querySelector("canvas")!;
if (canvas.getContext) {
	const ctx = canvas.getContext("2d")!;
	//Loading of the home test image - img1
	const img1 = new Image();
	img1.src = (document.getElementById("image") as HTMLImageElement)!.src;
	//drawing of the test image - img1
	img1.onload = () => {
		canvas.height = img1.height;
		canvas.width = img1.width;
		ctx.fillStyle = "gray";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		//draw background image
		// ctx.drawImage(img1, 0, 0);

		ctx.fillStyle = "gray";

		allPiecesPlaced = fillBoardWithPieces({
			canvasWidth: canvas.width,
			ctx,
			canvasHeight: canvas.height,
		});
	};
}

canvas.addEventListener("click", (e: MouseEvent) => {
	const xPos = e.offsetX;
	const yPos = e.offsetY;

	console.log({ xPos, yPos });
	const clickedPiece = allPiecesPlaced.find(
		(pieceEntity) =>
			pieceEntity.boundingBox[0][0] < xPos &&
			pieceEntity.boundingBox[1][0] > xPos &&
			pieceEntity.boundingBox[0][1] < yPos &&
			pieceEntity.boundingBox[1][1] > yPos,
	);

	if (!clickedPiece) {
		return;
	}

	const img1 = new Image();
	img1.src = (document.getElementById("image") as HTMLImageElement)!.src;

	const canvasForCropping = document.getElementById(
		"canvasForCropping",
	)! as HTMLCanvasElement;
	// const canvasForCropping = document.createElement("canvas");
	// canvasForCropping.height = 50
	// canvasForCropping.width = 50
	const croppingContext = canvasForCropping.getContext("2d")!;

	img1.onload = () => {
		croppingContext.drawImage(
			img1,
			clickedPiece.boundingBox[0][0],
			clickedPiece.boundingBox[0][1],
			65,
			50,
			0,
			0,
			65,
			50,
		);
		const croppedImageDataUrl = canvasForCropping.toDataURL();

		const croppedImage = new Image();
		croppedImage.src = croppedImageDataUrl;

		croppedImage.onload = () => {
			// document
			// 	.getElementById("destination")!
			// 	.setAttribute("src", croppedImageDataUrl);
			console.log({ clickedPiece });
			// console.log({ allPiecesPlaced });
			const piecePath = new Path2D(clickedPiece.piece);
			const ctx = canvas.getContext("2d")!;
			const pattern = ctx.createPattern(croppedImage, "no-repeat")!;

			document.getElementById("firstDiv")?.setAttribute(
				"style",
				`background-image: url(${croppedImageDataUrl});
						clip-path: path("M 15 0 H 65 V 50 H 50 C 55 30 25 30 30 50 H 15 V 35 C -5 40 -5 10 15 15 V 0 Z");
					
						`,
			);
			ctx.translate(
				25 + clickedPiece.boundingBox[0][0],
				25 + clickedPiece.boundingBox[0][1],
			);
			ctx.scale(1.1, 1.1);
			ctx.fillStyle = pattern;
			ctx.fill(piecePath);
			ctx.resetTransform();
		};
	};
});
