import { Archetype } from "../types/archetype"
import { Entity } from "../types/entity"
import { Position } from "../components/position"
import { Energy } from "../components/energy"

type Layer = number[][][]
type Callback = () => void

export class World {
    private archetypes: Map<string, Archetype> = new Map()
    private layers: Map<string, Layer> = new Map()
    private callbacks: Callback[] = []

    constructor(private width: number, private height: number, private resolution: number) {}

    // GETTERS

    getWidth(): number {
        return this.width
    }

    getHeight(): number {
        return this.height
    }

    getArchetypeByName(name: string): Archetype | undefined {
        return this.archetypes.get(name)
    }

    getArchetypes(): IterableIterator<Archetype> {
        return this.archetypes.values()
    }

    // SETTERS / ADDERS

    addArchetype(archetype: Archetype) {
        this.archetypes.set(archetype.getName(), archetype)

        let layer: number[][][] = []

        for (let i = 0; i < this.width; i++) {
            let row = []
            for (let j = 0; j < this.height; j++) {
                row.push([])
            }
            layer.push(row)
        }

        this.layers.set(archetype.getName(), layer)

        let modifier = (entity: Entity) => this.enter(archetype, entity, true)
        let cleaner = (entity: Entity) => this.leave(archetype, entity)

        archetype.addModifier(modifier)
        archetype.addCleaner(cleaner)
    }

    addCallback(callback: Callback) {
        this.callbacks.push(callback)
    }

    // CONTROLS

    private played: boolean = false
    private timestamp: number = 0

    isPlayed(): boolean {
        return this.played
    }

    play() {
        this.played = true
        this.timestamp = 0
        this.wait(this.resolution + 1)
    }

    pause() {
        this.played = false
    }

    next() {
        if (!this.played) {
            this.timestamp = 0
            this.update()

            for (let callback of this.callbacks) {
                callback()
            }
        }
    }

    private wait(timestamp: number) {
        if ((timestamp - this.timestamp >= this.resolution) && this.played) {
            this.update()

            for (let callback of this.callbacks) {
                callback()
            }

            this.timestamp = timestamp
        }

        window.requestAnimationFrame(this.wait.bind(this))
    }

    // MAIN

    private enter(archetype: Archetype, entity: Entity, insertion?: boolean) {
        const position = entity.getDepot().position
        const layer = this.layers.get(archetype.getName()) as Layer

        if (insertion) {
            position.x = Math.floor(Math.random() * this.width)
            position.y = Math.floor(Math.random() * this.height)
        }

        const cell = layer[position.x][position.y]
        cell.push(entity.getKey())
        position.index = cell.length - 1
    }

    private leave(archetype: Archetype, entity: Entity) {
        const position = entity.getDepot().position
        const layer = this.layers.get(archetype.getName()) as Layer
        const cell = layer[position.x][position.y]

        cell.splice(position.index, 1)

        for (let i = position.index; i < cell.length; i++) {
            const entity = archetype.getEntityById(cell[i]) as Entity
            const position = entity.getDepot().position
            position.index -= 1
        }
    }

    private region(position: Position): Position {
        return new Position(
            Math.floor(position.x / (this.width / 2)),
            Math.floor(position.y / (this.height / 2))
        )
    }

    private update() {
        for (const archetype of this.archetypes.values()) {
            for (const entity of archetype.getEntities()) {
                const sense = entity.getDepot().sense
                const position = entity.getDepot().position
                const movement = entity.getDepot().movement
                const energy = entity.getDepot().energy

                energy.reserve -= energy.decay
                if (energy.reserve <= 0) {
                    archetype.destroy(entity.getKey())
                }

                let candidates = []
                let steps = movement.steps

                while (steps > 0) {
                    let minimum = Infinity

                    for (let i = -sense.vision; i <= sense.vision; i++) {
                        for (let j = -sense.vision; j <= sense.vision; j++) {
                            for (const name of sense.preys) {
                                const layer = this.layers.get(name) as Layer
                                const distance = Math.hypot(i, j)

                                if (
                                    position.x + i >= 0 && position.x + i < this.width
                                    && position.y + j >= 0 && position.y + j < this.height
                                    && layer[position.x + i][position.y + j].length > 0
                                    && distance <= minimum
                                ) {
                                    if (distance < minimum) {
                                        candidates = []
                                        minimum = distance
                                    }

                                    candidates.push({ name: name, position: new Position(position.x + i, position.y + j) })
                                }
                            }
                        }
                    }

                    if (candidates.length > 0) {
                        const candidate = candidates[Math.floor(Math.random() * candidates.length)]

                        if (minimum === 0) {
                            const cell = (this.layers.get(candidate.name) as Layer)[candidate.position.x][candidate.position.y]
                            const id = cell[Math.floor(Math.random() * cell.length)]

                            energy.reserve += energy.table.get(candidate.name) ?? Energy.getGain();
                            (this.archetypes.get(candidate.name) as Archetype).destroy(id)

                            steps = 0
                            movement.target = undefined
                            continue
                        } else {
                            movement.target = candidate.position
                        }
                    } else {
                        if (movement.target == null) {
                            const region = this.region(position)

                            do {
                                movement.target = new Position(
                                    Math.floor(Math.random() * this.width),
                                    Math.floor(Math.random() * this.height)
                                )
                            } while (this.region(movement.target).equal(region))
                        }
                    }

                    if (
                        position.x === movement.target.x
                        && position.y === movement.target.y
                    ) {
                        movement.target = undefined
                    } else {
                        if (energy.reserve > movement.cost) {
                            this.leave(archetype, entity)

                            if      (position.x > movement.target.x) position.x--
                            else if (position.x < movement.target.x) position.x++

                            if      (position.y > movement.target.y) position.y--
                            else if (position.y < movement.target.y) position.y++

                            this.enter(archetype, entity)

                            energy.reserve -= movement.cost
                        }
                    }

                    steps -= 1
                }
            }
        }
    }
}
