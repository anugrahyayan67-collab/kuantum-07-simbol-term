import React from 'react';
import {C, FONT} from '../theme';
import {Sub, Sup} from './primitives';

// Komponen bersama adegan grup C (period4, chromium, fine, parity, rules, check).

export type Term = {m: string; L: string; J: string; odd?: boolean};

/** Simbol term ²ˢ⁺¹L_J di SVG (superskrip/subskrip dengan tspan baselineShift). */
export const TermSvg: React.FC<{
  x: number;
  y: number;
  term: Term;
  size?: number;
  color?: string;
  colored?: boolean;
  anchor?: 'start' | 'middle' | 'end';
  opacity?: number;
  weight?: number;
  prefix?: string;
}> = ({x, y, term, size = 40, color = C.ink, colored, anchor = 'middle', opacity = 1, weight = 600, prefix}) => {
  if (opacity <= 0.001) return null;
  const small = size * 0.6;
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      dominantBaseline="central"
      fontFamily={FONT.serif}
      fontSize={size}
      fontWeight={weight}
      fill={color}
      opacity={opacity}
      style={{paintOrder: 'stroke', stroke: 'rgba(4,6,12,0.85)', strokeWidth: size * 0.1}}
    >
      {prefix ? <tspan fontFamily={FONT.sans}>{prefix}</tspan> : null}
      <tspan baselineShift="super" fontSize={small} fill={colored ? C.violet : undefined}>
        {term.m}
      </tspan>
      <tspan fill={colored ? C.gold : undefined}>{term.L}</tspan>
      {term.odd ? (
        <tspan baselineShift="super" fontSize={small} fill={colored ? C.amber : undefined}>
          °
        </tspan>
      ) : null}
      <tspan baselineShift="sub" fontSize={small} fill={colored ? C.mint : undefined}>
        {term.J}
      </tspan>
    </text>
  );
};

/** Simbol term di HTML (untuk kartu Formula). */
export const TermHtml: React.FC<{term: Term; colored?: boolean}> = ({term, colored}) => (
  <span style={{whiteSpace: 'nowrap'}}>
    <Sup color={colored ? C.violet : undefined}>{term.m}</Sup>
    <span style={{color: colored ? C.gold : undefined}}>{term.L}</span>
    {term.odd ? <Sup color={colored ? C.amber : undefined}>°</Sup> : null}
    <Sub color={colored ? C.mint : undefined}>{term.J}</Sub>
  </span>
);

/** Panah spin (↑ sian / ↓ merah muda) digambar sebagai garis + kepala segitiga (tanpa marker/filter). */
export const SpinArr: React.FC<{x: number; y: number; up: boolean; len?: number; color?: string; opacity?: number; tilt?: number; width?: number}> = ({
  x,
  y,
  up,
  len = 74,
  color,
  opacity = 1,
  tilt = 0,
  width = 6,
}) => {
  if (opacity <= 0.001) return null;
  const col = color ?? (up ? C.cyan : C.pink);
  const dir = up ? -1 : 1;
  const ux = Math.sin(tilt) * -dir;
  const uy = Math.cos(tilt) * dir;
  // ujung panah
  const hx = x + (ux * len) / 2;
  const hy = y + (uy * len) / 2;
  const tx = x - (ux * len) / 2;
  const ty = y - (uy * len) / 2;
  const hs = 16;
  const nx = -uy;
  const ny = ux;
  const bx = hx - ux * hs;
  const by = hy - uy * hs;
  return (
    <g opacity={opacity}>
      <path d={`M${tx},${ty} L${bx},${by}`} stroke={col} strokeWidth={width} strokeLinecap="round" fill="none" />
      <path d={`M${hx},${hy} L${bx + nx * 10},${by + ny * 10} L${bx - nx * 10},${by - ny * 10} Z`} fill={col} />
    </g>
  );
};

/** Deretan kotak orbital (n kotak) dengan label di kiri. */
export const BoxRow: React.FC<{x: number; y: number; n: number; box?: number; gap?: number; label?: string; opacity?: number; stroke?: string; glow?: number}> = ({
  x,
  y,
  n,
  box = 84,
  gap = 6,
  label,
  opacity = 1,
  stroke = C.faint,
  glow = 0,
}) => (
  <g opacity={opacity}>
    {Array.from({length: n}, (_, i) => (
      <rect key={i} x={x + i * (box + gap)} y={y - box / 2} width={box} height={box} rx={10} fill="rgba(12,18,40,0.85)" stroke={stroke} strokeWidth={3} />
    ))}
    {glow > 0 ? (
      <rect x={x - 8} y={y - box / 2 - 8} width={n * (box + gap) - gap + 16} height={box + 16} rx={16} fill="none" stroke={C.gold} strokeWidth={3} opacity={glow} />
    ) : null}
    {label ? (
      <text x={x - 18} y={y} textAnchor="end" dominantBaseline="central" fontFamily={FONT.mono} fontSize={30} fill={C.muted}>
        {label}
      </text>
    ) : null}
  </g>
);

/** Tanda centang / silang kecil (SVG, digambar progresif). */
export const Mark: React.FC<{x: number; y: number; ok: boolean; p: number; size?: number}> = ({x, y, ok, p, size = 30}) => {
  if (p <= 0.001) return null;
  const s = size;
  const col = ok ? C.mint : C.red;
  const d = ok ? `M${x - s * 0.55},${y} L${x - s * 0.15},${y + s * 0.42} L${x + s * 0.6},${y - s * 0.5}` : `M${x - s * 0.45},${y - s * 0.45} L${x + s * 0.45},${y + s * 0.45} M${x + s * 0.45},${y - s * 0.45} L${x - s * 0.45},${y + s * 0.45}`;
  return (
    <g opacity={Math.min(1, p * 2)}>
      <circle cx={x} cy={y} r={s * 1.05} fill={col} opacity={0.14} />
      <path d={d} fill="none" stroke={col} strokeWidth={s * 0.2} strokeLinecap="round" strokeLinejoin="round" pathLength={100} strokeDasharray="100 100" strokeDashoffset={100 * (1 - p)} />
    </g>
  );
};

/** Cap stempel miring (HTML). */
export const Stamp: React.FC<{x: number; y: number; p: number; text: string; color?: string; rot?: number; size?: number}> = ({x, y, p, text, color = C.red, rot = -8, size = 40}) =>
  p <= 0.001 ? null : (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${1.5 - 0.5 * p})`,
        opacity: Math.min(1, p * 1.6),
        border: `5px solid ${color}`,
        borderRadius: 14,
        padding: '6px 22px',
        color,
        fontFamily: FONT.sans,
        fontWeight: 800,
        fontSize: size,
        letterSpacing: 3,
        whiteSpace: 'nowrap',
        background: 'rgba(8,10,20,0.55)',
        boxShadow: `0 0 30px ${color}44`,
      }}
    >
      {text}
    </div>
  );
