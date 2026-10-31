import React from 'react';
import {C, FONT} from '../theme';
import {Sub, Sup} from './primitives';

// Komponen bersama grup B (symbol, coupling, hund, micro, patterns).

/** Panah spin SVG: naik = sian (α), turun = merah muda (β). Kepala panah digambar sendiri (tanpa marker). */
export const SpinArrow: React.FC<{x: number; y: number; up: boolean; len?: number; width?: number; opacity?: number; color?: string}> = ({
  x,
  y,
  up,
  len = 40,
  width = 4,
  opacity = 1,
  color,
}) => {
  if (opacity <= 0.001) return null;
  const col = color ?? (up ? C.cyan : C.pink);
  const s = up ? -1 : 1;
  const tipY = y + (s * len) / 2;
  const tailY = y - (s * len) / 2;
  const hw = Math.max(5, width * 1.9);
  const hl = Math.max(9, width * 3);
  return (
    <g opacity={opacity}>
      <line x1={x} y1={tailY} x2={x} y2={tipY - s * hl * 0.6} stroke={col} strokeWidth={width} strokeLinecap="round" />
      <path d={`M${x},${tipY} L${x - hw},${tipY - s * hl} L${x + hw},${tipY - s * hl} Z`} fill={col} />
    </g>
  );
};

export type BoxFill = [number, number]; // [opasitas ↑, opasitas ↓]

/**
 * Deretan kotak orbital. fill[i] = [↑, ↓] (0..1). Elektron sedikit bergoyang (t).
 * labels: teks mₗ di bawah kotak.
 */
export const OrbitalBoxes: React.FC<{
  x: number; // tengah deretan
  y: number; // tengah kotak
  n: number;
  fill: BoxFill[];
  w?: number;
  h?: number;
  gap?: number;
  t?: number;
  labels?: string[];
  labelSize?: number;
  stroke?: string;
  hi?: number[]; // sorotan per kotak (0..1)
  opacity?: number;
  arrowW?: number;
}> = ({x, y, n, fill, w = 80, h = 90, gap = 0, t = 0, labels, labelSize = 22, stroke = C.muted, hi, opacity = 1, arrowW}) => {
  if (opacity <= 0.001) return null;
  const total = n * w + (n - 1) * gap;
  const x0 = x - total / 2;
  const aw = arrowW ?? Math.max(2.5, w / 22);
  return (
    <g opacity={opacity}>
      {Array.from({length: n}, (_, i) => {
        const bx = x0 + i * (w + gap);
        const [u, d] = fill[i] ?? [0, 0];
        const hv = hi?.[i] ?? 0;
        const bob = Math.sin(t * 2.2 + i * 1.3) * h * 0.035;
        return (
          <g key={i}>
            {hv > 0.01 ? <rect x={bx - 4} y={y - h / 2 - 4} width={w + 8} height={h + 8} rx={10} fill={C.gold} opacity={0.16 * hv} /> : null}
            <rect x={bx} y={y - h / 2} width={w} height={h} rx={Math.min(10, w * 0.12)} fill="rgba(12,18,40,0.82)" stroke={stroke} strokeWidth={Math.max(1.5, w / 40)} />
            <SpinArrow x={bx + w * 0.32} y={y + bob} up len={h * 0.66} width={aw} opacity={u} />
            <SpinArrow x={bx + w * 0.68} y={y - bob} up={false} len={h * 0.66} width={aw} opacity={d} />
            {labels ? (
              <text x={bx + w / 2} y={y + h / 2 + labelSize * 1.05} textAnchor="middle" dominantBaseline="central" fontFamily={FONT.mono} fontSize={labelSize} fill={C.muted}>
                {labels[i]}
              </text>
            ) : null}
          </g>
        );
      })}
    </g>
  );
};

/** Simbol term di HTML: ²ˢ⁺¹L_J (paritas ganjil "°" opsional). colored = tiap bagian berwarna kode. */
export const Term: React.FC<{m: React.ReactNode; L: React.ReactNode; J?: React.ReactNode; odd?: boolean; colored?: boolean; color?: string}> = ({
  m,
  L,
  J,
  odd,
  colored = true,
  color,
}) => (
  <span style={{fontFamily: FONT.serif, color, whiteSpace: 'nowrap'}}>
    <Sup color={colored ? C.violet : undefined}>{m}</Sup>
    <span style={{color: colored ? C.gold : undefined}}>{L}</span>
    {odd ? <Sup>°</Sup> : null}
    {J !== undefined ? <Sub color={colored ? C.mint : undefined}>{J}</Sub> : null}
  </span>
);

/** Simbol term di SVG memakai tspan baselineShift. */
export const TermSVG: React.FC<{
  x: number;
  y: number;
  m: string;
  L: string;
  J?: string;
  odd?: boolean;
  size?: number;
  colored?: boolean;
  color?: string;
  anchor?: 'start' | 'middle' | 'end';
  opacity?: number;
}> = ({x, y, m, L, J, odd, size = 40, colored = true, color = C.ink, anchor = 'middle', opacity = 1}) => {
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
      fill={color}
      opacity={opacity}
      style={{paintOrder: 'stroke', stroke: 'rgba(4,6,12,0.85)', strokeWidth: size * 0.1}}
    >
      <tspan fontSize={small} baselineShift="super" fill={colored ? C.violet : color}>
        {m}
      </tspan>
      <tspan fill={colored ? C.gold : color}>{L}</tspan>
      {odd ? (
        <tspan fontSize={small} baselineShift="super">
          °
        </tspan>
      ) : null}
      {J ? (
        <tspan fontSize={small} baselineShift="sub" fill={colored ? C.mint : color}>
          {J}
        </tspan>
      ) : null}
    </text>
  );
};

/** Panah vektor bebas warna (kepala digambar sendiri). */
export const Vec: React.FC<{x1: number; y1: number; x2: number; y2: number; color: string; width?: number; opacity?: number; head?: number}> = ({
  x1,
  y1,
  x2,
  y2,
  color,
  width = 6,
  opacity = 1,
  head,
}) => {
  const len = Math.hypot(x2 - x1, y2 - y1);
  if (len < 3 || opacity <= 0.001) return null;
  const ux = (x2 - x1) / len;
  const uy = (y2 - y1) / len;
  const hl = Math.min(head ?? width * 3.4, len * 0.5);
  const hw = hl * 0.6;
  const bx = x2 - ux * hl;
  const by = y2 - uy * hl;
  return (
    <g opacity={opacity}>
      <line x1={x1} y1={y1} x2={bx + ux * 2} y2={by + uy * 2} stroke={color} strokeWidth={width} strokeLinecap="round" />
      <path d={`M${x2},${y2} L${bx - uy * hw},${by + ux * hw} L${bx + uy * hw},${by - ux * hw} Z`} fill={color} />
    </g>
  );
};

/** Kartu daftar kecil (HTML) dengan pita warna kiri. */
export const Chip: React.FC<{x: number; y: number; color: string; children: React.ReactNode; opacity?: number; size?: number; anchor?: 'center' | 'left'; glow?: number}> = ({
  x,
  y,
  color,
  children,
  opacity = 1,
  size = 30,
  anchor = 'center',
  glow = 0,
}) =>
  opacity <= 0.001 ? null : (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(${anchor === 'center' ? '-50%' : '0%'}, -50%)`,
        opacity,
        padding: '10px 22px',
        borderRadius: 14,
        background: 'linear-gradient(160deg, rgba(22,30,58,0.86), rgba(8,11,24,0.86))',
        border: `1px solid ${color}55`,
        borderLeft: `6px solid ${color}`,
        boxShadow: `0 10px 30px rgba(0,0,0,0.45), 0 0 ${10 + 30 * glow}px ${color}${glow > 0.05 ? '55' : '18'}`,
        fontFamily: FONT.sans,
        fontSize: size,
        color: C.ink,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </div>
  );
