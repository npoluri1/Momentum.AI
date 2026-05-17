'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Box, Maximize2, RotateCcw, ZoomIn, ZoomOut, Save, Download } from 'lucide-react';

interface ThreeDViewerProps {
  sceneData?: any;
  title?: string;
}

export default function ThreeDViewer({ sceneData, title = "3D Design Preview" }: ThreeDViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState({ x: 0.5, y: 0.5 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const render = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);
      
      // Setup projection
      const centerX = width / 2;
      const centerY = height / 2;
      const scale = Math.min(width, height) / 4;

      // Draw 3D wireframe cube as a placeholder
      // In a real implementation with Three.js, this would be much more complex.
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      ctx.beginPath();

      const points = [
        [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
        [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]
      ];

      const projected = points.map(p => {
        // Rotate
        let x = p[0];
        let y = p[1];
        let z = p[2];

        // Y-axis rotation
        let nx = x * Math.cos(rotation.y) - z * Math.sin(rotation.y);
        let nz = x * Math.sin(rotation.y) + z * Math.cos(rotation.y);
        x = nx;
        z = nz;

        // X-axis rotation
        let ny = y * Math.cos(rotation.x) - z * Math.sin(rotation.x);
        nz = y * Math.sin(rotation.x) + z * Math.cos(rotation.x);
        y = ny;
        z = nz;

        // Project
        const factor = 2 / (z + 4);
        return [
          centerX + x * factor * scale,
          centerY - y * factor * scale
        ];
      });

      // Draw edges
      const edges = [
        [0, 1], [1, 2], [2, 3], [3, 0],
        [4, 5], [5, 6], [6, 7], [7, 4],
        [0, 4], [1, 5], [2, 6], [3, 7]
      ];

      edges.forEach(([i, j]) => {
        ctx.moveTo(projected[i][0], projected[i][1]);
        ctx.lineTo(projected[j][0], projected[j][1]);
      });
      ctx.stroke();

      // If we have sceneData, draw additional elements
      if (sceneData?.objects) {
          ctx.fillStyle = '#10b981';
          ctx.font = '12px sans-serif';
          ctx.fillText("CAD Scene Loaded", 20, 30);
          
          sceneData.objects.forEach((obj: any, i: number) => {
              ctx.fillText(`- ${obj.name || 'Object ' + i}`, 20, 50 + i * 20);
          });
      }

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [rotation, sceneData]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setLastMouse({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - lastMouse.x;
    const dy = e.clientY - lastMouse.y;
    setRotation(prev => ({
      x: prev.x + dy * 0.01,
      y: prev.y + dx * 0.01
    }));
    setLastMouse({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <div className="bg-surface-900 rounded-2xl overflow-hidden border border-surface-700 shadow-2xl flex flex-col h-[600px]">
      <div className="px-4 py-3 bg-surface-800 border-b border-surface-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Box className="w-5 h-5 text-brand-500" />
          <span className="font-semibold text-white">{title}</span>
          {sceneData?.metadata?.domain && (
              <span className="px-2 py-0.5 rounded text-[10px] bg-surface-700 text-surface-300 uppercase tracking-wider">
                  {sceneData.metadata.domain}
              </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button className="p-1.5 hover:bg-surface-700 rounded-lg text-surface-400 transition-colors">
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div 
        className="flex-1 relative cursor-grab active:cursor-grabbing overflow-hidden"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <canvas 
          ref={canvasRef} 
          width={800} 
          height={600} 
          className="w-full h-full"
        />
        
        {/* Controls Overlay */}
        <div className="absolute bottom-6 left-6 flex flex-col gap-2">
          <button onClick={() => setRotation({x: 0.5, y: 0.5})} className="p-2 bg-surface-800/80 backdrop-blur rounded-xl border border-surface-600 text-white hover:bg-surface-700 transition-all">
            <RotateCcw className="w-5 h-5" />
          </button>
          <div className="flex flex-col bg-surface-800/80 backdrop-blur rounded-xl border border-surface-600 overflow-hidden">
            <button className="p-2 hover:bg-surface-700 text-white border-b border-surface-600"><ZoomIn className="w-5 h-5" /></button>
            <button className="p-2 hover:bg-surface-700 text-white"><ZoomOut className="w-5 h-5" /></button>
          </div>
        </div>

        <div className="absolute top-6 right-6 flex gap-2">
          <button className="px-4 py-2 bg-brand-600 text-white rounded-xl font-semibold shadow-lg hover:bg-brand-700 transition-all flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export STL
          </button>
          <button className="p-2 bg-surface-800/80 backdrop-blur rounded-xl border border-surface-600 text-white hover:bg-surface-700 transition-all">
            <Save className="w-5 h-5" />
          </button>
        </div>

        {/* Status indicator */}
        <div className="absolute bottom-6 right-6 px-3 py-1.5 bg-brand-500/10 border border-brand-500/20 rounded-full backdrop-blur-sm">
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
                <span className="text-[10px] font-bold text-brand-400 uppercase tracking-widest">Rendering Engine Active</span>
            </div>
        </div>
      </div>
    </div>
  );
}
