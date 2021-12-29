import { Handler } from "@netlify/functions";
import fetch from "node-fetch";

const { RIOT_API_ROOT_LOL, API_KEY_TOKEN } = process.env;

type FetchChampionMasteryQuery = {
  name: string | undefined;
  id: string | undefined;
};

export interface SummonerResponse {
  id: string;
  accountID: string;
  puuid: string;
  name: string;
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
      "X-Riot-Token": API_KEY_TOKEN,
    },
  }).then((res) => res.json());
}
async function fetchSummoner(summonerName: string) {
  const res = (await fetchData(
    `${RIOT_API_ROOT_LOL}summoner/v4/summoners/by-name/${summonerName}`
  )) as SummonerResponse;
  return res;
}

function fetchChampionMastery(summonerId: string) {
  return fetchData(
    `${RIOT_API_ROOT_LOL}champion-mastery/v4/champion-masteries/by-summoner/${summonerId}`
  );
}
//#endregion

const handler: Handler = async (event, context) => {
  const { name: summonerName = undefined } =
    event.queryStringParameters as FetchChampionMasteryQuery;
  if (summonerName) {
    const summoner = await fetchSummoner(summonerName!);

    const response = await fetchChampionMastery(summoner.id);
    const body = { championMastery: response, summoner };
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
