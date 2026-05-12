import { useEffect, useMemo, useState } from 'react';
import Sidebar from './components/Sidebar';
import { PageShell } from './components/PageShell';
import { Panel } from './components/Panel';
import { AnimControls } from './components/AnimControls';
import { StepExplainer } from './components/StepExplainer';
import { useAnimation } from './hooks/useAnimation';
import { motion } from 'framer-motion';
import { Grid3X3 } from 'lucide-react';

type Cell = { raw: string; value: number | null; missing: boolean };
type Grid = Cell[][];

function parseGrid(text: string): Grid {
  try {
    const lines = text.trim().split('\n').map(l => l.trim());
    const rows: Grid = [];
    let expectedLen: number | null = null;
    for (const line of lines) {
      if (line.length === 0) continue;
      const parts = line.split(',').map(s => s.trim());
      if (expectedLen === null) expectedLen = parts.length;
      if (parts.length !== expectedLen) {
        throw new Error(`Row lengths differ: expected ${expectedLen}, got ${parts.length}`);
      }
      const cells: Cell[] = parts.map((token) => {
        const lower = token.toLowerCase();
        const isMissing = lower === '' || lower === 'na' || lower === 'null' || lower === 'nan' || lower === '.';
        if (isMissing) return { raw: token, value: null, missing: true };
        const n = Number(token);
        if (Number.isNaN(n)) {
          throw new Error(`Expected number or NA/null, found '${token}'`);
        }
        return { raw: token, value: n, missing: false };
      });
      rows.push(cells);
    }
    return rows;
  } catch (err) {
    console.error('[parseGrid] failed:', err);
    throw err;
  }
}

interface Step {
  index: number; // flat index
  r: number;
  c: number;
  isMissing: boolean;
  message: string;
  totalMissingSoFar: number;
}

function buildSteps(grid: Grid): Step[] {
  try {
    const rows = grid.length;
    const cols = grid[0]?.length ?? 0;
    const steps: Step[] = [];
    let countMissing = 0;
    let idx = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cell = grid[r][c];
        const miss = cell.missing;
        if (miss) countMissing++;
        steps.push({
          index: idx,
          r,
          c,
          isMissing: miss,
          totalMissingSoFar: countMissing,
          message: miss
            ? `Cell (${r + 1}, ${c + 1}) is missing → mark highlighted`
            : `Cell (${r + 1}, ${c + 1}) is present (${cell.value})`
        });
        idx++;
      }
    }
    // final summary step
    steps.push({
      index: idx,
      r: -1,
      c: -1,
      isMissing: false,
      totalMissingSoFar: countMissing,
      message: `Complete: scanned ${rows * cols} cells, found ${countMissing} missing`
    });
    console.log('[steps] generated', steps.length, 'steps');
    if (steps.length <= 1) {
      console.warn('[steps] suspiciously few steps --', steps.length);
    }
    return steps;
  } catch (err) {
    console.error('[buildSteps] failed:', err);
    return [];
  }
}

const defaultInput = `12, , 9, NA
7, 5, , 2
., 3, 8, 1
null, 6, 4, `;

export default function App() {
  const [input, setInput] = useState<string>(defaultInput);
  const [error, setError] = useState<string | null>(null);
  const [grid, setGrid] = useState<Grid>(() => parseGrid(defaultInput));
  const steps = useMemo(() => buildSteps(grid), [grid]);
  const anim = useAnimation({ totalSteps: steps.length, baseMs: 700 });

  useEffect(() => {
    console.log('[App] mounted', { topic: 'Identifying Missing Values', totalSteps: steps.length });
  }, [steps.length]);

  const current = steps[anim.step] ?? steps[0];

  const applyInput = () => {
    try {
      const parsed = parseGrid(input);
      setGrid(parsed);
      setError(null);
      console.log('[Input] applied', { rows: parsed.length, cols: parsed[0]?.length ?? 0 });
      anim.reset();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to parse input';
      setError(msg);
    }
  };

  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;

  return (
    <div className="flex h-full w-full">
      <Sidebar />
      <main className="flex-1 overflow-y-auto mesh-bg relative">
        <div className="relative z-10 p-6">
          <PageShell
            title="Identifying Missing Values"
            icon={<Grid3X3 className="w-5 h-5 accent-teal" />}
            accent="teal"
            description="We scan the data grid cell by cell, highlighting gaps (missing values) as we go. Missing values include empty cells, NA/null tokens, or non-numeric placeholders."
          >
            <div className="grid grid-cols-12 gap-4">
              <Panel title="Data Grid" accent="teal" className="col-span-12 lg:col-span-7">
                <GridView
                  grid={grid}
                  highlightIndex={current?.index ?? 0}
                  doneIndex={Math.max(0, Math.min(steps.length - 2, anim.step))}
                  rows={rows}
                  cols={cols}
                />
              </Panel>

              <div className="col-span-12 lg:col-span-5 space-y-4">
                <Panel title="Custom Input" accent="teal">
                  <CustomInput
                    input={input}
                    setInput={setInput}
                    error={error}
                    onApply={applyInput}
                  />
                </Panel>

                <StepExplainer text={current?.message ?? ''} accent="teal" />

                <AnimControls
                  step={anim.step}
                  totalSteps={anim.totalSteps}
                  playing={anim.playing}
                  toggle={anim.toggle}
                  reset={anim.reset}
                  onStepForward={() => anim.setStep(Math.min(anim.step + 1, anim.totalSteps - 1))}
                  onStepBack={() => anim.setStep(Math.max(anim.step - 1, 0))}
                />
              </div>
            </div>
          </PageShell>
        </div>
      </main>
    </div>
  );
}

function CustomInput({
  input,
  setInput,
  error,
  onApply
}: {
  input: string;
  setInput: (s: string) => void;
  error: string | null;
  onApply: () => void;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div>
      <button
        aria-label="Toggle Custom Input"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between text-left mb-3"
      >
        <span className="text-sm text-txt-2">Numbers separated by commas or spaces. Use empty, NA, null, or . for missing. Press Apply to run.</span>
        <span className="text-xs text-txt-3">{open ? '▾' : '▸'}</span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        className="overflow-hidden"
      >
        <textarea
          className="w-full h-36 p-3 rounded-md bg-surface-1 border border-edge text-sm font-mono"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          spellCheck={false}
        />
        {error && (
          <div className="mt-2 glass-panel p-2 border-l-[3px] border-red-500/40 text-xs text-red-200">
            {error}
          </div>
        )}
        <div className="mt-3 flex items-center justify-between">
          <div className="text-xs text-txt-3">
            Example: "12, , 9, NA"
          </div>
          <button
            aria-label="Apply Input"
            onClick={onApply}
            className="px-3 py-2 rounded-md accent-bg-teal border accent-border-teal hover:opacity-90 transition"
          >
            Apply
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function GridView({
  grid,
  highlightIndex,
  doneIndex,
  rows,
  cols
}: {
  grid: Grid;
  highlightIndex: number;
  doneIndex: number;
  rows: number;
  cols: number;
}) {
  // compute flat index -> r,c
  const isFinalSummary = highlightIndex >= rows * cols;
  return (
    <div className="flex flex-col gap-2">
      <div className="grid" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gap: '10px' }}>
        {grid.map((row, r) =>
          row.map((cell, c) => {
            const flat = r * cols + c;
            const isCurrent = flat === highlightIndex && !isFinalSummary;
            const isDone = flat <= doneIndex - 1; // processed before current
            const showGlow = isCurrent || (isDone && cell.missing);
            const glowClass = cell.missing ? 'cell-glow-amber' : 'cell-glow-teal';
            const borderCls = showGlow ? glowClass : '';
            const textMuted = flat > doneIndex && !isCurrent ? 'text-txt-3 opacity-60' : 'text-txt-1';
            const bgCls = cell.missing
              ? (isDone || isCurrent ? 'cell-heat-amber-3' : 'cell-heat-amber-1')
              : (isDone ? 'cell-heat-teal-2' : 'cell-heat-teal-0');

            return (
              <motion.div
                key={`${r}-${c}`}
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 28, delay: (r * cols + c) * 0.008 }}
                className={`h-16 rounded-lg border ${bgCls} flex items-center justify-center relative ${borderCls}`}
              >
                <motion.span
                  key={isCurrent ? `cur-${flat}-${cell.raw}` : `val-${flat}-${cell.raw}`}
                  initial={{ y: -6, opacity: 0.8 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 6, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className={`font-mono ${textMuted}`}
                >
                  {cell.missing ? (flat > doneIndex && !isCurrent ? '.' : '∅') : cell.value}
                </motion.span>
                {isCurrent && (
                  <div className="absolute inset-0 rounded-lg animate-glow-pulse" style={{ boxShadow: '0 0 20px 4px var(--glow)' }} />
                )}
              </motion.div>
            );
          })
        )}
      </div>
      <div className="text-xs text-txt-3 mt-1">
        {isFinalSummary
          ? 'Summary view'
          : `Scanning row ${Math.floor(highlightIndex / cols) + 1} of ${rows}`}
      </div>
    </div>
  );
}
