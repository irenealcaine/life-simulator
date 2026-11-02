import { useEffect, useRef } from "react"
import {
  ANIMAL_COLORS,
  ANIMAL_TYPES,
  GROUND_COLORS,
  NEWBORN_COLORS,
  NEWBORN_TURNS,
} from "../constants/simulationConfig"
import "./SimulatorBoard.css"

const MIN_HATCH_CELL = 6
const HALO_COLOR = "rgba(18, 20, 16, 0.5)"

const DRAW_GROUPS = [
  { type: ANIMAL_TYPES.RABBIT, newborn: false },
  { type: ANIMAL_TYPES.RABBIT, newborn: true },
  { type: ANIMAL_TYPES.FOX, newborn: false },
  { type: ANIMAL_TYPES.FOX, newborn: true },
]

const segmentPosition = (segment, progress, span) => {
  let dx = segment.x - segment.fromX
  let dy = segment.y - segment.fromY
  if (Math.abs(dx) > 1) {
    dx = dx > 0 ? dx - span : dx + span
  }
  if (Math.abs(dy) > 1) {
    dy = dy > 0 ? dy - span : dy + span
  }
  return {
    x: (segment.fromX + dx * progress + span) % span,
    y: (segment.fromY + dy * progress + span) % span,
  }
}

export default function SimulatorBoard({
  animals,
  food,
  gridSize,
  stepIntervalMs,
}) {
  const containerRef = useRef(null)
  const canvasRef = useRef(null)
  const groundRef = useRef(null)
  const segmentsRef = useRef([])
  const positionsRef = useRef(new Map())
  const tickTimeRef = useRef(0)
  const sizeRef = useRef(0)
  const gridSizeRef = useRef(gridSize)
  const intervalRef = useRef(stepIntervalMs)
  const foodRef = useRef(food)
  const reducedMotionRef = useRef(false)

  const drawGround = () => {
    const size = sizeRef.current
    if (!size) {
      return
    }

    const dpr = window.devicePixelRatio || 1
    let ground = groundRef.current
    if (!ground) {
      ground = document.createElement("canvas")
      groundRef.current = ground
    }
    ground.width = size * dpr
    ground.height = size * dpr

    const ctx = ground.getContext("2d")
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.fillStyle = GROUND_COLORS.FOOD
    ctx.fillRect(0, 0, size, size)

    const cell = size / gridSizeRef.current
    ctx.fillStyle = GROUND_COLORS.EATEN
    for (let index = 0; index < foodRef.current.length; index += 1) {
      if (foodRef.current[index] > 0) {
        const x = index % gridSizeRef.current
        const y = Math.floor(index / gridSizeRef.current)
        ctx.fillRect(x * cell, y * cell, Math.ceil(cell), Math.ceil(cell))
      }
    }

    if (cell >= MIN_HATCH_CELL) {
      ctx.strokeStyle = GROUND_COLORS.HATCH
      ctx.lineWidth = 1
      ctx.beginPath()
      for (let index = 0; index < foodRef.current.length; index += 1) {
        if (foodRef.current[index] > 0) {
          const x = index % gridSizeRef.current
          const y = Math.floor(index / gridSizeRef.current)
          ctx.moveTo(x * cell, y * cell + cell)
          ctx.lineTo(x * cell + cell, y * cell)
        }
      }
      ctx.stroke()
    }
  }

  const drawFrame = () => {
    const size = sizeRef.current
    if (!size) {
      return
    }

    const dpr = window.devicePixelRatio || 1
    const ctx = canvasRef.current.getContext("2d")
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    if (groundRef.current) {
      ctx.drawImage(groundRef.current, 0, 0, size, size)
    }

    const cell = size / gridSizeRef.current
    const radius = Math.max(cell * 0.35, 1)
    const haloRadius = radius + Math.min(1, radius * 0.35)
    const progress = reducedMotionRef.current
      ? 1
      : Math.min(
          Math.max(
            (performance.now() - tickTimeRef.current) / intervalRef.current,
            0
          ),
          1
        )
    const span = gridSizeRef.current
    const segments = segmentsRef.current

    ctx.fillStyle = HALO_COLOR
    ctx.beginPath()
    for (const segment of segments) {
      const position = segmentPosition(segment, progress, span)
      const cx = (position.x + 0.5) * cell
      const cy = (position.y + 0.5) * cell
      ctx.moveTo(cx + haloRadius, cy)
      ctx.arc(cx, cy, haloRadius, 0, Math.PI * 2)
    }
    ctx.fill()

    for (const group of DRAW_GROUPS) {
      ctx.fillStyle = group.newborn
        ? NEWBORN_COLORS[group.type]
        : ANIMAL_COLORS[group.type]
      ctx.beginPath()
      for (const segment of segments) {
        if (segment.type !== group.type) {
          continue
        }
        if ((segment.age < NEWBORN_TURNS) !== group.newborn) {
          continue
        }
        const position = segmentPosition(segment, progress, span)
        const cx = (position.x + 0.5) * cell
        const cy = (position.y + 0.5) * cell
        ctx.moveTo(cx + radius, cy)
        ctx.arc(cx, cy, radius, 0, Math.PI * 2)
      }
      ctx.fill()
    }
  }

  const resize = () => {
    const canvas = canvasRef.current
    const container = containerRef.current
    const size = container.clientWidth
    const dpr = window.devicePixelRatio || 1

    canvas.width = size * dpr
    canvas.height = size * dpr
    sizeRef.current = size
    drawGround()
  }

  useEffect(() => {
    intervalRef.current = stepIntervalMs
  }, [stepIntervalMs])

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => {
      reducedMotionRef.current = query.matches
    }
    update()
    query.addEventListener("change", update)
    return () => query.removeEventListener("change", update)
  }, [])

  useEffect(() => {
    const positions = positionsRef.current
    segmentsRef.current = animals.map((animal) => {
      const from = positions.get(animal.id)
      return {
        ...animal,
        fromX: from ? from.x : animal.x,
        fromY: from ? from.y : animal.y,
      }
    })
    positionsRef.current = new Map(
      animals.map((a) => [a.id, { x: a.x, y: a.y }])
    )
    tickTimeRef.current = performance.now()
  }, [animals])

  useEffect(() => {
    foodRef.current = food
    gridSizeRef.current = gridSize
    drawGround()
  }, [food, gridSize])

  useEffect(() => {
    const observer = new ResizeObserver(resize)
    observer.observe(containerRef.current)
    resize()

    let frame
    const loop = () => {
      drawFrame()
      frame = requestAnimationFrame(loop)
    }
    frame = requestAnimationFrame(loop)

    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <figure className="simulator-board">
      <div className="simulator-board__frame" ref={containerRef}>
        <canvas
          className="simulator-board__canvas"
          ref={canvasRef}
          aria-label="Grid de la simulación"
          role="img"
        />
      </div>
      <figcaption className="simulator-board__caption">
        Fig. 1. Ecosistema depredador-presa sobre retícula toroidal: cada punto
        es un individuo en movimiento y cada celda, el terreno con hierba o ya
        comido.
      </figcaption>
    </figure>
  )
}
