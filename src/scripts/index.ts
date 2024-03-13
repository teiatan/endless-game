import '../style.css';
import { Engine, Render, Runner, Events, Composite, Bodies, Vector, type Pair, type IEventCollision, Body} from 'matter-js'
import { Player as PlayerType, config, players } from './basicSettings';
import { Field, FieldSquare } from './Field';
import { Player } from './Player';
import { getRandomNumber } from './utils';

const canvas = document.querySelector<HTMLCanvasElement>('#canvas') ?? undefined;

const height = canvas?.offsetHeight ?? 0;
const width = canvas?.offsetWidth ?? 0;

const player1Elem = document.querySelector<HTMLSpanElement>('#player1');
const player2Elem = document.querySelector<HTMLSpanElement>('#player2');

const score = { player1: config.field.sideLength ** 2 / 2, player2: config.field.sideLength ** 2 / 2 };
const updateScore = ({ player1, player2 }: { player1: number; player2: number }) => {
  if(player1Elem && player2Elem) {
    player1Elem.innerText = String(player1)
    player2Elem.innerText = String(player2)
  }
};

const engine = Engine.create();
engine.gravity.y = 0;
const world = engine.world;
const render = Render.create({
  engine,
  canvas,
  options: { width: canvas?.offsetWidth, height: canvas?.offsetHeight, wireframes: false },
});
Render.run(render);
const runner = Runner.create({ isFixed: true });
Runner.run(runner, engine);

const field = new Field(world, config.field.sideLength, width / config.field.sideLength);
Events.on(engine, 'collisionEnd', (event) => handleCollisionCaptures(event));

Composite.add(world, [
  Bodies.rectangle(-2.5, height / 2, 5, height, { isStatic: true }),
  Bodies.rectangle(width + 2.5, height / 2, 5, height, { isStatic: true }),
  Bodies.rectangle(width / 2, -2.5, width, 5, { isStatic: true }),
  Bodies.rectangle(width / 2, height + 2.5, width, 5, { isStatic: true }),
]);

const squareSizePx = width / config.field.sideLength;

const player1 = new Player(
  world,
  Vector.create(squareSizePx, getRandomNumber(squareSizePx, height - squareSizePx * 3)),
  Vector.create(5, 5),
  squareSizePx,
  'player1',
);
const player2 = new Player(
  world,
  Vector.create(width - squareSizePx * 3, getRandomNumber(squareSizePx, height - squareSizePx * 3)),
  Vector.create(5, 5),
  squareSizePx,
  'player2',
);
const bodyToPlayer = new Map<Body, Player>([
  [player1.body, player1],
  [player2.body, player2],
]);

const handleCollisionCaptures = (event: IEventCollision<Engine>) => {
  players.forEach((playerName) => {
    const playerFieldPairs = getPlayerFieldPairs(event.pairs, playerName)
    if (playerFieldPairs.length === 0) {
      return
    }
    const { player, square } = playerFieldPairs[0]
    if (player.name === 'player1') {
      score.player1++
      score.player2--
    } else {
      score.player1--
      score.player2++
    }
    updateScore(score)
    square.capture(player.name)
  })
};

const getPlayerFieldPairs = (pairs: Pair[], name: PlayerType) => {
  const playerFieldPairs: { player: Player; square: FieldSquare }[] = []
  pairs.forEach(({ bodyA, bodyB }) => {
    let player: Player | undefined = undefined
    let square: FieldSquare | undefined = undefined
    for (const body of [bodyA, bodyB]) {
      if (bodyToPlayer.has(body)) {
        player = bodyToPlayer.get(body)!
      } else if (field.bodiesToSquares.has(body)) {
        square = field.bodiesToSquares.get(body)!
      }
    }
    if (square && player?.name === name) {
      playerFieldPairs.push({ player, square })
    };
  })
  return playerFieldPairs;
};