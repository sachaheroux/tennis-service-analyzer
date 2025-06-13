import { useState, useRef, useCallback, useEffect } from 'react'
import './App.css'
import { apiService, ServiceAnalysis, ServiceStats } from './services/api'

interface BallPosition {
  x: number
  y: number
}

type AppMode = 'game' | 'score'

function App() {
  const [mode, setMode] = useState<AppMode>('score')
  const [ballPosition, setBallPosition] = useState<BallPosition | null>(null)
  const [serviceResult, setServiceResult] = useState<ServiceAnalysis | null>(null)
  const [stats, setStats] = useState<ServiceStats | null>(null)
  const [loading, setLoading] = useState(false)
  const courtRef = useRef<HTMLDivElement>(null)

  const handleServiceBoxClick = useCallback(async (event: React.MouseEvent<SVGRectElement>) => {
    if (loading || mode !== 'score') return

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
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
      
      // Zone de service (tout le rectangle)
      const isValid = 
        x >= 10 && 
        x <= courtWidth - 10 && 
        y >= 10 && 
        y <= courtHeight - 10

      let zone = 'Hors service'
      if (isValid) {
        // Diviser en zones T (haut) et large (bas)
        if (y < courtHeight * 0.5) {
          zone = 'Service T'
        } else {
          zone = 'Service large'
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
  }, [loading, mode])

  const handleCourtClick = useCallback(async (event: React.MouseEvent<HTMLDivElement>) => {
    if (!courtRef.current || loading || mode !== 'game') return

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
      
      // Zone de service (tout le rectangle)
      const isValid = 
        x >= 10 && 
        x <= courtWidth - 10 && 
        y >= 10 && 
        y <= courtHeight - 10

      let zone = 'Hors service'
      if (isValid) {
        // Diviser en zones T (haut) et large (bas)
        if (y < courtHeight * 0.5) {
          zone = 'Service T'
        } else {
          zone = 'Service large'
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
  }, [loading, mode])

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
        <div className="header-content">
          <h1>🎾 Tennis Analyzer</h1>
          <div className="mode-selector">
            <select 
              value={mode} 
              onChange={(e) => setMode(e.target.value as AppMode)}
              className="mode-dropdown"
            >
              <option value="score">Score Mode</option>
              <option value="game">Game Mode</option>
            </select>
          </div>
        </div>
      </header>

      <main className="main-content">
        {mode === 'score' && (
          <>
            <div className="court-container">
              <div className="service-box-container">
                <svg 
                  className="service-box" 
                  viewBox="0 0 270 420"
                  preserveAspectRatio="xMidYMid meet"
                >
                  {/* Service box - simple green rectangle with thick border */}
                  <rect
                    x="0"
                    y="0"
                    width="270"
                    height="420"
                    fill="#2d5a27"
                    stroke="#ffffff"
                    strokeWidth="4"
                    onClick={handleServiceBoxClick}
                    style={{ cursor: 'pointer' }}
                  />
                  
                  {/* Balle */}
                  {ballPosition && (
                    <circle
                      cx={ballPosition.x}
                      cy={ballPosition.y}
                      r="8"
                      fill="#ffff00"
                      stroke="#000000"
                      strokeWidth="1"
                    />
                  )}
                </svg>
              </div>

              <div className="controls">
                <button onClick={resetCourt} className="action-button" disabled={loading}>
                  {loading ? 'Analyse...' : 'Effacer'}
                </button>
                <button onClick={resetStats} className="action-button secondary">
                  Reset Stats
                </button>
              </div>
            </div>

            {/* Résultats */}
            {serviceResult && (
              <div className="results">
                <div className={`result-status ${serviceResult.isValid ? 'in' : 'out'}`}>
                  {serviceResult.isValid ? '✅ IN' : '❌ OUT'}
                </div>
                <div className="result-details">
                  <div className="result-zone">
                    {serviceResult.zone}
                  </div>
                  <div className="precision">
                    {Math.round(serviceResult.precision)}% précision
                  </div>
                </div>
              </div>
            )}

            {/* Statistiques */}
            {stats && (
              <div className="stats">
                <h3>Statistiques</h3>
                <div className="stats-grid">
                  <div className="stat-item">
                    <div className="stat-value">{stats.totalServices}</div>
                    <div className="stat-label">Total</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-value">{stats.validServices}</div>
                    <div className="stat-label">Valides</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-value">{stats.faultServices}</div>
                    <div className="stat-label">Fautes</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-value">
                      {stats.totalServices > 0 ? Math.round((stats.validServices / stats.totalServices) * 100) : 0}%
                    </div>
                    <div className="stat-label">Réussite</div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {mode === 'game' && (
          <div className="game-mode">
            <h2>Game Mode</h2>
            <p>Mode jeu en développement...</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default App 