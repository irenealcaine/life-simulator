import { ANIMAL_TYPES } from "../constants/simulationConfig"
import { DIRECTIONS, wrap } from "./movement"

const REPRODUCTION_RATE_KEYS = {
  [ANIMAL_TYPES.RABBIT]: "rabbitReproductionRate",
  [ANIMAL_TYPES.FOX]: "foxReproductionRate",
}

const REPRODUCTION_RULES = {
  [ANIMAL_TYPES.RABBIT]: (first, second) =>
    first.hunger === 0 && second.hunger === 0,
  [ANIMAL_TYPES.FOX]: (first, second) =>
    first.hunger === 0 || second.hunger === 0,
}

const collectPairs = (animals, type, gridSize, radius) => {
  const byCell = new Map()
  for (const animal of animals) {
    if (animal.type === type) {
      byCell.set(`${animal.x},${animal.y}`, animal)
    }
  }

  const pairs = []
  for (const animal of animals) {
    if (animal.type !== type) {
      continue
    }
    for (let dx = -radius; dx <= radius; dx += 1) {
      for (let dy = -radius; dy <= radius; dy += 1) {
        const x = wrap(animal.x + dx, gridSize)
        const y = wrap(animal.y + dy, gridSize)
        const neighbor = byCell.get(`${x},${y}`)
        if (neighbor && neighbor.id > animal.id) {
          pairs.push([animal, neighbor])
        }
      }
    }
  }
  return pairs
}

export function applyReproduction(animals, settings) {
  if (animals.length === 0) {
    return animals
  }

  const current = animals.map((a) => ({
    ...a,
    age: a.age + 1,
    cooldown: a.cooldown > 0 ? a.cooldown - 1 : 0,
  }))
  const byId = new Map(current.map((a) => [a.id, a]))
  const occupied = new Set(current.map((a) => `${a.x},${a.y}`))
  const births = []
  let nextId = current.reduce((max, a) => Math.max(max, a.id), 0) + 1

  for (const type of Object.values(ANIMAL_TYPES)) {
    const rate = settings[REPRODUCTION_RATE_KEYS[type]]
    const canReproduce = REPRODUCTION_RULES[type]

    for (const [a, b] of collectPairs(
      current,
      type,
      settings.gridSize,
      settings.reproductionRadius
    )) {
      const first = byId.get(a.id)
      const second = byId.get(b.id)

      if (
        first.cooldown > 0 ||
        second.cooldown > 0 ||
        !canReproduce(first, second)
      ) {
        continue
      }

      if (Math.random() >= rate / 100) {
        continue
      }

      const freeCells = []
      for (const parent of [first, second]) {
        for (const [dx, dy] of DIRECTIONS) {
          const x = wrap(parent.x + dx, settings.gridSize)
          const y = wrap(parent.y + dy, settings.gridSize)
          const key = `${x},${y}`
          const alreadyListed = freeCells.some(
            ([freeX, freeY]) => freeX === x && freeY === y
          )
          if (!occupied.has(key) && !alreadyListed) {
            freeCells.push([x, y])
          }
        }
      }

      if (freeCells.length === 0) {
        continue
      }

      const [x, y] = freeCells[Math.floor(Math.random() * freeCells.length)]
      occupied.add(`${x},${y}`)
      births.push({
        id: nextId,
        type,
        x,
        y,
        hunger: 0,
        cooldown: settings.gestationTurns,
        age: 0,
      })
      nextId += 1

      byId.set(first.id, {
        ...first,
        cooldown: settings.gestationTurns,
      })
      byId.set(second.id, {
        ...second,
        cooldown: settings.gestationTurns,
      })
    }
  }

  return [...byId.values(), ...births]
}
