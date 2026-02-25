import { useState } from 'react';
import { Rnd } from 'react-rnd';

function Window({ app, onClose, onFocus, zIndex, isMinimized, onMinimize }) {
    const [isDragging, setIsDragging] = useState(false);
    const [isMaximized, setIsMaximized] = useState(false); // Nouvel état pour le plein écran !

    return (
        <Rnd
            disableDragging={isMaximized} // On interdit de déplacer si on est en plein écran
            enableResizing={!isMaximized} // Pareil pour le redimensionnement
            default={{
                x: 100 + Math.random() * 50,
                y: 100 + Math.random() * 50,
                width: 400,
                height: 350,
            }}
            minWidth={300}
            minHeight={200}
            bounds="parent"
            // On cache la fenêtre si elle est réduite (display: none)
            style={{ zIndex: zIndex, display: isMinimized ? 'none' : 'block' }}
            // On ajoute la classe CSS qu'on vient de créer si maximisée
            className={`window ${isMaximized ? 'maximized' : ''}`}
            onDragStart={() => { onFocus(); setIsDragging(true); }}
            onDragStop={() => setIsDragging(false)}
            onResizeStart={() => setIsDragging(true)}
            onResizeStop={() => setIsDragging(false)}
        >
            <div className="title-bar" onMouseDown={onFocus} style={{ cursor: isMaximized ? 'default' : 'move' }}>
                <div className="title-bar-text">{app.name} - {app.author}</div>
                <div className="title-bar-controls">
                    {/* Les vrais boutons de contrôle ! */}
                    <button aria-label="Minimize" onClick={(e) => { e.stopPropagation(); onMinimize(); }}></button>
                    <button aria-label="Maximize" onClick={(e) => { e.stopPropagation(); setIsMaximized(!isMaximized); }}></button>
                    <button aria-label="Close" onClick={(e) => { e.stopPropagation(); onClose(app.id); }}></button>
                </div>
            </div>

            <div className="window-body" style={{ margin: 0, padding: 0, height: 'calc(100% - 30px)' }}>
                <iframe
                    src={app.entry_point}
                    style={{
                        width: '100%', height: '100%', border: 'none', backgroundColor: '#fff',
                        pointerEvents: isDragging ? 'none' : 'auto'
                    }}
                    title={app.name}
                />
            </div>
        </Rnd>
    );
}

export default Window;