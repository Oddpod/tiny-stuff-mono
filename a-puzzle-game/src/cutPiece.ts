import { PIECE_DIMENSIONS } from "./pieceDefintions";
import type { PieceEntity } from "./makeBoard";
import { loadImage } from "./utils";

const canvasForCropping = document.createElement("canvas");
canvasForCropping.width = 300;
canvasForCropping.height = 200;
const croppingContext = canvasForCropping.getContext("2d")!;

let uniqueCounter = 0;

export interface CutPieceParams {
    pieceSize: number,
    piece: PieceEntity,
    image: HTMLImageElement
    boardWidth: number
    boardHeight: number
}
export const cutPiece = async ({ piece, pieceSize, image, boardHeight, boardWidth }: CutPieceParams) => {
    const shiftLeftBy =
        piece.definition.sides.left === "ear"
            ? 15 * pieceSize / PIECE_DIMENSIONS
            : 0;
    const shiftTopBy =
        piece.definition.sides.top === "ear"
            ? 15 * pieceSize / PIECE_DIMENSIONS
            : 0;
    const shiftedLeftX = Math.max(0, piece.boundingBox[0].x - shiftLeftBy) * image.width / boardWidth;
    const shiftedTopY = Math.max(0, piece.boundingBox[0].y - shiftTopBy) * image.height / boardHeight;

    const scaledUpWidth =
        (piece.definition.width * pieceSize) / PIECE_DIMENSIONS * image.width / boardWidth
    const scaledUpHeight =
        (piece.definition.height * pieceSize) / PIECE_DIMENSIONS * image.height / boardHeight

    const pieceWidth = (piece.definition.width * pieceSize) / PIECE_DIMENSIONS
    const pieceHeight = (piece.definition.height * pieceSize) / PIECE_DIMENSIONS
    
    canvasForCropping.width = pieceWidth
    canvasForCropping.height = pieceHeight
    
    croppingContext.drawImage(
        image,
        shiftedLeftX,
        shiftedTopY,
        scaledUpWidth,
        scaledUpHeight,
        0,
        0,
        pieceWidth,
        pieceHeight,
    );
    const croppedImageDataUrl = canvasForCropping.toDataURL();

    const clipPathId = `pieceClipPath_${uniqueCounter++}`;

    const croppedImage = await loadImage(croppedImageDataUrl)
    const style = `
        width: ${pieceWidth}px;
        height: ${pieceHeight}px;
    `;

    const imgStyle = `
        width: 100%;
        height: 100%;
        clip-path: url(#${clipPathId});
    `;

    croppedImage.setAttribute("style", imgStyle);

    const svgElement = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg",
    );
    svgElement.setAttribute("width", "0");
    svgElement.setAttribute("height", "0");
    const clipPathEl = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "clipPath",
    );
    clipPathEl.id = clipPathId;
    const pathEl = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path",
    );
    pathEl.setAttribute("d", piece.definition.path);

    const scaleToFitBoardX = pieceSize / PIECE_DIMENSIONS
    const scaleToFitBoardY = pieceSize / PIECE_DIMENSIONS
    pathEl.setAttribute(
        "transform",
        `scale(${(scaleToFitBoardX).toString()} ${(scaleToFitBoardY).toString()})`,
    );
    clipPathEl.appendChild(pathEl);
    svgElement.appendChild(clipPathEl);

    const newPiece = document.createElement("div");
    newPiece.appendChild(svgElement);
    newPiece.appendChild(croppedImage);
    newPiece.setAttribute("data-piece", JSON.stringify({ id: piece.id }))
    newPiece.setAttribute("style", style);
    newPiece.classList.add("piece");
    newPiece.setAttribute("draggable", "");

    return newPiece;
}