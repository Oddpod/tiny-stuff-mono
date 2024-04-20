import {
	fillBoardWithPieces,
	fillFirstRow,
	fillMiddleRow,
	fillMiddleRows,
	fillRowWithPieces,
} from "./piecePainter";
import {
	centerPiece1,
	centerPiece1Eared,
	centerPiece1Eared_180deg,
	centerPiece1_90deg,
	centerPiece2,
	centerPiece3,
	centerPiece3Eared,
	centerPiece3Eared_180deg,
	centerPiece3Eared_90deg,
	centerPiece4,
	centerPiece5,
	centerPiece6,
	cornerPiece,
	sidePiece1,
	sidePiece2,
	sidePiece2Eard_180deg,
	sidePiece2Eared,
	sidePiece2_180deg,
	sidePiece2_90deg,
	sidePiece3,
	sidePiece4,
	sidePiece5,
} from "./pieces";
import "./style.css";

const app = document.querySelector<HTMLDivElement>("#app")!;

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
		ctx.drawImage(img1, 0, 0);

		ctx.fillStyle = "gray";

		fillBoardWithPieces({
			canvasWidth: canvas.width,
			ctx,
			canvasHeight: canvas.height,
		});

		fillMiddleRows({
			ctx,
			canvasWidth: canvas.width,
			canvasHeight: canvas.height,
		});
		// fillNthRow({
		// 	canvasWidth: canvas.width,
		// 	ctx,
		// 	rowIndex: 3,
		// 	middlePieces: [centerPiece1_90deg, centerPiece1],
		// 	endPiece: sidePiece2_180deg,
		// });
		// fillRowWithPieces({
		// 	ctx,
		// 	startPiece: sidePiece2,
		// 	middlePieces: [centerPiece1, centerPiece2],
		// 	canvasWidth: canvas.width,
		// 	endPiece: sidePiece2,
		// 	rowIndex: 1,
		// });
		// const cornerPiecePath = new Path2D(cornerPiece);
		// ctx.fill(cornerPiecePath);

		const sidePiece4Path = new Path2D(sidePiece4);
		ctx.translate(canvas.width / 2, canvas.height / 2);
		ctx.fill(sidePiece4Path);
		ctx.resetTransform();

		// ctx.translate(canvas.width, 0);
		// ctx.rotate((90 * Math.PI) / 180);

		// ctx.fill(cornerPiecePath);
		// ctx.resetTransform();

		// ctx.translate(canvas.width, canvas.height);
		// ctx.rotate((180 * Math.PI) / 180);

		// ctx.fill(cornerPiecePath);
		// ctx.resetTransform();

		// const bottomLeftCornerPiece = new Path2D(cornerPiecePath);

		// ctx.translate(0, canvas.height);
		// ctx.rotate((270 * Math.PI) / 180);

		// ctx.fill(bottomLeftCornerPiece);
		// ctx.resetTransform();

		// const sidePiece1Path = new Path2D(sidePiece1);

		// ctx.translate(0, 100);
		// ctx.rotate((-90 * Math.PI) / 180);
		// ctx.fill(sidePiece1Path);
		// ctx.resetTransform();

		// ctx.translate(canvas.width, canvas.height - 100);
		// ctx.rotate((90 * Math.PI) / 180);
		// ctx.fill(sidePiece1Path);
		// ctx.resetTransform();

		// const sidePiece2Path = new Path2D(sidePiece2);

		// ctx.translate(canvas.width, 50);
		// ctx.rotate((90 * Math.PI) / 180);
		// ctx.fill(sidePiece2Path);
		// ctx.resetTransform();

		// ctx.translate(50, canvas.height);
		// ctx.rotate((-90 * Math.PI) / 180);
		// ctx.fill(sidePiece2Path);
		// ctx.resetTransform();

		// const sidePiece3Path = new Path2D(sidePiece3);

		// ctx.translate(0, canvas.height - 100);
		// ctx.fill(sidePiece3Path);
		// ctx.resetTransform();

		// const centerPiece1Path = new Path2D(centerPiece1);

		// ctx.translate(canvas.width / 2, canvas.height / 2);
		// ctx.rotate((180 * Math.PI) / 180);
		// ctx.fill(centerPiece1Path);
		// ctx.resetTransform();

		// const centerPiece2Path = new Path2D(centerPiece2);

		// ctx.translate(75, canvas.height - 75);
		// ctx.fill(centerPiece2Path);
		// ctx.resetTransform();

		// const centerPiece3Path = new Path2D(centerPiece3);

		// ctx.translate(canvas.width / 2 - 100, canvas.height / 2);
		// ctx.fill(centerPiece3Path);
		// ctx.resetTransform();

		// const centerPiece4Path = new Path2D(centerPiece4);

		// ctx.translate(canvas.width / 2 - 200, canvas.height / 2);
		// ctx.fill(centerPiece4Path);
		// ctx.resetTransform();
	};
}
