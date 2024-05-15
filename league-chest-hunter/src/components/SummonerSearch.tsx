import { createSignal } from "solid-js";
import type { Component } from "solid-js";
import type { ChampionMastery, SummonerResponse } from "../types";
import styles from './SummonerSearch.module.css'

export type SearchResponse = {
  summoner: SummonerResponse,
  championMastery: ChampionMastery[]
}
const SummonerSearch: Component<{
  onSearch: (summonerName: string) => void
}> = (props) => {
  const [summonerName, setSummonerName] = createSignal("");

  const onKeyDown = (event: KeyboardEvent) => {
    if(event.key === "Enter"){
      props.onSearch(summonerName());
    }
  }

  return (
    <div class={styles.SummonerSearch}>
      <input
        placeholder="gameName#tagLine"
        value={summonerName()}
        onKeyUp={(event) => onKeyDown(event)}
        onChange={(event) => setSummonerName(event.currentTarget.value)}
      />
      <button type="button" onClick={() => props.onSearch(summonerName())}>Fetch</button>
    </div>
  )
}

export default SummonerSearch;