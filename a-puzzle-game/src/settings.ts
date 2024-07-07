const settingsButton = document.getElementById("settings-button") as HTMLButtonElement;
const settingsDrawer = document.getElementById("settings-drawer") as HTMLDivElement;
const closeSettingsButton = document.getElementById("settings-close-button") as HTMLButtonElement;
let settingsDrawerOpen = false;
function toggleSettingsDrawer() {
	settingsDrawerOpen = !settingsDrawerOpen;
	if (settingsDrawerOpen) {
		settingsDrawer.classList.remove("hidden");
	} else {
		settingsDrawer.classList.add("hidden");
	}
}
settingsButton.addEventListener("click", () => {
	toggleSettingsDrawer();
});
closeSettingsButton.addEventListener("click", () => {
	toggleSettingsDrawer();
});


// TODO: Show settings pane the first time a user enters