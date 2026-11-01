import type React from 'react';
import {Check} from './Check';
import {Chromium} from './Chromium';
import {Coupling} from './Coupling';
import {Fine} from './Fine';
import {Hook} from './Hook';
import {Hund} from './Hund';
import {Hydrogen} from './Hydrogen';
import {Laser} from './Laser';
import {Manganese} from './Manganese';
import {Mercury} from './Mercury';
import {Micro} from './Micro';
import {Outro} from './Outro';
import {Parity} from './Parity';
import {Patterns} from './Patterns';
import {Pauli} from './Pauli';
import {Period4} from './Period4';
import {Phosphor} from './Phosphor';
import {Recap} from './Recap';
import {Roadmap} from './Roadmap';
import {Rules} from './Rules';
import {Singlet} from './Singlet';
import {Spin} from './Spin';
import {Symbol} from './Symbol';
import {Title} from './Title';

// Pemetaan id scene di naskah → komponen visual.
export const SCENES: Record<string, React.FC> = {
  hook: Hook,
  title: Title,
  roadmap: Roadmap,
  spin: Spin,
  pauli: Pauli,
  singlet: Singlet,
  symbol: Symbol,
  coupling: Coupling,
  hund: Hund,
  micro: Micro,
  patterns: Patterns,
  period4: Period4,
  chromium: Chromium,
  fine: Fine,
  parity: Parity,
  rules: Rules,
  check: Check,
  hydrogen: Hydrogen,
  mercury: Mercury,
  glow: Phosphor,
  manganese: Manganese,
  laser: Laser,
  recap: Recap,
  outro: Outro,
};
