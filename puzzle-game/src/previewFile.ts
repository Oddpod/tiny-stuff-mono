import { fileUpload, previewImageElement } from "./main";

const imageFigureElement = document.getElementById("image-figure");
const DEFAULT_IMAGE_SRC = Object.freeze(
	"/zhenyu-luo-4-QpFNeLOpQ-unsplash(2).webp",
);
let caption: HTMLElement | null = null;
export function previewFile(
	onLoadedCallback = (_: string) => {},
	onDefaultImageLoaded = (_: string) => {},
) {
	const file = fileUpload.files?.[0];
	if (!file) {
		resetToDefaultImage();
		onDefaultImageLoaded(previewImageElement.src);
		return;
	}

	if (!file?.type.includes("image")) {
		return alert("Only images are allowed!");
	}
	const reader = new FileReader();

	reader.onloadend = () => {
		if (!reader.result) return;
		const loadedImage = reader.result as string;
		previewImageElement.src = loadedImage;
		if (caption) {
			imageFigureElement?.removeChild(caption);
		}
		onLoadedCallback?.(loadedImage);
	};

	reader.readAsDataURL(file);
}

export function resetToDefaultImage() {
	if (caption) {
		imageFigureElement?.removeChild(caption);
	}
	if (previewImageElement.src === DEFAULT_IMAGE_SRC) return;
	previewImageElement.src = DEFAULT_IMAGE_SRC;
	caption = document.createElement("figcaption");
	caption.innerHTML = `
		Photo by
		<a
		  href="https://unsplash.com/@mrnuclear?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"
		  >ZHENYU LUO</a
		>
		on
		<a
		  href="https://unsplash.com/photos/a-view-of-a-city-at-night-from-a-tall-building-4-QpFNeLOpQ?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"
		  >Unsplash</a
		>
		`;
	imageFigureElement!.appendChild(caption);
}
