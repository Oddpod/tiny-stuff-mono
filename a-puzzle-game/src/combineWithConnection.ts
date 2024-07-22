import type { HtmlPieceElement } from "./clickPieceInPlace";
import type { PieceEntity } from "./makeBoard";
import { type Piece, PIECE_DIMENSIONS, pieceDefinitionLookup, type Side } from "./pieceDefintions";

interface CombineWithTopConnectionParams {
    boardContainer: HTMLDivElement;
    pieceDiv: HtmlPieceElement;
    wantedPiece: HtmlPieceElement;
    wantedPieceDomRect: DOMRect;
    pieceSize: number;
}

interface CombineConnectionReturnType {
    id: number,
    combinedPieceDiv: HTMLDivElement
}

interface CombinePiecesParams { innerParentDiv: HTMLDivElement, wantedPiece: HtmlPieceElement, pieceDiv: HtmlPieceElement, parentDiv: HTMLDivElement }

function createParentDivs() {
    const parentDiv = document.createElement("div");
    const innerParentDiv = document.createElement("div");
    parentDiv.style.position = "absolute";
    innerParentDiv.style.position = "relative";
    return { parentDiv, innerParentDiv };
}

function combinePieces({ innerParentDiv, wantedPiece, pieceDiv, parentDiv }: CombinePiecesParams) {
    innerParentDiv.appendChild(wantedPiece);
    innerParentDiv.appendChild(pieceDiv);
    parentDiv.appendChild(innerParentDiv);
    wantedPiece.ontouchstart = null;
    wantedPiece.onmousedown = null;
    pieceDiv.ontouchstart = null;
    pieceDiv.onmousedown = null;
}

let uniqueCounterCombined = 0

export function combineWithTopConnection({ boardContainer, pieceDiv, wantedPiece, wantedPieceDomRect, pieceSize, pieceDefSides }: CombineWithLeftConnectionParams): CombineConnectionReturnType {
    const { parentDiv, innerParentDiv } = createParentDivs();

    boardContainer?.removeChild(pieceDiv);
    boardContainer?.removeChild(wantedPiece);

    const wantedPieceDef = pieceDefinitionLookup.get(Number.parseInt(wantedPiece.dataset.definitionId))!;

    const { wantedPieceLeft, pieceDivLeft } = calculateLeftForTopAndBottom(wantedPieceDef, pieceDefSides.left, pieceSize)
    wantedPiece.style.left = `${wantedPieceLeft}px`;
    wantedPiece.style.top = "0px";
    pieceDiv.style.left = `${pieceDivLeft}px`;
    pieceDiv.style.top = `${wantedPieceDomRect.height - 15 * pieceSize / PIECE_DIMENSIONS}px`;

    parentDiv.style.top = `${wantedPieceDomRect.top}px`;
    parentDiv.style.left = `${wantedPieceDomRect.left}px`;

    combinePieces({ innerParentDiv, parentDiv, pieceDiv, wantedPiece });

    parentDiv.id = `combined-piece-${uniqueCounterCombined}`;
    return { combinedPieceDiv: parentDiv, id: uniqueCounterCombined++ };
}

export function combineWithRightConnection({
    boardContainer, wantedPiece, pieceDiv, pieceSize, pieceDomRect, wantedPieceDomRect, pieceDefSides
}: CombineWithLeftConnectionParams): CombineConnectionReturnType {
    boardContainer?.removeChild(wantedPiece);
    boardContainer?.removeChild(pieceDiv);

    const wantedPieceDef = pieceDefinitionLookup.get(Number.parseInt(wantedPiece.dataset.definitionId))!;

    const { pieceDivTop, wantedPieceTop } = calculateTopsForLeftAndRight(wantedPieceDef, pieceDefSides.top, pieceSize);

    pieceDiv.style.top = `${pieceDivTop}px`;

    wantedPiece.style.top = `${wantedPieceTop}px`;
    wantedPiece.style.left = `${pieceDomRect.width - 15 * pieceSize / PIECE_DIMENSIONS}px`;
    pieceDiv.style.left = "0px";

    const { parentDiv, innerParentDiv } = createParentDivs();

    parentDiv.style.top = `${Math.max(wantedPieceDomRect.top, pieceDomRect.top)}px`;
    parentDiv.style.left = `${pieceDomRect.left}px`;
    parentDiv.id = `combined-piece-${uniqueCounterCombined}`;

    combinePieces({ innerParentDiv, parentDiv, pieceDiv, wantedPiece });
    return { combinedPieceDiv: parentDiv, id: uniqueCounterCombined++ };
}
interface CombineWithBottomConnectionParams extends Pick<CombineWithTopConnectionParams, 'boardContainer' | 'pieceDiv' | 'pieceSize' | 'wantedPiece' | 'wantedPieceDomRect'> {
    pieceDomRect: DOMRect;
    pieceDefSides: PieceEntity["definition"]["sides"]
}

export function combineWithBottomConnection({ boardContainer, wantedPiece, pieceDomRect, pieceSize, wantedPieceDomRect, pieceDiv, pieceDefSides }: CombineWithBottomConnectionParams): CombineConnectionReturnType {
    boardContainer.removeChild(wantedPiece);
    boardContainer.removeChild(pieceDiv);

    const wantedPieceDef = pieceDefinitionLookup.get(Number.parseInt(wantedPiece.dataset.definitionId))!;

    const { wantedPieceLeft, pieceDivLeft } = calculateLeftForTopAndBottom(wantedPieceDef, pieceDefSides.left, pieceSize)

    wantedPiece.style.left = `${wantedPieceLeft}px`
    pieceDiv.style.left = `${pieceDivLeft}px`
    
    wantedPiece.style.top = `${pieceDomRect.height - 15 * pieceSize / PIECE_DIMENSIONS}px`;
    pieceDiv.style.top = "0px";

    const { parentDiv, innerParentDiv } = createParentDivs();

    parentDiv.style.top = `${pieceDomRect.top}px`;
    parentDiv.style.left = `${Math.min(pieceDomRect.left, wantedPieceDomRect.left)}px`;

    combinePieces({ innerParentDiv, wantedPiece, pieceDiv, parentDiv });

    parentDiv.id = `combined-piece-${uniqueCounterCombined}`;
    return { combinedPieceDiv: parentDiv, id: uniqueCounterCombined++ };
}
interface CombineWithLeftConnectionParams extends CombineWithBottomConnectionParams { }

export function combineWithLeftConnection({ wantedPiece, pieceDiv, boardContainer, pieceDomRect, pieceSize, wantedPieceDomRect, pieceDefSides }: CombineWithLeftConnectionParams): CombineConnectionReturnType {
    boardContainer.removeChild(wantedPiece);
    boardContainer.removeChild(pieceDiv);
    const wantedPieceDef = pieceDefinitionLookup.get(Number.parseInt(wantedPiece.dataset.definitionId))!

    pieceDiv.style.left = `${wantedPieceDomRect.width - 15 * pieceSize / PIECE_DIMENSIONS}px`;
    wantedPiece.style.left = "0px";
    const { pieceDivTop, wantedPieceTop } = calculateTopsForLeftAndRight(wantedPieceDef, pieceDefSides.top, pieceSize);
    const { parentDiv, innerParentDiv } = createParentDivs();

    pieceDiv.style.top = `${pieceDivTop}px`
    wantedPiece.style.top = `${wantedPieceTop}px`
    parentDiv.style.top = `${Math.min(pieceDomRect.top, wantedPieceDomRect.top)}px`;
    parentDiv.style.left = `${wantedPieceDomRect.left}px`;

    combinePieces({ innerParentDiv, wantedPiece, pieceDiv, parentDiv });

    parentDiv.id = `combined-piece-${uniqueCounterCombined}`;
    return { combinedPieceDiv: parentDiv, id: uniqueCounterCombined++ };
}

function calculateTopsForLeftAndRight(wantedPieceDef: Piece, pieceDefTopSide: Side, pieceSize: number) {
    let wantedPieceTop = 0;
    let pieceDivTop = 0;
    if (wantedPieceDef.sides.top === pieceDefTopSide) {
        pieceDivTop = 0;
    } else if (wantedPieceDef.sides.top === "ear") {
        pieceDivTop = 15 * pieceSize / PIECE_DIMENSIONS;
        wantedPieceTop = 0;
    } else {
        pieceDivTop = 0;
        wantedPieceTop = 15 * pieceSize / PIECE_DIMENSIONS;
    }
    return { pieceDivTop, wantedPieceTop };
}

function calculateLeftForTopAndBottom(wantedPieceDef: Piece, pieceDivLeftSide: Side, pieceSize: number) {
    let wantedPieceLeft = 0;
    let pieceDivLeft = 0;
    if (wantedPieceDef.sides.left === pieceDivLeftSide) {
        pieceDivLeft = 0;
    } else if (wantedPieceDef.sides.left === "ear") {
        pieceDivLeft = 15 * pieceSize / PIECE_DIMENSIONS;
        wantedPieceLeft = 0;
    } else {
        pieceDivLeft = 0;
        wantedPieceLeft = 15 * pieceSize / PIECE_DIMENSIONS;
    }
    return { pieceDivLeft, wantedPieceLeft };
}
