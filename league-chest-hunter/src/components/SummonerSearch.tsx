import { createSignal } from "solid-js";
import type { Component } from "solid-js";
import type { ChampionMastery, SummonerResponse } from "../types";
import styles from "./SummonerSearch.module.css";

const urlParams = new URLSearchParams(window.location.search);

export type SearchResponse = {
	summoner: SummonerResponse;
	championMastery: ChampionMastery[];
};
const SummonerSearch: Component<{
	onSearch: (summonerName: string) => void;
}> = (props) => {
	const [summonerName, setSummonerName] = createSignal(
		decodeURIComponent(urlParams.get("summoner") ?? ""),
	);

	const onKeyDown = (event: KeyboardEvent) => {
		event.preventDefault();
		if (event.key !== "Enter") return;
		if (!summonerName().includes("#")) return;

		const url = new URL(window.location.href);
		url.searchParams.set("summoner", encodeURIComponent(summonerName()));
		window.history.pushState(null, "", url.toString());
		props.onSearch(summonerName());
	};

	return (
		<div class={styles.SummonerSearch}>
			<input
				placeholder="gameName#tagLine"
				value={summonerName()}
				onKeyUp={(event) => onKeyDown(event)}
				onChange={(event) => setSummonerName(event.currentTarget.value)}
			/>
			<button type="button" onClick={() => props.onSearch(summonerName())}>
				Fetch
			</button>
		</div>
	);
};

export default SummonerSearch;
