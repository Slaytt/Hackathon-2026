function App() {
  return (
    // Le fond d'écran de notre OS
    <div style={{ backgroundColor: '#008080', height: '100vh', padding: '50px' }}>

      {/* La magie de XP.css commence ici avec la classe "window" */}
      <div className="window" style={{ width: '350px' }}>

        {/* La barre bleue en haut */}
        <div className="title-bar">
          <div className="title-bar-text">AMU-OS System</div>
          <div className="title-bar-controls">
            <button aria-label="Minimize"></button>
            <button aria-label="Maximize"></button>
            <button aria-label="Close"></button>
          </div>
        </div>

        {/* Le contenu de la fenêtre */}
        <div className="window-body">
          <p>Bienvenue sur AMU-OS ! 🚀</p>
          <p>Le système est prêt pour le hackathon.</p>
          <section className="field-row" style={{ justifyContent: 'flex-end' }}>
            <button>OK</button>
          </section>
        </div>

      </div>

    </div>
  )
}

export default App