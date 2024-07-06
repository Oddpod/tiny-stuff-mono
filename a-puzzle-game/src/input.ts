import { Effect, } from "effect";

const dimensionsConfig = document.getElementById("select-piece-dimensions") as HTMLFormElement

const inputWidth = dimensionsConfig.querySelector('#dim-width') as HTMLInputElement
const inputHeight = dimensionsConfig.querySelector('#dim-height') as HTMLInputElement
const imageElement = (document.getElementById(
    "image",
) as HTMLImageElement)!;

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