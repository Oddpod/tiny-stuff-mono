import { Effect } from "effect";
import { PIECE_DIMENSIONS } from "./pieceDefintions";
import type { PieceEntity } from "./pieceCreator";

const canvasForCropping = document.createElement("canvas");
canvasForCropping.width = 300;
canvasForCropping.height = 200;
const croppingContext = canvasForCropping.getContext("2d")!;

let uniqueCounter = 0;

export interface CutPieceParams {
    pieceSize: number,
    piece: PieceEntity,
    image: HTMLImageElement
}
export const cutPiece = ({ piece, pieceSize, image }: CutPieceParams): Promise<HTMLDivElement> => {
    const shiftLeftBy =
        piece.definition.sides.left === "ear"
            ? (15 * pieceSize) / PIECE_DIMENSIONS
            : 0;
    const shiftTopBy =
        piece.definition.sides.top === "ear"
            ? (15 * pieceSize) / PIECE_DIMENSIONS
            : 0;
    const shiftedLeftX = Math.max(0, piece.boundingBox[0].x - shiftLeftBy);
    const shiftedTopY = Math.max(0, piece.boundingBox[0].y - shiftTopBy);

    const scaledUpWidth =
        (piece.definition.width * pieceSize) / PIECE_DIMENSIONS;
    const scaledUpHeight =
        (piece.definition.height * pieceSize) / PIECE_DIMENSIONS;

    croppingContext.drawImage(
        image,
        shiftedLeftX,
        shiftedTopY,
        scaledUpWidth,
        scaledUpHeight,
        0,
        0,
        Math.max(piece.definition.width, canvasForCropping.width),
        Math.max(piece.definition.height, canvasForCropping.height),
    );
    const croppedImageDataUrl = canvasForCropping.toDataURL();

    const croppedImage = new Image();
    croppedImage.src = croppedImageDataUrl;

    const clipPathId = `pieceClipPath_${uniqueCounter++}`;

    // 		clip-path: path("${piece.definition.path}");
    return new Promise((res, rej) => {
        croppedImage.onload = () => {
            const style = `
                        width: ${scaledUpWidth}px;
                        height: ${scaledUpHeight}px;
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
            pathEl.setAttribute(
                "transform",
                `scale(${(pieceSize / PIECE_DIMENSIONS).toString()} ${(pieceSize / PIECE_DIMENSIONS).toString()})`,
            );
            clipPathEl.appendChild(pathEl);
            svgElement.appendChild(clipPathEl);

            const newPiece = document.createElement("div");
            newPiece.appendChild(svgElement);
            newPiece.appendChild(croppedImage);
            newPiece.setAttribute("style", style);
            newPiece.setAttribute("draggable", "");

            return res(newPiece);
        };
    })
}