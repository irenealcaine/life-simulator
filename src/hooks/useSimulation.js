import { useCallback, useEffect, useRef, useState } from "react"
import { ANIMAL_TYPES, DEFAULT_SETTINGS } from "../constants/simulationConfig"
import { createFoodGrid, regrowFood, applyFeeding } from "../utils/food"
import { applyHunting } from "../utils/hunt"
import { createAnimals, moveAnimals } from "../utils/movement"
import { applyReproduction } from "../utils/reproduction"
import { loadSettings, saveSettings } from "../utils/storage"

const MAX_HISTORY = 10000

const createWorld = (settings) => ({
  animals: createAnimals(
    settings.gridSize,
    settings.rabbitCount,
    settings.foxCount
  ),
  food: createFoodGrid(
    settings.gridSize,
    settings.initialFoodCoverage,
    settings.foodRegrowthTurns
  ),
})

export default function useSimulation() {
  const [settings, setSettings] = useState(() => loadSettings(DEFAULT_SETTINGS))
  const [world, setWorld] = useState(() => createWorld(settings))
  const [isRunning, setIsRunning] = useState(false)
  const [hasEnded, setHasEnded] = useState(false)
  const [stepCount, setStepCount] = useState(0)
  const [history, setHistory] = useState([])
  const stepCountRef = useRef(0)
  const lastWorldRef = useRef(null)

  const maxSteps =
    settings.duration > 0
      ? Math.floor((settings.duration * 1000) / settings.stepIntervalMs)
      : Infinity

  useEffect(() => {
    if (!isRunning) {
      return undefined
    }

    const id = setInterval(() => {
      setWorld((current) => {
        const food = regrowFood(current.food)
        const animals = moveAnimals(current.animals, settings.gridSize)
        const fed = applyFeeding(animals, food, settings)
        const hunted = applyHunting(fed.animals, settings)
        return {
          animals: applyReproduction(hunted, settings),
          food: fed.food,
        }
      })
      stepCountRef.current += 1
      setStepCount(stepCountRef.current)

      if (stepCountRef.current >= maxSteps) {
        setIsRunning(false)
        setHasEnded(true)
      }
    }, settings.stepIntervalMs)

    return () => clearInterval(id)
  }, [isRunning, settings, maxSteps])

  useEffect(() => {
    if (lastWorldRef.current === world) {
      return
    }
    lastWorldRef.current = world

    const rabbits = world.animals.filter(
      (a) => a.type === ANIMAL_TYPES.RABBIT
    ).length
    const foxes = world.animals.filter(
      (a) => a.type === ANIMAL_TYPES.FOX
    ).length
    const grassCells = world.food.reduce(
      (count, value) => count + (value === 0 ? 1 : 0),
      0
    )
    const grassPercent = world.food.length
      ? Math.round((grassCells / world.food.length) * 100)
      : 0

    setHistory((current) => {
      const next = [
        ...current,
        { turn: stepCountRef.current, rabbits, foxes, grassPercent },
      ]
      return next.length > MAX_HISTORY
        ? next.slice(next.length - MAX_HISTORY)
        : next
    })
  }, [world])

  const start = useCallback(() => setIsRunning(true), [])

  const pause = useCallback(() => setIsRunning(false), [])

  const applySettings = useCallback((nextSettings) => {
    stepCountRef.current = 0
    setStepCount(0)
    setHistory([])
    setIsRunning(false)
    setHasEnded(false)
    saveSettings(nextSettings)
    setSettings(nextSettings)
    setWorld(createWorld(nextSettings))
  }, [])

  return {
    animals: world.animals,
    food: world.food,
    history,
    settings,
    isRunning,
    hasEnded,
    stepCount,
    start,
    pause,
    applySettings,
  }
}
