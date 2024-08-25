import { Effect } from "effect";
import { previewFile } from "./previewFile";
import { clamp, gcd, loadImage } from "./utils";

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
const loadButton = document.getElementById("load-button") as HTMLButtonElement;

export const fileInput = fileUpload.querySelector("input") as HTMLInputElement;
const pieceCountElement = dimensionsConfig.querySelector(
	"#piece-count",
) as HTMLOutputElement;

let oldWidthValue = 2;
let oldHeightValue = 2;
dimensionsConfig.addEventListener("input", () => {
	const width = Number.parseInt(inputWidthElement.value);
	const height = Number.parseInt(inputHeightElement.value);
	if (!Number.isNaN(width)) {
		oldWidthValue = width;
	}
	if (!Number.isNaN(height)) {
		oldHeightValue = height;
	}
});

let aspectRatio = {
	width: 1,
	height: 1,
};

export interface InputConfig {
	widthInPieces: number;
	heightInPieces: number;
	imageSrc: string;
}

function setAspectRatio(image: HTMLImageElement) {
	const greatestCommonDivisor = gcd(image.height, image.width);
	aspectRatio = {
		width: image.width / greatestCommonDivisor,
		height: image.height / greatestCommonDivisor,
	};
	return aspectRatio;
}

export async function loadChosenImage() {
	const imageSrc = await previewFile();
	const image = await loadImage(imageSrc);
	setAspectRatio(image);
	inputHeightElement.value = Math.round(
		(Number.parseInt(inputWidthElement.value) * aspectRatio.height) /
			aspectRatio.width,
	).toString();
}

export function setChosenImage(
	image: HTMLImageElement,
	puzzleWidth: number,
): Promise<number> {
	imageElement.src = image.src;
	return new Promise((res, rej) => {
		imageElement.addEventListener("load", () => {
			const aspectRatio = setAspectRatio(image);
			inputWidthElement.value = puzzleWidth.toString();
			const adjustedHeight = Math.round(
				(puzzleWidth * aspectRatio.height) / aspectRatio.width,
			);
			inputHeightElement.value = adjustedHeight.toString();

			if (aspectRatio.height < aspectRatio.width) {
				const width =
					Math.floor(MAX_DIM_XY / aspectRatio.width) * aspectRatio.width;
				const height = Math.floor(
					(width * aspectRatio.height) / aspectRatio.width,
				);
				oldHeightValue = height;
				oldWidthValue = width;
				inputHeightElement.setAttribute("max", height.toString());
				inputWidthElement.setAttribute("max", width.toString());
			} else {
				const height =
					Math.floor(MAX_DIM_XY / aspectRatio.height) * aspectRatio.height;
				const width = Math.floor(
					(height * aspectRatio.width) / aspectRatio.height,
				);
				oldHeightValue = height;
				oldWidthValue = width;
				inputHeightElement.setAttribute("max", height.toString());
				inputWidthElement.setAttribute("max", width.toString());
			}
			pieceCountElement.innerText = (puzzleWidth * adjustedHeight).toString();
			return res(adjustedHeight);
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

export const MIN_PIECE_SIZE = Object.freeze(50);
const MAX_DIM_XY = Object.freeze(50);

inputWidthElement.addEventListener("change", (event: Event) => {
	const newValue = (event.target as HTMLInputElement).value;
	let newWidthInPieces = Number.parseInt(newValue);
	if (Number.isNaN(newWidthInPieces)) {
		inputWidthElement.value = oldWidthValue.toString();
		return;
	}
	newWidthInPieces =
		Math.floor(newWidthInPieces / aspectRatio.width) * aspectRatio.width;
	const inputMin = Number.parseInt(inputWidthElement.min);
	const inputMax = Number.parseInt(inputWidthElement.max);
	if (newWidthInPieces > inputMax) {
		newWidthInPieces = clamp(newWidthInPieces, inputMin, inputMax);
		inputWidthElement.value = newWidthInPieces.toString();
		inputHeightElement.value = inputHeightElement.max;
		pieceCountElement.innerText = (
			newWidthInPieces * Number.parseInt(inputHeightElement.value)
		).toString();
		return;
	}
	const adjustedHeight =
		(newWidthInPieces * aspectRatio.height) / aspectRatio.width;
	inputHeightElement.value = adjustedHeight.toString();
	inputWidthElement.value = newWidthInPieces.toString();
	pieceCountElement.innerText = (newWidthInPieces * adjustedHeight).toString();
});

inputHeightElement.addEventListener("change", (event: Event) => {
	const newValue = (event.target as HTMLInputElement).value;
	let newHeightInPieces = Number.parseInt(newValue);
	if (Number.isNaN(newHeightInPieces)) {
		inputHeightElement.value = oldHeightValue.toString();
		return;
	}
	newHeightInPieces =
		Math.floor(newHeightInPieces / aspectRatio.height) * aspectRatio.height;
	const inputMin = Number.parseInt(inputHeightElement.min);
	const inputMax = Number.parseInt(inputHeightElement.max);
	if (newHeightInPieces > inputMax) {
		newHeightInPieces = clamp(newHeightInPieces, inputMin, inputMax);
		inputHeightElement.value = newHeightInPieces.toString();
		inputWidthElement.value = inputWidthElement.max;
		return;
	}
	const adjustedWidth =
		(newHeightInPieces * aspectRatio.width) / aspectRatio.height;
	inputWidthElement.value = adjustedWidth.toString();
	inputHeightElement.value = newHeightInPieces.toString();
	pieceCountElement.innerText = (newHeightInPieces * adjustedWidth).toString();
});

inputWidthElement.addEventListener("focus", () => {
	loadButton.setAttribute("disabled", "");
});

inputWidthElement.addEventListener("blur", () => {
	loadButton.removeAttribute("disabled");
});

inputHeightElement.addEventListener("focus", () => {
	loadButton.setAttribute("disabled", "");
});

inputHeightElement.addEventListener("blur", () => {
	loadButton.removeAttribute("disabled");
});

fileInput.addEventListener("change", loadChosenImage);
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
