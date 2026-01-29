'use client';

import React, { useMemo } from 'react';
import styles from '@/styles/components/tours/SketchItineraryCard.module.css';

interface Stop {
  id: string;
  name: string;
  description?: string;
  icon?: string;
}

interface SketchItineraryCardProps {
  title: string;
  tripType?: string;
  stops: Stop[];
  totalDays?: number;
  difficulty?: 'easy' | 'moderate' | 'challenging';
  highlights?: string[];
  footerMessage?: string;
}

export default function SketchItineraryCard({
  title,
  tripType = 'Adventure Tour',
  stops,
  totalDays,
  difficulty,
  highlights = [],
  footerMessage = 'Have an amazing adventure!',
}: SketchItineraryCardProps) {
  // Calculate the curved path and stop positions for vertical layout
  const { pathData, stopPositions } = useMemo(() => {
    if (stops.length < 2) return { pathData: '', stopPositions: [] };

    const startY = 140;
    const cardHeight = 600;
    const contentHeight = cardHeight - 240;
    const stopSpacing = contentHeight / (stops.length - 1);
    const centerX = 150;

    let path = `M ${centerX} ${startY}`;
    const positions: { x: number; y: number }[] = [];

    for (let i = 0; i < stops.length; i++) {
      const y = startY + stopSpacing * i;
      positions.push({ x: centerX, y });
    }

    for (let i = 1; i < stops.length; i++) {
      const y1 = startY + stopSpacing * (i - 1);
      const y2 = startY + stopSpacing * i;
      const controlX = i % 2 === 1 ? 100 : 200;
      path += ` Q ${controlX} ${(y1 + y2) / 2} ${centerX} ${y2}`;
    }
    return { pathData: path, stopPositions: positions };
  }, [stops.length]);

  return (
    <div className={styles['trip-card']}>
      {/* Left gold side */}
      <div className={styles['trip-card__left-section']}>
        {/* Header banner on top */}
        <div className={styles['trip-card__banner']}>
          <div className={styles['trip-card__banner-ribbon']}>
            <span className={styles['trip-card__banner-text']}>{title.toUpperCase()}</span>
          </div>
        </div>

        {/* Main route container */}
        <div className={styles['trip-card__route-container']}>
          <svg
            viewBox="0 0 300 600"
            className={styles['trip-card__route-svg']}
            preserveAspectRatio="xMidYMid slice"
          >
            {/* Curved dotted line */}
            <path
              d={pathData}
              stroke="#c84c3c"
              strokeWidth="3"
              strokeDasharray="8,6"
              fill="none"
              strokeLinecap="round"
            />

            {/* Red circle markers */}
            {stops.map((stop, index) => {
              const pos = stopPositions[index];
              if (!pos) return null;

              return (
                <g key={`marker-${stop.id}`} data-stop-index={index}>
                  <circle cx={pos.x} cy={pos.y} r="14" fill="#c84c3c" />
                  <circle cx={pos.x} cy={pos.y} r="6" fill="white" />
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Right cyan/teal side with stops */}
      <div className={styles['trip-card__right-section']}>
        <div className={styles['trip-card__stops-list']}>
          {stops.map((stop) => (
            <div key={stop.id} className={styles['trip-card__stop-item']}>
              <div className={styles['trip-card__stop-icon-box']} aria-hidden="true">
                <span className={styles['trip-card__stop-pin']}>📍</span>
              </div>
              <div className={styles['trip-card__stop-content']}>
                <h3 className={styles['trip-card__stop-name']}>{stop.name}</h3>
                {stop.description && (
                  <p className={styles['trip-card__stop-description']}>{stop.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className={styles['trip-card__footer']}>
        <p className={styles['trip-card__footer-text']}>{footerMessage}</p>
      </div>
    </div>
  );
}
