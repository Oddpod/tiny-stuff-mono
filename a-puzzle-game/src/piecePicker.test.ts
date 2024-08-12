import { describe, expect, it } from "vitest";
import { type PieceDefinition, pieceDefinitions } from "./pieceDefinitions";
import { findFittingPiece } from "./piecePicker";

describe("piecePicker", () => {
	const allPieces = Object.entries(pieceDefinitions).map(([name, p]) => ({
		sides: p.sides,
		name,
	}));

	it.each(allPieces)("Test left piece %j", ({ sides }) => {
		const piece = findFittingPiece({ toTheLeft: sides.right });
		expect(piece).toBeTruthy();
	});
	it.each(allPieces)("Test top side %j", ({ sides }) => {
		const piece = findFittingPiece({ toTheTop: sides.bottom });
		expect(piece).toBeTruthy();
	});

	it.each(allPieces)("Test both sides %j", ({ sides }) => {
		const piece = findFittingPiece({
			toTheTop: sides.bottom,
			toTheLeft: sides.right,
		});
		expect(piece).toBeTruthy();
	});

	it("Left side should be flat if toTheLeft is undefined", () => {
		const piece = findFittingPiece();
		expect(piece.sides.left).toBe("flat");

		const piece2 = findFittingPiece({ toTheTop: "ear" });
		expect(piece2.sides.left).toBe("flat");

		const piece3 = findFittingPiece({ toTheTop: "hole" });
		expect(piece3.sides.left).toBe("flat");
	});

	type Side = PieceDefinition["sides"]["bottom"];
	const sides: {
		left: Side;
		top: Side;
	}[] = [
		{ left: "hole", top: "hole" },
		{ left: "ear", top: "ear" },
		{ left: "ear", top: "hole" },
		{ left: "hole", top: "ear" },
	] as const;
	it.each(sides)("Should respect top and left side", ({ left, top }) => {
		const piece = findFittingPiece({ toTheLeft: left, toTheTop: top });
		expect(piece.sides.left).toBe(left === "ear" ? "hole" : "ear");
		expect(piece.sides.top).toBe(top === "ear" ? "hole" : "ear");
	});
});
