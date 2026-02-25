import { useState, useEffect } from 'react';
import Window from './Window';

function App() {
  const [registry, setRegistry] = useState([]);
  const [openWindows, setOpenWindows] = useState([]);
  const [activeWindowId, setActiveWindowId] = useState(null);

  const [minimizedWindows, setMinimizedWindows] = useState([]);
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);

  useEffect(() => {
    // On garde le son de démarrage, c'est trop cool
    const audio = new Audio('https://www.myinstants.com/media/sounds/windows-xp-startup.mp3');
    audio.play().catch(() => console.log("Cliquez pour le son"));

    fetch('/registry.json')
      .then(res => res.json())
      .then(data => setRegistry(data))
      .catch(err => console.error("Erreur de chargement du registry :", err));
  }, []);

  const openApp = (appId) => {
    if (!openWindows.includes(appId)) {
      setOpenWindows([...openWindows, appId]);
    }
    setMinimizedWindows(minimizedWindows.filter(id => id !== appId));
    setActiveWindowId(appId);
    setIsStartMenuOpen(false);
  };

  const closeApp = (appId) => {
    setOpenWindows(openWindows.filter(id => id !== appId));
    setMinimizedWindows(minimizedWindows.filter(id => id !== appId));
  };

  const toggleTaskbarApp = (appId) => {
    if (activeWindowId === appId && !minimizedWindows.includes(appId)) {
      setMinimizedWindows([...minimizedWindows, appId]);
    } else {
      setMinimizedWindows(minimizedWindows.filter(id => id !== appId));
      setActiveWindowId(appId);
    }
    setIsStartMenuOpen(false);
  };

  return (
    <div
      onClick={() => setIsStartMenuOpen(false)}
      style={{
        backgroundImage: 'url("/background.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      {/* --- LE BUREAU --- */}
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {registry.map((app) => (
          <div
            key={app.id}
            onDoubleClick={() => openApp(app.id)}
            style={{ width: '80px', textAlign: 'center', color: 'white', cursor: 'pointer', textShadow: '2px 2px 4px #000' }}
          >
            {/* Retour aux emojis simples et fluides */}
            <div style={{ fontSize: '35px' }}>
              {app.icon === 'computer' ? '💻' : '📁'}
            </div>
            <div style={{ fontSize: '12px', marginTop: '5px', fontFamily: 'Tahoma, sans-serif', fontWeight: 'bold' }}>{app.name}</div>
          </div>
        ))}
      </div>

      {/* --- LES FENÊTRES OUVERTES --- */}
      {openWindows.map((appId) => {
        const appData = registry.find(a => a.id === appId);
        return (
          <Window
            key={appId}
            app={appData}
            onClose={closeApp}
            onFocus={() => {
              setActiveWindowId(appId);
              setMinimizedWindows(minimizedWindows.filter(id => id !== appId));
            }}
            zIndex={activeWindowId === appId ? 100 : 10}
            isMinimized={minimizedWindows.includes(appId)}
            onMinimize={() => setMinimizedWindows([...minimizedWindows, appId])}
          />
        );
      })}

      {/* --- LE MENU DÉMARRER --- */}
      {isStartMenuOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'absolute', bottom: '40px', left: 0, width: '250px',
            backgroundColor: '#ece9d8', border: '2px solid #0055ea', borderBottom: 'none',
            borderTopRightRadius: '5px', zIndex: 10000, display: 'flex', flexDirection: 'column',
            boxShadow: '2px -2px 5px rgba(0,0,0,0.5)'
          }}
        >
          <div style={{ backgroundColor: '#0055ea', color: 'white', padding: '15px 10px', fontWeight: 'bold', fontSize: '18px', display: 'flex', alignItems: 'center', borderBottom: '2px solid #002f9a' }}>
            <span style={{ fontSize: '24px', marginRight: '10px' }}>👾</span>
            <span style={{ fontFamily: 'Tahoma, sans-serif' }}>AMU System</span>
          </div>
          <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: '5px', backgroundColor: '#fff', height: '100%' }}>
            <div style={{ fontWeight: 'bold', color: '#888', borderBottom: '1px solid #ccc', marginBottom: '5px', fontFamily: 'Tahoma', fontSize: '11px' }}>Applications</div>
            {registry.map(app => (
              <div
                key={app.id}
                onClick={() => openApp(app.id)}
                style={{ padding: '6px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontFamily: 'Tahoma, sans-serif', fontSize: '12px' }}
                onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#316ac5'; e.currentTarget.style.color = '#fff'; }}
                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#000'; }}
              >
                <span style={{ fontSize: '16px' }}>🚀</span>
                {app.name}
              </div>
            ))}
          </div>
          <div style={{ backgroundColor: '#0055ea', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '10px', borderTop: '1px solid #002f9a' }}>
            <span style={{ color: 'white', fontSize: '11px', fontFamily: 'Tahoma', cursor: 'pointer' }}>Éteindre...</span>
          </div>
        </div>
      )}

      {/* --- LA BARRE DES TÂCHES (Style XP conservé) --- */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '30px',
          background: 'linear-gradient(to bottom, #245edb 0%, #1941a5 100%)',
          borderTop: '1px solid #3f82f3', display: 'flex', alignItems: 'center', padding: '0', zIndex: 9999,
        }}
      >
        <button
          onClick={() => setIsStartMenuOpen(!isStartMenuOpen)}
          style={{
            fontWeight: 'bold', height: '100%', padding: '0 10px 0 5px', display: 'flex', alignItems: 'center', gap: '4px',
            background: 'linear-gradient(to bottom, #3c863c 0%, #265e26 100%)',
            border: 'none', borderRight: '1px solid #173e17', color: 'white', fontFamily: 'Tahoma, sans-serif', fontSize: '13px',
            boxShadow: isStartMenuOpen ? 'inset 1px 1px 2px rgba(0,0,0,0.6)' : 'inset 1px 1px 1px rgba(255,255,255,0.3)',
            borderRadius: '0 5px 5px 0', cursor: 'pointer'
          }}
        >
          <span style={{ fontSize: '18px' }}>🏁</span>
          Démarrer
        </button>

        <div style={{ display: 'flex', gap: '2px', flexGrow: 1, padding: '2px 5px' }}>
          {openWindows.map(appId => {
            const appData = registry.find(a => a.id === appId);
            const isActive = activeWindowId === appId && !minimizedWindows.includes(appId);
            return (
              <button
                key={appId}
                onClick={() => toggleTaskbarApp(appId)}
                style={{
                  width: '150px', textAlign: 'left', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  backgroundColor: isActive ? '#1f48a9' : '#3c81f3',
                  color: 'white', border: '1px solid', borderColor: isActive ? '#132c68' : '#245edb',
                  fontFamily: 'Tahoma', fontSize: '11px', padding: '0 5px', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer'
                }}
              >
                <span>📁</span>
                {appData?.name}
              </button>
            );
          })}
        </div>

        <div style={{
          padding: '0 10px', height: '100%', display: 'flex', alignItems: 'center',
          background: 'linear-gradient(to bottom, #0c59b9 0%, #139ee7 8%, #18b5f2 100%)',
          color: 'white', fontFamily: 'Tahoma', fontSize: '11px', borderLeft: '1px solid #132c68'
        }}>
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
}

export default App;