import type { InputConfig } from "./input";

export interface DimConfigWithPieceSize extends InputConfig {
    pieceSize: number
}

const loadImage = (imageSrc: string): Promise<HTMLImageElement> => {
    return new Promise((res, rej) => {
        const img1 = new Image();
        img1.src = imageSrc;
        img1.onload = () => res(img1);
    });
};
export const loadAndAddImage = async (imageSrc: string) => {
    const image = await loadImage(imageSrc);
    return image;
};
