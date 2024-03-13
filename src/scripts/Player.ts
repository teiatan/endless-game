import { Bodies, World, Body, type Vector } from 'matter-js'
import { collisionCaterogy, Player as PlayerType, config } from './basicSettings'
import { getOpponentName } from './utils'

export class Player {
  public readonly body: Body
  constructor(
    private world: World,
    position: Vector,
    velocity: Vector,
    size: number,
    public readonly name: PlayerType,
  ) {
    this.body = Bodies.rectangle(position.x + size / 2, position.y + size / 2, size, size, {
      frictionAir: 0,
      frictionStatic: 0,
      friction: 0,
      inertia: Infinity,
      restitution: 1,
      collisionFilter: { mask: collisionCaterogy[getOpponentName(this.name)] | collisionCaterogy.wall },
      render: {
        fillStyle: config.colors[this.name],
      },
    })
    Body.setVelocity(this.body, velocity)
    World.add(this.world, this.body)
  }
}
