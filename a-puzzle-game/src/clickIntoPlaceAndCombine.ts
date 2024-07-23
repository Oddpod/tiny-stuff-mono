import { type ClickIntoPlaceAndCombineParams, type HtmlPieceElement, HIT_OFFSET } from "./clickPieceInPlace";
import { combineWithTopConnection, combineWithRightConnection, combineWithBottomConnection, combineWithLeftConnection } from "./combineWithConnection";
import { checkOverlapOnBottom, checkOverlapOnLeft, checkOverlapOnRight, checkOverLapOnTop } from "./overlap";
import { PIECE_DIMENSIONS } from "./pieceDefintions";
import { adjustAndAddPieceToCombined, bottomConnectionCalcPos, leftConnectionCalcPos, rightConnectionCalcPos, topConnectionCalculateShiftXY } from "./shiftPieceIntoCombined";

export function clickIntoPlaceAndCombine({ piece, pieceSize }: ClickIntoPlaceAndCombineParams) {
    // TODO: Combine to larger divs
    const boardContainer = document.getElementById("board-container") as HTMLDivElement;

    const pieceDiv = document.getElementById(`piece-${piece.id}`) as HtmlPieceElement;

    const pieceDomRect = pieceDiv.getBoundingClientRect();
    const hitOffsetForEar = 15 * pieceSize / PIECE_DIMENSIONS + HIT_OFFSET;
    if (piece.connections.top !== null) {
        const { isOverLappingOnX, isOverLappingOnY, wantedPieceDomRect, wantedPiece, wantedPieceId } = checkOverLapOnTop({ connections: piece.connections, pieceDomRect, hitOffsetForEar });

        if (isOverLappingOnX && isOverLappingOnY) {
            const combinedParentDiv = wantedPiece.parentElement;
            const hasCombinedParent = combinedParentDiv !== null && combinedParentDiv?.id !== "board-container";
            if (hasCombinedParent) {
                const combinedParentDomRect = combinedParentDiv.getBoundingClientRect();
                const { pieceDivTop, pieceDivLeft } = topConnectionCalculateShiftXY({ combinedParentDiv, wantedPieceDomRect, pieceSize, wantedPiece, sides: piece.definition.sides, pieceDomRect });
                combinedParentDiv.style.height = `${pieceDomRect.height + pieceDivTop}px`
                combinedParentDiv.style.width = `${Math.max(combinedParentDomRect.width, pieceDomRect.width)}px`
                adjustAndAddPieceToCombined({ pieceDiv, pieceDivTop, pieceDivLeft, combinedParentDiv });
                return { didCombine: true };
            }

            return {
                ...combineWithTopConnection({ boardContainer, pieceDiv, pieceSize, wantedPiece, wantedPieceDomRect, pieceDefSides: piece.definition.sides, pieceDomRect }),
                connectedPieceId: wantedPieceId
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
                return { didCombine: true };
            }

            return {
                ...combineWithRightConnection({ boardContainer, pieceDefSides: piece.definition.sides, pieceDiv, pieceDomRect, pieceSize, wantedPiece, wantedPieceDomRect }),
                connectedPieceId: wantedPieceId
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
                return { didCombine: true };
            }

            return {
                ...combineWithBottomConnection({ boardContainer, pieceDiv, pieceDomRect, pieceSize, wantedPiece, wantedPieceDomRect, pieceDefSides: piece.definition.sides }),
                connectedPieceId: wantedPieceId
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
                return { didCombine: true };
            }
            return {
                ...combineWithLeftConnection({ boardContainer, pieceDiv, pieceDomRect, pieceSize, wantedPiece, wantedPieceDomRect, pieceDefSides: piece.definition.sides }),
                connectedPieceId: wantedPieceId
            };
        }
    }
    return {}
}
