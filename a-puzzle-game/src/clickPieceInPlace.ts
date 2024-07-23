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

export interface HtmlPieceElement extends HTMLDivElement {
    dataset: {
        pieceId: string,
        definitionId: string,
    }
}

export const HIT_OFFSET = Object.freeze(5);

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

export interface ClickIntoPlaceAndCombineParams {
    piece: PieceEntity
    pieceSize: number
}

function checkWantedPiece(wantedLeftPieceId: number, hitOffsetForEar: number) {
    const wantedLeftPiece = document.getElementById(`piece-${wantedLeftPieceId}`)! as HtmlPieceElement;
    const definition = pieceDefinitionLookup.get(Number.parseInt(wantedLeftPiece.dataset.definitionId))!;
    const domRect = wantedLeftPiece.getBoundingClientRect();
    const isOverLappingOnY = isWithinRangeInclusive(domRect.top - domRect.top - HIT_OFFSET, - 1 / 2 * hitOffsetForEar, 1 / 2 * hitOffsetForEar)
    return { domRect, definition, isOverLappingOnY };
}
