import { useEffect, useRef } from "react"
import { CHART_COLORS } from "../constants/simulationConfig"
import "./PopulationChart.css"

const SERIES = [
  { key: "rabbits", label: "Conejos", color: CHART_COLORS.RABBIT, max: "count" },
  { key: "foxes", label: "Zorros", color: CHART_COLORS.FOX, max: "count" },
  {
    key: "grassPercent",
    label: "Hierba %",
    color: CHART_COLORS.GRASS,
    max: "percent",
  },
]

const PAD = { top: 16, right: 76, bottom: 24, left: 38 }
const LABEL_GAP = 13

const drawTooltip = (ctx, point, guideX, width) => {
  const rows = [
    { label: "Conejos", value: point.rabbits, color: CHART_COLORS.RABBIT },
    { label: "Zorros", value: point.foxes, color: CHART_COLORS.FOX },
    {
      label: "Hierba",
      value: `${point.grassPercent}%`,
      color: CHART_COLORS.GRASS,
    },
  ]
  const boxWidth = 130
  const rowHeight = 15
  const boxHeight = 30 + rows.length * rowHeight
  const boxX = guideX + 12 + boxWidth < width ? guideX + 12 : guideX - 12 - boxWidth
  const boxY = PAD.top + 6

  ctx.fillStyle = CHART_COLORS.SURFACE
  ctx.fillRect(boxX, boxY, boxWidth, boxHeight)
  ctx.strokeStyle = CHART_COLORS.GRID
  ctx.lineWidth = 1
  ctx.strokeRect(boxX, boxY, boxWidth, boxHeight)

  ctx.fillStyle = CHART_COLORS.MUTED
  ctx.fillText(`Paso ${point.turn}`, boxX + 10, boxY + 18)

  rows.forEach((row, index) => {
    const y = boxY + 34 + index * rowHeight
    ctx.fillStyle = row.color
    ctx.fillRect(boxX + 10, y - 5, 8, 2)
    ctx.fillStyle = CHART_COLORS.TEXT
    ctx.fillText(`${row.label} ${row.value}`, boxX + 24, y)
  })
}

export default function PopulationChart({ history }) {
  const containerRef = useRef(null)
  const canvasRef = useRef(null)
  const historyRef = useRef(history)
  const hoverRef = useRef(null)
  const layoutRef = useRef({ xs: [], sampled: [] })

  const draw = () => {
    const container = containerRef.current
    const canvas = canvasRef.current
    const data = historyRef.current
    const width = container.clientWidth
    const height = container.clientHeight

    if (!width || !height) {
      return
    }

    const dpr = window.devicePixelRatio || 1
    canvas.width = width * dpr
    canvas.height = height * dpr

    const ctx = canvas.getContext("2d")
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, width, height)

    const plotWidth = width - PAD.left - PAD.right
    const plotHeight = height - PAD.top - PAD.bottom

    ctx.strokeStyle = CHART_COLORS.GRID
    ctx.lineWidth = 1
    for (let i = 0; i <= 4; i += 1) {
      const y = PAD.top + (plotHeight * i) / 4
      ctx.beginPath()
      ctx.moveTo(PAD.left, y)
      ctx.lineTo(PAD.left + plotWidth, y)
      ctx.stroke()
    }

    ctx.font = '11px "Archivo", sans-serif'

    if (data.length > 1) {
      let maxAnimals = 10
      for (const point of data) {
        maxAnimals = Math.max(maxAnimals, point.rabbits, point.foxes)
      }

      const stride = Math.max(1, Math.ceil(data.length / plotWidth))
      const sampled = []
      for (let i = 0; i < data.length; i += stride) {
        sampled.push(data[i])
      }
      if (sampled[sampled.length - 1] !== data[data.length - 1]) {
        sampled.push(data[data.length - 1])
      }

      const xs = sampled.map(
        (_, index) =>
          PAD.left + (plotWidth * index) / Math.max(sampled.length - 1, 1)
      )
      layoutRef.current = { xs, sampled }

      const scaleOf = (serie) => (serie.max === "percent" ? 100 : maxAnimals)
      const toY = (value, scale) =>
        PAD.top + plotHeight - (plotHeight * value) / scale

      for (const serie of SERIES) {
        const scale = scaleOf(serie)
        ctx.strokeStyle = serie.color
        ctx.lineWidth = 1.5
        ctx.beginPath()
        for (let i = 0; i < sampled.length; i += 1) {
          const y = toY(sampled[i][serie.key], scale)
          if (i === 0) {
            ctx.moveTo(xs[i], y)
          } else {
            ctx.lineTo(xs[i], y)
          }
        }
        ctx.stroke()
      }

      const hover = hoverRef.current
      const hoverPoint = hover !== null ? sampled[hover] : null

      if (hoverPoint) {
        ctx.strokeStyle = CHART_COLORS.MUTED
        ctx.globalAlpha = 0.4
        ctx.beginPath()
        ctx.moveTo(xs[hover], PAD.top)
        ctx.lineTo(xs[hover], PAD.top + plotHeight)
        ctx.stroke()
        ctx.globalAlpha = 1
      }

      const last = sampled[sampled.length - 1]
      const lastX = xs[xs.length - 1]
      const endLabels = SERIES.map((serie) => ({
        ...serie,
        y: toY(last[serie.key], scaleOf(serie)),
      })).sort((a, b) => a.y - b.y)

      for (let i = 1; i < endLabels.length; i += 1) {
        if (endLabels[i].y - endLabels[i - 1].y < LABEL_GAP) {
          endLabels[i].y = endLabels[i - 1].y + LABEL_GAP
        }
      }

      for (const label of endLabels) {
        const valueY = toY(last[label.key], scaleOf(label))
        ctx.fillStyle = label.color
        ctx.beginPath()
        ctx.arc(lastX, valueY, 2.5, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillText(
          label.label,
          lastX + 8,
          Math.min(label.y, PAD.top + plotHeight + 4) + 4
        )
      }

      if (hoverPoint) {
        for (const serie of SERIES) {
          ctx.fillStyle = serie.color
          ctx.beginPath()
          ctx.arc(
            xs[hover],
            toY(hoverPoint[serie.key], scaleOf(serie)),
            3,
            0,
            Math.PI * 2
          )
          ctx.fill()
        }
        drawTooltip(ctx, hoverPoint, xs[hover], width)
      }

      ctx.fillStyle = CHART_COLORS.MUTED
      ctx.fillText(String(maxAnimals), 6, PAD.top + 4)
      ctx.fillText(String(data[0].turn), PAD.left, height - 6)
      ctx.fillText(
        String(data[data.length - 1].turn),
        PAD.left + plotWidth - 24,
        height - 6
      )
    } else {
      layoutRef.current = { xs: [], sampled: [] }
      ctx.fillStyle = CHART_COLORS.EMPTY
      ctx.fillText(
        "La serie aparecerá cuando avance la simulación.",
        PAD.left,
        PAD.top + plotHeight / 2
      )
    }
  }

  const handleMouseMove = (event) => {
    const { xs } = layoutRef.current
    if (!xs.length) {
      return
    }

    const rect = canvasRef.current.getBoundingClientRect()
    const x = event.clientX - rect.left
    let nearest = 0
    let nearestDistance = Infinity
    for (let i = 0; i < xs.length; i += 1) {
      const distance = Math.abs(xs[i] - x)
      if (distance < nearestDistance) {
        nearestDistance = distance
        nearest = i
      }
    }

    hoverRef.current = nearest
    draw()
  }

  const handleMouseLeave = () => {
    hoverRef.current = null
    draw()
  }

  useEffect(() => {
    historyRef.current = history
    draw()
  })

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      draw()
    })
    observer.observe(containerRef.current)

    let cancelled = false
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        if (!cancelled) {
          draw()
        }
      })
    }

    return () => {
      cancelled = true
      observer.disconnect()
    }
  }, [])

  return (
    <figure className="population-chart">
      <div className="population-chart__plot" ref={containerRef}>
        <canvas
          className="population-chart__canvas"
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          aria-label="Gráfica de poblaciones y hierba en el tiempo"
          role="img"
        />
      </div>
      <figcaption className="population-chart__caption">
        Fig. 2. Poblaciones y hierba por turno.
      </figcaption>
    </figure>
  )
}
