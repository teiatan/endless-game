import { Player } from "./basicSettings";

export const getOpponentName = (name: Player):Player => {
    return name === 'player1' ? 'player2' : 'player1'
}

export const getRandomNumber = (min: number, max: number):number => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };