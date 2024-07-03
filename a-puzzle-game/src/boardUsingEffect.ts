import { Effect, pipe } from "effect";

const dimensionsConfig = document.getElementById("select-piece-dimensions") as HTMLFormElement

const inputWidth = dimensionsConfig.querySelector('input[id="dim-width]"') as HTMLInputElement
const inputHeight = dimensionsConfig.querySelector('input[id="dim-height]"') as HTMLInputElement


dimensionsConfig.addEventListener("submit", (event) => {
    event.preventDefault();
    createNewBoard();
})

const readDimConfig = () => {
    const width = Number.parseInt(inputWidth.value)
    const height = Number.parseInt(inputHeight.value)

    if (Number.isNaN(width) || Number.isNaN(height)) {
        return Effect.fail(new Error("Invalid user input"))
    }
    return Effect.succeed({
        width,
        height
    })
}


const createNewBoard = () => pipe(readDimConfig)