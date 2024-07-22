import type { PieceEntity } from "./makeBoard";
import { type Piece, PIECE_DIMENSIONS, pieceDefinitionLookup } from "./pieceDefintions";
import { isWithinRangeInclusive } from "./utils";

interface ClickPieceIntoPlaceParams {
    left: number,
    top: number,
    pieceId: number,
    boundingBox: PieceEntity["boundingBox"],
    definition: Piece,
    pieceSize: number
}

interface HtmlPieceElement extends HTMLDivElement {
    dataset: {
        definitionId: string,
    }
}

const HIT_OFFSET = Object.freeze(5);

export function clickPieceIntoPlace({ pieceId, left, top, boundingBox, definition, pieceSize }: ClickPieceIntoPlaceParams) {
    const boardBoundingBox = document.getElementById("board")!.getBoundingClientRect()
    const pieceDiv = document.getElementById(`piece-${pieceId}`)

    const isCornerPiece = Object.values(definition.sides).filter(sideType => sideType === "flat").length === 2

    // TODO: refactor out to own method
    const shiftLeftBy =
        definition.sides.left === "ear"
            ? 15 * pieceSize / PIECE_DIMENSIONS
            : 0;
    const shiftTopBy =
        definition.sides.top === "ear"
            ? 15 * pieceSize / PIECE_DIMENSIONS
            : 0;

    const leftAdjustedForEars = boardBoundingBox.left - shiftLeftBy
    const topAdjustedForEars = boardBoundingBox.top - shiftTopBy

    const leftIsInsideBoundingBox = isWithinRangeInclusive(left, leftAdjustedForEars + boundingBox[0].x - HIT_OFFSET, leftAdjustedForEars + boundingBox[1].x - HIT_OFFSET)
    const topIsInsideBoundingBox = isWithinRangeInclusive(top, topAdjustedForEars + boundingBox[0].y - HIT_OFFSET, topAdjustedForEars + boundingBox[1].y - HIT_OFFSET)
    if (leftIsInsideBoundingBox && topIsInsideBoundingBox && isCornerPiece) {
        const pieceDiv = document.getElementById(`piece-${pieceId}`)
        if (!pieceDiv) {
            throw Error("Piece not found on board")
        }
        pieceDiv.style.left = `${boundingBox[0].x + leftAdjustedForEars}px`
        pieceDiv.style.top = `${boundingBox[0].y + topAdjustedForEars}px`
        pieceDiv.onmousedown = null
        pieceDiv.ontouchstart = null
        pieceDiv.style.zIndex = "20"
        return
    }

    const canConnectPiece = {
        toTheRight: definition.sides.right !== "flat",
        toTheLeft: definition.sides.left !== "flat",
        toTheTop: definition.sides.top !== "flat",
        toTheBottom: definition.sides.bottom !== "flat"
    }

    const pieceDomRect = pieceDiv!.getBoundingClientRect();
    const hitOffsetForEar = 15 * pieceSize / PIECE_DIMENSIONS + HIT_OFFSET
    if (canConnectPiece.toTheLeft) {
        const wantedLeftPieceId = pieceId - 1
        const { domRect, definition: wantedPieceDef, isOverLappingOnY } = checkWantedPiece(wantedLeftPieceId, hitOffsetForEar);

        const isOverLappingOnX = isWithinRangeInclusive(pieceDomRect.left - domRect.right - HIT_OFFSET, -hitOffsetForEar, -1 / 2 * hitOffsetForEar)
        console.log({ isOverLappingOnX, isOverLappingOnY, hmm: pieceDomRect.left - domRect.right - HIT_OFFSET, hitOffsetForEar })
        if (isOverLappingOnX && isOverLappingOnY) {
            pieceDiv!.style.left = `${domRect.right - 15 * pieceSize / PIECE_DIMENSIONS}px`
            pieceDiv!.style.top = `${domRect.top - (definition.sides.top === "ear" ? 15 * pieceSize / PIECE_DIMENSIONS : 0) + (wantedPieceDef.sides.top === "ear" ? 15 * pieceSize / PIECE_DIMENSIONS : 0)}px`
        }
    } else if (canConnectPiece.toTheRight) {
        const wantedRightPieceId = pieceId + 1
        const { domRect, definition: wantedPieceDef, isOverLappingOnY } = checkWantedPiece(wantedRightPieceId, hitOffsetForEar);

        const isOverLappingOnX = isWithinRangeInclusive(pieceDomRect.right - domRect.left - HIT_OFFSET, -hitOffsetForEar, hitOffsetForEar)
        console.log({ isOverLappingOnX, isOverLappingOnY, hmm: pieceDomRect.right - domRect.left - HIT_OFFSET, hitOffsetForEar, case: "right" })
        if (isOverLappingOnX && isOverLappingOnY) {
            pieceDiv!.style.left = `${domRect.left - pieceDomRect.width + (definition.sides.right === "ear" ? 15 * pieceSize / PIECE_DIMENSIONS : 0)}px`
            pieceDiv!.style.top = `${domRect.top + (wantedPieceDef.sides.top === "ear" ? 15 * pieceSize / PIECE_DIMENSIONS : 0)}px`
        }
    } else if (canConnectPiece.toTheTop) {
        const wantedRightPieceId = pieceId + 1
        const { domRect, isOverLappingOnY } = checkWantedPiece(wantedRightPieceId, hitOffsetForEar);

        const isOverLappingOnX = isWithinRangeInclusive(pieceDomRect.left - domRect.right - HIT_OFFSET, -hitOffsetForEar, -1 / 2 * hitOffsetForEar)
        console.log({ isOverLappingOnX, isOverLappingOnY, wanted: domRect.bottom, piece: pieceDomRect.bottom })
        if (isOverLappingOnX && isOverLappingOnY) {
            pieceDiv!.style.left = `${domRect.left + (definition.sides.left === "hole" ? -15 * pieceSize / PIECE_DIMENSIONS : 0)}px`
            pieceDiv!.style.top = `${domRect.top + (definition.sides.bottom === "hole" ? -15 * pieceSize / PIECE_DIMENSIONS : 0)}px`
        }
    } else if (canConnectPiece.toTheBottom) {

    }
}

interface ClickIntoPlaceAndCombineParams {
    piece: PieceEntity
    pieceSize: number
}

const connectedPiecesLookup = new Map<number, number[][]>
let uniqueCounterCombined = 0

export function clickIntoPlaceAndCombine({ piece, pieceSize }: ClickIntoPlaceAndCombineParams) {
    // TODO: Combine to larger divs
    const boardContainer = document.getElementById("board-container")
    const parentDiv = document.createElement("div")
    const innerParentDiv = document.createElement("div")
    parentDiv.style.position = "absolute"
    innerParentDiv.style.position = "relative"

    const pieceDiv = document.getElementById(`piece-${piece.id}`) as HtmlPieceElement

    const pieceDomRect = pieceDiv.getBoundingClientRect()
    const hitOffsetForEar = 15 * pieceSize / PIECE_DIMENSIONS + HIT_OFFSET
    console.log(piece.connections)
    if (piece.connections.top !== null) {
        const wantedPieceId = piece.connections.top

        const wantedPiece = document.getElementById(`piece-${wantedPieceId}`) as HtmlPieceElement
        const wantedPieceDomRect = wantedPiece.getBoundingClientRect()
        const combinedParentDiv = wantedPiece.parentElement

        const hasCombinedParent = combinedParentDiv !== null && combinedParentDiv?.id !== "board-container"

        const isOverLappingOnY = isWithinRangeInclusive(wantedPieceDomRect.bottom - pieceDomRect.top - HIT_OFFSET, 1 / 2 * hitOffsetForEar, hitOffsetForEar)
        const isOverLappingOnX = isWithinRangeInclusive(wantedPieceDomRect.left - pieceDomRect.left - HIT_OFFSET, - 1 / 2 * hitOffsetForEar, 1 / 2 * hitOffsetForEar)

        console.log({ isOverLappingOnX, isOverLappingOnY, top: wantedPieceDomRect.bottom - pieceDomRect.top - HIT_OFFSET, left: wantedPieceDomRect.left - pieceDomRect.left - HIT_OFFSET })
        if (isOverLappingOnX && isOverLappingOnY) {
            if (hasCombinedParent) {
                console.log({ wantedPieceDomRect })
                pieceDiv.style.top = `${wantedPieceDomRect.bottom - combinedParentDiv.getBoundingClientRect().top - 15 * pieceSize / PIECE_DIMENSIONS}px`
                const wantedPieceDef = pieceDefinitionLookup.get(Number.parseInt(wantedPiece.dataset.definitionId))!
                if (wantedPieceDef.sides.left === piece.definition.sides.left) {
                    pieceDiv.style.left = wantedPiece.style.left
                } else {
                    if (wantedPieceDef.sides.left === "ear") {
                        pieceDiv.style.left = `${15 * pieceSize / PIECE_DIMENSIONS}px`
                    }
                }
                pieceDiv.ontouchstart = null;
                pieceDiv.onmousedown = null;
                combinedParentDiv.appendChild(pieceDiv)
                return null
            }

            wantedPiece.style.top = "0px"
            wantedPiece.style.left = "0px"
            pieceDiv.style.left = "0px"
            pieceDiv.style.top = `${wantedPieceDomRect.height - 15 * pieceSize / PIECE_DIMENSIONS}px`

            if (!hasCombinedParent) {
                boardContainer?.removeChild(wantedPiece)
            }

            boardContainer?.removeChild(pieceDiv)
            if (hasCombinedParent) {
                pieceDiv.style.top = `${combinedParentDiv.getBoundingClientRect().height - 15 * pieceSize / PIECE_DIMENSIONS}px`
                combinedParentDiv.appendChild(pieceDiv)
            }


            parentDiv.style.top = `${wantedPieceDomRect.top}px`
            parentDiv.style.left = `${wantedPieceDomRect.left}px`

            addPiecesToCombinedDiv({ innerParentDiv, parentDiv, pieceDiv, wantedPiece })

            parentDiv.id = `combined-piece-${uniqueCounterCombined}`

            return { combinedPieceDiv: parentDiv, id: uniqueCounterCombined++, pieceIds: [piece.id, wantedPieceId] }
        }
    }
    if (piece.connections.right !== null) {
        const wantedPieceId = piece.connections.right
        const wantedPiece = document.getElementById(`piece-${wantedPieceId}`) as HtmlPieceElement
        const wantedPieceDomRect = wantedPiece.getBoundingClientRect()
        const diffY = wantedPieceDomRect.top - pieceDomRect.top
        const diffX = pieceDomRect.right - wantedPieceDomRect.left
        const isOverLappingOnY = isWithinRangeInclusive(diffY, -hitOffsetForEar, hitOffsetForEar)
        const isOverLappingOnX = isWithinRangeInclusive(diffX, 1 / 2 * hitOffsetForEar, hitOffsetForEar)

        console.log({ isOverLappingOnX, isOverLappingOnY, hitOffsetForEar, diffX, diffY, case: "right" })

        if (isOverLappingOnX && isOverLappingOnY) {
            const combinedParentDiv = wantedPiece.parentElement

            const hasCombinedParent = combinedParentDiv !== null && combinedParentDiv?.id !== "board-container"
            if (hasCombinedParent) {
                console.log({ wantedPieceDomRect })
                const combinedParentDivRect = combinedParentDiv.getBoundingClientRect()
                pieceDiv.style.left = `${wantedPieceDomRect.left - pieceDomRect.width - combinedParentDivRect.left + 15 * pieceSize / PIECE_DIMENSIONS}px`
                const wantedPieceDef = pieceDefinitionLookup.get(Number.parseInt(wantedPiece.dataset.definitionId))!
                let pieceDivTop = 0
                if (wantedPieceDef.sides.top === piece.definition.sides.top) {
                    pieceDivTop = wantedPieceDomRect.top - combinedParentDivRect.top
                } else if (wantedPieceDef.sides.top === "ear") {
                    pieceDivTop = wantedPieceDomRect.top - combinedParentDivRect.top + 15 * pieceSize / PIECE_DIMENSIONS
                }
                else {
                    pieceDivTop = wantedPieceDomRect.top - combinedParentDivRect.top - 15 * pieceSize / PIECE_DIMENSIONS
                }
                console.log({ pieceDivTop })
                pieceDiv.style.top = `${pieceDivTop}px`
                pieceDiv.ontouchstart = null;
                pieceDiv.onmousedown = null;
                combinedParentDiv.appendChild(pieceDiv)
                return null
            }

            boardContainer?.removeChild(wantedPiece)
            boardContainer?.removeChild(pieceDiv)

            const wantedPieceDef = pieceDefinitionLookup.get(Number.parseInt(wantedPiece.dataset.definitionId))!
            let pieceDivTop = 0
            if (wantedPieceDef.sides.top === piece.definition.sides.top) {
                // pass
            } else if (wantedPieceDef.sides.top === "ear") {
                pieceDivTop = 15 * pieceSize / PIECE_DIMENSIONS
            }
            else {
                pieceDivTop = - 15 * pieceSize / PIECE_DIMENSIONS
            }
            console.log({ pieceDivTop })
            pieceDiv.style.top = `${pieceDivTop}px`

            wantedPiece.style.top = "0px"
            wantedPiece.style.left = `${pieceDomRect.width - 15 * pieceSize / PIECE_DIMENSIONS}px`
            pieceDiv.style.left = "0px"

            parentDiv.style.top = `${Math.max(wantedPieceDomRect.top, pieceDomRect.top)}px`
            parentDiv.style.left = `${pieceDomRect.left}px`

            addPiecesToCombinedDiv({ innerParentDiv, parentDiv, pieceDiv, wantedPiece })
            parentDiv.id = `combined-piece-${uniqueCounterCombined}`
            return { combinedPieceDiv: parentDiv, id: uniqueCounterCombined++, pieceIds: [piece.id, wantedPieceId] }
        }
    }
    if (piece.connections.bottom !== null) {
        const wantedPieceId = piece.connections.bottom
        const wantedPiece = document.getElementById(`piece-${wantedPieceId}`) as HtmlPieceElement
        const wantedPieceDomRect = wantedPiece.getBoundingClientRect()
        const diffY = wantedPieceDomRect.top - pieceDomRect.bottom - HIT_OFFSET
        const diffX = pieceDomRect.left - wantedPieceDomRect.left - HIT_OFFSET
        const isOverLappingOnY = isWithinRangeInclusive(diffY, - hitOffsetForEar - HIT_OFFSET, 1 / 2 * hitOffsetForEar)
        const isOverLappingOnX = isWithinRangeInclusive(diffX, - hitOffsetForEar, hitOffsetForEar)

        console.log({ isOverLappingOnX, isOverLappingOnY, hitOffsetForEar, diffX, diffY })
        if (isOverLappingOnX && isOverLappingOnY) {
            const combinedParentDiv = wantedPiece.parentElement

            const hasCombinedParent = combinedParentDiv !== null && combinedParentDiv?.id !== "board-container"
            if (hasCombinedParent) {
                console.log({ wantedPieceDomRect })
                const combinedParentDivRect = combinedParentDiv.getBoundingClientRect()
                pieceDiv.style.top = `${wantedPieceDomRect.top - combinedParentDivRect.top - pieceDomRect.height + 15 * pieceSize / PIECE_DIMENSIONS}px`
                const wantedPieceDef = pieceDefinitionLookup.get(Number.parseInt(wantedPiece.dataset.definitionId))!
                let pieceDivLeft = 0
                if (wantedPieceDef.sides.left === piece.definition.sides.left) {
                    pieceDivLeft = wantedPieceDomRect.left - combinedParentDivRect.left
                } else if (wantedPieceDef.sides.left === "ear") {
                    pieceDivLeft = wantedPieceDomRect.left - combinedParentDivRect.left + 15 * pieceSize / PIECE_DIMENSIONS
                }
                else {
                    pieceDivLeft = wantedPieceDomRect.left - combinedParentDivRect.left - 15 * pieceSize / PIECE_DIMENSIONS
                }
                console.log({ pieceDivLeft })
                pieceDiv.style.left = `${pieceDivLeft}px`
                pieceDiv.ontouchstart = null;
                pieceDiv.onmousedown = null;
                combinedParentDiv.appendChild(pieceDiv)
                return null
            }
            wantedPiece.style.top = `${pieceDomRect.height - 15 * pieceSize / PIECE_DIMENSIONS}px`
            pieceDiv.style.top = "0px";
            const pieceWidthDiff = wantedPieceDomRect.width - pieceDomRect.width
            console.log({ pieceWidthDiff })
            if (pieceWidthDiff > 0) {
                pieceDiv.style.left = `${pieceWidthDiff}px`
                wantedPiece.style.left = "0px"
            } else if (pieceWidthDiff < 0) {
                wantedPiece.style.left = `${Math.abs(pieceWidthDiff)}px`
                pieceDiv.style.left = "0px"
            } else {
                wantedPiece.style.left = "0px"
                pieceDiv.style.left = "0px";
            }

            parentDiv.style.top = `${pieceDomRect.top}px`
            parentDiv.style.left = `${Math.min(pieceDomRect.left, wantedPieceDomRect.left)}px`

            addPiecesToCombinedDiv({ innerParentDiv, wantedPiece, pieceDiv, parentDiv });

            parentDiv.id = `combined-piece-${uniqueCounterCombined}`

            return { combinedPieceDiv: parentDiv, id: uniqueCounterCombined++, pieceIds: [piece.id, wantedPieceId] }
        }
    }
    if (piece.connections.left !== null) {
        const wantedPieceId = piece.connections.left
        const wantedPiece = document.getElementById(`piece-${wantedPieceId}`) as HtmlPieceElement
        const wantedPieceDomRect = wantedPiece.getBoundingClientRect()
        const diffY = wantedPieceDomRect.top - pieceDomRect.top - HIT_OFFSET
        const diffX = pieceDomRect.left - wantedPieceDomRect.right - HIT_OFFSET
        const isOverLappingOnY = isWithinRangeInclusive(diffY, - hitOffsetForEar - HIT_OFFSET, 1 / 2 * hitOffsetForEar)
        const isOverLappingOnX = isWithinRangeInclusive(diffX, - hitOffsetForEar, hitOffsetForEar)

        console.log({ isOverLappingOnX, isOverLappingOnY, hitOffsetForEar, diffX, diffY })
        if (isOverLappingOnX && isOverLappingOnY) {
            boardContainer?.removeChild(wantedPiece)
            boardContainer?.removeChild(pieceDiv)

            pieceDiv.style.left = `${wantedPieceDomRect.width - 15 * pieceSize / PIECE_DIMENSIONS}px`
            wantedPiece.style.left = "0px";
            const pieceHeightDiff = wantedPieceDomRect.height - pieceDomRect.height
            console.log({ pieceWidthDiff: pieceHeightDiff })
            if (pieceHeightDiff > 0) {
                pieceDiv.style.top = `${pieceHeightDiff}px`
                wantedPiece.style.top = "0px"
            } else if (pieceHeightDiff < 0) {
                wantedPiece.style.top = `${Math.abs(pieceHeightDiff)}px`
                pieceDiv.style.top = "0px"
            } else {
                wantedPiece.style.top = "0px"
                pieceDiv.style.top = "0px";
            }

            parentDiv.style.top = `${Math.min(pieceDomRect.top, wantedPieceDomRect.top)}px`
            parentDiv.style.left = `${wantedPieceDomRect.left}px`

            addPiecesToCombinedDiv({ innerParentDiv, wantedPiece, pieceDiv, parentDiv });

            parentDiv.id = `combined-piece-${uniqueCounterCombined}`

            return { combinedPieceDiv: parentDiv, id: uniqueCounterCombined++, pieceIds: [piece.id, wantedPieceId] }
        }
    }
}

interface AddPiecesToCombinedDivParams { innerParentDiv: HTMLDivElement, wantedPiece: HtmlPieceElement, pieceDiv: HtmlPieceElement, parentDiv: HTMLDivElement }

function addPiecesToCombinedDiv({ innerParentDiv, wantedPiece, pieceDiv, parentDiv }: AddPiecesToCombinedDivParams) {
    innerParentDiv.appendChild(wantedPiece);
    innerParentDiv.appendChild(pieceDiv);
    parentDiv.appendChild(innerParentDiv);
    wantedPiece.ontouchstart = null;
    wantedPiece.onmousedown = null;
    pieceDiv.ontouchstart = null;
    pieceDiv.onmousedown = null;
}

function checkWantedPiece(wantedLeftPieceId: number, hitOffsetForEar: number) {
    const wantedLeftPiece = document.getElementById(`piece-${wantedLeftPieceId}`)! as HtmlPieceElement;
    const definition = pieceDefinitionLookup.get(Number.parseInt(wantedLeftPiece.dataset.definitionId))!;
    const domRect = wantedLeftPiece.getBoundingClientRect();
    const isOverLappingOnY = isWithinRangeInclusive(domRect.top - domRect.top - HIT_OFFSET, - 1 / 2 * hitOffsetForEar, 1 / 2 * hitOffsetForEar)
    return { domRect, definition, isOverLappingOnY };
}
