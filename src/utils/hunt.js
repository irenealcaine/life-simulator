import { ANIMAL_TYPES } from "../constants/simulationConfig"
import { DIRECTIONS, wrap } from "./movement"

export function applyHunting(animals, settings) {
  const rabbitsByCell = new Map()
  for (const animal of animals) {
    if (animal.type === ANIMAL_TYPES.RABBIT) {
      rabbitsByCell.set(`${animal.x},${animal.y}`, animal.id)
    }
  }

  const eatenRabbitIds = new Set()
  const survivors = []

  for (const animal of animals) {
    if (animal.type !== ANIMAL_TYPES.FOX) {
      survivors.push(animal)
      continue
    }

    const preyIds = []
    for (const [dx, dy] of DIRECTIONS) {
      const x = wrap(animal.x + dx, settings.gridSize)
      const y = wrap(animal.y + dy, settings.gridSize)
      const preyId = rabbitsByCell.get(`${x},${y}`)
      if (preyId !== undefined && !eatenRabbitIds.has(preyId)) {
        preyIds.push(preyId)
      }
    }

    let eaten = false
    if (
      preyIds.length > 0 &&
      Math.random() < settings.foxHuntSuccessRate / 100
    ) {
      const preyId = preyIds[Math.floor(Math.random() * preyIds.length)]
      eatenRabbitIds.add(preyId)
      eaten = true
    }

    if (eaten) {
      survivors.push({ ...animal, hunger: 0 })
      continue
    }

    const hunger = animal.hunger + 1

    if (hunger < settings.foxStarvationTurns) {
      survivors.push({ ...animal, hunger })
    }
  }

  return survivors.filter((animal) => !eatenRabbitIds.has(animal.id))
}
