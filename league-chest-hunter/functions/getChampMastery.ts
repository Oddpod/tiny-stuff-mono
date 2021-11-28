
import { Handler } from "@netlify/functions";
const fetch = require('node-fetch')

const { RIOT_API_ROOT_LOL, API_KEY_TOKEN } = process.env;

//#region helper functions
function fetchData(url: string) {
  return fetch(url, {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
      'X-Riot-Token': API_KEY_TOKEN
    }
  }).then(res => res.json());
}
async function fetchSummonerId(
  summonerName: string,
  summonerId: string | undefined = undefined
) {
  if (summonerId) {
    return summonerId;
  }
  const res = await fetchData(
    `${RIOT_API_ROOT_LOL}summoner/v4/summoners/by-name/${summonerName}`
  )
  return res.id;
}

function fetchChampionMastery(summonerId: string) {
  return fetchData(
    `${RIOT_API_ROOT_LOL}champion-mastery/v4/champion-masteries/by-summoner/${summonerId}`,
  );
}
//#endregion



const handler: Handler = async (event, context) => {
  const { name: summonerName = undefined, id = undefined } = event.queryStringParameters;
  if (summonerName || id) {
    const summonerId = await fetchSummonerId(summonerName, id);

    const response = await fetchChampionMastery(summonerId)
    return {
      statusCode: 200,
      body: `{ "championMastery": ${response}, ${summonerId} }`
    };
  }
  return {
    statusCode: 400,
    body: "Error: Include either a summerName or summonerId"
  };
};

export { handler };
