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

export function topConnectionCalculateShiftXY({ combinedParentDiv, wantedPieceDomRect, pieceSize, wantedPiece, sides }: BottomConnectionCalcPosParams) {
    const combinedParentDivRect = combinedParentDiv.getBoundingClientRect();
    let pieceDivLeft = 0;
    const wantedPieceDef = pieceDefinitionLookup.get(Number.parseInt(wantedPiece.dataset.definitionId))!;
    if (wantedPieceDef.sides.left === sides.left) {
        pieceDivLeft = wantedPieceDomRect.left - combinedParentDivRect.left;
    } else {
        if (wantedPieceDef.sides.left === "ear") {
            pieceDivLeft = 15 * pieceSize / PIECE_DIMENSIONS;
        }
    }
    const pieceDivTop = wantedPieceDomRect.bottom - combinedParentDivRect.top - 15 * pieceSize / PIECE_DIMENSIONS;
    return { pieceDivTop, pieceDivLeft };
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
    console.log("wantedTop", wantedPieceDef.sides.top)
    console.log("pieceTop", sides.top)
    if (wantedPieceDef.sides.top === sides.top) {
        pieceDivTop = 0;
    } else if (wantedPieceDef.sides.top === "ear") {
        pieceDivTop = wantedPieceDomRect.top - combinedParentDivRect.top + 15 * pieceSize / PIECE_DIMENSIONS;
    }
    else {
        pieceDivTop = wantedPieceDomRect.top - combinedParentDivRect.top - 15 * pieceSize / PIECE_DIMENSIONS;
    }
    console.log({ pieceDivTop });
    const pieceDivLeft = - pieceDomRect.width + 15 * pieceSize / PIECE_DIMENSIONS;
    return { pieceDivLeft, pieceDivTop };
}

interface AdjustAndAddPieceToCombinedParams {
    pieceDiv: HtmlPieceElement,
    pieceDivTop: number,
    pieceDivLeft: number,
    combinedParentDiv: HTMLElement,
    // pieceSize: number,
    pieceDomRect: DOMRect
}

export function adjustAndAddPieceToCombined({ pieceDiv, pieceDivTop, pieceDivLeft, combinedParentDiv, pieceDomRect }: AdjustAndAddPieceToCombinedParams) {
    pieceDiv.ontouchstart = null;
    pieceDiv.onmousedown = null;
    const combinedParentDomRect = combinedParentDiv.getBoundingClientRect();
    let newCombinedLeft = combinedParentDomRect.left
    let newCombinedTop = combinedParentDomRect.top
    // console.log('asdas', combinedParentDiv.getBoundingClientRect())
    // Shift rest of pieces if left or top is negative
    if (pieceDivLeft < 0) {
        const children = combinedParentDiv.querySelectorAll<HtmlPieceElement>(".piece")
        for (const child of children) {
            child.style.left = `${child.getBoundingClientRect().left - combinedParentDomRect.left + Math.abs(pieceDivLeft)}px`
        }
        console.log('asdas', pieceDomRect.left)
        newCombinedLeft = pieceDomRect.left
        pieceDivLeft = 0
    }
    if (pieceDivTop < 0) {
        const children = combinedParentDiv.querySelectorAll<HtmlPieceElement>(".piece")
        for (const child of children) {
            child.style.top = `${child.getBoundingClientRect().top - combinedParentDomRect.top + Math.abs(pieceDivTop)}px`
        }
        console.log('asdas', pieceDomRect.top)
        newCombinedTop = pieceDomRect.top
        pieceDivTop = 0
    }
    pieceDiv.style.top = `${pieceDivTop}px`;
    pieceDiv.style.left = `${pieceDivLeft}px`;
    console.log({ pieceDivTop, pieceDivLeft })
    combinedParentDiv.appendChild(pieceDiv);
    console.log({ newCombinedLeft, newCombinedTop })
    return { newCombinedLeft, newCombinedTop }
}