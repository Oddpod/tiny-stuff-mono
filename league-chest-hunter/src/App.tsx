import type { Component } from "solid-js";
import { createSignal, onMount, For } from "solid-js";
import logo from "./logo.svg";
import styles from "./App.module.css";
import type { ChampionMastery } from "./ChampMastery";
import testResponse from "./testResponse";
import ChampMasteries from "./ChampionMasteries";

const App: Component = () => {
  const [summonerName, setSummonerName] = createSignal("");
  const [champMasteries, setChampMasteries] = createSignal<ChampionMastery[]>();

  const fetchChampMasteries = async () => {
    const response = await fetch(
      `/.netlify/functions/getChampMastery?name=${summonerName()}`
    ).then((res) => res.json());
    setChampMasteries(response.championMastery);
  };
  onMount(() => fetchChampMasteries());
  return (
    <div class={styles.App}>
      <header>
        <h1>League Chest Hunter</h1>
      </header>
      <input
        placeholder="Summoner name"
        value={summonerName()}
        onChange={(event) => setSummonerName(event.currentTarget.value)}
      />
      <button onClick={() => fetchChampMasteries()}>Fetch</button>
      <ChampMasteries masteries={testResponse.championMastery} />
    </div>
  );
};

export default App;
