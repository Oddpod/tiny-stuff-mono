import type { Component } from "solid-js";
import type { SummonerResponse } from "../types";
import styles from "./Summoner.module.css";

const Summoner: Component<{ profile: SummonerResponse }> = (props) => (
  <div class={styles.SummonerContainer}>
    <img class={styles.summonerIcon} src={`/profileicon/${props.profile?.profileIconId}.webp`} />
    <h2>{props.profile.name} </h2>
  </div>
);

export default Summoner;
