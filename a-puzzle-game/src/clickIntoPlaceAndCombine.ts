import { type ClickIntoPlaceAndCombineParams, type HtmlPieceElement, HIT_OFFSET } from "./clickPieceInPlace";
import { combineWithTopConnection, combineWithRightConnection, combineWithBottomConnection, combineWithLeftConnection } from "./combineWithConnection";
import type { PieceEntity } from "./makeBoard";
import { checkOverlapOnBottom, checkOverlapOnLeft, checkOverlapOnRight, checkOverLapOnTop } from "./overlap";
import { PIECE_DIMENSIONS } from "./pieceDefintions";
import { adjustAndAddPieceToCombined, bottomConnectionCalcPos, leftConnectionCalcPos, rightConnectionCalcPos, topConnectionCalculateShiftXY } from "./shiftPieceIntoCombined";

export enum PlaceAndCombineResult {
    Combined = 0,
    ExpandedGroup = 1,
    Nothing = 2
}

type ReturnType = { result: PlaceAndCombineResult.Nothing }
    | { result: PlaceAndCombineResult.ExpandedGroup, groupDivId: number }
    | { result: PlaceAndCombineResult.Combined, connectedPieceId: number, combinedPieceDiv: HTMLDivElement, id: number }
export function clickIntoPlaceAndCombine({ piece, pieceSize }: ClickIntoPlaceAndCombineParams): ReturnType {
    const boardContainer = document.getElementById("board-container") as HTMLDivElement;

    const { pieceDomRect, hitOffsetForEar, pieceDiv } = getCombineParams(piece, pieceSize);
    if (piece.connections.top !== null) {
        const { isOverLapping, wantedPieceDomRect, wantedPiece, wantedPieceId } = checkOverLapOnTop({ connections: piece.connections, pieceDomRect, hitOffsetForEar });

        if (isOverLapping) {
            const combinedParentDiv = wantedPiece.parentElement;
            const hasCombinedParent = combinedParentDiv !== null && combinedParentDiv?.id !== "board-container";
            if (hasCombinedParent) {
                return expandPieceGroupTop({ combinedParentDiv, wantedPieceDomRect, pieceSize, wantedPiece, piece, pieceDomRect, pieceDiv });
            }

            return {
                ...combineWithTopConnection({ boardContainer, pieceDiv, pieceSize, wantedPiece, wantedPieceDomRect, pieceDefSides: piece.definition.sides, pieceDomRect }),
                connectedPieceId: wantedPieceId!,
                result: PlaceAndCombineResult.Combined
            };
        }
    }
    if (piece.connections.right !== null) {
        const { isOverLappingOnX, isOverLappingOnY, wantedPiece, wantedPieceDomRect, wantedPieceId } = checkOverlapOnRight({ connections: piece.connections, pieceDomRect, hitOffsetForEar });

        if (isOverLappingOnX && isOverLappingOnY) {
            const combinedParentDiv = wantedPiece.parentElement;

            const hasCombinedParent = combinedParentDiv !== null && combinedParentDiv?.id !== "board-container";
            if (hasCombinedParent) {
                const combinedParentDomRect = combinedParentDiv.getBoundingClientRect();
                const { pieceDivLeft, pieceDivTop } = rightConnectionCalcPos({ wantedPieceDomRect, combinedParentDiv, wantedPiece, sides: piece.definition.sides, pieceSize, pieceDomRect });
                combinedParentDiv.style.height = `${Math.max(combinedParentDomRect.height, pieceDomRect.height)}px`
                combinedParentDiv.style.width = `${Math.abs(pieceDivLeft) + combinedParentDomRect.width}px`
                adjustAndAddPieceToCombined({ pieceDiv, pieceDivTop, pieceDivLeft, combinedParentDiv });
                return { result: PlaceAndCombineResult.ExpandedGroup, groupDivId: Number.parseInt(combinedParentDiv.parentElement!.dataset.id!) };
            }

            return {
                ...combineWithRightConnection({ boardContainer, pieceDefSides: piece.definition.sides, pieceDiv, pieceDomRect, pieceSize, wantedPiece, wantedPieceDomRect }),
                connectedPieceId: wantedPieceId!,
                result: PlaceAndCombineResult.Combined
            };
        }
    }
    if (piece.connections.bottom !== null) {
        const { isOverLappingOnX, isOverLappingOnY, wantedPiece, wantedPieceDomRect, wantedPieceId } = checkOverlapOnBottom({ hitOffsetForEar, connections: piece.connections, pieceDomRect });

        if (isOverLappingOnX && isOverLappingOnY) {
            const combinedParentDiv = wantedPiece.parentElement;

            const hasCombinedParent = combinedParentDiv !== null && combinedParentDiv?.id !== "board-container";
            if (hasCombinedParent) {
                const { pieceDivTop, pieceDivLeft } = bottomConnectionCalcPos({ combinedParentDiv, wantedPiece, wantedPieceDomRect, sides: piece.definition.sides, pieceDomRect, pieceSize });
                adjustAndAddPieceToCombined({ pieceDiv, pieceDivTop, pieceDivLeft, combinedParentDiv });
                return { result: PlaceAndCombineResult.ExpandedGroup, groupDivId: Number.parseInt(combinedParentDiv.parentElement!.dataset.id!) };
            }

            return {
                ...combineWithBottomConnection({ boardContainer, pieceDiv, pieceDomRect, pieceSize, wantedPiece, wantedPieceDomRect, pieceDefSides: piece.definition.sides }),
                connectedPieceId: wantedPieceId!,
                result: PlaceAndCombineResult.Combined
            };
        }
    }
    if (piece.connections.left !== null) {
        const { isOverLappingOnX, isOverLappingOnY, wantedPiece, wantedPieceDomRect, wantedPieceId } = checkOverlapOnLeft({ hitOffsetForEar, connections: piece.connections, pieceDomRect });

        if (isOverLappingOnX && isOverLappingOnY) {
            const combinedParentDiv = wantedPiece.parentElement;

            const hasCombinedParent = combinedParentDiv !== null && combinedParentDiv?.id !== "board-container";
            if (hasCombinedParent) {
                const { pieceDivTop, pieceDivLeft } = leftConnectionCalcPos({ combinedParentDiv, wantedPiece, wantedPieceDomRect, sides: piece.definition.sides, pieceDomRect, pieceSize });
                adjustAndAddPieceToCombined({ pieceDiv, pieceDivTop, pieceDivLeft, combinedParentDiv });
                return { result: PlaceAndCombineResult.ExpandedGroup, groupDivId: Number.parseInt(combinedParentDiv.parentElement!.dataset.id!) };
            }
            return {
                ...combineWithLeftConnection({ boardContainer, pieceDiv, pieceDomRect, pieceSize, wantedPiece, wantedPieceDomRect, pieceDefSides: piece.definition.sides }),
                connectedPieceId: wantedPieceId!,
                result: PlaceAndCombineResult.Combined
            };
        }
    }
    return { result: PlaceAndCombineResult.Nothing }
}

interface ExpandPieceGroupTop {
    combinedParentDiv: HTMLElement, wantedPieceDomRect: DOMRect, pieceSize: number, wantedPiece: HtmlPieceElement, piece: PieceEntity, pieceDomRect: DOMRect, pieceDiv: HtmlPieceElement
}
export function expandPieceGroupTop({ combinedParentDiv, wantedPieceDomRect, pieceSize, wantedPiece, piece, pieceDomRect, pieceDiv }: ExpandPieceGroupTop) {
    const combinedParentDomRect = combinedParentDiv.getBoundingClientRect();
    const { pieceDivTop, pieceDivLeft } = topConnectionCalculateShiftXY({ combinedParentDiv, wantedPieceDomRect, pieceSize, wantedPiece, sides: piece.definition.sides, pieceDomRect });
    combinedParentDiv.style.height = `${pieceDomRect.height + pieceDivTop}px`;
    combinedParentDiv.style.width = `${Math.max(combinedParentDomRect.width, pieceDomRect.width)}px`;
    adjustAndAddPieceToCombined({ pieceDiv, pieceDivTop, pieceDivLeft, combinedParentDiv });
    return { result: PlaceAndCombineResult.ExpandedGroup, groupDivId: Number.parseInt(combinedParentDiv.parentElement!.dataset.id!) } satisfies ReturnType;
}

export function getCombineParams(piece: PieceEntity, pieceSize: number) {
    const pieceDiv = document.getElementById(`piece-${piece.id}`) as HtmlPieceElement;

    const pieceDomRect = pieceDiv.getBoundingClientRect();
    const hitOffsetForEar = 15 * pieceSize / PIECE_DIMENSIONS + HIT_OFFSET;
    return { pieceDomRect, hitOffsetForEar, pieceDiv };
}

