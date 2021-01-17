import { Depot } from './depot'

export class Entity {
    private static uuid: number = 0

    private readonly key: number = Entity.uuid

    constructor(private depot: Depot) {
        Entity.uuid++
    }

    getKey(): number {
        return this.key
    }

    getDepot(): Depot {
        return this.depot
    }

    clone(): Entity {
        const entity = new Entity(new Depot())
        entity.depot = this.depot.clone()
        return entity
    }
}
