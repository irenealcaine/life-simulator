import ControlPanel from "./components/ControlPanel"
import Footer from "./components/Footer"
import PhaseChart from "./components/PhaseChart"
import PopulationChart from "./components/PopulationChart"
import SimulatorBoard from "./components/SimulatorBoard"
import SpeciesLegend from "./components/SpeciesLegend"
import StatsBar from "./components/StatsBar"
import useSimulation from "./hooks/useSimulation"
import "./App.css"

export default function App() {
  const {
    animals,
    food,
    history,
    settings,
    isRunning,
    hasEnded,
    stepCount,
    start,
    pause,
    applySettings,
  } = useSimulation()

  const statusLabel = hasEnded
    ? "Finalizada"
    : isRunning
      ? "En marcha"
      : "Pausado"

  return (
    <div className="app">
      <header className="app__header">
        <div className="app__heading">
          <h1 className="app__title">Life Simulator</h1>
          <p className="app__description">
            Simulador de vida y poblaciones entre zorros y conejos basado en el
            modelo depredador-presa de Lotka-Volterra
          </p>
        </div>

        <p className="app__status">
          <span
            className={
              isRunning
                ? "app__status-dot app__status-dot--running"
                : "app__status-dot"
            }
            aria-hidden="true"
          />
          <span>{statusLabel}</span>
          {hasEnded ? (
            <span className="app__status-hint">
              Pulsa Reiniciar para otra ejecución
            </span>
          ) : null}
        </p>
      </header>

      <main className="app__main">
        <StatsBar animals={animals} food={food} stepCount={stepCount} />

        <div className="app__workspace">
          <div className="app__plate">
            <SpeciesLegend />

            <SimulatorBoard
              animals={animals}
              food={food}
              gridSize={settings.gridSize}
              stepIntervalMs={settings.stepIntervalMs}
            />
          </div>

          <ControlPanel
            settings={settings}
            isRunning={isRunning}
            hasEnded={hasEnded}
            onStart={start}
            onPause={pause}
            onApply={applySettings}
          />
        </div>

        <div className="app__charts">
          <PopulationChart history={history} />
          <PhaseChart history={history} />
        </div>
      </main>

      <Footer />
    </div>
  )
}
