import { PieceCutter } from "./pieceCutter";
import { makePieceDraggable } from "./makePieceDraggable";
import { PieceCreator, type PieceEntity } from "./pieceCreator";
import { shuffle } from "./shuffle";
import "./style.css";

const app = document.querySelector<HTMLDivElement>("#app")!;

let allPieces: PieceEntity[] = [];

const boardElement = document.getElementById("board") as HTMLDivElement;
const fileUpload = document.getElementById("file-upload") as HTMLInputElement;
const previewImageElement = (document.getElementById(
	"image",
) as HTMLImageElement)!;

if (!boardElement) {
	throw Error("No board div element");
}
// TODO: Use this to scale pieces in pieceCreator?
const PIECE_SIZE = Object.freeze(50 as const);
const PIECE_GAP = Object.freeze(0 as const);
let pieceCreator: PieceCreator | null = null;
function createPuzzle() {
	boardElement.innerHTML = "";

	pieceCreator = new PieceCreator({
		canvasHeight: boardElement.clientHeight,
		canvasWidth: boardElement.clientWidth,
		pieceSize: PIECE_SIZE,
		pieceGap: PIECE_GAP,
	});
	allPieces = pieceCreator.create();

	console.log({ allPieces });
	cutAndPlacePieces({
		pieces: allPieces,
		scaleFactorX: pieceCreator.widthDimensions.scaleToFitLengthFactor,
		scaleFactorY: pieceCreator.heightDimensions.scaleToFitLengthFactor,
		imageSrc: previewImageElement.src,
	});
}

let loadedImage = null;
interface CutAndPlacePiecesParams {
	pieces: PieceEntity[];
	scaleFactorX: number;
	scaleFactorY: number;
	imageSrc: string;
}

async function cutAndPlacePieces({
	scaleFactorY,
	scaleFactorX,
	pieces,
	imageSrc,
}: CutAndPlacePiecesParams) {
	const img1 = new Image();
	img1.src = imageSrc;
	img1.onload = async () => {
		const boardWidth = img1.width - (img1.width % PIECE_SIZE);
		const boardHeight = img1.height - (img1.height % PIECE_SIZE);
		document.documentElement.style.setProperty(
			"--board-width",
			`${boardWidth.toString()}px`,
		);
		document.documentElement.style.setProperty(
			"--board-height",
			`${boardHeight.toString()}px`,
		);

		shuffle(allPieces);

		const pieceCutter = new PieceCutter({
			imageElement: img1,
			pieceSize: PIECE_SIZE,
			scaleFactorX,
			scaleFactorY,
		});
		for (let i = 0; i < pieces.length; i++) {
			const piece = pieces[i];

			const newPiece = await pieceCutter.cutPieceFromImage(piece);
			makePieceDraggable(newPiece, () => saveBoardState());
			boardElement.appendChild(newPiece);
		}
	};
}

async function loadSavedState() {
	previewFile(async () => {
		const savedBoardStateMeta = localStorage.getItem("saved-board-state-meta");
		if (!savedBoardStateMeta) return;
		const { numPieces, scaleFactorX, scaleFactorY } =
			JSON.parse(savedBoardStateMeta);
		const pieces = [];
		for (let i = 0; i < numPieces; i++) {
			pieces.push(
				JSON.parse(localStorage.getItem(`saved-board-state-piece-${i}`)!),
			);
		}
		await cutAndPlacePieces({
			pieces,
			scaleFactorX,
			scaleFactorY,
			imageSrc: previewImageElement.src,
		});
	});
}

function saveBoardState() {
	localStorage.setItem('saved-image', previewImageElement.src)
	localStorage.setItem(
		"saved-board-state-meta",
		JSON.stringify({
			numPieces: allPieces.length,
			scaleFactorX: pieceCreator?.widthDimensions.scaleToFitLengthFactor,
			scaleFactorY: pieceCreator?.heightDimensions.scaleToFitLengthFactor,
		}),
	);
	allPieces.forEach((piece, index) => {
		localStorage.setItem(
			`saved-board-state-piece-${index}`,
			JSON.stringify(piece),
		);
	});
}

function previewFile(onLoadedCallback = (_: string) => {}) {
	const file = fileUpload.files?.[0];
	if (!file) {
		previewImageElement.src = "";
		return;
	}

	if (!file?.type.includes("image")) {
		return alert("Only images are allowed!");
	}
	const reader = new FileReader();

	reader.onloadend = () => {
		if (!reader.result) return;
		loadedImage = reader.result as string;
		previewImageElement.src = loadedImage;
		onLoadedCallback?.(loadedImage);
	};

	reader.readAsDataURL(file);
}
fileUpload?.addEventListener("change", () => previewFile());

const loadButton = document.getElementById("load-button");
loadButton?.addEventListener("click", () => createPuzzle());
loadSavedState();
