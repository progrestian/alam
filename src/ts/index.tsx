import '../sass/main.sass'
import React from 'react'
import ReactDOM from 'react-dom'
import { Archetype } from './types/archetype'
import { Canvas } from './systems/canvas'
import { Color } from './components/color'
import { Control } from './systems/control'
import { Depot } from './types/depot'
import { Energy } from './components/energy'
import { Hud } from './systems/hud'
import { Movement } from './components/movement'
import { Sense } from './components/sense'
import { World } from './systems/world'

const plants = new Archetype('plants', new Depot({
    color: new Color('#2d94'),
    energy: new Energy(1, 0),
    movement: new Movement(0),
}))

const herbivores = new Archetype('herbivores', new Depot({
    color: new Color('#56ba'),
    energy: new Energy(8),
    sense: new Sense(2, ['plants']),
}))

const omnivores = new Archetype('omnivores', new Depot({
    color: new Color('#a6ba'),
    movement: new Movement(2),
    sense: new Sense(4, ['plants', 'herbivores']),
}))

const carnivores = new Archetype('carnivores', new Depot({
    color: new Color('#f99a'),
    energy: new Energy(32),
    movement: new Movement(4),
    sense: new Sense(8, ['herbivores', 'omnivores']),
}))

const world = new World(64, 48, 1000 / 60)

world.addArchetype(plants)
world.addArchetype(herbivores)
world.addArchetype(omnivores)
world.addArchetype(carnivores)

plants.spawn(1000)
herbivores.spawn(25)
omnivores.spawn(10)
carnivores.spawn(5)

ReactDOM.render(
  <React.StrictMode>
      <div>
        <Control world={world}></Control>
        <Canvas world={world} unit={10}></Canvas>
      </div>
      <div>
        <Hud archetypes={[plants, herbivores, omnivores, carnivores]}></Hud>
      </div>
  </React.StrictMode>,
  document.getElementById('root')
)
