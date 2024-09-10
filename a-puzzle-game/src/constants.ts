export interface HtmlPieceElement extends HTMLDivElement {
	dataset: {
		pieceId: string;
		definitionId: string;
		coords: string;
	};
}

export const HIT_OFFSET = Object.freeze(5);

export const SINGLE_PIECE_ZINDEX = Object.freeze(40).toString();
export const COMBINED_PIECE_ZINDEX = Object.freeze(20).toString();

export const MIN_PIECE_SIZE = Object.freeze(50);
export const MAX_DIM_XY = Object.freeze(50);
