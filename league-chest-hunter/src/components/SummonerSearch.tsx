import { createSignal } from "solid-js";
import type { Component } from "solid-js";
import { ChampionMastery, SummonerResponse } from "../types";
import styles from './SummonerSearch.module.css'

export type SearchResponse = {
  summoner: SummonerResponse,
  championMastery: ChampionMastery[]
}
const SummonerSearch: Component<{
  onSearchResponse: (response: SearchResponse) => void
}> = (props) => {
  const [summonerName, setSummonerName] = createSignal("");

  const fetchChampMasteries = async () => {
    const response = await fetch(
      `/.netlify/functions/getChampMastery?name=${summonerName()}`
    ).then((res) => res.json());
    props.onSearchResponse(response)
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if(event.key === "Enter"){
      fetchChampMasteries();
    }
  }

  return (
    <div class={styles.SummonerSearch}>
      <input
        placeholder="Summoner name"
        value={summonerName()}
        onKeyUp={(event) => onKeyDown(event)}
        onChange={(event) => setSummonerName(event.currentTarget.value)}
      />
      <button onClick={() => fetchChampMasteries()}>Fetch</button>
    </div>
  )
}

export default SummonerSearch;