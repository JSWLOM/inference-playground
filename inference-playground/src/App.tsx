import { useState } from 'react';
import { Playground } from './components/Playground';
import { DiffView } from './components/DiffView';

type Tab = 'playground' | 'diff';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('playground');

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>

      {/* Nav — Sarvam style: white bg, rounded, floating */}
      <div style={{ padding: '12px 24px 0', position: 'sticky', top: 0, zIndex: 50 }}>
        <nav style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          padding: '10px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
          border: '1px solid #E8ECF4',
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginRight: '16px' }}>
            <div style={{
              width: '32px', height: '32px',
              background: 'linear-gradient(135deg, #2563EB, #7C3AED, #F97316)',
              borderRadius: '10px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 800, fontSize: '15px',
            }}>S</div>
            <span style={{
              fontSize: '15px', fontWeight: 700,
              color: '#0F1623', letterSpacing: '-0.3px',
              fontFamily: 'Syne, sans-serif',
            }}>
              sarvam <span style={{ color: '#9AA3B2', fontWeight: 400 }}>devportal</span>
            </span>
          </div>

          {/* Tabs */}
          {([
            { id: 'playground', label: 'Playground', icon: '⚡' },
            { id: 'diff',       label: 'Diff View',  icon: '⊕' },
          ] as { id: Tab; label: string; icon: string }[]).map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '7px 16px',
                borderRadius: '20px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '13px',
                fontFamily: 'Syne, sans-serif',
                fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: '6px',
                transition: 'all 0.2s',
                background: activeTab === tab.id
                  ? '#0F1623'
                  : 'transparent',
                color: activeTab === tab.id
                  ? '#FFFFFF'
                  : '#4A5568',
              }}
              onMouseEnter={e => {
                if (activeTab !== tab.id)
                  e.currentTarget.style.background = '#F4F6FB';
              }}
              onMouseLeave={e => {
                if (activeTab !== tab.id)
                  e.currentTarget.style.background = 'transparent';
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}

          {/* Badge */}
          <div style={{ marginLeft: 'auto' }}>
            <span style={{
              fontSize: '11px',
              padding: '4px 10px',
              borderRadius: '20px',
              background: 'rgba(249,115,22,0.1)',
              color: '#F97316',
              fontFamily: 'JetBrains Mono, monospace',
              fontWeight: 600,
              border: '1px solid rgba(249,115,22,0.25)',
            }}>v0.1.0-beta</span>
          </div>
        </nav>
      </div>

      {/* Page Content */}
      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }}>
        {activeTab === 'playground' ? <Playground /> : <DiffView />}
      </main>
    </div>
  );
}