import { ANIMAL_TYPES, NEWBORN_TURNS } from "../constants/simulationConfig"

export const DIRECTIONS = [
  [0, -1],
  [0, 1],
  [-1, 0],
  [1, 0],
  [-1, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
]

export const wrap = (value, size) => (value + size) % size

const positionKey = (x, y) => `${x},${y}`

export const shuffle = (items) => {
  for (let i = items.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[items[i], items[j]] = [items[j], items[i]]
  }
  return items
}

export function createAnimals(gridSize, rabbitCount, foxCount) {
  const cells = shuffle(
    Array.from({ length: gridSize * gridSize }, (_, index) => index)
  )
  const types = [
    ...Array.from({ length: rabbitCount }, () => ANIMAL_TYPES.RABBIT),
    ...Array.from({ length: foxCount }, () => ANIMAL_TYPES.FOX),
  ]

  return shuffle(types)
    .slice(0, cells.length)
    .map((type, index) => ({
      id: index + 1,
      type,
      x: cells[index] % gridSize,
      y: Math.floor(cells[index] / gridSize),
      hunger: 0,
      cooldown: 0,
      age: NEWBORN_TURNS,
    }))
}

export function moveAnimals(animals, gridSize) {
  const occupied = new Set(animals.map((a) => positionKey(a.x, a.y)))

  return animals.map((animal) => {
    const freeCells = DIRECTIONS.map(([dx, dy]) => [
      wrap(animal.x + dx, gridSize),
      wrap(animal.y + dy, gridSize),
    ]).filter(([x, y]) => !occupied.has(positionKey(x, y)))

    if (freeCells.length === 0) {
      return animal
    }

    occupied.delete(positionKey(animal.x, animal.y))
    const [x, y] = freeCells[Math.floor(Math.random() * freeCells.length)]
    occupied.add(positionKey(x, y))

    return { ...animal, x, y }
  })
}
