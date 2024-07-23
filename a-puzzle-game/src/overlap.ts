import type { HtmlPieceElement } from "./clickPieceInPlace";
import type { PieceEntity } from "./makeBoard";
import { isWithinRangeInclusive } from "./utils";

const HIT_OFFSET = Object.freeze(5)

interface CheckOverlapParams {
    connections: PieceEntity["connections"],
    pieceDomRect: DOMRect,
    hitOffsetForEar: number
}

export function checkOverlapOnLeft({ connections, pieceDomRect, hitOffsetForEar }: CheckOverlapParams) {
    const wantedPieceId = connections.left;
    const wantedPiece = document.getElementById(`piece-${wantedPieceId}`) as HtmlPieceElement;
    const wantedPieceDomRect = wantedPiece.getBoundingClientRect();
    const diffY = wantedPieceDomRect.top - pieceDomRect.top - HIT_OFFSET;
    const diffX = pieceDomRect.left - wantedPieceDomRect.right - HIT_OFFSET;
    const isOverLappingOnY = isWithinRangeInclusive(diffY, -hitOffsetForEar, hitOffsetForEar);
    const isOverLappingOnX = isWithinRangeInclusive(diffX, -hitOffsetForEar, hitOffsetForEar);
    console.log({ isOverLappingOnX, isOverLappingOnY, hitOffsetForEar, diffX, diffY, case: "left" });

    return { isOverLappingOnX, isOverLappingOnY, wantedPiece, wantedPieceDomRect, wantedPieceId };
}

export function checkOverlapOnBottom({ connections, pieceDomRect, hitOffsetForEar }: CheckOverlapParams) {
    const wantedPieceId = connections.bottom;
    const wantedPiece = document.getElementById(`piece-${wantedPieceId}`) as HtmlPieceElement;
    const wantedPieceDomRect = wantedPiece.getBoundingClientRect();
    const diffY = wantedPieceDomRect.top - pieceDomRect.bottom - HIT_OFFSET;
    const diffX = pieceDomRect.left - wantedPieceDomRect.left - HIT_OFFSET;
    const isOverLappingOnY = isWithinRangeInclusive(diffY, -hitOffsetForEar - HIT_OFFSET, 1 / 2 * hitOffsetForEar);
    const isOverLappingOnX = isWithinRangeInclusive(diffX, -hitOffsetForEar, hitOffsetForEar);
    console.log({ isOverLappingOnX, isOverLappingOnY, hitOffsetForEar, diffX, diffY, case: "bottom" });

    return { isOverLappingOnX, isOverLappingOnY, wantedPiece, wantedPieceDomRect, wantedPieceId };
}

export function checkOverlapOnRight({ connections, pieceDomRect, hitOffsetForEar }: CheckOverlapParams) {
    const wantedPieceId = connections.right;
    const wantedPiece = document.getElementById(`piece-${wantedPieceId}`) as HtmlPieceElement;
    const wantedPieceDomRect = wantedPiece.getBoundingClientRect();
    // TODO: Is it necessary to use HIT_OFFSET?
    const diffY = wantedPieceDomRect.top - pieceDomRect.top - HIT_OFFSET;
    const diffX = pieceDomRect.right - wantedPieceDomRect.left - HIT_OFFSET;
    const isOverLappingOnY = isWithinRangeInclusive(diffY, -hitOffsetForEar, hitOffsetForEar);
    const isOverLappingOnX = isWithinRangeInclusive(diffX, 1 / 2 * hitOffsetForEar, hitOffsetForEar);

    console.log({ isOverLappingOnX, isOverLappingOnY, hitOffsetForEar, diffX, diffY, case: "right" });
    return { isOverLappingOnX, isOverLappingOnY, wantedPiece, wantedPieceDomRect, wantedPieceId };
}

export function checkOverLapOnTop({ connections, pieceDomRect, hitOffsetForEar }: CheckOverlapParams) {
    const wantedPieceId = connections.top;

    const wantedPiece = document.getElementById(`piece-${wantedPieceId}`) as HtmlPieceElement;
    const wantedPieceDomRect = wantedPiece.getBoundingClientRect();

    const diffY = wantedPieceDomRect.bottom - pieceDomRect.top - HIT_OFFSET
    const diffX = wantedPieceDomRect.left - pieceDomRect.left - HIT_OFFSET
    const isOverLappingOnY = isWithinRangeInclusive(diffY, 1 / 2 * hitOffsetForEar, hitOffsetForEar);
    const isOverLappingOnX = isWithinRangeInclusive(diffX, -1 / 2 * hitOffsetForEar, 1 / 2 * hitOffsetForEar);

    console.log({ isOverLappingOnX, isOverLappingOnY, hitOffsetForEar, diffX, diffY, case: "top" });

    return { isOverLapping: isOverLappingOnX && isOverLappingOnY, wantedPieceDomRect, wantedPiece, wantedPieceId };
}