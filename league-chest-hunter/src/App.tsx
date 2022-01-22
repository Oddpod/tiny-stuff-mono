import { Component, createMemo } from "solid-js";
import { createSignal } from "solid-js";
import styles from "./App.module.css";
import ChampMasteries from "./components/ChampionMasteries";
import { SummonerResponse } from "./types";
import Summoner from "./components/Summoner";
import testData from '../_testData.json'
import SummonerSearch, { SearchResponse } from "./components/SummonerSearch";
import { includeChampNames } from "./util/champ";
import { ChampionMasteryWithName } from "./components/ChampMastery";

enum FILTER_TYPE {
  NONE = "NONE",
  CHEST_AVAILABLE = "CHEST_AVAILABLE",
}

const App: Component = () => {
  const [profile, setProfile] = createSignal<SummonerResponse>(testData.profile);
  const [champMasteries, setChampMasteries] = createSignal<ChampionMasteryWithName[]>(
    testData.championMastery.map(includeChampNames)
  );
  const [filter, setFilter] = createSignal<FILTER_TYPE>(
    FILTER_TYPE.CHEST_AVAILABLE
  );
  const [nameFilter, setNameFilter] = createSignal<string>(
    ''
  )
  const toggleFilter = () => {
    setFilter(filter() === FILTER_TYPE.CHEST_AVAILABLE ? FILTER_TYPE.NONE : FILTER_TYPE.CHEST_AVAILABLE)
  }

  const onSearchResponse = (response: SearchResponse) => {
    setProfile(response.summoner);
    setChampMasteries(response.championMastery.map(includeChampNames));
  };

  const filteredMasteries = createMemo(() => {
    return champMasteries()
      .filter(mastery => filter() !== FILTER_TYPE.CHEST_AVAILABLE || !mastery.chestGranted)
      .filter(mastery => !nameFilter() || mastery.championName.includes(nameFilter()))
  });

  return (
    <div class={styles.App}>
      <header>
        <h1>League Chest Hunter</h1>
      </header>
      <SummonerSearch onSearchResponse={(response) => onSearchResponse(response)} />
      <article>
        <section class={styles.SummonerInfo}>
          <Summoner profile={profile()} />
          <input
            type="text"
            class={styles.filterChamps}
            placeholder="Filter by champ name"
            value={nameFilter()}
            name="filterChamps"
            id="filterChamps"
            onInput={(event) => setNameFilter(event.currentTarget.value)}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            class={styles.ChestIcon}
            color={filter() === FILTER_TYPE.CHEST_AVAILABLE ? 'goldenrod' : 'grey'}
            aria-hidden="true"
            role="checkbox"
            width="100%"
            onClick={() => toggleFilter()}
            height="100%"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 24 24">
            <path d="M5 4h14a3 3 0 0 1 3 3v4h-7v-1H9v1H2V7a3 3 0 0 1 3-3m6 7h2v2h-2v-2m-9 1h7v1l2 2h2l2-2v-1h7v8H2v-8z" fill="currentColor">
            </path>
          </svg>
          <input type="checkbox"
            value={filter() === FILTER_TYPE.CHEST_AVAILABLE ? 1 : 0}
            id="filterChests"
            name="filterChests"
            checked
            onClick={() => toggleFilter()}
          />
          <label for="filterChests">Filter out chest granted</label>
        </section>
        <ChampMasteries masteries={filteredMasteries()} isFiltering={!!nameFilter()} />
      </article>
    </div>
  );
};

export default App;
