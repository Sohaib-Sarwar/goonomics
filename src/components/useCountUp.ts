import { useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'

/** Eases a number up to `target` once. Reduced motion (or a zero target) shows the final value. */
export function useCountUp(target: number, durationMs = 900, delayMs = 0): number {
  const reduce = useReducedMotion()
  const [value, setValue] = useState(reduce || target === 0 ? target : 0)

  useEffect(() => {
    if (reduce || target === 0) {
      setValue(target)
      return
    }
    let raf = 0
    const begin = performance.now() + delayMs
    const tick = (now: number) => {
      const t = Math.min(1, Math.max(0, (now - begin) / durationMs))
      const eased = 1 - Math.pow(1 - t, 3)
      setValue(target * eased)
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, durationMs, delayMs, reduce])

  return value
}
