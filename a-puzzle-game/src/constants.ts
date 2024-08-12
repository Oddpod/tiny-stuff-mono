export interface HtmlPieceElement extends HTMLDivElement {
	dataset: {
		pieceId: string;
		definitionId: string;
		coords: string;
	};
}

export const HIT_OFFSET = Object.freeze(5);
