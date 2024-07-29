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
    | { result: PlaceAndCombineResult.ExpandedGroup, groupDivId: number, newCombinedTop: number, newCombinedLeft: number }
    | { result: PlaceAndCombineResult.Combined, connectedPieceId: number, combinedPieceDiv: HTMLDivElement, id: number }
export function clickIntoPlaceAndCombine({ piece, pieceSize }: ClickIntoPlaceAndCombineParams): ReturnType {
    const boardContainer = document.getElementById("board-container") as HTMLDivElement;

    const { pieceDomRect, hitOffsetForEar, pieceDiv } = getCombineParams(piece, pieceSize);
    if (piece.connections.top !== null) {
        const { isOverlapping, wantedPieceDomRect, wantedPiece, wantedPieceId } = checkOverLapOnTop({ connections: piece.connections, pieceDomRect, hitOffsetForEar });

        if (isOverlapping) {
            const combinedParentDiv = wantedPiece.parentElement?.parentElement;
            const hasCombinedParent = !!combinedParentDiv && combinedParentDiv?.id.startsWith("combined-piece")

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
        const { isOverlapping, wantedPiece, wantedPieceDomRect, wantedPieceId } = checkOverlapOnRight({ connections: piece.connections, pieceDomRect, hitOffsetForEar });

        if (isOverlapping) {
            const combinedParentDiv = wantedPiece.parentElement?.parentElement;
            const hasCombinedParent = !!combinedParentDiv && combinedParentDiv?.id.startsWith("combined-piece")

            if (hasCombinedParent) {
                return expandPieceGroupRight({ combinedParentDiv, wantedPieceDomRect, wantedPiece, piece, pieceSize, pieceDomRect, pieceDiv });
            }

            return {
                ...combineWithRightConnection({ boardContainer, pieceDefSides: piece.definition.sides, pieceDiv, pieceDomRect, pieceSize, wantedPiece, wantedPieceDomRect }),
                connectedPieceId: wantedPieceId!,
                result: PlaceAndCombineResult.Combined
            };
        }
    }
    if (piece.connections.bottom !== null) {
        const { isOverlapping, wantedPiece, wantedPieceDomRect, wantedPieceId } = checkOverlapOnBottom({ hitOffsetForEar, connections: piece.connections, pieceDomRect });

        if (isOverlapping) {
            const combinedParentDiv = wantedPiece.parentElement?.parentElement;
            const hasCombinedParent = !!combinedParentDiv && combinedParentDiv?.id.startsWith("combined-piece")

            if (hasCombinedParent) {
                return expandPieceGroupBottom({ combinedParentDiv, wantedPiece, wantedPieceDomRect, piece, pieceDomRect, pieceSize, pieceDiv });
            }

            return {
                ...combineWithBottomConnection({ boardContainer, pieceDiv, pieceDomRect, pieceSize, wantedPiece, wantedPieceDomRect, pieceDefSides: piece.definition.sides }),
                connectedPieceId: wantedPieceId!,
                result: PlaceAndCombineResult.Combined
            };
        }
    }
    if (piece.connections.left !== null) {
        const { isOverlapping, wantedPiece, wantedPieceDomRect, wantedPieceId } = checkOverlapOnLeft({ hitOffsetForEar, connections: piece.connections, pieceDomRect });

        if (isOverlapping) {
            const combinedParentDiv = wantedPiece.parentElement?.parentElement;
            const hasCombinedParent = !!combinedParentDiv && combinedParentDiv?.id.startsWith("combined-piece")

            if (hasCombinedParent) {
                return expandPieceGroupLeft({ combinedParentDiv, wantedPiece, wantedPieceDomRect, piece, pieceDomRect, pieceSize, pieceDiv });
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
export function expandPieceGroupLeft({ combinedParentDiv, wantedPiece, wantedPieceDomRect, piece, pieceDomRect, pieceSize, pieceDiv }: ExpandPieceGroupTop) {
    const combinedParentDomRect = combinedParentDiv.getBoundingClientRect();
    const { pieceDivTop, pieceDivLeft } = leftConnectionCalcPos({ combinedParentDiv, wantedPiece, wantedPieceDomRect, sides: piece.definition.sides, pieceDomRect, pieceSize });
    console.log({ pieceDivLeft, width: combinedParentDomRect.width })
    combinedParentDiv.style.height = `${Math.max(combinedParentDomRect.height, pieceDomRect.height)}px`;
    combinedParentDiv.style.width = `${Math.abs(pieceDivLeft) + pieceDomRect.width}px`;
    const { newCombinedLeft, newCombinedTop } = adjustAndAddPieceToCombined({ pieceDiv, pieceDivTop, pieceDivLeft, combinedParentDiv, pieceDomRect });
    return { result: PlaceAndCombineResult.ExpandedGroup, groupDivId: Number.parseInt(combinedParentDiv.dataset.id!), newCombinedLeft, newCombinedTop } satisfies ReturnType;
}

export function expandPieceGroupBottom({ combinedParentDiv, wantedPiece, wantedPieceDomRect, piece, pieceDomRect, pieceSize, pieceDiv }: ExpandPieceGroupTop) {
    const combinedParentDomRect = combinedParentDiv.getBoundingClientRect();
    const { pieceDivTop, pieceDivLeft } = bottomConnectionCalcPos({ combinedParentDiv, wantedPiece, wantedPieceDomRect, sides: piece.definition.sides, pieceDomRect, pieceSize });
    combinedParentDiv.style.height = `${Math.abs(pieceDivTop) + pieceDomRect.height}px`;
    combinedParentDiv.style.width = `${Math.max(combinedParentDomRect.width, pieceDomRect.width)}px`;
    const { newCombinedLeft, newCombinedTop } = adjustAndAddPieceToCombined({ pieceDiv, pieceDivTop, pieceDivLeft, combinedParentDiv, pieceDomRect });
    return { result: PlaceAndCombineResult.ExpandedGroup, groupDivId: Number.parseInt(combinedParentDiv.dataset.id!), newCombinedLeft, newCombinedTop } satisfies ReturnType;
}

export function expandPieceGroupRight({ combinedParentDiv, wantedPieceDomRect, wantedPiece, piece, pieceSize, pieceDomRect, pieceDiv }: ExpandPieceGroupTop) {
    const combinedParentDomRect = combinedParentDiv.getBoundingClientRect();
    const { pieceDivLeft, pieceDivTop } = rightConnectionCalcPos({ wantedPieceDomRect, combinedParentDiv, wantedPiece, sides: piece.definition.sides, pieceSize, pieceDomRect });
    combinedParentDiv.style.height = `${Math.max(combinedParentDomRect.height, pieceDomRect.height)}px`;
    combinedParentDiv.style.width = `${Math.abs(pieceDivLeft) + combinedParentDomRect.width}px`;
    const { newCombinedLeft, newCombinedTop } = adjustAndAddPieceToCombined({ pieceDiv, pieceDomRect, pieceDivTop, pieceDivLeft, combinedParentDiv });
    return { result: PlaceAndCombineResult.ExpandedGroup, groupDivId: Number.parseInt(combinedParentDiv.dataset.id!), newCombinedLeft, newCombinedTop } satisfies ReturnType;
}

export function expandPieceGroupTop({ combinedParentDiv, wantedPieceDomRect, pieceSize, wantedPiece, piece, pieceDomRect, pieceDiv }: ExpandPieceGroupTop) {
    const combinedParentDomRect = combinedParentDiv.getBoundingClientRect();
    const { pieceDivTop, pieceDivLeft } = topConnectionCalculateShiftXY({ combinedParentDiv, wantedPieceDomRect, pieceSize, wantedPiece, sides: piece.definition.sides, pieceDomRect });
    combinedParentDiv.style.height = `${pieceDomRect.height + pieceDivTop}px`;
    combinedParentDiv.style.width = `${Math.max(combinedParentDomRect.width, pieceDomRect.width)}px`;
    const { newCombinedLeft, newCombinedTop } = adjustAndAddPieceToCombined({ pieceDiv, pieceDivTop, pieceDivLeft, combinedParentDiv, pieceDomRect });
    return { result: PlaceAndCombineResult.ExpandedGroup, groupDivId: Number.parseInt(combinedParentDiv.dataset.id!), newCombinedLeft, newCombinedTop } satisfies ReturnType;
}

export function getCombineParams(piece: PieceEntity, pieceSize: number) {
    const pieceDiv = document.getElementById(`piece-${piece.id}`) as HtmlPieceElement;

    const pieceDomRect = pieceDiv.getBoundingClientRect();
    const hitOffsetForEar = 15 * pieceSize / PIECE_DIMENSIONS + HIT_OFFSET;
    return { pieceDomRect, hitOffsetForEar, pieceDiv };
}

