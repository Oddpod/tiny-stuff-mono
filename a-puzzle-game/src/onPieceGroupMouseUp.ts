import { getCombineParams, expandPieceGroupTop, expandPieceGroupRight, expandPieceGroupBottom, expandPieceGroupLeft } from "./clickIntoPlaceAndCombine";
import type { HtmlPieceElement } from "./clickPieceInPlace";
import { checkOverLapOnTop, checkOverlapOnRight, checkOverlapOnBottom, checkOverlapOnLeft } from "./overlap";
import { type Piece, pieceDefinitionLookup } from "./pieceDefintions";
import type { SavedBoard } from "./storeState";
import { checkCollision } from "./utils";

function findAllPiecesTouchingCombinedDiv(combinedPieceDiv: HTMLDivElement) {
    const allPieces = document.querySelectorAll<HtmlPieceElement>(".piece")
    const piecesInside = [];
    const rect = combinedPieceDiv.getBoundingClientRect()
    for (const element of allPieces) {
        const box = element.getBoundingClientRect();
        const alreadyInCombinedDiv = combinedPieceDiv.id === element.parentElement?.parentElement?.id
        if (
            checkCollision(rect, box) && !alreadyInCombinedDiv
        ) {
            piecesInside.push(element);
        }
    };
    return piecesInside;
}

interface OnPieceGroupMouseUpParams {
    combinedPiecesLookup: Map<number,
        { pieceIds: Set<number>; }>,
    id: number,
    combinedPieceDiv: HTMLDivElement,
    savedBoard: SavedBoard,
    pieceSize: number
}

export function onPieceGroupMouseUp({ combinedPiecesLookup, id, combinedPieceDiv, savedBoard, pieceSize }: OnPieceGroupMouseUpParams) {
    const combinedPiece = combinedPiecesLookup.get(id)!;
    const pieces = findAllPiecesTouchingCombinedDiv(combinedPieceDiv);
    // console.log({ pieces })

    for (const pieceDiv of pieces) {
        const hasCombinedDiv = pieceDiv.parentElement !== null && pieceDiv.parentElement?.id !== "board-container";
        if (!hasCombinedDiv) {
            const pieceToTry = savedBoard.flat().find(p => p.id === Number.parseInt(pieceDiv.dataset.pieceId))!;
            const definition = pieceDefinitionLookup.get(pieceToTry.definitionId)!;

            if (combinedPiece.pieceIds.has(pieceToTry.connections.top ?? -1)) {
                const { pieceDomRect, hitOffsetForEar, pieceDiv } = getCombineParams({ ...pieceToTry, definition }, pieceSize);
                const { isOverlapping, wantedPieceDomRect, wantedPiece } = checkOverLapOnTop({ connections: pieceToTry.connections, pieceDomRect, hitOffsetForEar });
                if (isOverlapping) {
                    const { newCombinedLeft, newCombinedTop } = expandPieceGroupTop({ combinedParentDiv: combinedPieceDiv, piece: { ...pieceToTry, definition }, pieceDiv, pieceDomRect, pieceSize, wantedPiece, wantedPieceDomRect });
                    combinedPieceDiv.style.left = `${newCombinedLeft}px`;
                    combinedPieceDiv.style.top = `${newCombinedTop}px`;
                    combinedPiece.pieceIds.add(pieceToTry.id);
                    combinedPiecesLookup.set(id, combinedPiece);
                    continue;
                }
            }
            if (combinedPiece.pieceIds.has(pieceToTry.connections.right ?? -1)) {
                const { pieceDomRect, hitOffsetForEar, pieceDiv } = getCombineParams({ ...pieceToTry, definition }, pieceSize);
                const { isOverlapping, wantedPieceDomRect, wantedPiece } = checkOverlapOnRight({ connections: pieceToTry.connections, pieceDomRect, hitOffsetForEar });
                if (isOverlapping) {
                    const { newCombinedLeft, newCombinedTop } = expandPieceGroupRight({ combinedParentDiv: combinedPieceDiv, piece: { ...pieceToTry, definition }, pieceDiv, pieceDomRect, pieceSize, wantedPiece, wantedPieceDomRect });
                    combinedPieceDiv.style.left = `${newCombinedLeft}px`;
                    combinedPieceDiv.style.top = `${newCombinedTop}px`;
                    combinedPiece.pieceIds.add(pieceToTry.id);
                    combinedPiecesLookup.set(id, combinedPiece);
                    continue;
                }
            }
            if (combinedPiece.pieceIds.has(pieceToTry.connections.bottom ?? -1)) {
                const { pieceDomRect, hitOffsetForEar, pieceDiv } = getCombineParams({ ...pieceToTry, definition }, pieceSize);
                const { isOverlapping, wantedPieceDomRect, wantedPiece } = checkOverlapOnBottom({ connections: pieceToTry.connections, pieceDomRect, hitOffsetForEar });
                if (isOverlapping) {
                    expandPieceGroupBottom({ combinedParentDiv: combinedPieceDiv, piece: { ...pieceToTry, definition }, pieceDiv, pieceDomRect, pieceSize, wantedPiece, wantedPieceDomRect });
                    combinedPiece.pieceIds.add(pieceToTry.id);
                    combinedPiecesLookup.set(id, combinedPiece);
                    continue;
                }
            }

            if (combinedPiece.pieceIds.has(pieceToTry.connections.left ?? -1)) {
                const { pieceDomRect, hitOffsetForEar, pieceDiv } = getCombineParams({ ...pieceToTry, definition }, pieceSize);
                const { isOverlapping, wantedPieceDomRect, wantedPiece } = checkOverlapOnLeft({ connections: pieceToTry.connections, pieceDomRect, hitOffsetForEar });
                if (isOverlapping) {
                    expandPieceGroupLeft({ combinedParentDiv: combinedPieceDiv, piece: { ...pieceToTry, definition }, pieceDiv, pieceDomRect, pieceSize, wantedPiece, wantedPieceDomRect });
                    combinedPiece.pieceIds.add(pieceToTry.id);
                    combinedPiecesLookup.set(id, combinedPiece);
                }
            }
        }
        console.log("asdf");
    }
}
