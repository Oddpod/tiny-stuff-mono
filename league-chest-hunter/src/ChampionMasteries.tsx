import { ChampionMasteryWithName } from "./ChampMastery";
import ChampMastery from "./ChampMastery";
import type { Component } from "solid-js";
import { For } from "solid-js";
import styles from "./ChampionMasteries.module.css";
import championsById from "./assets/champion/championsById.json";
import { ChampionMastery } from "./types";

const includeChampNames = (mastery: ChampionMastery) => ({
  ...mastery,
  championName: (championsById as { [key: string]: string })[
    mastery.championId
  ],
});

const ChampMasteries: Component<{ masteries: ChampionMastery[] }> = (props) => {
  return (
    <div class={styles.ChampionMasteries}>
      <For
        each={props.masteries.map(includeChampNames)}
        fallback={<div>Loading...</div>}
      >
        {(mastery: ChampionMasteryWithName) => <ChampMastery mastery={mastery} />}
      </For>
    </div>
  );
};

export default ChampMasteries;
