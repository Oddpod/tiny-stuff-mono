const API_KEY_TOKEN = "RGAPI-aa71a168-4409-4740-b70b-1d7a7fb8fc7c";
const RIOT_API_ROOT_LOL = "https://euw1.api.riotgames.com/lol/"

function fetchData(url) {
    return fetch(url, {
        headers: new Headers({ "X-Riot-Token": API_KEY_TOKEN }),
    });
}
export async function fetchSummonerId(
    summonerName,
    summonerId = undefined,
) {
    if (summonerId) {
        return summonerId;
    }
    const id = await fetchData(
        `${RIOT_API_ROOT_LOL}summoner/v4/summoners/by-name/${summonerName}`,
    )
        .then((response) => (response.json()))
        .then(res => res.id);
    return id;
}

export function fetchChampionMastery(summonerId) {
    return fetchData(
        `${RIOT_API_ROOT_LOL}champion-mastery/v4/champion-masteries/by-summoner/${summonerId}`,
    );
}