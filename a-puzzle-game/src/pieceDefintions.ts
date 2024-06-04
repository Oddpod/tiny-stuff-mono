export const PIECE_EAR_SIZE = Object.freeze(15);
export const PIECE_DIMENSIONS = Object.freeze(50);

type Side = "ear" | "hole" | "flat";
interface Piece {
	id: number;
	width: number;
	height: number;
	sides: {
		bottom: Side;
		top: Side;
		left: Side;
		right: Side;
	};
	path: string;
}

interface PiecesLookup {
	[key: string]: Piece;
}

export type PieceDefinition =
	(typeof pieceDefinitions)[keyof typeof pieceDefinitions];

export const pieceDefinitions = {
	centerPiece1: {
		height: 80,
		id: 0,
		path: "M 0 15 H 15 C 10 -5 40 -5 35 15 H 50 V 30 C 30 25 30 55 50 50 V 65 H 35 C 40 85 10 85 15 65 H 0 V 50 C 19 55 20 25 0 30 Z",
		sides: {
			bottom: "ear",
			left: "hole",
			right: "hole",
			top: "ear",
		},
		width: 50,
	},
	centerPiece2: {
		height: 65,
		id: 1,
		path: "M 15 15 H 30 C 25 -5 55 -5 50 15 H 65 V 30 C 45 25 45 55 65 50 V 65 H 50 C 55 85 25 85 30 65 H 15 V 50 C -5 55 -5 25 15 30 Z",
		sides: {
			bottom: "flat",
			left: "ear",
			right: "hole",
			top: "ear",
		},
		width: 65,
	},
	centerPiece3: {
		height: 65,
		id: 2,
		path: "M 0 0 H 15 C 10 20 40 20 35 0 H 50 V 15 C 30 10 30 40 50 35 V 50 H 35 C 40 30 10 30 15 50 H 0 V 35 C 20 40 20 10 0 15 Z",
		sides: {
			bottom: "hole",
			left: "hole",
			right: "hole",
			top: "hole",
		},
		width: 65,
	},
	centerPiece4: {
		height: 65,
		id: 3,
		path: "M 0 15 H 15 C 10 -5 40 -5 35 15 H 50 V 30 C 30 25 30 55 50 50 V 65 H 35 C 40 45 10 45 15 65 H 0 V 50 C 20 55 20 25 0 30 Z",
		sides: {
			bottom: "hole",
			left: "hole",
			right: "hole",
			top: "ear",
		},
		width: 65,
	},
	centerPiece5: {
		height: 65,
		id: 4,
		path: "M 0 0 H 15 C 10 20 40 20 35 0 H 50 V 15 C 30 10 30 40 50 35 V 50 H 35 C 40 70 10 70 15 50 H 0 V 35 C 20 40 20 10 0 15 Z",
		sides: {
			bottom: "ear",
			left: "hole",
			right: "hole",
			top: "hole",
		},
		width: 50,
	},
	centerPiece6: {
		height: 65,
		id: 5,
		path: "M 50 50 H 35 C 40 30 10 30 15 50 H 0 V 35 C 20 40 20 10 0 15 V 0 H 15 C 10 20 40 20 35 0 H 50 V 15 C 30 10 30 40 50 35 Z",
		sides: {
			bottom: "hole",
			left: "hole",
			right: "hole",
			top: "hole",
		},
		width: 65,
	},
	centerPiece7: {
		height: 80,
		id: 6,
		path: "M 15 15 H 30 C 25 -5 55 -5 50 15 H 65 V 30 C 85 25 85 55 65 50 V 65 H 50 C 55 85 25 85 30 65 H 15 V 50 C -5 55 -5 25 15 30 Z",
		sides: {
			bottom: "ear",
			left: "ear",
			right: "ear",
			top: "ear",
		},
		width: 80,
	},
	centerPiece8: {
		height: 50,
		id: 7,
		path: "M 65 0 V 15 C 85 10 85 40 65 35 V 50 H 50 C 55 30 25 30 30 50 H 15 V 35 C -5 40 -5 10 15 15 V 0 H 30 C 25 19 55 20 50 0 Z",
		sides: {
			bottom: "hole",
			left: "ear",
			right: "ear",
			top: "hole",
		},
		width: 80,
	},
	centerPiece9: {
		height: 65,
		id: 8,
		path: "M 50 65 H 35 C 40 45 10 45 15 65 H 0 V 50 C 20 55 20 25 0 30 V 15 H 15 C 10 -5 40 -5 35 15 H 50 V 30 C 30 25 30 55 50 50 Z",
		sides: {
			bottom: "hole",
			left: "hole",
			right: "hole",
			top: "ear",
		},
		width: 65,
	},
	centerPiece10: {
		height: 65,
		id: 9,
		path: "M 65 65 H 50 C 55 45 25 45 30 65 H 15 V 50 C -5 55 -5 25 15 30 V 15 H 30 C 25 -5 55 -5 50 15 H 65 V 30 C 85 25 85 55 65 50 Z",
		sides: {
			bottom: "hole",
			left: "ear",
			right: "ear",
			top: "ear",
		},
		width: 80,
	},
	centerPiece11: {
		height: 80,
		id: 10,
		path: "M 65 15 V 30 C 45 25 45 55 65 50 V 65 H 50 C 55 85 25 85 30 65 H 15 V 50 C -5 55 -5 25 15 30 V 15 H 30 C 25 -5 55 -5 50 15 Z",
		sides: {
			bottom: "ear",
			left: "ear",
			right: "hole",
			top: "ear",
		},
		width: 65,
	},
	centerPiece12: {
		height: 65,
		id: 11,
		path: "M 15 0 H 30 C 25 20 55 20 50 0 H 65 V 15 C 85 10 85 40 65 35 V 50 H 50 C 55 70 25 70 30 50 H 15 V 35 C -5 40 -5 10 15 15 Z",
		sides: {
			bottom: "ear",
			left: "ear",
			right: "ear",
			top: "hole",
		},
		width: 80,
	},
	cornerPieceLeftBottom1: {
		height: 65,
		id: 12,
		path: "M 0 50 V 0 H 15 C 10 20 40 20 35 0 H 50 V 15 C 70 10 70 40 50 35 V 50 Z",
		sides: {
			bottom: "flat",
			left: "flat",
			right: "ear",
			top: "hole",
		},
		width: 65,
	},
	cornerPieceLeftBottom2: {
		height: 65,
		id: 13,
		path: "M 50 65 H 0 V 15 H 15 C 10 -5 40 -5 35 15 H 50 V 30 C 70 25 70 55 50 50 Z",
		sides: {
			bottom: "flat",
			left: "flat",
			right: "ear",
			top: "ear",
		},
		width: 65,
	},
	cornerPieceLeftBottom3: {
		height: 65,
		id: 14,
		path: "M 50 65 H 0 V 15 H 15 C 10 -5 40 -5 35 15 H 50 V 30 C 30 25 30 55 50 50 Z",
		sides: {
			bottom: "flat",
			left: "flat",
			right: "hole",
			top: "ear",
		},
		width: 50,
	},
	cornerPieceLeftBottom4: {
		height: 50,
		id: 15,
		path: "M 50 50 H 0 V 0 H 15 C 10 20 40 20 35 0 H 50 V 15 C 30 10 30 40 50 35 Z",
		sides: {
			bottom: "flat",
			left: "flat",
			right: "hole",
			top: "hole",
		},
		width: 50,
	},
	cornerPieceLeftTop1: {
		height: 65,
		id: 16,
		path: "M 0 0 H 50 V 15 C 30 10 30 40 50 35 V 50 H 35 C 40 70 10 70 15 50 H 0 Z",
		sides: {
			bottom: "ear",
			left: "flat",
			right: "hole",
			top: "flat",
		},
		width: 50,
	},
	cornerPieceLeftTop2: {
		height: 50,
		id: 17,
		path: "M 0 0 H 50 V 15 C 30 10 30 40 50 35 V 50 H 35 C 40 30 10 30 15 50 H 0 Z",
		sides: {
			bottom: "hole",
			left: "flat",
			right: "hole",
			top: "flat",
		},
		width: 50,
	},
	cornerPieceLeftTop3: {
		height: 50,
		id: 18,
		path: "M 0 0 H 50 V 15 C 70 10 70 40 50 35 V 50 H 35 C 40 30 10 30 15 50 H 0 Z",
		sides: {
			bottom: "hole",
			left: "flat",
			right: "ear",
			top: "flat",
		},
		width: 65,
	},
	cornerPieceLeftTop4: {
		height: 65,
		id: 19,
		path: "M 0 0 H 50 V 15 C 70 10 70 40 50 35 V 50 H 35 C 40 70 10 70 15 50 H 0 Z",
		sides: {
			bottom: "ear",
			left: "flat",
			right: "ear",
			top: "flat",
		},
		width: 65,
	},
	cornerPieceRightBottom1: {
		height: 65,
		id: 20,
		path: "M 50 15 V 65 H 0 V 50 C 20 55 20 25 0 30 V 15 H 15 C 10 -5 40 -5 35 15 Z",
		sides: {
			bottom: "flat",
			left: "hole",
			right: "flat",
			top: "ear",
		},
		width: 50,
	},
	cornerPieceRightBottom2: {
		height: 65,
		id: 21,
		path: "M 65 15 V 65 H 15 V 50 C -5 55 -5 25 15 30 V 15 H 30 C 25 -5 55 -5 50 15 Z",
		sides: {
			bottom: "flat",
			left: "ear",
			right: "flat",
			top: "ear",
		},
		width: 65,
	},
	cornerPieceRightBottom3: {
		height: 50,
		id: 22,
		path: "M 65 0 V 50 H 15 V 35 C -5 40 -5 10 15 15 V 0 H 30 C 25 20 55 20 50 0 Z",
		sides: {
			bottom: "flat",
			left: "ear",
			right: "flat",
			top: "hole",
		},
		width: 65,
	},
	cornerPieceRightBottom4: {
		height: 50,
		id: 23,
		path: "M 50 0 V 50 H 0 V 35 C 20 40 20 10 0 15 V 0 H 15 C 10 20 40 20 35 0 Z",
		sides: {
			bottom: "flat",
			left: "hole",
			right: "flat",
			top: "hole",
		},
		width: 50,
	},
	cornerPieceTopRight1: {
		height: 50,
		id: 24,
		path: "M 15 0 H 65 V 50 H 50 C 55 30 25 30 30 50 H 15 V 35 C -5 40 -5 10 15 15 V 0 Z",
		sides: {
			bottom: "hole",
			left: "ear",
			right: "flat",
			top: "flat",
		},
		width: 65,
	},
	cornerPieceTopRight2: {
		height: 65,
		id: 25,
		path: "M 0 0 H 50 V 50 H 35 C 40 70 10 70 15 50 H 0 V 35 C 20 40 20 10 0 15 V 0 Z",
		sides: {
			bottom: "ear",
			left: "hole",
			right: "flat",
			top: "flat",
		},
		width: 50,
	},
	cornerPieceTopRight3: {
		height: 50,
		id: 26,
		path: "M 0 0 H 50 V 50 H 35 C 40 30 10 30 15 50 H 0 V 35 C 20 40 20 10 0 15 V 0 Z",
		sides: {
			bottom: "hole",
			left: "hole",
			right: "flat",
			top: "flat",
		},
		width: 50,
	},
	cornerPieceTopRight4: {
		height: 65,
		id: 27,
		path: "M 15 0 H 65 V 50 H 50 C 55 70 25 70 30 50 H 15 V 35 C -5 40 -5 10 15 15 V 0 Z",
		sides: {
			bottom: "ear",
			left: "ear",
			right: "flat",
			top: "flat",
		},
		width: 65,
	},
	sidePieceBottom1: {
		height: 50,
		id: 28,
		path: "M 50 50 H 0 V 35 C 20 40 20 10 0 15 V 0 H 15 C 10 20 40 20 35 0 H 50 V 15 C 70 10 70 40 50 35 Z",
		sides: {
			bottom: "flat",
			left: "hole",
			right: "ear",
			top: "hole",
		},
		width: 65,
	},
	sidePieceBottom2: {
		height: 65,
		id: 29,
		path: "M 50 65 H 0 V 50 C 20 55 20 25 0 30 V 15 H 15 C 10 -5 40 -5 35 15 H 50 V 30 C 70 25 70 55 50 50 Z",
		sides: {
			bottom: "flat",
			left: "hole",
			right: "ear",
			top: "ear",
		},
		width: 65,
	},
	sidePieceBottom3: {
		height: 65,
		id: 30,
		path: "M 65 65 H 15 V 50 C -5 55 -5 25 15 30 V 15 H 30 C 25 -5 55 -5 50 15 H 65 V 30 C 85 25 85 55 65 50 Z",
		sides: {
			bottom: "flat",
			left: "ear",
			right: "ear",
			top: "ear",
		},
		width: 80,
	},
	sidePieceBottom4: {
		height: 50,
		id: 31,
		path: "M 65 50 H 15 V 35 C -5 40 -5 10 15 15 V 0 H 30 C 25 20 55 20 50 0 H 65 V 15 C 85 10 85 40 65 35 Z",
		sides: {
			bottom: "flat",
			left: "ear",
			right: "ear",
			top: "hole",
		},
		width: 80,
	},
	sidePieceBottom5: {
		height: 65,
		id: 32,
		path: "M 50 50 H 0 V 35 C 20 40 20 10 0 15 V 0 H 15 C 10 20 40 20 35 0 H 50 V 15 C 30 10 30 40 50 35 Z",
		sides: {
			bottom: "flat",
			left: "hole",
			right: "hole",
			top: "hole",
		},
		width: 65,
	},
	sidePieceBottom6: {
		height: 65,
		id: 33,
		path: "M 50 65 H 0 V 50 C 20 55 20 25 0 30 V 15 H 15 C 10 -5 40 -5 35 15 H 50 V 30 C 30 25 30 55 50 50 Z",
		sides: {
			bottom: "flat",
			left: "hole",
			right: "hole",
			top: "ear",
		},
		width: 50,
	},
	sidePieceLeft1: {
		height: 50,
		id: 34,
		path: "M 0 0 H 15 C 10 20 40 20 35 0 H 50 V 15 C 70 10 70 40 50 35 V 50 H 35 C 40 30 10 30 15 50 H 0 V 35 V 0 Z",
		sides: {
			bottom: "hole",
			left: "flat",
			right: "ear",
			top: "hole",
		},
		width: 65,
	},
	sidePieceLeft2: {
		height: 65,
		id: 35,
		path: "M 0 50 V 0 H 15 C 10 20 40 20 35 0 H 50 V 15 C 70 10 70 40 50 35 V 50 H 35 C 40 70 10 70 15 50 Z",
		sides: {
			bottom: "ear",
			left: "flat",
			right: "ear",
			top: "hole",
		},
		width: 65,
	},
	sidePieceLeft3: {
		height: 50,
		id: 36,
		path: "M 0 50 V 0 H 15 C 10 20 40 20 35 0 H 50 V 15 C 30 10 30 40 50 35 V 50 H 35 C 40 30 10 30 15 50 Z",
		sides: {
			bottom: "hole",
			left: "flat",
			right: "hole",
			top: "hole",
		},
		width: 50,
	},
	sidePieceLeft4: {
		height: 65,
		id: 37,
		path: "M 0 15 H 15 C 10 -5 40 -5 35 15 H 50 V 30 C 70 25 70 55 50 50 V 65 H 35 C 40 45 10 45 15 65 H 0 V 50 V 15 Z",
		sides: {
			bottom: "hole",
			left: "flat",
			right: "ear",
			top: "ear",
		},
		width: 65,
	},
	sidePieceLeft5: {
		height: 80,
		id: 38,
		path: "M 0 65 V 15 H 15 C 10 -5 40 -5 35 15 H 50 V 30 C 70 25 70 55 50 50 V 65 H 35 C 40 85 10 85 15 65 Z",
		sides: {
			bottom: "ear",
			left: "flat",
			right: "ear",
			top: "ear",
		},
		width: 65,
	},
	sidePieceLeft6: {
		height: 80,
		id: 39,
		path: "M 0 65 V 15 H 15 C 10 -5 40 -5 35 15 H 50 V 30 C 30 25 30 55 50 50 V 65 H 35 C 40 85 10 85 15 65 Z",
		sides: {
			bottom: "ear",
			left: "flat",
			right: "hole",
			top: "ear",
		},
		width: 50,
	},
	sidePieceRight1: {
		height: 50,
		id: 40,
		path: "M 65 0 V 50 H 50 C 55 30 25 30 30 50 H 15 V 35 C -5 40 -5 10 15 15 V 0 H 30 C 25 20 55 20 50 0 Z",
		sides: {
			bottom: "hole",
			left: "ear",
			right: "flat",
			top: "hole",
		},
		width: 65,
	},
	sidePieceRight2: {
		height: 65,
		id: 41,
		path: "M 65 15 V 65 H 50 C 55 45 25 45 30 65 H 15 V 50 C -5 55 -5 25 15 30 V 15 H 30 C 25 -5 55 -5 50 15 Z",
		sides: {
			bottom: "hole",
			left: "ear",
			right: "flat",
			top: "ear",
		},
		width: 65,
	},
	sidePieceRight3: {
		id: 51,
		height: 80,
		width: 65,
		path: "M 65 15 V 65 H 50 C 55 85 25 85 30 65 H 15 V 50 C -5 55 -5 25 15 30 V 15 H 30 C 25 -5 55 -5 50 15 Z",
		sides: {
			top: "ear",
			right: "flat",
			left: "ear",
			bottom: "ear",
		},
	},
	sidePieceRight4: {
		height: 65,
		id: 42,
		path: "M 65 15 V 65 H 50 C 55 45 25 45 30 65 H 15 V 50 C -5 55 -5 25 15 30 V 15 H 30 C 25 -5 55 -5 50 15 Z",
		sides: {
			bottom: "hole",
			left: "ear",
			right: "flat",
			top: "ear",
		},
		width: 65,
	},
	sidePieceRight5: {
		height: 65,
		id: 43,
		path: "M 50 15 V 65 H 35 C 40 45 10 45 15 65 H 0 V 50 C 20 55 20 25 0 30 V 15 H 15 C 10 -5 40 -5 35 15 Z",
		sides: {
			bottom: "hole",
			left: "hole",
			right: "flat",
			top: "ear",
		},
		width: 50,
	},
	sidePieceRight6: {
		height: 65,
		id: 44,
		path: "M 50 0 V 50 H 35 C 40 30 10 30 15 50 H 0 V 35 C 20 40 20 10 0 15 V 0 H 15 C 10 20 40 20 35 0 Z",
		sides: {
			bottom: "hole",
			left: "hole",
			right: "flat",
			top: "hole",
		},
		width: 50,
	},
	sidePieceTop1: {
		height: 65,
		id: 45,
		path: "M 0 0 H 50 V 15 C 30 10 30 40 50 35 V 50 H 35 C 40 70 10 70 15 50 H 0 V 35 C 20 40 20 10 0 15 Z",
		sides: {
			bottom: "ear",
			left: "hole",
			right: "hole",
			top: "flat",
		},
		width: 50,
	},
	sidePieceTop2: {
		height: 65,
		id: 46,
		path: "M 15 0 H 65 V 15 C 45 10 45 40 65 35 V 50 H 50 C 55 70 25 70 30 50 H 15 V 35 C -5 40 -5 10 15 15 Z",
		sides: {
			bottom: "ear",
			left: "ear",
			right: "hole",
			top: "flat",
		},
		width: 65,
	},
	sidePieceTop3: {
		height: 65,
		id: 47,
		path: "M 15 0 H 65 V 15 C 85 10 85 40 65 35 V 50 H 50 C 55 70 25 70 30 50 H 15 V 35 C -5 40 -5 10 15 15 Z",
		sides: {
			bottom: "ear",
			left: "ear",
			right: "ear",
			top: "flat",
		},
		width: 80,
	},
	sidePieceTop4: {
		height: 50,
		id: 48,
		path: "M 15 0 H 65 V 15 C 85 10 85 40 65 35 V 50 H 50 C 55 30 25 30 30 50 H 15 V 35 C -5 40 -5 10 15 15 Z",
		sides: {
			bottom: "hole",
			left: "ear",
			right: "ear",
			top: "flat",
		},
		width: 80,
	},
	sidePieceTop5: {
		height: 50,
		id: 49,
		path: "M 0 0 H 50 V 15 C 30 10 30 40 50 35 V 50 H 35 C 40 30 10 30 15 50 H 0 V 35 C 20 40 20 10 0 15 Z",
		sides: {
			bottom: "hole",
			left: "hole",
			right: "hole",
			top: "flat",
		},
		width: 50,
	},
	sidePieceTop6: {
		height: 65,
		id: 50,
		path: "M 0 0 H 50 V 15 C 30 10 30 40 50 35 V 50 H 35 C 40 70 10 70 15 50 H 0 V 35 C 20 40 20 10 0 15 Z",
		sides: {
			bottom: "ear",
			left: "hole",
			right: "hole",
			top: "flat",
		},
		width: 50,
	},
} as const satisfies PiecesLookup;
