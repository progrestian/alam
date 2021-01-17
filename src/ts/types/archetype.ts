import { Depot } from "./depot"
import { Entity } from "./entity"

type Modifier = (entity: Entity) => void
type Cleaner = (entity: Entity) => void

export class Archetype {
    private static uuid: number = 0

    private readonly key: number = Archetype.uuid
    private entities: Map<number, Entity> = new Map()
    private modifiers: Modifier[] = []
    private cleaners: Cleaner[] = []

    constructor(private name: string, private depot: Depot) {
        Archetype.uuid++
        this.entities = new Map()
    }

    // GETTERS

    getName(): string {
        return this.name
    }

    getDepot(): Depot {
        return this.depot
    }

    getCount(): number {
        return this.entities.size
    }

    getEntityById(id: number): Entity | undefined {
        return this.entities.get(id)
    }

    getEntities(): IterableIterator<Entity> {
        return this.entities.values()
    }

    // SETTERS / ADDERS

    addModifier(modifier: Modifier) {
        this.modifiers.push(modifier)
    }

    addCleaner(cleaner: Cleaner) {
        this.cleaners.push(cleaner)
    }

    // MAIN

    destroy(id: number) {
        const entity = this.entities.get(id) as Entity

        for (let cleaner of this.cleaners) {
            cleaner(entity)
        }

        this.entities.delete(id)
    }

    spawn(amount?: number) {
        amount = (amount == null || amount < 1) ? 1 : amount

        for (let i = 0; i < amount; i++) {
            const entity = new Entity(this.depot.clone())
            this.entities.set(entity.getKey(), entity)

            for (let modifier of this.modifiers) {
                modifier(entity)
            }
        }
    }
}
