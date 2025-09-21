import React, { useMemo } from 'react';
import { StudyModule } from '../types';
import { useAppContext } from '../context/AppContext';

interface StarMapProps {
    modules: StudyModule[];
    onSelectModule: (module: StudyModule) => void;
    activeModuleId?: string | null;
    view: { x: number; y: number; zoom: number };
}

const StarMap: React.FC<StarMapProps> = ({ modules, onSelectModule, activeModuleId, view }) => {
    const { t } = useAppContext();

    const findModuleById = (id: string) => modules.find(m => m.id === id);

    const connections = modules
        .filter(m => m.unlocks)
        .map(m => {
            const startNode = m;
            const endNode = findModuleById(m.unlocks!);
            if (startNode && endNode) {
                return { startNode, endNode };
            }
            return null;
        })
        .filter((conn): conn is { startNode: StudyModule, endNode: StudyModule } => conn !== null);

    const mapSize = useMemo(() => {
        if (modules.length === 0) return { width: 0, height: 0 };
        const padding = 200;
        const xs = modules.map(m => m.x);
        const ys = modules.map(m => m.y);
        return {
            width: Math.max(...xs) + padding,
            height: Math.max(...ys) + padding,
        };
    }, [modules]);

    return (
        <div className="relative w-full h-full overflow-hidden bg-grid-pattern">
            <div id="stars1" className="stars"></div>
            <div id="stars2" className="stars"></div>
            <div id="stars3" className="stars"></div>
            
            <div
                className="absolute top-0 left-0 transition-transform duration-100 ease-out"
                style={{
                    width: `${mapSize.width}px`,
                    height: `${mapSize.height}px`,
                    transform: `translate(${view.x}px, ${view.y}px) scale(${view.zoom})`,
                    transformOrigin: 'top left',
                }}
            >
                <svg className="absolute top-0 left-0" width={mapSize.width} height={mapSize.height} style={{ pointerEvents: 'none' }}>
                    <defs>
                        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" style={{ stopColor: 'rgba(56, 189, 248, 0.1)', stopOpacity: 1 }} />
                            <stop offset="100%" style={{ stopColor: 'rgba(56, 189, 248, 0.5)', stopOpacity: 1 }} />
                        </linearGradient>
                    </defs>
                    {connections.map((conn, index) => (
                        <line
                            key={index}
                            x1={conn.startNode.x}
                            y1={conn.startNode.y}
                            x2={conn.endNode.x}
                            y2={conn.endNode.y}
                            stroke="url(#lineGradient)"
                            strokeWidth="2"
                        />
                    ))}
                </svg>

                {modules.map(module => (
                    <div
                        key={module.id}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                        style={{ left: `${module.x}px`, top: `${module.y}px` }}
                        onClick={() => onSelectModule(module)}
                    >
                        <div 
                            className={`w-5 h-5 rounded-full transition-all duration-300 ${
                                module.isCompleted ? 'bg-secondary' : 'bg-primary'
                            } ${activeModuleId === module.id ? 'scale-150 ring-4 ring-secondary-light' : 'group-hover:scale-125'}`}
                        >
                            <div className={`w-full h-full rounded-full ${
                                module.isCompleted ? 'bg-secondary' : 'bg-primary'
                            } animate-pulse-faint`}></div>
                        </div>
                        <div className="absolute left-1/2 -translate-x-1/2 mt-2 whitespace-nowrap text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-surface-dark/70 px-2 py-1 rounded-md text-xs">
                            {module.title}
                            <div className={`mt-1 text-xs ${
                                module.subject === 'Biology' ? 'text-green-400' : module.subject === 'Chemistry' ? 'text-blue-400' : 'text-red-400'
                            }`}>
                                {t(module.subject.toLowerCase())}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <style>{`
                .stars {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    width: 100%;
                    height: 100%;
                    display: block;
                    background: transparent;
                }
                #stars1 {
                    background-image: radial-gradient(1px 1px at 20px 30px, #eee, rgba(0,0,0,0)), radial-gradient(1px 1px at 40px 70px, #fff, rgba(0,0,0,0)), radial-gradient(1px 1px at 50px 160px, #ddd, rgba(0,0,0,0)), radial-gradient(1px 1px at 90px 40px, #fff, rgba(0,0,0,0)), radial-gradient(2px 2px at 130px 80px, #fff, rgba(0,0,0,0)), radial-gradient(1px 1px at 160px 120px, #ddd, rgba(0,0,0,0));
                    background-size: 200px 200px;
                    animation: move-twink-back 200s linear infinite;
                }
                #stars2 {
                    background-image: radial-gradient(1px 1px at 10px 90px, #eee, rgba(0,0,0,0)), radial-gradient(2px 2px at 30px 20px, #fff, rgba(0,0,0,0)), radial-gradient(1px 1px at 60px 110px, #ddd, rgba(0,0,0,0)), radial-gradient(1px 1px at 120px 10px, #fff, rgba(0,0,0,0)), radial-gradient(2px 2px at 150px 180px, #fff, rgba(0,0,0,0)), radial-gradient(1px 1px at 180px 150px, #ddd, rgba(0,0,0,0));
                    background-size: 250px 250px;
                    animation: move-twink-back 150s linear infinite;
                }
                #stars3 {
                    background-image: radial-gradient(2px 2px at 5px 150px, #eee, rgba(0,0,0,0)), radial-gradient(1px 1px at 80px 50px, #fff, rgba(0,0,0,0)), radial-gradient(2px 2px at 100px 100px, #ddd, rgba(0,0,0,0)), radial-gradient(2px 2px at 140px 140px, #fff, rgba(0,0,0,0)), radial-gradient(1px 1px at 170px 30px, #fff, rgba(0,0,0,0)), radial-gradient(2px 2px at 190px 190px, #ddd, rgba(0,0,0,0));
                    background-size: 300px 300px;
                    animation: move-twink-back 100s linear infinite;
                }
                @keyframes move-twink-back {
                    from { background-position: 0 0; }
                    to { background-position: -10000px 5000px; }
                }
                .bg-grid-pattern {
                    background-image: linear-gradient(rgba(56, 189, 248, 0.1) 1px, transparent 1px), linear-gradient(to right, rgba(56, 189, 248, 0.1) 1px, transparent 1px);
                    background-size: 40px 40px;
                }
                @keyframes pulse-faint {
                    0%, 100% { opacity: 0.7; }
                    50% { opacity: 1; }
                }
                .animate-pulse-faint {
                    animation: pulse-faint 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
            `}</style>
        </div>
    );
}

export default StarMap;