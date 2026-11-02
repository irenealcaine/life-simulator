export const ANIMAL_TYPES = {
  RABBIT: "rabbit",
  FOX: "fox",
}

export const ANIMAL_COLORS = {
  [ANIMAL_TYPES.RABBIT]: "#e8e2d2",
  [ANIMAL_TYPES.FOX]: "#c2622f",
}

export const NEWBORN_TURNS = 5

export const NEWBORN_COLORS = {
  [ANIMAL_TYPES.RABBIT]: "#a29a8a",
  [ANIMAL_TYPES.FOX]: "#996744",
}

export const GROUND_COLORS = {
  FOOD: "#3a5c42",
  EATEN: "#3f2c1d",
  HATCH: "#5c402b",
}

export const CHART_COLORS = {
  RABBIT: ANIMAL_COLORS[ANIMAL_TYPES.RABBIT],
  FOX: ANIMAL_COLORS[ANIMAL_TYPES.FOX],
  GRASS: "#6fae7f",
  GRID: "#2e3328",
  MUTED: "#9aa38f",
  EMPTY: "#6f7566",
  SURFACE: "#1a1d16",
  TEXT: "#e8e2d2",
}

export const DEFAULT_SETTINGS = {
  gridSize: 50,
  rabbitCount: 425,
  foxCount: 60,
  duration: 0,
  stepIntervalMs: 500,
  foodRegrowthTurns: 5,
  rabbitStarvationTurns: 4,
  initialFoodCoverage: 100,
  foxHuntSuccessRate: 60,
  foxStarvationTurns: 15,
  rabbitReproductionRate: 50,
  foxReproductionRate: 40,
  reproductionRadius: 1,
  gestationTurns: 1,
}

export const SETTINGS_LIMITS = {
  gridSize: { min: 10, max: 200 },
  animalCount: { min: 0 },
  duration: { min: 0, max: 3600 },
  stepIntervalMs: { min: 100, max: 10000 },
  foodRegrowthTurns: { min: 1, max: 100 },
  rabbitStarvationTurns: { min: 1, max: 100 },
  initialFoodCoverage: { min: 0, max: 100 },
  foxHuntSuccessRate: { min: 0, max: 100 },
  foxStarvationTurns: { min: 1, max: 100 },
  rabbitReproductionRate: { min: 0, max: 100 },
  foxReproductionRate: { min: 0, max: 100 },
  reproductionRadius: { min: 1, max: 10 },
  gestationTurns: { min: 1, max: 100 },
}
