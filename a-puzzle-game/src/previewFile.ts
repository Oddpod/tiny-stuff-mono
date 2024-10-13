import { fileInput } from "./input";

const imageFigureElement = document.getElementById("image-figure");
const DEFAULT_IMAGE_SRC = Object.freeze(
	"/zhenyu-luo-4-QpFNeLOpQ-unsplash.webp",
);

const previewImageElement = (document.getElementById(
	"image",
) as HTMLImageElement)!;

export function previewFile(): Promise<string> {
	const file = fileInput.files?.[0];
	return new Promise((res, _) => {
		if (!file) {
			const imageSrc = resetToDefaultImage();
			previewImageElement.src = imageSrc
			return res(imageSrc);
		}

		if (!file?.type.includes("image")) {
			return alert("Only images are allowed!");
		}
		const reader = new FileReader();

		reader.onloadend = () => {
			if (!reader.result) return;
			const loadedImage = reader.result as string;
			previewImageElement.src = loadedImage;
			const caption = imageFigureElement?.querySelector("figcaption")
			if (caption) {
				imageFigureElement?.removeChild(caption);
			}
			return res(loadedImage)
		};

		reader.readAsDataURL(file);
	})
}

export function resetToDefaultImage() {
	const caption = imageFigureElement?.querySelector("figcaption")
	if (caption) {
		imageFigureElement?.removeChild(caption);
	}
	if (previewImageElement.src === DEFAULT_IMAGE_SRC) return DEFAULT_IMAGE_SRC;
	previewImageElement.src = DEFAULT_IMAGE_SRC;
	const newCaption = document.createElement("figcaption");
	newCaption.innerHTML = `
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
	imageFigureElement!.appendChild(newCaption);
	return DEFAULT_IMAGE_SRC
}
