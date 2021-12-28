import type { Component } from "solid-js";
import { ChampionMastery } from "./types";
import styles from "./ChampMastery.module.css";
import { AquiredChest, Chest } from "./Icons";

export interface ChampionMasteryWithName extends ChampionMastery {
  championName: string;
}

const ChampMastery: Component<{ mastery: ChampionMasteryWithName }> = (
  props
) => {
  return (
    <div class={styles.ChampMastery}>
      {/* {props.mastery.chestGranted ? "✔🧰" : "❌🧰"} */}
      {props.mastery.chestGranted ? (
        <AquiredChest class={styles.chestIcon} />
      ) : (
        <Chest class={styles.chestIcon} />
      )}
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
