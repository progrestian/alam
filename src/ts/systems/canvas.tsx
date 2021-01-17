import React, { RefObject } from 'react'
import { World } from './world'

interface CanvasProps {
    world: World,
    unit: number
}

export class Canvas extends React.Component<CanvasProps> {
    private ref: RefObject<HTMLCanvasElement>

    constructor(props: CanvasProps) {
        super(props)

        this.ref = React.createRef<HTMLCanvasElement>()
    }

    componentDidMount() {
        const ctx = this.ref.current?.getContext('2d') ?? new CanvasRenderingContext2D()

        const callback = () => {
            ctx.clearRect(0, 0, this.props.world.getWidth() * this.props.unit, this.props.world.getHeight() * this.props.unit)

            for (const archetype of this.props.world.getArchetypes()) {
                const color = archetype.getDepot().color
                ctx.fillStyle = color.rgba

                for (const entity of archetype.getEntities()) {
                    const position = entity.getDepot().position

                    ctx.fillRect(
                        this.props.unit * position.x,
                        this.props.unit * position.y,
                        this.props.unit,
                        this.props.unit
                    )
                }
            }
        }

        this.props.world.addCallback(callback)
    }

    render() {
        return <canvas ref={this.ref} id='canvas' width={this.props.world.getWidth() * this.props.unit} height={this.props.world.getHeight() * this.props.unit}></canvas>
    }
}
