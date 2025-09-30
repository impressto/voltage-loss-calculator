import './App.css'
import VoltageCalculator from './components/VoltageCalculator'

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Wire Voltage Loss Calculator</h1>
        <p>Calculate voltage drop for different wire gauges and materials</p>
      </header>
      
      <main>
        <VoltageCalculator />
      </main>
      
      <footer className="app-footer">
        <p>© {new Date().getFullYear()} Wire Voltage Loss Calculator</p>
      </footer>
    </div>
  )
}

export default App
