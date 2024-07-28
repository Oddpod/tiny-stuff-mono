import { getCombineParams, expandPieceGroupTop, expandPieceGroupRight, expandPieceGroupBottom, expandPieceGroupLeft } from "./clickIntoPlaceAndCombine";
import type { HtmlPieceElement } from "./clickPieceInPlace";
import { checkOverLapOnTop, checkOverlapOnRight, checkOverlapOnBottom, checkOverlapOnLeft } from "./overlap";
import { type Piece, pieceDefinitionLookup } from "./pieceDefintions";
import { topConnectionCalculateShiftXY } from "./shiftPieceIntoCombined";
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

export function onPieceGroupMouseUp({ combinedPiecesLookup, id, combinedPieceDiv: droppedPieceGroupDiv, savedBoard, pieceSize }: OnPieceGroupMouseUpParams) {
    const combinedPiece = combinedPiecesLookup.get(id)!;
    const pieces = findAllPiecesTouchingCombinedDiv(droppedPieceGroupDiv);
    // console.log({ pieces })

    for (const pieceDiv of pieces) {
        const combinedPieceParent = pieceDiv.parentElement?.parentElement
        const hasCombinedDiv = !!combinedPieceParent && combinedPieceParent.id.startsWith("combined-piece")
        if (!hasCombinedDiv) {
            const pieceToTry = savedBoard.flat().find(p => p.id === Number.parseInt(pieceDiv.dataset.pieceId))!;
            const definition = pieceDefinitionLookup.get(pieceToTry.definitionId)!;

            if (combinedPiece.pieceIds.has(pieceToTry.connections.top ?? -1)) {
                const { pieceDomRect, hitOffsetForEar, pieceDiv } = getCombineParams({ ...pieceToTry, definition }, pieceSize);
                const { isOverlapping, wantedPieceDomRect, wantedPiece } = checkOverLapOnTop({ connections: pieceToTry.connections, pieceDomRect, hitOffsetForEar });
                if (isOverlapping) {
                    const { newCombinedLeft, newCombinedTop } = expandPieceGroupTop({ combinedParentDiv: droppedPieceGroupDiv, piece: { ...pieceToTry, definition }, pieceDiv, pieceDomRect, pieceSize, wantedPiece, wantedPieceDomRect });
                    droppedPieceGroupDiv.style.left = `${newCombinedLeft}px`;
                    droppedPieceGroupDiv.style.top = `${newCombinedTop}px`;
                    combinedPiece.pieceIds.add(pieceToTry.id);
                    combinedPiecesLookup.set(id, combinedPiece);
                    continue;
                }
            }
            if (combinedPiece.pieceIds.has(pieceToTry.connections.right ?? -1)) {
                const { pieceDomRect, hitOffsetForEar, pieceDiv } = getCombineParams({ ...pieceToTry, definition }, pieceSize);
                const { isOverlapping, wantedPieceDomRect, wantedPiece } = checkOverlapOnRight({ connections: pieceToTry.connections, pieceDomRect, hitOffsetForEar });
                if (isOverlapping) {
                    const { newCombinedLeft, newCombinedTop } = expandPieceGroupRight({ combinedParentDiv: droppedPieceGroupDiv, piece: { ...pieceToTry, definition }, pieceDiv, pieceDomRect, pieceSize, wantedPiece, wantedPieceDomRect });
                    droppedPieceGroupDiv.style.left = `${newCombinedLeft}px`;
                    droppedPieceGroupDiv.style.top = `${newCombinedTop}px`;
                    combinedPiece.pieceIds.add(pieceToTry.id);
                    combinedPiecesLookup.set(id, combinedPiece);
                    continue;
                }
            }
            if (combinedPiece.pieceIds.has(pieceToTry.connections.bottom ?? -1)) {
                const { pieceDomRect, hitOffsetForEar, pieceDiv } = getCombineParams({ ...pieceToTry, definition }, pieceSize);
                const { isOverlapping, wantedPieceDomRect, wantedPiece } = checkOverlapOnBottom({ connections: pieceToTry.connections, pieceDomRect, hitOffsetForEar });
                if (isOverlapping) {
                    const { newCombinedLeft, newCombinedTop } = expandPieceGroupBottom({ combinedParentDiv: droppedPieceGroupDiv, piece: { ...pieceToTry, definition }, pieceDiv, pieceDomRect, pieceSize, wantedPiece, wantedPieceDomRect });
                    droppedPieceGroupDiv.style.left = `${newCombinedLeft}px`;
                    droppedPieceGroupDiv.style.top = `${newCombinedTop}px`;
                    combinedPiece.pieceIds.add(pieceToTry.id);
                    combinedPiecesLookup.set(id, combinedPiece);
                    continue;
                }
            }

            if (combinedPiece.pieceIds.has(pieceToTry.connections.left ?? -1)) {
                const { pieceDomRect, hitOffsetForEar, pieceDiv } = getCombineParams({ ...pieceToTry, definition }, pieceSize);
                const { isOverlapping, wantedPieceDomRect, wantedPiece } = checkOverlapOnLeft({ connections: pieceToTry.connections, pieceDomRect, hitOffsetForEar });
                if (isOverlapping) {
                    const { newCombinedLeft, newCombinedTop } = expandPieceGroupLeft({ combinedParentDiv: droppedPieceGroupDiv, piece: { ...pieceToTry, definition }, pieceDiv, pieceDomRect, pieceSize, wantedPiece, wantedPieceDomRect });
                    droppedPieceGroupDiv.style.left = `${newCombinedLeft}px`;
                    droppedPieceGroupDiv.style.top = `${newCombinedTop}px`;
                    combinedPiece.pieceIds.add(pieceToTry.id);
                    combinedPiecesLookup.set(id, combinedPiece);
                }
            }
        } else {
            console.log("combined")
            const pieceToTry = savedBoard.flat().find(p => p.id === Number.parseInt(pieceDiv.dataset.pieceId))!;
            const pieceToTryDefinition = pieceDefinitionLookup.get(pieceToTry.definitionId)!;

            if (combinedPiece.pieceIds.has(pieceToTry.connections.top ?? -1)) {
                const { pieceDomRect, hitOffsetForEar, pieceDiv } = getCombineParams({ ...pieceToTry, definition: pieceToTryDefinition }, pieceSize);
                const { isOverlapping, wantedPieceDomRect, wantedPiece } = checkOverLapOnTop({ connections: pieceToTry.connections, pieceDomRect, hitOffsetForEar });
                if (isOverlapping) {
                    const { pieceDivTop: newCombinedTop, pieceDivLeft } = topConnectionCalculateShiftXY({ combinedParentDiv: droppedPieceGroupDiv, pieceDomRect, pieceSize, sides: pieceToTryDefinition.sides, wantedPiece, wantedPieceDomRect })
                    const newCombinedLeft = Math.min(droppedPieceGroupDiv.getBoundingClientRect().left, combinedPieceParent.getBoundingClientRect().left);
                    // const newCombinedTop ;
                    
                    const leftMostParent = droppedPieceGroupDiv.getBoundingClientRect().left < combinedPieceParent.getBoundingClientRect().left ? droppedPieceGroupDiv : combinedPieceParent
                    const rightMostParent = droppedPieceGroupDiv.getBoundingClientRect().left < combinedPieceParent.getBoundingClientRect().left ? combinedPieceParent : droppedPieceGroupDiv
                    
                    const boardContainer = document.getElementById("board-container")
                    const children = rightMostParent.querySelectorAll<HtmlPieceElement>(".piece")!
                    for (const child of children) {
                        child.style.left = "0px"
                        child.style.top = "0px"
                        leftMostParent.appendChild(child)
                    }
                    boardContainer?.removeChild(leftMostParent)
                    
                    leftMostParent.style.left = `${newCombinedLeft}px`;
                    leftMostParent.style.top = `${newCombinedTop}px`;
                    combinedPiece.pieceIds.add(pieceToTry.id);
                    combinedPiecesLookup.set(id, combinedPiece);

                    continue;
                }
            }
        }
        console.log("asdf");
    }
}
