import { ANIMAL_TYPES } from "../constants/simulationConfig"
import { shuffle } from "./movement"

export function createFoodGrid(gridSize, coverage, regrowthTurns) {
  const food = new Uint8Array(gridSize * gridSize)

  if (coverage < 100) {
    const withoutFood = Math.round((food.length * (100 - coverage)) / 100)
    const indices = shuffle(
      Array.from({ length: food.length }, (_, index) => index)
    )
    for (let i = 0; i < withoutFood; i += 1) {
      food[indices[i]] = regrowthTurns
    }
  }

  return food
}

export function regrowFood(food) {
  const next = Uint8Array.from(food)
  for (let i = 0; i < next.length; i += 1) {
    if (next[i] > 0) {
      next[i] -= 1
    }
  }
  return next
}

export function applyFeeding(animals, food, settings) {
  const nextFood = Uint8Array.from(food)
  const survivors = []

  for (const animal of animals) {
    if (animal.type !== ANIMAL_TYPES.RABBIT) {
      survivors.push(animal)
      continue
    }

    const index = animal.y * settings.gridSize + animal.x

    if (nextFood[index] === 0) {
      nextFood[index] = settings.foodRegrowthTurns
      survivors.push({ ...animal, hunger: 0 })
      continue
    }

    const hunger = animal.hunger + 1

    if (hunger < settings.rabbitStarvationTurns) {
      survivors.push({ ...animal, hunger })
    }
  }

  return { animals: survivors, food: nextFood }
}
