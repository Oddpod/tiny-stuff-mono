import type { Component } from "solid-js";
import type { ChampionMastery } from "../types";
import styles from "./ChampMastery.module.css";
import { AquiredChest, Chest } from "./Icons";

export interface ChampionMasteryWithName extends ChampionMastery {
	championName: string;
}

const ChampMastery: Component<{ mastery: ChampionMasteryWithName }> = (
	props,
) => {
	return (
		<div class={styles.ChampMastery}>
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
				loading="lazy"
				alt={`champ icon for ${props.mastery.championName}`}
				src={`/champion/tiles/${props.mastery.championName}_0.webp`}
			/>
		</div>
	);
};

export default ChampMastery;
