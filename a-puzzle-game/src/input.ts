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

previewFile()
fileInput.addEventListener("change", previewFile);
fileUpload.addEventListener("dragover", (event) => {
    // TODO: Styling when file is dragged over
    event.preventDefault()
    console.log("dragover")
})
fileUpload.addEventListener("drop", (event) => {
    event.preventDefault()
    if (!event.dataTransfer?.files) { return }

    fileInput.files = event.dataTransfer.files
    previewFile()
    console.log({ event, fileInput })
})