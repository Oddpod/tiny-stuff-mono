import { serve } from "https://deno.land/std@0.114.0/http/server.ts";

const RIOT_API_ROOT_LOL = Deno.env.get("RIOT_API_ROOT_LOL") as string;
const API_KEY_TOKEN = Deno.env.get("RIOT_API_KEY") as string;

//#region helper functions
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
//#endregion

async function handler(req: any): Promise<Response> {
  // if (req.query.name || req.summonerId) {
  //   const summonerId = await fetchSummonerId(
  //     req.body.summonerId,
  //     req.query.name,
  //   );

  //   const response = await fetchChampionMastery(summonerId).then((response) =>
  //     response.json()
  //   );
  //   return new Response(
  //     `{ "championMastery": ${response}, ${summonerId} }`,
  //     { status: 200, headers: { "content-type": "application/json" }}
  //   );
  // }
  return new Response("Error: Include either a summerName or summonerId", {
    status: 400,
    headers: { "content-type": "application/json" }
  });
}

console.log("Listening on http://localhost:8080");
await serve(handler);
