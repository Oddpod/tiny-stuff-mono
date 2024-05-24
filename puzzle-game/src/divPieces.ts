export const PIECE_EAR_SIZE = Object.freeze(15);

export const pieceDefinitions = {
	cornerPiece: {
		width: 50,
		height: 65,
		sidesWithEars: ["bottom"],
		path: "M 0 0 H 50 V 15 C 30 10 30 40 50 35 V 50 H 35 C 40 70 10 70 15 50 H 0 Z",
	},

	cornerPiece_90deg: {
		width: 65,
		height: 50,
		sidesWithEars: ["left"],
		path: "M 15 0 H 65 V 50 H 50 C 55 30 25 30 30 50 H 15 V 35 C -5 40 -5 10 15 15 V 0 Z",
	},
	cornerPiece_270deg: {
		width: 65,
		height: 65,
		sidesWithEars: ["right"],
		path: "M 0 50 V 0 H 15 C 10 20 40 20 35 0 H 50 V 15 C 70 10 70 40 50 35 V 50 Z",
	},

	cornerPiece2Eared: {
		width: 65,
		height: 65,
		sidesWithEars: ["top", "right"],
		path: "M 50 65 H 0 V 15 H 15 C 10 -5 40 -5 35 15 H 50 V 30 C 70 25 70 55 50 50 Z",
	},

	sidePiece1: {
		width: 50,
		height: 65,
		sidesWithEars: ["bottom"],
		path: "M 0 0 H 50 V 15 C 30 10 30 40 50 35 V 50 H 35 C 40 70 10 70 15 50 H 0 V 35 C 20 40 20 10 0 15 Z",
	},

	sidePiece2: {
		width: 65,
		height: 65,
		sidesWithEars: ["right", "bottom"],
		path: "M 0 50 V 0 H 15 C 10 20 40 20 35 0 H 50 V 15 C 70 10 70 40 50 35 V 50 H 35 C 40 70 10 70 15 50 Z",
	},

	sidePiece2_90deg: {
		width: 65,
		height: 65,
		sidesWithEars: ["bottom", "left"],
		path: "M 15 0 H 65 V 15 C 45 10 45 40 65 35 V 50 H 50 C 55 70 25 70 30 50 H 15 V 35 C -5 40 -5 10 15 15 Z",
	},

	sidePiece2_180deg: {
		width: 65,
		height: 65,
		sidesWithEars: ["top", "left"],
		path: "M 65 15 V 65 H 50 C 55 45 25 45 30 65 H 15 V 50 C -5 55 -5 25 15 30 V 15 H 30 C 25 -5 55 -5 50 15 Z",
	},

	sidePiece3: {
		width: 50,
		height: 65,
		sidesWithEars: ["top"],
		path: "M 50 15 V 65 H 35 C 40 45 10 45 15 65 H 0 V 50 C 20 55 20 25 0 30 V 15 H 15 C 10 -5 40 -5 35 15 Z",
	},

	sidePiece3Right: {
		width: 50,
		height: 65,
		sidesWithEars: ["top"],
		path: "M 50 15 V 65 H 0 V 50 C 20 55 20 25 0 30 V 15 H 15 C 10 -5 40 -5 35 15 Z",
	},

	sidePiece4: {
		width: 80,
		height: 50,
		sidesWithEars: ["right", "left"],
		path: "M 15 0 H 65 V 15 C 85 10 85 40 65 35 V 50 H 50 C 55 30 25 30 30 50 H 15 V 35 C -5 40 -5 10 15 15 Z",
	},

	sidePiece4_180deg: {
		width: 65,
		height: 65,
		sidesWithEars: ["right", "left"],
		path: "M 65 50 H 15 V 35 C -5 40 -5 10 15 15 V 0 H 30 C 25 20 55 20 50 0 H 65 V 15 C 85 10 85 40 65 35 Z",
	},

	sidePiece1Eared: {
		width: 65,
		height: 50,
		sidesWithEars: ["right"],
		path: "M 0 0 H 15 C 10 20 40 20 35 0 H 50 V 15 C 70 10 70 40 50 35 V 50 H 35 C 40 30 10 30 15 50 H 0 V 35 V 0 Z",
	},

	sidePiece2Eared: {
		width: 65,
		height: 65,
		sidesWithEars: ["top", "bottom"],
		path: "M 0 65 V 15 H 15 C 10 -5 40 -5 35 15 H 50 V 30 C 30 25 30 55 50 50 V 65 H 35 C 40 85 10 85 15 65 Z",
	},

	sidePiece2Holed: {
		width: 65,
		height: 50,
		sidesWithEars: ["right"],
		path: "M 50 50 H 0 V 35 C 20 40 20 10 0 15 V 0 H 15 C 10 20 40 20 35 0 H 50 V 15 C 70 10 70 40 50 35 Z",
	},

	sidePiece2Eared_180deg: {
		width: 65,
		height: 65,
		sidesWithEars: ["top", "left"],
		path: "M 65 15 V 65 H 50 C 55 45 25 45 30 65 H 15 V 50 C -5 55 -5 25 15 30 V 15 H 30 C 25 -5 55 -5 50 15 Z",
	},
	sidePiece2Eared_270deg: {
		width: 65,
		height: 65,
		sidesWithEars: ["top", "right"],
		path: "M 50 65 H 0 V 50 C 20 55 20 25 0 30 V 15 H 15 C 10 -5 40 -5 35 15 H 50 V 30 C 70 25 70 55 50 50 Z",
	},

	sidePiece3Eared: {
		width: 80,
		height: 80,
		sidesWithEars: ["top", "right", "left"],
		path: "M 65 65 H 15 V 50 C -5 55 -5 25 15 30 V 15 H 30 C 25 -5 55 -5 50 15 H 65 V 30 C 85 25 85 55 65 50 Z",
	},

	sidePiece3EaredLeft: {
		width: 65,
		height: 80,
		sidesWithEars: ["top", "right", "bottom"],
		path: "M 0 65 V 15 H 15 C 10 -5 40 -5 35 15 H 50 V 30 C 70 25 70 55 50 50 V 65 H 35 C 40 85 10 85 15 65 Z",
	},

	sidePiece2EaredLeft: {
		width: 50,
		height: 80,
		sidesWithEars: ["top", "bottom"],
		path: "M 0 65 V 15 H 15 C 10 -5 40 -5 35 15 H 50 V 30 C 30 25 30 55 50 50 V 65 H 35 C 40 85 10 85 15 65 Z",
	},

	sidePiece3Holed: {
		width: 65,
		height: 65,
		sidesWithEars: [],
		path: "M 50 50 H 0 V 35 C 20 40 20 10 0 15 V 0 H 15 C 10 20 40 20 35 0 H 50 V 15 C 30 10 30 40 50 35 Z",
	},

	centerPiece5: {
		width: 50,
		height: 65,
		sidesWithEars: ["bottom"],
		path: "M 0 0 H 15 C 10 20 40 20 35 0 H 50 V 15 C 30 10 30 40 50 35 V 50 H 35 C 40 70 10 70 15 50 H 0 V 35 C 20 40 20 10 0 15 Z",
	},

	centerPiece6: {
		width: 65,
		height: 65,
		sidesWithEars: [],
		path: "M 50 50 H 35 C 40 30 10 30 15 50 H 0 V 35 C 20 40 20 10 0 15 V 0 H 15 C 10 20 40 20 35 0 H 50 V 15 C 30 10 30 40 50 35 Z",
	},

	centerPiece1Eared: {
		width: 65,
		height: 65,
		sidesWithEars: ["top"],
		path: "M 50 65 H 35 C 40 45 10 45 15 65 H 0 V 50 C 20 55 20 25 0 30 V 15 H 15 C 10 -5 40 -5 35 15 H 50 V 30 C 30 25 30 55 50 50 Z",
	},

	centerPiece1Eared_180deg: {
		width: 50,
		height: 65,
		sidesWithEars: ["bottom"],
		path: "M 0 0 H 15 C 10 20 40 20 35 0 H 50 V 15 C 30 10 30 40 50 35 V 50 H 35 C 40 70 10 70 15 50 H 0 V 35 C 20 40 20 10 0 15 Z",
	},

	centerPiece3Eared: {
		width: 80,
		height: 65,
		sidesWithEars: ["top", "right", "left"],
		path: "M 65 65 H 50 C 55 45 25 45 30 65 H 15 V 50 C -5 55 -5 25 15 30 V 15 H 30 C 25 -5 55 -5 50 15 H 65 V 30 C 85 25 85 55 65 50 Z",
	},

	centerPiece3Eared_90deg: {
		width: 65,
		height: 65,
		sidesWithEars: ["top", "bottom", "left"],
		path: "M 65 15 V 30 C 45 25 45 55 65 50 V 65 H 50 C 55 85 25 85 30 65 H 15 V 50 C -5 55 -5 25 15 30 V 15 H 30 C 25 -5 55 -5 50 15 Z",
	},
	centerPiece3Eared_180deg: {
		width: 65,
		height: 65,
		sidesWithEars: ["right", "bottom", "left"],
		path: "M 15 0 H 30 C 25 20 55 20 50 0 H 65 V 15 C 85 10 85 40 65 35 V 50 H 50 C 55 70 25 70 30 50 H 15 V 35 C -5 40 -5 10 15 15 Z",
	},

	centerPiece1: {
		width: 50,
		height: 80,
		sidesWithEars: ["top", "bottom"],
		path: "M 0 15 H 15 C 10 -5 40 -5 35 15 H 50 V 30 C 30 25 30 55 50 50 V 65 H 35 C 40 85 10 85 15 65 H 0 V 50 C 19 55 20 25 0 30 Z",
	},

	centerPiece1_90deg: {
		width: 80,
		height: 50,
		sidesWithEars: ["right", "left"],
		path: "M 65 0 V 15 C 85 10 85 40 65 35 V 50 H 50 C 55 30 25 30 30 50 H 15 V 35 C -5 40 -5 10 15 15 V 0 H 30 C 25 19 55 20 50 0 Z",
	},

	centerPiece2: {
		width: 65,
		height: 65,
		sidesWithEars: ["top", "bottom", "left"],
		path: "M 15 15 H 30 C 25 -5 55 -5 50 15 H 65 V 30 C 45 25 45 55 65 50 V 65 H 50 C 55 85 25 85 30 65 H 15 V 50 C -5 55 -5 25 15 30 Z",
	},

	centerPiece3: {
		width: 65,
		height: 65,
		sidesWithEars: [],
		path: "M 0 0 H 15 C 10 20 40 20 35 0 H 50 V 15 C 30 10 30 40 50 35 V 50 H 35 C 40 30 10 30 15 50 H 0 V 35 C 20 40 20 10 0 15 Z",
	},

	centerPiece4: {
		width: 65,
		height: 65,
		sidesWithEars: ["top"],
		path: "M 0 15 H 15 C 10 -5 40 -5 35 15 H 50 V 30 C 30 25 30 55 50 50 V 65 H 35 C 40 45 10 45 15 65 H 0 V 50 C 20 55 20 25 0 30 Z",
	},
} as const;
