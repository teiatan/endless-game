export const players = ['player1', 'player2'] as const;
export type Player = (typeof players)[number];
export type Color = (typeof config)['colors'][Player];
export type Score = { player1: number; player2: number };
export const collisionCaterogy = { wall: 1, player1: 2, player2: 4 } as const;
export const config = {
    field: {
      sideLength: 16,
    },
    colors: {
      player1: '#4B3B86',
      player2: '#EFAB30',
    } satisfies Record<Player, string>,
  } as const;