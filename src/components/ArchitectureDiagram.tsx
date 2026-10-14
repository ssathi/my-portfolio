import React, { useState } from 'react';
import { platformLayers } from '@/data/systemOverview';

export default function ArchitectureDiagram() {
  const [activeLayer, setActiveLayer] = useState<number>(0);

  const layerColors = [
    'from-blue-500/20 to-cyan-500/10 border-cyan-500/40 text-cyan-400',
    'from-amber-500/20 to-orange-500/10 border-orange-500/40 text-orange-400',
    'from-emerald-500/20 to-teal-500/10 border-emerald-500/40 text-emerald-400',
    'from-indigo-500/20 to-purple-500/10 border-indigo-500/40 text-indigo-400',
    'from-purple-500/20 to-pink-500/10 border-purple-500/40 text-purple-400',
    'from-sky-500/20 to-blue-500/10 border-blue-500/40 text-blue-400',
  ];

  return (
    <div className="rounded-2xl glass-panel p-6 sm:p-8 border border-surface-200/60">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-primary-400">
            System Topology
          </span>
          <h3 className="text-2xl font-bold text-white mt-1">Arogya Platform Layered Architecture</h3>
        </div>
        <p className="text-xs text-slate-400 max-w-sm">
          Click any architectural layer to inspect its components, protocols, and technologies.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-3">
          {platformLayers.map((layer, idx) => (
            <button
              key={idx}
              onClick={() => setActiveLayer(idx)}
              className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between ${
                activeLayer === idx
                  ? `bg-surface-200/90 shadow-lg ${layerColors[idx]}`
                  : 'bg-surface-100/40 border-surface-200/40 text-slate-400 hover:bg-surface-200/40 hover:text-white'
              }`}
            >
              <div className="font-semibold text-sm">{layer.name}</div>
              <span className="text-xs font-mono opacity-60">Layer {idx + 1}</span>
            </button>
          ))}
        </div>

        <div className="lg:col-span-7 rounded-xl p-6 bg-surface-100/80 border border-surface-200/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-primary-500/20 text-primary-300 border border-primary-500/30">
                Layer {activeLayer + 1} of 6
              </span>
              <h4 className="text-lg font-bold text-white">
                {platformLayers[activeLayer].name}
              </h4>
            </div>

            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              {platformLayers[activeLayer].description}
            </p>

            <h5 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3">
              Core Technologies & Protocols
            </h5>
            <div className="flex flex-wrap gap-2 mb-6">
              {platformLayers[activeLayer].technologies.map((tech, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-lg text-xs font-mono bg-surface-200/60 border border-surface-200/80 text-white shadow-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-surface-200/50 flex items-center justify-between text-xs text-slate-400">
            <span>Production Tested in 11+ Hospital Deployments</span>
            <span className="font-mono text-primary-400">Zero-Downtime Operations</span>
          </div>
        </div>
      </div>
    </div>
  );
}
