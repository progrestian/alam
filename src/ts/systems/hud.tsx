import React from 'react'
import { Archetype } from '../types/archetype'
import { Entity } from '../types/entity'

interface HudProps {
    archetypes: Archetype[]
}

export class Hud extends React.Component<HudProps> {
    render() {
        return (
            <div id='hud'>
                {this.props.archetypes.map(archetype => (
                    <HudArchetype key={archetype.getName()} archetype={archetype}></HudArchetype>
                ))}
            </div>
        )
    }
}

interface HudArchetypeProps {
    archetype: Archetype
}

interface HudArchetypeState {
    name: string,
    count: number
}

class HudArchetype extends React.Component<HudArchetypeProps, HudArchetypeState> {
    constructor(props: HudArchetypeProps) {
        super(props)

        this.state = {
            name: props.archetype.getName(),
            count: props.archetype.getCount()
        }
    }

    componentDidMount() {
        const changeCount = (_: Entity) => {
            this.setState({ count: this.props.archetype.getCount() })
        }

        this.props.archetype.addModifier(changeCount)
        this.props.archetype.addCleaner(changeCount)
    }

    render() {
        return (
            <div className='panel'>
                <HudField label="name" data={this.state.name}></HudField>
                <HudField label="count" data={this.state.count.toString()}></HudField>
            </div>
        )
    }
}

interface HudFieldProps {
    label: string,
    data: string
}

class HudField extends React.Component<HudFieldProps> {
    render() {
        return (
            <div className='field'>
                <p className='label'>{this.props.label}</p>
                <p className='data'>{this.props.data}</p>
            </div>
        )
    }
}
