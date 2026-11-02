import { SETTINGS_LIMITS } from "../constants/simulationConfig"

export function validateSettings(settings) {
  const {
    gridSize,
    rabbitCount,
    foxCount,
    duration,
    stepIntervalMs,
    foodRegrowthTurns,
    rabbitStarvationTurns,
    initialFoodCoverage,
    foxHuntSuccessRate,
    foxStarvationTurns,
    rabbitReproductionRate,
    foxReproductionRate,
    reproductionRadius,
    gestationTurns,
  } = settings
  const limits = SETTINGS_LIMITS

  if (
    !Number.isInteger(gridSize) ||
    gridSize < limits.gridSize.min ||
    gridSize > limits.gridSize.max
  ) {
    return `El tamaño del grid debe ser un entero entre ${limits.gridSize.min} y ${limits.gridSize.max}`
  }

  if (
    !Number.isInteger(rabbitCount) ||
    !Number.isInteger(foxCount) ||
    rabbitCount < limits.animalCount.min ||
    foxCount < limits.animalCount.min
  ) {
    return "Las cantidades de animales deben ser números enteros mayores o iguales a 0"
  }

  if (rabbitCount + foxCount > gridSize * gridSize) {
    return `El total de animales no puede superar las ${gridSize * gridSize} casillas del grid`
  }

  if (
    !Number.isInteger(duration) ||
    duration < limits.duration.min ||
    duration > limits.duration.max
  ) {
    return `La duración debe ser un número entero de segundos entre ${limits.duration.min} y ${limits.duration.max} (0 = indefinida)`
  }

  if (
    !Number.isFinite(stepIntervalMs) ||
    stepIntervalMs < limits.stepIntervalMs.min ||
    stepIntervalMs > limits.stepIntervalMs.max
  ) {
    return `El intervalo por paso debe estar entre ${limits.stepIntervalMs.min / 1000} y ${limits.stepIntervalMs.max / 1000} segundos`
  }

  if (
    !Number.isInteger(foodRegrowthTurns) ||
    foodRegrowthTurns < limits.foodRegrowthTurns.min ||
    foodRegrowthTurns > limits.foodRegrowthTurns.max
  ) {
    return `Los turnos de renovación del alimento deben ser un número entero entre ${limits.foodRegrowthTurns.min} y ${limits.foodRegrowthTurns.max}`
  }

  if (
    !Number.isInteger(rabbitStarvationTurns) ||
    rabbitStarvationTurns < limits.rabbitStarvationTurns.min ||
    rabbitStarvationTurns > limits.rabbitStarvationTurns.max
  ) {
    return `Los turnos sin alimento hasta morir deben ser un número entero entre ${limits.rabbitStarvationTurns.min} y ${limits.rabbitStarvationTurns.max}`
  }

  if (
    !Number.isInteger(initialFoodCoverage) ||
    initialFoodCoverage < limits.initialFoodCoverage.min ||
    initialFoodCoverage > limits.initialFoodCoverage.max
  ) {
    return `La cobertura inicial de alimento debe ser un número entero entre ${limits.initialFoodCoverage.min} y ${limits.initialFoodCoverage.max}`
  }

  if (
    !Number.isInteger(foxHuntSuccessRate) ||
    foxHuntSuccessRate < limits.foxHuntSuccessRate.min ||
    foxHuntSuccessRate > limits.foxHuntSuccessRate.max
  ) {
    return `La probabilidad de caza del zorro debe ser un número entero entre ${limits.foxHuntSuccessRate.min} y ${limits.foxHuntSuccessRate.max}`
  }

  if (
    !Number.isInteger(foxStarvationTurns) ||
    foxStarvationTurns < limits.foxStarvationTurns.min ||
    foxStarvationTurns > limits.foxStarvationTurns.max
  ) {
    return `Los turnos sin comer hasta morir de los zorros deben ser un número entero entre ${limits.foxStarvationTurns.min} y ${limits.foxStarvationTurns.max}`
  }

  if (
    !Number.isInteger(rabbitReproductionRate) ||
    rabbitReproductionRate < limits.rabbitReproductionRate.min ||
    rabbitReproductionRate > limits.rabbitReproductionRate.max
  ) {
    return `La probabilidad de reproducción de conejos debe ser un número entero entre ${limits.rabbitReproductionRate.min} y ${limits.rabbitReproductionRate.max}`
  }

  if (
    !Number.isInteger(foxReproductionRate) ||
    foxReproductionRate < limits.foxReproductionRate.min ||
    foxReproductionRate > limits.foxReproductionRate.max
  ) {
    return `La probabilidad de reproducción de zorros debe ser un número entero entre ${limits.foxReproductionRate.min} y ${limits.foxReproductionRate.max}`
  }

  if (
    !Number.isInteger(gestationTurns) ||
    gestationTurns < limits.gestationTurns.min ||
    gestationTurns > limits.gestationTurns.max
  ) {
    return `Los turnos de gestación deben ser un número entero entre ${limits.gestationTurns.min} y ${limits.gestationTurns.max}`
  }

  if (
    !Number.isInteger(reproductionRadius) ||
    reproductionRadius < limits.reproductionRadius.min ||
    reproductionRadius > limits.reproductionRadius.max
  ) {
    return `El radio de reproducción debe ser un número entero entre ${limits.reproductionRadius.min} y ${limits.reproductionRadius.max}`
  }

  return ""
}
