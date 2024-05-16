import type {
	Account,
	ChampionMasteryInternal,
} from "../functions/getChampMastery";

export interface ChampionMastery
	extends Pick<
		ChampionMasteryInternal,
		"chestGranted" | "championId" | "championLevel" | "championPoints"
	> {}

export interface SummonerResponse
	extends Pick<Account, "gameName" | "tagLine"> {
	profileIconId: number;
}
