import type { HtmlPieceElement } from "./clickPieceInPlace";
import type { PieceEntity } from "./makeBoard";
import { PIECE_DIMENSIONS, pieceDefinitionLookup } from "./pieceDefintions";

interface BottomConnectionCalcPosParams {
    combinedParentDiv: HTMLElement,
    wantedPiece: HtmlPieceElement,
    wantedPieceDomRect: DOMRect
    sides: PieceEntity["definition"]["sides"],
    pieceSize: number
    pieceDomRect: DOMRect
}

interface LeftConnectionCalcPosParams extends BottomConnectionCalcPosParams {

}

export function leftConnectionCalcPos({ combinedParentDiv, sides, pieceDomRect, pieceSize, wantedPiece, wantedPieceDomRect }: LeftConnectionCalcPosParams) {
    const combinedParentDivRect = combinedParentDiv.getBoundingClientRect();
    const wantedPieceDef = pieceDefinitionLookup.get(Number.parseInt(wantedPiece.dataset.definitionId))!;
    let pieceDivTop = 0;
    if (wantedPieceDef.sides.top === sides.top) {
        alert('hmm')
        pieceDivTop = wantedPieceDomRect.top - combinedParentDivRect.top;
    } else if (wantedPieceDef.sides.top === "ear") {
        pieceDivTop = wantedPieceDomRect.top - combinedParentDivRect.top + 15 * pieceSize / PIECE_DIMENSIONS;
    }
    else {
        pieceDivTop = wantedPieceDomRect.top - combinedParentDivRect.top - 15 * pieceSize / PIECE_DIMENSIONS;
    }
    console.log({ pieceDivTop });
    const pieceDivLeft = wantedPieceDomRect.left + pieceDomRect.width - combinedParentDivRect.left + 15 * pieceSize / PIECE_DIMENSIONS;
    return { pieceDivLeft, pieceDivTop };

}

export function bottomConnectionCalcPos({ combinedParentDiv, wantedPiece, wantedPieceDomRect, sides, pieceSize, pieceDomRect }: BottomConnectionCalcPosParams) {
    const combinedParentDivRect = combinedParentDiv.getBoundingClientRect();
    const wantedPieceDef = pieceDefinitionLookup.get(Number.parseInt(wantedPiece.dataset.definitionId))!;
    let pieceDivLeft = 0;
    if (wantedPieceDef.sides.left === sides.left) {
        pieceDivLeft = wantedPieceDomRect.left - combinedParentDivRect.left;
    } else if (wantedPieceDef.sides.left === "ear") {
        pieceDivLeft = wantedPieceDomRect.left - combinedParentDivRect.left + 15 * pieceSize / PIECE_DIMENSIONS;
    }
    else {
        pieceDivLeft = wantedPieceDomRect.left - combinedParentDivRect.left - 15 * pieceSize / PIECE_DIMENSIONS;
    }
    console.log({ pieceDivLeft });
    const pieceDivTop = wantedPieceDomRect.top - combinedParentDivRect.top - pieceDomRect.height + 15 * pieceSize / PIECE_DIMENSIONS;
    return { pieceDivTop, pieceDivLeft };
}

export function rightConnectionCalcPos({ wantedPieceDomRect, combinedParentDiv, wantedPiece, sides, pieceSize, pieceDomRect }: BottomConnectionCalcPosParams) {
    const combinedParentDivRect = combinedParentDiv.getBoundingClientRect();
    const wantedPieceDef = pieceDefinitionLookup.get(Number.parseInt(wantedPiece.dataset.definitionId))!;
    let pieceDivTop = 0;
    if (wantedPieceDef.sides.top === sides.top) {
        pieceDivTop = wantedPieceDomRect.top - combinedParentDivRect.top;
    } else if (wantedPieceDef.sides.top === "ear") {
        pieceDivTop = wantedPieceDomRect.top - combinedParentDivRect.top + 15 * pieceSize / PIECE_DIMENSIONS;
    }
    else {
        pieceDivTop = wantedPieceDomRect.top - combinedParentDivRect.top - 15 * pieceSize / PIECE_DIMENSIONS;
    }
    console.log({ pieceDivTop });
    const pieceDivLeft = wantedPieceDomRect.left - pieceDomRect.width - combinedParentDivRect.left + 15 * pieceSize / PIECE_DIMENSIONS;
    return { pieceDivLeft, pieceDivTop };
}

interface AdjustAndAddPieceToCombinedParams {
    pieceDiv: HtmlPieceElement, pieceDivTop: number, pieceDivLeft: number, combinedParentDiv: HTMLElement
}

export function adjustAndAddPieceToCombined({ pieceDiv, pieceDivTop, pieceDivLeft, combinedParentDiv }: AdjustAndAddPieceToCombinedParams) {
    pieceDiv.style.top = `${pieceDivTop}px`;
    pieceDiv.style.left = `${pieceDivLeft}px`;
    pieceDiv.ontouchstart = null;
    pieceDiv.onmousedown = null;
    combinedParentDiv.appendChild(pieceDiv);
}

export function topConnectionCalculateShiftXY({ combinedParentDiv, wantedPieceDomRect, pieceSize, wantedPiece, sides }: BottomConnectionCalcPosParams) {
    const combinedParentDivRect = combinedParentDiv.getBoundingClientRect();
    const pieceDivTop = wantedPieceDomRect.bottom - combinedParentDivRect.top - 15 * pieceSize / PIECE_DIMENSIONS;
    let pieceDivLeft = 0;
    const wantedPieceDef = pieceDefinitionLookup.get(Number.parseInt(wantedPiece.dataset.definitionId))!;
    if (wantedPieceDef.sides.left === sides.left) {
        pieceDivLeft = wantedPieceDomRect.left - combinedParentDivRect.left;
    } else {
        if (wantedPieceDef.sides.left === "ear") {
            pieceDivLeft = 15 * pieceSize / PIECE_DIMENSIONS;
        }
    }
    return { pieceDivTop, pieceDivLeft };
}