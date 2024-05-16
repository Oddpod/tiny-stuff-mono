import type { Handler } from "@netlify/functions";
import fetch from "node-fetch";
import type { SummonerResponse, ChampionMastery } from "../src/types";

const { RIOT_API_ROOT, API_KEY_TOKEN, RIOT_API_ROOT_LOL } = process.env;

if (!RIOT_API_ROOT) {
	console.error(
		`Missing environment variable: ${
			Object.keys({ RIOT_API_ROOT })[0]
		} is not defined`,
	);
}
if (!RIOT_API_ROOT_LOL) {
	console.error(
		`Missing environment variable: ${
			Object.keys({ RIOT_API_ROOT_LOL })[0]
		} is not defined`,
	);
}

if (!API_KEY_TOKEN) {
	console.error(
		`Missing environment variable: ${
			Object.keys({ API_KEY_TOKEN })[0]
		} is not defined`,
	);
}

type FetchChampionMasteryQuery = {
	name: string | undefined;
	id: string | undefined;
};

export interface ChampionMasteryInternal {
	puuid: string;
	championId: number;
	championLevel: number;
	championPoints: number;
	lastPlayTime: number;
	championPointsSinceLastLevel: number;
	championPointsUntilNextLevel: number;
	chestGranted: boolean;
	tokensEarned: number;
	summonerId: string;
}

export interface Account {
	puuid: string;
	gameName: string;
	tagLine: string;
}

//#region helper functions
function fetchData<T>(url: string) {
	return fetch(url, {
		method: "get",
		headers: {
			"Content-Type": "application/json",
			// biome-ignore lint/style/noNonNullAssertion: <explanation>
			"X-Riot-Token": API_KEY_TOKEN!,
		},
	}).then((res) => res.json() as Promise<T>);
}
async function fetchAccount(gameNameAndTagLine: string) {
	const [gameName, tagLine] = gameNameAndTagLine.split("#");
	const res = (await fetchData(
		`${RIOT_API_ROOT}riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}`,
	)) as Account;
	return res;
}

function fetchChampionMastery(puuid: string) {
	return fetchData<ChampionMasteryInternal[]>(
		`${RIOT_API_ROOT_LOL}lol/champion-mastery/v4/champion-masteries/by-puuid/${puuid}`,
	);
}

interface SummonerInternal {
	id: string;
	accountId: string;
	profileIconId: number;
	revisionDate: number;
	summonerLevel: number;
	puuid: string;
}

function fetchSummoner(puuid: string) {
	return fetchData<SummonerInternal>(
		`${RIOT_API_ROOT_LOL}lol/summoner/v4/summoners/by-puuid/${puuid}`,
	);
}
//#endregion

const handler: Handler = async (event, context) => {
	const { name: summonerName = undefined } =
		event.queryStringParameters as FetchChampionMasteryQuery;
	if (summonerName) {
		const { puuid, gameName, tagLine } = await fetchAccount(summonerName);

		const { profileIconId } = await fetchSummoner(puuid);
		const response = await fetchChampionMastery(puuid);
		const body = {
			championMastery: response.map(
				({ chestGranted, championId }) =>
					({
						championId,
						chestGranted,
					}) satisfies ChampionMastery,
			),
			summoner: { gameName, tagLine, profileIconId } satisfies SummonerResponse,
		};
		return {
			statusCode: 200,
			body: JSON.stringify(body),
		};
	}
	return {
		statusCode: 400,
		body: "Error: Include either a summerName or summonerId",
	};
};

export { handler };
