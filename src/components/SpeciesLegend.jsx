import {
  ANIMAL_COLORS,
  ANIMAL_TYPES,
  GROUND_COLORS,
  NEWBORN_COLORS,
} from "../constants/simulationConfig"
import "./SpeciesLegend.css"

const ENTRIES = [
  { color: ANIMAL_COLORS[ANIMAL_TYPES.RABBIT], label: "Conejo", shape: "dot" },
  {
    color: NEWBORN_COLORS[ANIMAL_TYPES.RABBIT],
    label: "Cría de conejo",
    shape: "dot",
  },
  { color: ANIMAL_COLORS[ANIMAL_TYPES.FOX], label: "Zorro", shape: "dot" },
  {
    color: NEWBORN_COLORS[ANIMAL_TYPES.FOX],
    label: "Cría de zorro",
    shape: "dot",
  },
  { color: GROUND_COLORS.FOOD, label: "Hierba", shape: "cell" },
  { color: GROUND_COLORS.EATEN, label: "Terreno comido", shape: "cell" },
]

export default function SpeciesLegend() {
  return (
    <aside className="species-legend" aria-label="Leyenda del tablero">
      <h2 className="species-legend__title">Leyenda</h2>
      <ul className="species-legend__list">
        {ENTRIES.map((entry) => (
          <li className="species-legend__item" key={entry.label}>
            <span
              className={`species-legend__swatch species-legend__swatch--${entry.shape}`}
              style={{ backgroundColor: entry.color }}
              aria-hidden="true"
            />
            {entry.label}
          </li>
        ))}
      </ul>
    </aside>
  )
}
