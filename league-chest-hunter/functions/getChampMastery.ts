import type { Handler } from "@netlify/functions";
import fetch from "node-fetch";

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

export interface Account {
	puuid: string;
	gameName: string;
	tagLine: string;
	profileIconID: number;
	revisionDate: number;
	summonerLevel: number;
}

//#region helper functions
function fetchData(url: string) {
	return fetch(url, {
		method: "get",
		headers: {
			"Content-Type": "application/json",
			// biome-ignore lint/style/noNonNullAssertion: <explanation>
			"X-Riot-Token": API_KEY_TOKEN!,
		},
	}).then((res) => res.json());
}
async function fetchSummoner(gameNameAndTagLine: string) {
	const [gameName, tagLine] = gameNameAndTagLine.split("#");
	const res = (await fetchData(
		`${RIOT_API_ROOT}riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}`,
	)) as Account;
	return res;
}

function fetchChampionMastery(puuid: string) {
	return fetchData(
		`${RIOT_API_ROOT_LOL}lol/champion-mastery/v4/champion-masteries/by-puuid/${puuid}`,
	);
}
//#endregion

const handler: Handler = async (event, context) => {
	const { name: summonerName = undefined } =
		event.queryStringParameters as FetchChampionMasteryQuery;
	if (summonerName) {
		const { puuid, gameName, tagLine } = await fetchSummoner(summonerName);

		const response = await fetchChampionMastery(puuid);
		const body = { championMastery: response, summoner: { gameName, tagLine } };
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
