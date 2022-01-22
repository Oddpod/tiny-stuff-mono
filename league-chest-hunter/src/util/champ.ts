import type { ChampionMastery } from "../types";
import championsById from "../assets/champion/championsById.json";

export const includeChampNames = (mastery: ChampionMastery) => ({
    ...mastery,
    championName: (championsById as { [key: string]: string })[
      mastery.championId
    ],
  });