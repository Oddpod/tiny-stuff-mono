import { ChampionMasteryWithName } from "./ChampMastery";
import ChampMastery from "./ChampMastery";
import type { Component } from "solid-js";
import { For } from "solid-js";
import styles from "./ChampionMasteries.module.css";

const ChampMasteries: Component<{
  masteries: ChampionMasteryWithName[];
  isFiltering: boolean
}> = (props) => {
  return (
    <div class={styles.ChampionMasteries}>
      <For
        each={props.masteries}
        fallback={props.isFiltering ? <></> : <div>Loading...</div>}
      >
        {(mastery: ChampionMasteryWithName) => (
          <ChampMastery mastery={mastery} />
        )}
      </For>
    </div>
  );
};

export default ChampMasteries;
