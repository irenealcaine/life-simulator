import { useCallback, useEffect, useRef, useState } from "react"
import ControlField from "./ControlField"
import { SETTINGS_LIMITS } from "../constants/simulationConfig"
import { validateSettings } from "../utils/settings"
import "./ControlPanel.css"

const initialForm = (settings) => ({
  gridSize: settings.gridSize,
  rabbitCount: settings.rabbitCount,
  foxCount: settings.foxCount,
  duration: settings.duration,
  stepInterval: settings.stepIntervalMs / 1000,
  foodRegrowthTurns: settings.foodRegrowthTurns,
  rabbitStarvationTurns: settings.rabbitStarvationTurns,
  initialFoodCoverage: settings.initialFoodCoverage,
  foxHuntSuccessRate: settings.foxHuntSuccessRate,
  foxStarvationTurns: settings.foxStarvationTurns,
  rabbitReproductionRate: settings.rabbitReproductionRate,
  foxReproductionRate: settings.foxReproductionRate,
  reproductionRadius: settings.reproductionRadius,
  gestationTurns: settings.gestationTurns,
})

const toSettings = (form) => ({
  gridSize: Number(form.gridSize),
  rabbitCount: Number(form.rabbitCount),
  foxCount: Number(form.foxCount),
  duration: Number(form.duration),
  stepIntervalMs: Number(form.stepInterval) * 1000,
  foodRegrowthTurns: Number(form.foodRegrowthTurns),
  rabbitStarvationTurns: Number(form.rabbitStarvationTurns),
  initialFoodCoverage: Number(form.initialFoodCoverage),
  foxHuntSuccessRate: Number(form.foxHuntSuccessRate),
  foxStarvationTurns: Number(form.foxStarvationTurns),
  rabbitReproductionRate: Number(form.rabbitReproductionRate),
  foxReproductionRate: Number(form.foxReproductionRate),
  reproductionRadius: Number(form.reproductionRadius),
  gestationTurns: Number(form.gestationTurns),
})

export default function ControlPanel({
  settings,
  isRunning,
  hasEnded,
  onStart,
  onPause,
  onApply,
}) {
  const [form, setForm] = useState(() => initialForm(settings))
  const [error, setError] = useState("")
  const formRef = useRef(null)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const nextSettings = toSettings(form)
    const message = validateSettings(nextSettings)

    if (message) {
      setError(message)
      return
    }

    setError("")
    onApply(nextSettings)
  }

  const handleStart = useCallback(() => {
    const nextSettings = toSettings(form)
    const message = validateSettings(nextSettings)

    if (message) {
      setError(message)
      return
    }

    setError("")

    const hasChanges = Object.keys(nextSettings).some(
      (key) => nextSettings[key] !== settings[key]
    )
    if (hasEnded || hasChanges) {
      onApply(nextSettings)
    }
    onStart()
  }, [form, settings, hasEnded, onApply, onStart])

  useEffect(() => {
    const handleKeyDown = (event) => {
      const target = event.target
      if (
        !(target instanceof HTMLElement) ||
        target.closest(
          "input, textarea, select, button, a, summary, [contenteditable]"
        )
      ) {
        return
      }

      if (event.key === " " || event.code === "Space") {
        event.preventDefault()
        if (isRunning) {
          onPause()
        } else {
          handleStart()
        }
      } else if (event.key === "r" || event.key === "R") {
        event.preventDefault()
        formRef.current?.requestSubmit()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isRunning, onPause, handleStart])

  return (
    <aside className="control-panel">
      <h2 className="control-panel__title">Controles</h2>

      <form
        className="control-panel__form"
        onSubmit={handleSubmit}
        ref={formRef}
      >
        <div className="control-panel__buttons">
          {isRunning ? (
            <button
              type="button"
              className="control-panel__button control-panel__button--primary"
              onClick={onPause}
              title="Espacio"
            >
              Pausar
            </button>
          ) : (
            <button
              type="button"
              className="control-panel__button control-panel__button--primary"
              onClick={handleStart}
              title="Espacio"
            >
              Empezar
            </button>
          )}
          <button type="submit" className="control-panel__button" title="R">
            Reiniciar
          </button>
        </div>

        {error ? (
          <p className="control-panel__error" role="alert">
            {error}
          </p>
        ) : null}

        <details className="control-panel__section" open>
          <summary className="control-panel__summary">Ajustes básicos</summary>

          <fieldset className="control-panel__group">
            <legend className="control-panel__legend">Simulación</legend>

            <ControlField
              label="Tamaño del grid"
              name="gridSize"
              value={form.gridSize}
              min={SETTINGS_LIMITS.gridSize.min}
              max={SETTINGS_LIMITS.gridSize.max}
              onChange={handleChange}
            />

            <ControlField
              label="Duración (segundos, 0 = indefinida)"
              name="duration"
              value={form.duration}
              min={SETTINGS_LIMITS.duration.min}
              max={SETTINGS_LIMITS.duration.max}
              onChange={handleChange}
            />

            <ControlField
              label="Segundos por paso"
              name="stepInterval"
              value={form.stepInterval}
              min={SETTINGS_LIMITS.stepIntervalMs.min / 1000}
              max={SETTINGS_LIMITS.stepIntervalMs.max / 1000}
              step={0.1}
              onChange={handleChange}
            />
          </fieldset>

          <fieldset className="control-panel__group">
            <legend className="control-panel__legend">Población inicial</legend>

            <ControlField
              label="Conejos"
              name="rabbitCount"
              value={form.rabbitCount}
              min={SETTINGS_LIMITS.animalCount.min}
              onChange={handleChange}
            />

            <ControlField
              label="Zorros"
              name="foxCount"
              value={form.foxCount}
              min={SETTINGS_LIMITS.animalCount.min}
              onChange={handleChange}
            />
          </fieldset>

          <fieldset className="control-panel__group">
            <legend className="control-panel__legend">Terreno</legend>

            <ControlField
              type="range"
              suffix="%"
              label="Cobertura inicial de alimento"
              name="initialFoodCoverage"
              value={form.initialFoodCoverage}
              min={SETTINGS_LIMITS.initialFoodCoverage.min}
              max={SETTINGS_LIMITS.initialFoodCoverage.max}
              onChange={handleChange}
            />
          </fieldset>
        </details>

        <details className="control-panel__section">
          <summary className="control-panel__summary">Ajustes avanzados</summary>

          <fieldset className="control-panel__group">
            <legend className="control-panel__legend">Conejos</legend>

            <ControlField
              type="range"
              suffix="%"
              label="Probabilidad de reproducción"
              name="rabbitReproductionRate"
              value={form.rabbitReproductionRate}
              min={SETTINGS_LIMITS.rabbitReproductionRate.min}
              max={SETTINGS_LIMITS.rabbitReproductionRate.max}
              onChange={handleChange}
            />

            <ControlField
              label="Turnos sin alimento hasta morir"
              name="rabbitStarvationTurns"
              value={form.rabbitStarvationTurns}
              min={SETTINGS_LIMITS.rabbitStarvationTurns.min}
              max={SETTINGS_LIMITS.rabbitStarvationTurns.max}
              onChange={handleChange}
            />
          </fieldset>

          <fieldset className="control-panel__group">
            <legend className="control-panel__legend">Zorros</legend>

            <ControlField
              type="range"
              suffix="%"
              label="Probabilidad de caza"
              name="foxHuntSuccessRate"
              value={form.foxHuntSuccessRate}
              min={SETTINGS_LIMITS.foxHuntSuccessRate.min}
              max={SETTINGS_LIMITS.foxHuntSuccessRate.max}
              onChange={handleChange}
            />

            <ControlField
              type="range"
              suffix="%"
              label="Probabilidad de reproducción"
              name="foxReproductionRate"
              value={form.foxReproductionRate}
              min={SETTINGS_LIMITS.foxReproductionRate.min}
              max={SETTINGS_LIMITS.foxReproductionRate.max}
              onChange={handleChange}
            />

            <ControlField
              label="Turnos sin comer hasta morir"
              name="foxStarvationTurns"
              value={form.foxStarvationTurns}
              min={SETTINGS_LIMITS.foxStarvationTurns.min}
              max={SETTINGS_LIMITS.foxStarvationTurns.max}
              onChange={handleChange}
            />
          </fieldset>

          <fieldset className="control-panel__group">
            <legend className="control-panel__legend">Reproducción</legend>

            <ControlField
              label="Radio de reproducción (casillas)"
              name="reproductionRadius"
              value={form.reproductionRadius}
              min={SETTINGS_LIMITS.reproductionRadius.min}
              max={SETTINGS_LIMITS.reproductionRadius.max}
              onChange={handleChange}
            />

            <ControlField
              label="Turnos de gestación"
              name="gestationTurns"
              value={form.gestationTurns}
              min={SETTINGS_LIMITS.gestationTurns.min}
              max={SETTINGS_LIMITS.gestationTurns.max}
              onChange={handleChange}
            />
          </fieldset>

          <fieldset className="control-panel__group">
            <legend className="control-panel__legend">Terreno</legend>

            <ControlField
              label="Turnos de renovación del alimento"
              name="foodRegrowthTurns"
              value={form.foodRegrowthTurns}
              min={SETTINGS_LIMITS.foodRegrowthTurns.min}
              max={SETTINGS_LIMITS.foodRegrowthTurns.max}
              onChange={handleChange}
            />
          </fieldset>
        </details>
      </form>
    </aside>
  )
}
