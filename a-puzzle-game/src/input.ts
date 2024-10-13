import { Effect } from "effect";
import { previewFile } from "./previewFile";
import { loadImage } from "./utils";

const dimensionsConfig = document.getElementById(
	"select-piece-dimensions",
) as HTMLFormElement;

const inputWidthElement = dimensionsConfig.querySelector(
	"#dim-width",
) as HTMLInputElement;
const inputHeightElement = dimensionsConfig.querySelector(
	"#dim-height",
) as HTMLInputElement;
const imageElement = (document.getElementById("image") as HTMLImageElement)!;
const fileUpload = document.getElementById("file-upload") as HTMLInputElement;
const dimWidthButtonPlus = document.getElementById(
	"dim-width-button-plus",
) as HTMLButtonElement;
const dimWidthButtonMinus = document.getElementById(
	"dim-width-button-minus",
) as HTMLButtonElement;
const dimHeightButtonPlus = document.getElementById(
	"dim-height-button-plus",
) as HTMLButtonElement;
const dimHeightButtonMinus = document.getElementById(
	"dim-height-button-minus",
) as HTMLButtonElement;

export const fileInput = fileUpload.querySelector("input") as HTMLInputElement;
const pieceCountElement = dimensionsConfig.querySelector(
	"#piece-count",
) as HTMLOutputElement;

// let aspectRatio = {
// 	width: 1,
// 	height: 1,
// };

export interface InputConfig {
	widthInPieces: number;

	heightInPieces: number;
	imageSrc: string;
}

// TODO: Setting for maintaining aspect ratio
// function setAspectRatio(image: HTMLImageElement) {
// 	const greatestCommonDivisor = gcd(image.height, image.width);
// 	aspectRatio = {
// 		width: image.width / greatestCommonDivisor,
// 		height: image.height / greatestCommonDivisor,
// 	};
// 	return aspectRatio;
// }

export async function loadChosenImage(imageSrc: string) {
	await loadImage(imageSrc);
	// TODO: Setting for maintaining aspect ratio
	// const aspectRatio = setAspectRatio(image);
}

export function setChosenImage(
	image: HTMLImageElement,
	puzzleWidth: number,
	puzzleHeight: number,
): Promise<void> {
	imageElement.src = image.src;
	return new Promise((res, _) => {
		imageElement.addEventListener("load", () => {
			// const aspectRatio = setAspectRatio(image);
			inputWidthElement.value = puzzleWidth.toString();

			inputHeightElement.value = puzzleHeight.toString();

			pieceCountElement.innerText = (puzzleWidth * puzzleHeight).toString();
			return res();
		});
	});
}

export const readConfig = (): Effect.Effect<InputConfig, Error> => {
	const widthInPieces = Number.parseInt(inputWidthElement.value);
	const heightInPieces = Number.parseInt(inputHeightElement.value);
	const imageSrc = imageElement.src;

	if (
		Number.isNaN(widthInPieces) ||
		Number.isNaN(heightInPieces) ||
		!imageSrc
	) {
		return Effect.fail(
			new Error(
				`Invalid user input: ${JSON.stringify({ widthInPieces, heightInPieces, imageSrc })}`,
			),
		);
	}
	return Effect.succeed({
		widthInPieces,
		heightInPieces,
		imageSrc,
	});
};

dimWidthButtonPlus.addEventListener("click", () => {
	const newWidthInPieces = +inputWidthElement.value + 1;

	const inputMax = Number.parseInt(inputWidthElement.max);
	if (newWidthInPieces > inputMax) {
		return;
	}

	inputWidthElement.value = newWidthInPieces.toString();
	pieceCountElement.innerText = (
		newWidthInPieces * +inputHeightElement.value
	).toString();
});
dimWidthButtonMinus.addEventListener("click", () => {
	const newWidthInPieces = +inputWidthElement.value - 1;

	if (Number.isNaN(newWidthInPieces)) {
		return;
	}

	const inputMin = Number.parseInt(inputWidthElement.min);
	if (newWidthInPieces < inputMin) {
		return;
	}

	inputWidthElement.value = newWidthInPieces.toString();
	pieceCountElement.innerText = (
		newWidthInPieces * +inputHeightElement.value
	).toString();
});

dimHeightButtonMinus.addEventListener("click", () => {
	const newHeightInPieces = +inputHeightElement.value - 1;
	if (Number.isNaN(newHeightInPieces)) {
		return;
	}

	const inputMin = Number.parseInt(inputHeightElement.min);
	if (newHeightInPieces < inputMin) {
		return;
	}

	inputHeightElement.value = newHeightInPieces.toString();
	pieceCountElement.innerText = (
		newHeightInPieces * +inputWidthElement.value
	).toString();
});

dimHeightButtonPlus.addEventListener("click", () => {
	const newHeightInPieces = +inputHeightElement.value + 1;
	if (Number.isNaN(newHeightInPieces)) {
		return;
	}
	const inputMax = Number.parseInt(inputHeightElement.max);
	if (newHeightInPieces > inputMax) {
		return;
	}

	inputHeightElement.value = newHeightInPieces.toString();
	pieceCountElement.innerText = (
		newHeightInPieces * +inputWidthElement.value
	).toString();
});

fileInput.addEventListener("change", async () => {
	const imageSrc = await previewFile();
	loadChosenImage(imageSrc);
});
fileUpload.addEventListener("dragover", (event) => {
	// TODO: Styling when file is dragged over
	event.preventDefault();
});
fileUpload.addEventListener("drop", (event) => {
	event.preventDefault();
	if (!event.dataTransfer?.files) {
		return;
	}

	fileInput.files = event.dataTransfer.files;
	previewFile();
});
