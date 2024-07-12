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
	removeAnimationIfNthTime();
	toggleSettingsDrawer();
});
closeSettingsButton.addEventListener("click", () => {
	toggleSettingsDrawer();
});

function removeAnimationIfNthTime() {
	const hasOpenedSettingsBefore = localStorage.getItem("has-opened-settings")
	if (hasOpenedSettingsBefore) {
		settingsButton.classList.remove("animate-bounce")
		return
	}

	localStorage.setItem("has-opened-settings", "true")
}

removeAnimationIfNthTime()