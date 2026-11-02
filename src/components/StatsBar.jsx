import { ANIMAL_TYPES } from "../constants/simulationConfig"
import "./StatsBar.css"

export default function StatsBar({ animals, food, stepCount }) {
  const rabbitCount = animals.filter(
    (animal) => animal.type === ANIMAL_TYPES.RABBIT
  ).length
  const foxCount = animals.filter(
    (animal) => animal.type === ANIMAL_TYPES.FOX
  ).length
  const grassCells = food.reduce(
    (count, value) => count + (value === 0 ? 1 : 0),
    0
  )
  const grassPercent = food.length
    ? Math.round((grassCells / food.length) * 100)
    : 0

  const stats = [
    { label: "Conejos", value: rabbitCount },
    { label: "Zorros", value: foxCount },
    { label: "Paso", value: stepCount },
    { label: "% de hierba", value: `${grassPercent}%` },
  ]

  return (
    <section className="stats-bar" aria-label="Estado de la simulación">
      {stats.map((stat) => (
        <div className="stats-bar__item" key={stat.label}>
          <span className="stats-bar__label">{stat.label}</span>
          <span className="stats-bar__value">{stat.value}</span>
        </div>
      ))}
    </section>
  )
}
