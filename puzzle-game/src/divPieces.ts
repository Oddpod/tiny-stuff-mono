export const PIECE_EAR_SIZE = Object.freeze(15);
export const PIECE_DIMENSIONS = Object.freeze(50);

type Side = "ear" | "hole" | "flat";
interface Piece {
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
		path: "M 15 0 H 30 C 25 20 55 20 50 0 H 65 V 15 C 85 10 85 40 65 35 V 50 H 50 C 55 70 25 70 30 50 H 15 V 35 C -5 40 -5 10 15 15 Z",
		sides: {
			bottom: "ear",
			left: "ear",
			right: "ear",
			top: "hole",
		},
		width: 80,
	},
	cornerPieceRightBottom1: {
		height: 65,
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
		path: "M 50 0 V 50 H 0 V 35 C 20 40 20 10 0 15 V 0 H 15 C 10 20 40 20 35 0 Z",
		sides: {
			bottom: "flat",
			left: "hole",
			right: "flat",
			top: "hole",
		},
		width: 50,
	},
	cornerPieceLeftBottom1: {
		height: 65,
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
		path: "M 50 65 H 0 V 15 H 15 C 10 35 40 35 35 15 H 50 V 30 C 30 25 30 55 50 50 Z",
		sides: {
			bottom: "flat",
			left: "flat",
			right: "hole",
			top: "hole",
		},
		width: 50,
	},
	cornerPieceLeftTop2: {
		height: 50,
		width: 50,
		sides: {
			top: "flat",
			left: "flat",
			right: "hole",
			bottom: "hole",
		},
		path: "M 0 0 H 50 V 15 C 30 10 30 40 50 35 V 50 H 35 C 40 30 10 30 15 50 H 0 Z",
	},
	cornerPieceLeftTop3: {
		width: 65,
		height: 50,
		path: "M 0 0 H 50 V 15 C 70 10 70 40 50 35 V 50 H 35 C 40 30 10 30 15 50 H 0 Z",
		sides: {
			top: "flat",
			right: "ear",
			bottom: "hole",
			left: "flat",
		},
	},
	cornerPieceLeftTop4: {
		width: 65,
		height: 65,
		path: "M 0 0 H 50 V 15 C 70 10 70 40 50 35 V 50 H 35 C 40 70 10 70 15 50 H 0 Z",
		sides: {
			top: "flat",
			right: "ear",
			bottom: "ear",
			left: "flat",
		},
	},
	cornerPieceLeftTop1: {
		height: 65,
		path: "M 0 0 H 50 V 15 C 30 10 30 40 50 35 V 50 H 35 C 40 70 10 70 15 50 H 0 Z",
		sides: {
			bottom: "ear",
			left: "flat",
			right: "hole",
			top: "flat",
		},
		width: 50,
	},
	cornerPieceTopRight1: {
		height: 50,
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
		height: 80,
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
		height: 65,
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
		width: 50,
		path: "M 50 65 H 0 V 50 C 20 55 20 25 0 30 V 15 H 15 C 10 -5 40 -5 35 15 H 50 V 30 C 30 25 30 55 50 50 Z",
		sides: {
			top: "ear",
			right: "hole",
			bottom: "flat",
			left: "hole",
		},
	},
	sidePieceLeft1: {
		height: 50,
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
		width: 65,
		sides: {
			top: "ear",
			right: "ear",
			bottom: "hole",
			left: "flat",
		},
		path: "M 0 15 H 15 C 10 -5 40 -5 35 15 H 50 V 30 C 70 25 70 55 50 50 V 65 H 35 C 40 45 10 45 15 65 H 0 V 50 V 15 Z",
	},
	sidePieceLeft5: {
		height: 80,
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
		width: 65,
		height: 50,
		path: "M 65 0 V 50 H 50 C 55 30 25 30 30 50 H 15 V 35 C -5 40 -5 10 15 15 V 0 H 30 C 25 20 55 20 50 0 Z",
		sides: {
			bottom: "hole",
			left: "ear",
			right: "flat",
			top: "hole",
		},
	},
	sidePieceRight2: {
		height: 65,
		path: "M 65 15 V 65 H 50 C 55 45 25 45 30 65 H 15 V 50 C -5 55 -5 25 15 30 V 15 H 30 C 25 -5 55 -5 50 15 Z",
		sides: {
			bottom: "hole",
			left: "ear",
			right: "flat",
			top: "ear",
		},
		width: 65,
	},
	sidePieceRight4: {
		height: 65,
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
		path: "M 50 15 V 65 H 35 C 40 45 10 45 15 65 H 0 V 50 C 20 55 20 25 0 30 V 15 H 15 C 10 -5 40 -5 35 15 Z",
		width: 50,
		height: 65,
		sides: {
			top: "ear",
			right: "flat",
			bottom: "hole",
			left: "hole",
		},
	},
	sidePieceRight6: {
		width: 50,
		height: 65,
		sides: {
			top: "hole",
			right: "flat",
			bottom: "hole",
			left: "hole",
		},
		path: "M 50 0 V 50 H 35 C 40 30 10 30 15 50 H 0 V 35 C 20 40 20 10 0 15 V 0 H 15 C 10 20 40 20 35 0 Z",
	},

	sidePieceTop1: {
		height: 65,
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
		width: 80,
		height: 65,
		path: "M 15 0 H 65 V 15 C 85 10 85 40 65 35 V 50 H 50 C 55 70 25 70 30 50 H 15 V 35 C -5 40 -5 10 15 15 Z",
		sides: {
			bottom: "ear",
			left: "ear",
			right: "ear",
			top: "flat",
		},
	},
	sidePieceTop4: {
		height: 50,
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
		path: "M 0 0 H 50 V 15 C 30 10 30 40 50 35 V 50 H 35 C 40 30 10 30 15 50 H 0 V 35 C 20 40 20 10 0 15 Z",
		sides: {
			top: "flat",
			right: "hole",
			bottom: "hole",
			left: "hole",
		},
		height: 50,
		width: 50,
	},
	sidePieceTop6: {
		path: "M 0 0 H 50 V 15 C 30 10 30 40 50 35 V 50 H 35 C 40 70 10 70 15 50 H 0 V 35 C 20 40 20 10 0 15 Z",
		sides: {
			top: "flat",
			right: "hole",
			bottom: "ear",
			left: "hole",
		},
		width: 50,
		height: 65,
	},
} as const satisfies PiecesLookup;
