import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { StudyModule } from '../types';
import { studyModules } from '../data/mockData';
import StarMap from '../components/StarMap';
import MissionBriefingPanel from '../components/MissionBriefingPanel';
import ModuleView from '../components/ModuleView';
import ChatbotWidget from '../components/ChatbotWidget';
import { useAppContext } from '../context/AppContext';

const ZOOM_SENSITIVITY = 0.001;
const MIN_ZOOM = 0.3;
const MAX_ZOOM = 2.5;

const Study: React.FC = () => {
    const { t } = useAppContext();
    const [modules] = useState<StudyModule[]>(studyModules);
    const [selectedModule, setSelectedModule] = useState<StudyModule | null>(null);
    const [viewingModule, setViewingModule] = useState<StudyModule | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    
    const [view, setView] = useState({ x: 0, y: 0, zoom: 1 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    // Force dark theme for the sci-fi aesthetic
    useEffect(() => {
        document.documentElement.classList.add('dark');
    }, []);

    const mapBounds = useMemo(() => {
        if (modules.length === 0) return { minX: 0, minY: 0, maxX: 0, maxY: 0 };
        const padding = 150; // px padding around the content
        const xs = modules.map(m => m.x);
        const ys = modules.map(m => m.y);
        return {
            minX: Math.min(...xs) - padding,
            minY: Math.min(...ys) - padding,
            maxX: Math.max(...xs) + padding,
            maxY: Math.max(...ys) + padding,
        };
    }, [modules]);
    
    // Center on the next available module on initial load
    useEffect(() => {
        const nextModule = modules.find(m => !m.isCompleted) || modules[0];
        if (nextModule && containerRef.current) {
            const { width, height } = containerRef.current.getBoundingClientRect();
            setView({
                x: -nextModule.x + width / 2,
                y: -nextModule.y + height / 2,
                zoom: 1,
            });
        }
    }, [modules]);


    const handleSelectModule = (module: StudyModule) => {
        setSelectedModule(module);
    };

    const handleLaunch = () => {
        if (selectedModule) {
            setViewingModule(selectedModule);
            setSelectedModule(null);
        }
    };

    const handleExitModuleView = () => {
        setViewingModule(null);
    };
    
    const handleCloseBriefing = () => {
        setSelectedModule(null);
    };
    
    const handleWheel = useCallback((e: React.WheelEvent) => {
        e.preventDefault();
        if (!containerRef.current) return;
        const { deltaY } = e;
        const zoomDelta = -deltaY * ZOOM_SENSITIVITY;

        setView(prevView => {
            const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, prevView.zoom * (1 + zoomDelta)));
            
            const rect = containerRef.current!.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            const worldX = (mouseX - prevView.x) / prevView.zoom;
            const worldY = (mouseY - prevView.y) / prevView.zoom;
            
            let newX = mouseX - worldX * newZoom;
            let newY = mouseY - worldY * newZoom;
            
            return { x: newX, y: newY, zoom: newZoom };
        });
    }, []);

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        setIsDragging(true);
        setView(prevView => {
            setDragStart({ x: e.clientX - prevView.x, y: e.clientY - prevView.y });
            return prevView;
        });
    }, []);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!isDragging) return;
        e.preventDefault();
        setView(prev => ({
            ...prev,
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y,
        }));
    }, [isDragging, dragStart]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    return (
        <div className="min-h-screen bg-background-dark text-text-dark font-sans overflow-hidden">
            <div 
                ref={containerRef}
                className="relative w-full h-screen select-none"
                onWheel={handleWheel}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
            >
                <StarMap 
                    modules={modules} 
                    onSelectModule={handleSelectModule} 
                    activeModuleId={selectedModule?.id}
                    view={view}
                />
            </div>
            
            {selectedModule && (
                <MissionBriefingPanel 
                    module={selectedModule} 
                    onLaunch={handleLaunch}
                    onClose={handleCloseBriefing}
                />
            )}

            {viewingModule && (
                <ModuleView 
                    module={viewingModule} 
                    onExit={handleExitModuleView}
                />
            )}
            
            <ChatbotWidget selectedModule={viewingModule || selectedModule} />
        </div>
    );
};

export default Study;