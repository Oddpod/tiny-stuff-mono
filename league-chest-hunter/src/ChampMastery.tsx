import type { Component } from "solid-js";
import { ChampionMastery } from "./types";
import styles from "./ChampMastery.module.css";

export interface ChampionMasteryWithName extends ChampionMastery {
  championName: string;
}

const ChampMastery: Component<{ mastery: ChampionMasteryWithName }> = (
  props
) => {
  return (
    <div class={styles.ChampMastery}>
      {/* {props.mastery.chestGranted ? "✔🧰" : "❌🧰"} */}
      <img
        class={`
        ${styles.champImage} 
        ${
          props.mastery.chestGranted
            ? styles.chestGranted
            : styles.chestAvailable
        }`}
        src={`src/assets/champion/tiles/${props.mastery.championName}_0.jpg`}
      />
    </div>
  );
};

export default ChampMastery;
