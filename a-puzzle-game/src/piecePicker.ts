import { pieceDefinitions, type PieceDefinition } from "./pieceDefinitions";
import { getRandom } from "./utils";

interface FindFittingPieceParams {
	toTheLeft?: PieceDefinition["sides"]["right"];
	toTheTop?: PieceDefinition["sides"]["right"];
	lastInRow?: boolean;
	isLastRow?: boolean;
}

const topLeftPieces = [
	pieceDefinitions.cornerPieceLeftTop1,
	pieceDefinitions.cornerPieceLeftTop2,
	pieceDefinitions.cornerPieceLeftTop3,
	pieceDefinitions.cornerPieceLeftTop4,
];

const topSidePieces = [
	pieceDefinitions.sidePieceTop1,
	pieceDefinitions.sidePieceTop2,
	pieceDefinitions.sidePieceTop3,
	pieceDefinitions.sidePieceTop4,
	pieceDefinitions.sidePieceTop5,
	pieceDefinitions.sidePieceTop6,
];

const topRightPieces = [
	pieceDefinitions.cornerPieceTopRight1,
	pieceDefinitions.cornerPieceTopRight2,
	pieceDefinitions.cornerPieceTopRight3,
	pieceDefinitions.cornerPieceTopRight4,
];

const sidePiecesLeft = [
	pieceDefinitions.sidePieceLeft1,
	pieceDefinitions.sidePieceLeft2,
	pieceDefinitions.sidePieceLeft3,
	pieceDefinitions.sidePieceLeft4,
	pieceDefinitions.sidePieceLeft5,
	pieceDefinitions.sidePieceLeft6,
];

const centerPieces = [
	pieceDefinitions.centerPiece1,
	pieceDefinitions.centerPiece2,
	pieceDefinitions.centerPiece3,
	pieceDefinitions.centerPiece4,
	pieceDefinitions.centerPiece5,
	pieceDefinitions.centerPiece6,
	pieceDefinitions.centerPiece7,
	pieceDefinitions.centerPiece8,
	pieceDefinitions.centerPiece9,
	pieceDefinitions.centerPiece10,
	pieceDefinitions.centerPiece11,
	pieceDefinitions.centerPiece12,
];

const rightSidePieces = [
	pieceDefinitions.sidePieceRight1,
	pieceDefinitions.sidePieceRight2,
	pieceDefinitions.sidePieceRight3,
	pieceDefinitions.sidePieceRight4,
	pieceDefinitions.sidePieceRight5,
	pieceDefinitions.sidePieceRight6,
];

const bottomLeftPieces = [
	pieceDefinitions.cornerPieceLeftBottom1,
	pieceDefinitions.cornerPieceLeftBottom2,
	pieceDefinitions.cornerPieceLeftBottom3,
	pieceDefinitions.cornerPieceLeftBottom4,
];

const bottomSidePieces = [
	pieceDefinitions.sidePieceBottom1,
	pieceDefinitions.sidePieceBottom2,
	pieceDefinitions.sidePieceBottom3,
	pieceDefinitions.sidePieceBottom4,
	pieceDefinitions.sidePieceBottom5,
	pieceDefinitions.sidePieceBottom6,
];

const bottomRightPieces = [
	pieceDefinitions.cornerPieceRightBottom1,
	pieceDefinitions.cornerPieceRightBottom2,
	pieceDefinitions.cornerPieceRightBottom3,
	pieceDefinitions.cornerPieceRightBottom4,
];

export function findFittingPiece({
	toTheLeft,
	toTheTop,
	lastInRow,
	isLastRow,
}: FindFittingPieceParams = {}): PieceDefinition {
	if (!toTheLeft) {
		if (!toTheTop) {
			return getRandom(topLeftPieces);
		}
		const requiredTopSide = toTheTop === "ear" ? "hole" : "ear";

		if (isLastRow) {
			return getRandom(
				bottomLeftPieces.filter((piece) => piece.sides.top === requiredTopSide),
			);
		}
		return getRandom(
			sidePiecesLeft.filter((piece) => piece.sides.top === requiredTopSide),
		);
	}

	const requiredLeftSide = toTheLeft === "ear" ? "hole" : "ear";

	if (lastInRow) {
		if (!toTheTop) {
			return getRandom(
				topRightPieces.filter((piece) => piece.sides.left === requiredLeftSide),
			);
		}
		const requiredTopSide = toTheTop === "ear" ? "hole" : "ear";
		if (isLastRow) {
			return getRandom(
				bottomRightPieces.filter(
					(piece) =>
						piece.sides.left === requiredLeftSide &&
						piece.sides.top === requiredTopSide,
				),
			);
		}
		return getRandom(
			rightSidePieces.filter(
				(piece) =>
					piece.sides.left === requiredLeftSide &&
					piece.sides.right === "flat" &&
					piece.sides.top === requiredTopSide,
			),
		);
	}

	if (!toTheTop) {
		return getRandom(
			topSidePieces.filter((piece) => piece.sides.left === requiredLeftSide),
		);
	}
	const requiredTopSide = toTheTop === "ear" ? "hole" : "ear";

	if (isLastRow) {
		const candidatePieces = bottomSidePieces.filter(
			(piece) =>
				piece.sides.left === requiredLeftSide &&
				piece.sides.top === requiredTopSide,
		);
		return getRandom(candidatePieces);
	}
	
	return getRandom(
		centerPieces.filter(
			(piece) =>
				piece.sides.top === requiredTopSide &&
				piece.sides.left === requiredLeftSide,
		),
	);
}
