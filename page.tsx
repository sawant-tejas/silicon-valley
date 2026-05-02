'use client';

import React, { useState } from 'react';
import Spline from '@splinetool/react-spline';

type Paper = {
  paperId: string;
  title: string;
  authors?: Array<{ name: string }>;
  year?: number;
  citationCount?: number;
  abstract?: string;
};

function SplineBackground() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    >
      <Spline scene="https://prod.spline.design/lyXCDL7eztsBEi-J/scene.splinecode" />
    </div>
  );
}

export default function Home() {
  const [topic, setTopic] = useState('');
  const [papers, setPapers] = useState<Paper[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedTopic = topic.trim();
    if (!trimmedTopic) {
      setPapers([]);
      return;
    }

    setIsLoading(true);
    try {
      const url = `https://api.semanticscholar.org/graph/v1/paper/search?query=${encodeURIComponent(
        trimmedTopic
      )}&fields=title,authors,year,citationCount,abstract&limit=20`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch papers');
      }
      const data = await response.json();
      setPapers(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      console.error(error);
      setPapers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderAbstractPreview = (text?: string) => {
    if (!text) return 'No abstract available.';
    return text.length > 150 ? `${text.slice(0, 150)}...` : text;
  };

  return (
    <div style={{
      position: 'relative',
      minHeight: '100vh',
      width: '100%',
      overflow: 'hidden',
      background: '#0A0E1A',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <SplineBackground />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          background: 'rgba(10, 14, 26, 0.45)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: '15vh',
          marginBottom: '15vh',
        }}
      >
        <h1
          style={{
            color: '#FFF',
            fontSize: '3rem',
            fontWeight: 700,
            textShadow: '0 1px 12px #7F77DD50, 0 2px 24px #5DCAA540',
            marginBottom: '2rem',
            letterSpacing: '-0.02em',
            textAlign: 'center',
            lineHeight: 1.1,
          }}
        >
          Discover Your Next Adventure
        </h1>
        <form
          style={{
            width: '100%',
            maxWidth: 420,
            background: 'rgba(16,24,36,0.85)',
            borderRadius: 14,
            boxShadow: '0 2px 32px 0 #20244930',
            display: 'flex',
            alignItems: 'center',
            gap: 0,
            padding: '0.5rem 1rem',
          }}
          onSubmit={handleSearch}
        >
          <input
            type="text"
            placeholder="Search research topics..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            style={{
              flex: 1,
              border: 'none',
              padding: '1rem',
              background: 'transparent',
              color: '#fff',
              fontSize: '1.15rem',
              outline: 'none',
            }}
          />
          <button
            type="submit"
            disabled={isLoading}
            style={{
              padding: '0.7rem 1.3rem',
              background: 'linear-gradient(95deg, #7F77DD 0%, #5DCAA5 100%)',
              color: '#fff',
              fontWeight: 600,
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
              fontSize: '1rem',
              marginLeft: '1rem',
              boxShadow: '0 1px 6px #090b1740',
              transition: 'filter 0.16s',
              opacity: isLoading ? 0.7 : 1,
            }}
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </form>
        {isLoading && (
          <div
            style={{
              marginTop: '1.25rem',
              width: 36,
              height: 36,
              border: '4px solid rgba(255, 255, 255, 0.25)',
              borderTopColor: '#5DCAA5',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
            }}
            aria-label="Loading"
            role="status"
          />
        )}

        {!isLoading && papers.length > 0 && (
          <div
            style={{
              marginTop: '1.5rem',
              width: '100%',
              maxWidth: 900,
              display: 'grid',
              gap: '1rem',
            }}
          >
            {papers.map((paper) => (
              <article
                key={paper.paperId}
                style={{
                  padding: '1rem 1.1rem',
                  borderRadius: 12,
                  background: 'rgba(16,24,36,0.9)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: '#fff',
                  boxShadow: '0 2px 16px #11152a70',
                }}
              >
                <h3 style={{ margin: 0, fontSize: '1.1rem', marginBottom: '0.65rem' }}>{paper.title}</h3>
                <p style={{ margin: 0, color: '#D6DAE6', marginBottom: '0.4rem' }}>
                  <strong>Authors:</strong>{' '}
                  {paper.authors && paper.authors.length > 0
                    ? paper.authors.map((author) => author.name).join(', ')
                    : 'Unknown'}
                </p>
                <p style={{ margin: 0, color: '#D6DAE6', marginBottom: '0.4rem' }}>
                  <strong>Year:</strong> {paper.year ?? 'N/A'}
                </p>
                <p style={{ margin: 0, color: '#D6DAE6', marginBottom: '0.55rem' }}>
                  <strong>Citations:</strong> {paper.citationCount ?? 0}
                </p>
                <p style={{ margin: 0, color: '#C7CCDB', lineHeight: 1.5 }}>
                  {renderAbstractPreview(paper.abstract)}
                </p>
              </article>
            ))}
          </div>
        )}
      </div>
      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

