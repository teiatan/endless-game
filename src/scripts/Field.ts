import { Bodies, type Body, World, Vector } from 'matter-js'
import { collisionCaterogy, Player, config } from './basicSettings'
import { getOpponentName } from './utils'

export class Field {
  public readonly bodiesToSquares = new Map<Body, FieldSquare>()

  constructor(
    private world: World,
    sideLength: number,
    squareSizePx: number,
  ) {
    Array.from({ length: sideLength }, (_, y) =>
      Array.from({ length: sideLength }, (_, x) => {
        const owner = x < sideLength / 2 ? 'player1' : 'player2'
        const position = Vector.create(x * squareSizePx + squareSizePx / 2, y * squareSizePx + squareSizePx / 2)
        const square = new FieldSquare(this.world, position, owner, squareSizePx)
        this.bodiesToSquares.set(square.body, square)
        return square
      }),
    )
  }
}

export class FieldSquare {
  public readonly body: Body
  constructor(
    private world: World,
    position: Vector,
    private _owner: Player,
    sizePx: number,
  ) {
    this.body = Bodies.rectangle(position.x, position.y, sizePx + 1, sizePx + 1, {
      isStatic: true,
      collisionFilter: { category: collisionCaterogy[this._owner] },
      render: {
        fillStyle: config.colors[getOpponentName(this._owner)],
      },
    })
    World.add(this.world, this.body)
  }

  public get owner(): Player {
    return this._owner
  }

  public capture(newOwner: Player) {
    this._owner = newOwner
    this.body.render.fillStyle = config.colors[getOpponentName(newOwner)]
    this.body.collisionFilter.category = collisionCaterogy[newOwner]
  }
}
