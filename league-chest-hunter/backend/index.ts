import { serve } from "https://deno.land/std@0.114.0/http/server.ts";

const RIOT_API_ROOT_LOL = Deno.env.get("RIOT_API_ROOT_LOL") as string;
const API_KEY_TOKEN = Deno.env.get("RIOT_API_KEY") as string;
console.log(API_KEY_TOKEN);

function fetchData(url: string) {
  return fetch(url, {
    headers: new Headers({ "X-Riot-Token": API_KEY_TOKEN }),
  });
}
async function fetchSummonerId(
  summonerName: string,
  summonerId: string | undefined = undefined,
) {
  if (summonerId) {
    return summonerId;
  }
  const id = await fetchData(
    `${RIOT_API_ROOT_LOL}summoner/v4/summoners/by-name/${summonerName}`,
  )
    .then((response) => (response.json()))
    .then((res: { id: string }) => res.id);
  return id;
}

function fetchChampionMastery(summonerId: string) {
  return fetchData(
    `${RIOT_API_ROOT_LOL}champion-mastery/v4/champion-masteries/by-summoner/${summonerId}`,
  );
}

async function handler(req: any): Promise<Response> {
  if (req.query.name || req.summonerId) {
    const summonerId = await fetchSummonerId(
      req.body.summonerId,
      req.query.name,
    );

    const response = await fetchChampionMastery(summonerId).then((response) =>
      response.json()
    );
    return new Promise(() =>
      new Response(`{ "championMastery": ${response}, ${summonerId} }`)
    );
  }
  return new Promise(() =>
    new Response("Error: Include either a summerName or summonerId", {
      status: 400,
    })
  );
}

console.log("Listening on http://localhost:8000");
await serve(handler);
