export class Component {
    static default(): Component {
        return new Component()
    }

    clone(): Component {
        return new Component()
    }
}
