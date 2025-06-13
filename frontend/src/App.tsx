import { useState, useRef, useCallback, useEffect } from 'react'
import './App.css'
import { apiService, ServiceAnalysis, ServiceStats } from './services/api'

interface BallPosition {
  x: number
  y: number
}

function App() {
  const [ballPosition, setBallPosition] = useState<BallPosition | null>(null)
  const [serviceResult, setServiceResult] = useState<ServiceAnalysis | null>(null)
  const [stats, setStats] = useState<ServiceStats | null>(null)
  const [loading, setLoading] = useState(false)
  const courtRef = useRef<HTMLDivElement>(null)

  const handleCourtClick = useCallback(async (event: React.MouseEvent<HTMLDivElement>) => {
    if (!courtRef.current || loading) return

    const rect = courtRef.current.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    setBallPosition({ x, y })
    setLoading(true)

    try {
      // Appel à l'API backend pour analyser le service
      const analysis = await apiService.analyzeService(x, y)
      setServiceResult(analysis)
      
      // Récupérer les statistiques mises à jour
      const updatedStats = await apiService.getStats()
      setStats(updatedStats)
    } catch (error) {
      console.error('Erreur lors de l\'analyse du service:', error)
      // Fallback vers le calcul local en cas d'erreur
      const courtWidth = rect.width
      const courtHeight = rect.height
      
      const serviceBoxLeft = courtWidth * 0.5
      const serviceBoxRight = courtWidth * 0.85
      const serviceBoxTop = courtHeight * 0.25
      const serviceBoxBottom = courtHeight * 0.75

      const isValid = 
        x >= serviceBoxLeft && 
        x <= serviceBoxRight && 
        y >= serviceBoxTop && 
        y <= serviceBoxBottom

      let zone = 'Hors service'
      if (isValid) {
        if (y < courtHeight * 0.5) {
          zone = 'Service T (haut)'
        } else {
          zone = 'Service large (bas)'
        }
      }

      setServiceResult({
        isValid,
        zone,
        precision: isValid ? Math.random() * 100 : 0,
        ballPosition: { x, y }
      })
    } finally {
      setLoading(false)
    }
  }, [loading])

  const resetCourt = () => {
    setBallPosition(null)
    setServiceResult(null)
  }

  const resetStats = async () => {
    try {
      await apiService.resetStats()
      const updatedStats = await apiService.getStats()
      setStats(updatedStats)
    } catch (error) {
      console.error('Erreur lors de la réinitialisation des statistiques:', error)
    }
  }

  // Charger les statistiques au démarrage
  useEffect(() => {
    const loadStats = async () => {
      try {
        const initialStats = await apiService.getStats()
        setStats(initialStats)
      } catch (error) {
        console.error('Erreur lors du chargement des statistiques:', error)
      }
    }
    loadStats()
  }, [])

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎾 Analyseur de Service Tennis</h1>
        <p>Cliquez sur le terrain pour placer la balle et analyser le service</p>
      </header>

      <main className="main-content">
        <div className="court-container">
          <div 
            ref={courtRef}
            className="tennis-court"
            onClick={handleCourtClick}
          >
            {/* Lignes du terrain */}
            <div className="court-lines">
              {/* Ligne centrale */}
              <div className="center-line"></div>
              
              {/* Lignes de service */}
              <div className="service-line-left"></div>
              <div className="service-line-right"></div>
              
              {/* Ligne de fond */}
              <div className="baseline"></div>
              
              {/* Lignes latérales */}
              <div className="sideline-left"></div>
              <div className="sideline-right"></div>
              
              {/* Zone de service droite */}
              <div className="service-box-right">
                <div className="service-box-top"></div>
                <div className="service-box-bottom"></div>
              </div>
            </div>

            {/* Balle */}
            {ballPosition && (
              <div 
                className="ball"
                style={{
                  left: ballPosition.x - 8,
                  top: ballPosition.y - 8
                }}
              />
            )}

            {/* Filet */}
            <div className="net"></div>
          </div>

          <div className="controls">
            <button onClick={resetCourt} className="reset-button" disabled={loading}>
              {loading ? 'Analyse...' : 'Effacer'}
            </button>
            <button onClick={resetStats} className="reset-button">
              Réinitialiser Stats
            </button>
          </div>
        </div>

        {/* Résultats */}
        {serviceResult && (
          <div className="results">
            <h2>Résultat du service</h2>
            <div className={`result-status ${serviceResult.isValid ? 'in' : 'out'}`}>
              {serviceResult.isValid ? '✅ SERVICE VALIDE' : '❌ SERVICE FAUTE'}
            </div>
            <div className="result-zone">
              Zone: {serviceResult.zone}
            </div>
            <div className="precision">
              Précision: {Math.round(serviceResult.precision)}%
            </div>
            {ballPosition && (
              <div className="coordinates">
                Position: ({Math.round(ballPosition.x)}, {Math.round(ballPosition.y)})
              </div>
            )}
          </div>
        )}

        {/* Statistiques */}
        {stats && (
          <div className="stats">
            <h2>Statistiques</h2>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-label">Total services:</span>
                <span className="stat-value">{stats.totalServices}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Services valides:</span>
                <span className="stat-value">{stats.validServices}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Fautes:</span>
                <span className="stat-value">{stats.faultServices}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Précision moyenne:</span>
                <span className="stat-value">{Math.round(stats.averagePrecision)}%</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App 