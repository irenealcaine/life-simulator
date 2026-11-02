import { useEffect, useRef } from "react"
import { CHART_COLORS } from "../constants/simulationConfig"
import "./PhaseChart.css"

const PAD = { top: 16, right: 18, bottom: 30, left: 42 }
const POINT_LABEL_WIDTH = 96

export default function PhaseChart({ history }) {
  const containerRef = useRef(null)
  const canvasRef = useRef(null)
  const historyRef = useRef(history)

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

    const side = Math.min(
      width - PAD.left - PAD.right,
      height - PAD.top - PAD.bottom
    )
    const plotLeft = PAD.left + (width - PAD.left - PAD.right - side) / 2
    const plotTop = PAD.top + (height - PAD.top - PAD.bottom - side) / 2
    const plotRight = plotLeft + side
    const plotBottom = plotTop + side

    ctx.strokeStyle = CHART_COLORS.GRID
    ctx.lineWidth = 1
    for (let i = 0; i <= 4; i += 1) {
      const y = plotTop + (side * i) / 4
      ctx.beginPath()
      ctx.moveTo(plotLeft, y)
      ctx.lineTo(plotRight, y)
      ctx.stroke()
    }

    ctx.font = '11px "Archivo", sans-serif'
    ctx.fillStyle = CHART_COLORS.MUTED

    if (data.length > 1) {
      let maxRabbits = 10
      let maxFoxes = 10
      for (const point of data) {
        maxRabbits = Math.max(maxRabbits, point.rabbits)
        maxFoxes = Math.max(maxFoxes, point.foxes)
      }

      const stride = Math.max(1, Math.ceil(data.length / side))
      const sampled = []
      for (let i = 0; i < data.length; i += stride) {
        sampled.push(data[i])
      }
      if (sampled[sampled.length - 1] !== data[data.length - 1]) {
        sampled.push(data[data.length - 1])
      }

      const toX = (point) => plotLeft + (side * point.rabbits) / maxRabbits
      const toY = (point) => plotBottom - (side * point.foxes) / maxFoxes

      for (let i = 1; i < sampled.length; i += 1) {
        ctx.globalAlpha = 0.15 + (0.85 * i) / sampled.length
        ctx.strokeStyle = CHART_COLORS.RABBIT
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.moveTo(toX(sampled[i - 1]), toY(sampled[i - 1]))
        ctx.lineTo(toX(sampled[i]), toY(sampled[i]))
        ctx.stroke()
      }
      ctx.globalAlpha = 1

      const last = sampled[sampled.length - 1]
      const lastX = toX(last)
      const lastY = toY(last)

      ctx.fillStyle = CHART_COLORS.FOX
      ctx.beginPath()
      ctx.arc(lastX, lastY, 3.5, 0, Math.PI * 2)
      ctx.fill()

      const flipLeft = lastX + POINT_LABEL_WIDTH > plotRight
      ctx.fillStyle = CHART_COLORS.MUTED
      ctx.textAlign = flipLeft ? "right" : "left"
      const offsetX = flipLeft ? -10 : 10
      ctx.fillText(`${last.rabbits} conejos`, lastX + offsetX, lastY - 6)
      ctx.fillText(`${last.foxes} zorros`, lastX + offsetX, lastY + 12)
      ctx.textAlign = "left"

      ctx.fillStyle = CHART_COLORS.MUTED
      ctx.fillText(String(maxFoxes), 6, plotTop + 4)
      ctx.textAlign = "right"
      ctx.fillText(String(maxRabbits), plotRight, height - 8)
      ctx.textAlign = "left"
    } else {
      ctx.fillStyle = CHART_COLORS.EMPTY
      ctx.fillText(
        "Aparecerá cuando avance la simulación.",
        plotLeft,
        plotTop + side / 2
      )
    }

    ctx.fillStyle = CHART_COLORS.MUTED
    ctx.textAlign = "center"
    ctx.fillText("Conejos", plotLeft + side / 2, height - 8)
    ctx.save()
    ctx.translate(12, plotTop + side / 2)
    ctx.rotate(-Math.PI / 2)
    ctx.fillText("Zorros", 0, 0)
    ctx.restore()
    ctx.textAlign = "left"
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
    <figure className="phase-chart">
      <div className="phase-chart__plot" ref={containerRef}>
        <canvas
          className="phase-chart__canvas"
          ref={canvasRef}
          aria-label="Retrato de fase de conejos frente a zorros"
          role="img"
        />
      </div>
      <figcaption className="phase-chart__caption">
        Fig. 3. Retrato de fase: conejos frente a zorros.
      </figcaption>
    </figure>
  )
}
