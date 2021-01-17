import React from 'react'
import { World } from './world'

interface ControlProps {
    world: World
}

export class Control extends React.Component<ControlProps> {
    toggle() {
        document.getElementById('button-play').classList.toggle('button-active')
        document.getElementById('button-pause').classList.toggle('button-active')
    }

    render() {
        return (
            <div id='control'>
                <button id='button-play' onClick={() => {
                    this.props.world.play()
                    this.toggle()
                }}>▶</button>
                <button id='button-pause' className='button-active' onClick={() => {
                    this.props.world.pause()
                    this.toggle()
                }}>⏸</button>
                <button id='button-skip' onClick={() => this.props.world.next()}>→</button>
            </div>
        )
    }
}
