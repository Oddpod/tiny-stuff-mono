import type { Component } from "solid-js";
import type { SummonerResponse } from "../types";
import styles from "./Summoner.module.css";

const Summoner: Component<{ profile: SummonerResponse }> = (props) => (
	<div class={styles.SummonerContainer}>
		<img
			alt="profile icon"
			class={styles.summonerIcon}
			src={`/profileicon/${props.profile?.profileIconId}.webp`}
		/>
		<h2>
			{props.profile.gameName}#{props.profile.tagLine}{" "}
		</h2>
	</div>
);

export default Summoner;
