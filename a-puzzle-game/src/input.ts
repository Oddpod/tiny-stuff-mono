import { Effect, } from "effect";
import { previewFile } from "./previewFile";
import { loadImage } from "./utils";

const dimensionsConfig = document.getElementById("select-piece-dimensions") as HTMLFormElement

const inputWidth = dimensionsConfig.querySelector('#dim-width') as HTMLInputElement
const inputHeight = dimensionsConfig.querySelector('#dim-height') as HTMLInputElement
const imageElement = (document.getElementById(
    "image",
) as HTMLImageElement)!;
const fileUpload = document.getElementById(
    "file-upload",
) as HTMLInputElement;

export const fileInput = fileUpload.querySelector("input") as HTMLInputElement

let aspectRatio = 1;

export interface InputConfig {
    widthInPieces: number,
    heightInPieces: number,
    imageSrc: string,
}

export const readConfig = (): Effect.Effect<InputConfig, Error> => {
    const widthInPieces = Number.parseInt(inputWidth.value)
    const heightInPieces = Number.parseInt(inputHeight.value)
    const imageSrc = imageElement.src

    if (Number.isNaN(widthInPieces) || Number.isNaN(heightInPieces) || !imageSrc) {
        return Effect.fail(new Error("Invalid user input"))
    }
    return Effect.succeed({
        widthInPieces,
        heightInPieces,
        imageSrc
    })
}

inputWidth.addEventListener("change", (event: Event) => {
    const newValue = (event.target as HTMLInputElement).value;
    const newWidthInPieces = Number.parseInt(newValue)
    if (Number.isNaN(newWidthInPieces)) { return }
    inputHeight.value = (newWidthInPieces * aspectRatio).toString()
})

inputHeight.addEventListener("change", (event: Event) => {
    const newValue = (event.target as HTMLInputElement).value;
    const newHeightInPieces = Number.parseInt(newValue)
    if (Number.isNaN(newHeightInPieces)) { return }
    inputWidth.value = (newHeightInPieces / aspectRatio).toString()
})

export async function loadChosenImage() {
    const imageSrc = await previewFile()
    const image = await loadImage(imageSrc)
    let widthInPieces = Number.parseInt(inputWidth.value)
    let heightInPieces = Number.parseInt(inputHeight.value)
    aspectRatio = image.height / image.width;

    if (widthInPieces > heightInPieces) {
        heightInPieces = Math.round(widthInPieces * aspectRatio)
        inputHeight.value = heightInPieces.toString()
    } else {
        widthInPieces = Math.round(heightInPieces / aspectRatio)
        inputWidth.value = widthInPieces.toString()
    }

    let boardWidth = Math.min(image.width, window.innerWidth)
    let boardHeight = Math.min(image.height, window.innerHeight)
    if (image.width > image.height) {
        boardWidth = Math.min(image.width, window.innerWidth * 3 / 4)
        boardHeight = Math.round(boardWidth * aspectRatio)
    } else {
        boardHeight = Math.min(image.height, window.innerHeight * 3 / 4)
        boardWidth = Math.round(boardHeight / aspectRatio)
    }
    document.documentElement.style.setProperty(
        "--board-width",
        `${boardWidth.toString()}px`,
    );
    document.documentElement.style.setProperty(
        "--board-height",
        `${boardHeight.toString()}px`,
    );

    return { image, heightInPieces, widthInPieces, aspectRatio };
}
loadChosenImage()
fileInput.addEventListener("change", loadChosenImage);
fileUpload.addEventListener("dragover", (event) => {
    // TODO: Styling when file is dragged over
    event.preventDefault()
    console.log("dragover")
})
fileUpload.addEventListener("drop", (event) => {
    event.preventDefault()
    if (!event.dataTransfer?.files) { return }
    fileInput.files = event.dataTransfer.files
    loadChosenImage()
    console.log({ event, fileInput })
})