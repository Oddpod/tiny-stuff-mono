import { type Component, createMemo } from "solid-js";
import { createSignal } from "solid-js";
import styles from "./App.module.css";
import ChampMasteries from "./components/ChampionMasteries";
import type { SummonerResponse } from "./types";
import Summoner from "./components/Summoner";
import SummonerSearch, {
	type SearchResponse,
} from "./components/SummonerSearch";
import { includeChampNames } from "./util/champ";
import type { ChampionMasteryWithName } from "./components/ChampMastery";
import yasuoMaster from "./yasuoMaster";
import Loader from "./components/Loader";
import projectPackage from "../package.json";

enum FILTER_TYPE {
	NONE = "NONE",
	CHEST_AVAILABLE = "CHEST_AVAILABLE",
}

export interface ProfileData {
	summoner: SummonerResponse;
	champMasteries: ChampionMasteryWithName[];
}

function loadInitData(): ProfileData {
	const saved = localStorage.getItem("lastProfileData");
	try {
		if (saved) {
			return JSON.parse(saved) as ProfileData;
		}
	} catch {
		return yasuoMaster;
	}
	return yasuoMaster;
}

function saveProfileData(profile: ProfileData) {
	localStorage.setItem("lastProfileData", JSON.stringify(profile));
}

const App: Component = () => {
	const [profile, setProfile] = createSignal(loadInitData());

	const [champFilter, setChampFilter] = createSignal<FILTER_TYPE>(
		FILTER_TYPE.CHEST_AVAILABLE,
	);
	const [loading, setLoading] = createSignal<boolean>(false);
	const toggleFilter = () => {
		setChampFilter(
			champFilter() === FILTER_TYPE.CHEST_AVAILABLE
				? FILTER_TYPE.NONE
				: FILTER_TYPE.CHEST_AVAILABLE,
		);
	};
	const [nameFilter, setNameFilter] = createSignal<string>("");

	const fetchChampMasteries = async (summonerName: string) => {
		setLoading(true);
		const params = new URLSearchParams({
			name: summonerName,
		});
		try {
			const response = await fetch(
				`/.netlify/functions/getChampMastery?${params}`,
			);
			if (response.ok) {
				const body = await response.json();
				onSearchResponse(body);
			}
		} finally {
			setLoading(false);
		}
	};

	const onSearchResponse = (response: SearchResponse) => {
		setProfile((p) => ({
			...p,
			summoner: response.summoner,
			champMasteries: response.championMastery.map(includeChampNames),
		}));
		saveProfileData({
			summoner: response.summoner,
			champMasteries: response.championMastery.map(includeChampNames),
		});
	};

	const filteredMasteries = createMemo(() => {
		const masteries = profile().champMasteries;
		if (masteries === null) {
			return [];
		}
		return masteries
			.filter(
				(mastery) =>
					champFilter() !== FILTER_TYPE.CHEST_AVAILABLE ||
					!mastery.chestGranted,
			)
			.filter(
				(mastery) =>
					!nameFilter() ||
					(mastery.championName ?? "")
						.toLowerCase()
						.includes(nameFilter().toLowerCase()),
			);
	});

	const params = new URLSearchParams(window.location.search);
	const name = params.get("summoner");
	if (name) {
		fetchChampMasteries(name);
	}

	return (
		<div class={styles.App}>
			<header>
				<h1>League Chest Hunter</h1>
			</header>
			<SummonerSearch onSearch={fetchChampMasteries} />
			<article>
				<section class={styles.SummonerInfo}>
					{!!profile() && <Summoner profile={profile().summoner} />}
					<input
						type="text"
						class={styles.filterChamps}
						placeholder="Filter by champ name"
						value={nameFilter()}
						name="filterChamps"
						id="filterChamps"
						onInput={(event) => setNameFilter(event.target.value)}
					/>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class={styles.ChestIcon}
						color={
							champFilter() === FILTER_TYPE.CHEST_AVAILABLE
								? "goldenrod"
								: "grey"
						}
						aria-hidden="true"
						width="100%"
						onClick={() => toggleFilter()}
						onKeyUp={() => toggleFilter()}
						height="100%"
						preserveAspectRatio="xMidYMid meet"
						viewBox="0 0 24 24"
					>
						<path
							d="M5 4h14a3 3 0 0 1 3 3v4h-7v-1H9v1H2V7a3 3 0 0 1 3-3m6 7h2v2h-2v-2m-9 1h7v1l2 2h2l2-2v-1h7v8H2v-8z"
							fill="currentColor"
						/>
					</svg>
					<input
						type="checkbox"
						value={champFilter() === FILTER_TYPE.CHEST_AVAILABLE ? 1 : 0}
						id="filterChests"
						name="filterChests"
						checked
						onClick={() => toggleFilter()}
					/>
					<label for="filterChests">Filter out chest granted</label>
				</section>
				{loading() ? (
					<Loader />
				) : (
					profile().champMasteries !== null && (
						<ChampMasteries
							masteries={filteredMasteries()}
							isFiltering={!!nameFilter()}
						/>
					)
				)}
			</article>
			<footer>
				<p>
					Assets provided by{" "}
					<a href="https://www.communitydragon.org/">CommunityDragon</a>
				</p>
				<p>
					League Chest Hunter was created under Riot Games'{" "}
					<a href="https://www.riotgames.com/en/legal">"Legal Jibber Jabber"</a>{" "}
					policy using assets owned by Riot Games. Riot Games does not endorse
					or sponsor this project.
				</p>
				<p>
					League Chest Hunter v{projectPackage.version}
					<br />
					Built by{" "}
					<a href="https://github.com/Oddpod" target="_blank" rel="noreferrer">
						@Oddpod
					</a>
					.{" "}
					<a href="https://github.com/Oddpod/tiny-stuff-mono/tree/main/league-chest-hunter">
						View source on Github
					</a>
				</p>
			</footer>
		</div>
	);
};

export default App;
