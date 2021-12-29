import { Component, createMemo } from "solid-js";
import { createSignal, onMount } from "solid-js";
import styles from "./App.module.css";
import testResponse from "./testResponse";
import ChampMasteries from "./ChampionMasteries";
import { ChampionMastery, SummonerResponse } from "./types";
import Summoner from "./Summoner";

enum FILTER_TYPE {
  CHEST_AVAILABLE = "CHEST_AVAILABLE",
}

const App: Component = () => {
  const [summonerName, setSummonerName] = createSignal("");
  const [profile, setProfile] = createSignal<SummonerResponse>({
    "id": "7LyvKM5Bwepavtv_nFGtUQNesl55cT8AvS5zNy2Gw5pW1Eg",
    "accountId": "Qj9OZKmMyi9OcmKAWHQka4athvjle8VoET5Q9J2cxWIHNR0",
    "puuid": "5BejTVi6a8Tt38TF9zedFDmR9UvG-apBrM-kYDzAbf7C-3-u0YIx6WqYZcXEcZK4LTs-TXN-N5WXUQ",
    "name": "Knightalot",
    "profileIconId": 763,
    "revisionDate": 1638571226000,
    "summonerLevel": 66
});
  const [champMasteries, setChampMasteries] = createSignal<ChampionMastery[]>(
    testResponse.championMastery
  );
  const [filter, setFilter] = createSignal<FILTER_TYPE>(
    FILTER_TYPE.CHEST_AVAILABLE
  );

  const fetchChampMasteries = async () => {
    const response = await fetch(
      `/.netlify/functions/getChampMastery?name=${summonerName()}`
    ).then((res) => res.json());
    setProfile(response.summoner);
    setChampMasteries(response.championMastery);
  };

  const filteredMasteries = createMemo(() => {
    if (filter() === FILTER_TYPE.CHEST_AVAILABLE) {
      return champMasteries()?.filter(mastery => !mastery.chestGranted);
    }
    return champMasteries();
  });
  return (
    <div class={styles.App}>
      <header>
        <h1>League Chest Hunter</h1>
      </header>
      <div>
        <input
          placeholder="Summoner name"
          value={summonerName()}
          onChange={(event) => setSummonerName(event.currentTarget.value)}
        />
        <button onClick={() => fetchChampMasteries()}>Fetch</button>
      </div>
      <article>
        <Summoner profile={profile()} />
        <ChampMasteries masteries={filteredMasteries()} />
      </article>
      {/* <ChampMasteries masteries={testResponse.championMastery} /> */}
    </div>
  );
};

export default App;
