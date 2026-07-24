export const LARGE_NUMBERS = [25, 50, 75, 100]
export const SMALL_NUMBERS = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10]

export const NUMBERS_COUNT = 6

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

/** Draw `bigCount` large numbers and the rest small numbers, forming a 6-tile hand. */
export function drawNumbers(bigCount: number): number[] {
  const big = shuffle(LARGE_NUMBERS).slice(0, bigCount)
  const small = shuffle(SMALL_NUMBERS).slice(0, NUMBERS_COUNT - bigCount)
  return shuffle([...big, ...small])
}

export function randomTarget(): number {
  return 100 + Math.floor(Math.random() * 900)
}

export function scoreNumbers(target: number, result: number | null): number {
  if (result === null) return 0
  const diff = Math.abs(target - result)
  if (diff === 0) return 10
  if (diff <= 5) return 7
  if (diff <= 10) return 5
  return 0
}

interface Candidate {
  value: number
  expr: string
}

/** Classic Countdown numbers solver: finds the achievable value closest to the target. */
export function solveNumbers(numbers: number[], target: number): Candidate | null {
  const n = numbers.length
  const memo = new Map<number, Candidate[]>()

  function combosForMask(mask: number): Candidate[] {
    const cached = memo.get(mask)
    if (cached) return cached

    const indices: number[] = []
    for (let i = 0; i < n; i++) if (mask & (1 << i)) indices.push(i)

    let results: Candidate[]
    if (indices.length === 1) {
      const value = numbers[indices[0]]
      results = [{ value, expr: String(value) }]
    } else {
      const seen = new Map<number, string>()
      for (let sub = (mask - 1) & mask; sub > 0; sub = (sub - 1) & mask) {
        const other = mask ^ sub
        if (sub > other) continue // avoid computing each partition twice
        const left = combosForMask(sub)
        const right = combosForMask(other)
        for (const a of left) {
          for (const b of right) {
            for (const cand of combine(a, b)) {
              if (!seen.has(cand.value)) seen.set(cand.value, cand.expr)
            }
          }
        }
      }
      results = Array.from(seen, ([value, expr]) => ({ value, expr }))
    }
    memo.set(mask, results)
    return results
  }

  function combine(a: Candidate, b: Candidate): Candidate[] {
    const out: Candidate[] = []
    out.push({ value: a.value + b.value, expr: `(${a.expr} + ${b.expr})` })
    if (a.value >= b.value) out.push({ value: a.value - b.value, expr: `(${a.expr} - ${b.expr})` })
    else out.push({ value: b.value - a.value, expr: `(${b.expr} - ${a.expr})` })
    out.push({ value: a.value * b.value, expr: `(${a.expr} * ${b.expr})` })
    if (b.value !== 0 && a.value % b.value === 0) out.push({ value: a.value / b.value, expr: `(${a.expr} / ${b.expr})` })
    if (a.value !== 0 && b.value % a.value === 0) out.push({ value: b.value / a.value, expr: `(${b.expr} / ${a.expr})` })
    return out.filter((c) => Number.isInteger(c.value) && c.value > 0)
  }

  let best: Candidate | null = null
  let bestDiff = Infinity
  for (let mask = 1; mask < 1 << n; mask++) {
    for (const cand of combosForMask(mask)) {
      const diff = Math.abs(cand.value - target)
      if (diff < bestDiff) {
        bestDiff = diff
        best = cand
        if (diff === 0) return best
      }
    }
  }
  return best
}

/** Parses and validates a user-entered expression against the drawn numbers. */
export function evaluateExpression(expr: string, available: number[]): number | null {
  const tokens = expr.match(/\d+|[+\-*/()]/g)
  if (!tokens) return null

  const remaining = [...available]
  for (const tok of tokens) {
    if (/^\d+$/.test(tok)) {
      const n = Number(tok)
      const idx = remaining.indexOf(n)
      if (idx === -1) return null // number not available (or reused too many times)
      remaining.splice(idx, 1)
    }
  }

  try {
    const result = evalArithmetic(expr)
    if (result === null || !Number.isInteger(result) || result <= 0) return null
    return result
  } catch {
    return null
  }
}

/** Minimal recursive-descent evaluator for + - * / with parentheses, no external calls. */
function evalArithmetic(expr: string): number | null {
  let pos = 0
  const src = expr.replace(/\s+/g, '')

  function peek(): string | undefined {
    return src[pos]
  }

  function parseNumber(): number {
    const start = pos
    while (pos < src.length && /\d/.test(src[pos])) pos++
    if (pos === start) throw new Error('Expected number')
    return Number(src.slice(start, pos))
  }

  function parseFactor(): number {
    if (peek() === '(') {
      pos++
      const value = parseExpr()
      if (peek() !== ')') throw new Error('Expected )')
      pos++
      return value
    }
    return parseNumber()
  }

  function parseTerm(): number {
    let value = parseFactor()
    while (peek() === '*' || peek() === '/') {
      const op = src[pos]
      pos++
      const rhs = parseFactor()
      if (op === '*') value *= rhs
      else {
        if (rhs === 0 || !Number.isInteger(value / rhs)) throw new Error('Non-integer division')
        value /= rhs
      }
      if (value <= 0) throw new Error('Non-positive intermediate result')
    }
    return value
  }

  function parseExpr(): number {
    let value = parseTerm()
    while (peek() === '+' || peek() === '-') {
      const op = src[pos]
      pos++
      const rhs = parseTerm()
      value = op === '+' ? value + rhs : value - rhs
      if (value <= 0) throw new Error('Non-positive intermediate result')
    }
    return value
  }

  if (src.length === 0) return null
  const result = parseExpr()
  if (pos !== src.length) throw new Error('Unexpected trailing input')
  return result
}
