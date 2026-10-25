import { CALORIES, FICTIONAL } from './assumptions'
import type { AuditResult } from './types'

/**
 * The alternate timeline: modeled minutes converted into imaginary achievements. Every count is
 * modeled minutes ÷ a duration built from the assumptions below, which the user can edit.
 */
export interface TimelineAssumptions {
  /** Reading speed. 0.8 pages a minute ≈ 238 words a minute (Brysbaert 2019) at ~300 words a page. */
  pagesPerMinute: number
  pagesPerBook: number
  lessonMinutes: number
  /** Lessons in a beginner Python course. */
  pythonLessons: number
  tutorialMinutes: number
}

export const DEFAULT_TIMELINE: TimelineAssumptions = {
  pagesPerMinute: 0.8,
  pagesPerBook: 200,
  lessonMinutes: 30,
  pythonLessons: 20,
  tutorialMinutes: 25,
}

export const TIMELINE_LIMITS: Record<keyof TimelineAssumptions, [number, number]> = {
  pagesPerMinute: [0.1, 5],
  pagesPerBook: [20, 2000],
  lessonMinutes: [5, 240],
  pythonLessons: [1, 200],
  tutorialMinutes: [2, 240],
}

export interface TimelineItem {
  id: string
  count: number
  label: string
  basis: string
}

export function timelineItems(r: Pick<AuditResult, 'time'>, a: TimelineAssumptions): TimelineItem[] {
  const m = r.time.minutes
  const bookMinutes = a.pagesPerBook / a.pagesPerMinute
  return [
    { id: 'books', count: m / bookMinutes, label: 'short books read', basis: `${a.pagesPerBook} pages at ${a.pagesPerMinute} pages a minute` },
    { id: 'lessons', count: m / a.lessonMinutes, label: 'beginner coding lessons', basis: `${a.lessonMinutes} minutes each` },
    { id: 'python', count: m / (a.pythonLessons * a.lessonMinutes), label: 'Python basics courses finished', basis: `${a.pythonLessons} lessons × ${a.lessonMinutes} minutes` },
    { id: 'tutorials', count: m / (a.tutorialMinutes / 2), label: 'tutorials quit halfway, plus a new tab', basis: `${a.tutorialMinutes} minute tutorials, abandoned at the midpoint` },
    { id: 'films', count: m / 120, label: 'movies, the real absolute cinema', basis: '2 hours each' },
    { id: 'flights', count: m / 480, label: 'flights from London to New York', basis: 'about 8 hours each' },
  ]
}

export interface FictionalMeters {
  brainrotXP: number
  lockInPotential: number
  productivityPoints: number
}

/** Openly made up meters. Labelled fictional wherever they appear. */
export function fictionalMeters(r: Pick<AuditResult, 'time' | 'fictional'>): FictionalMeters {
  return {
    brainrotXP: r.fictional.brainrotXP,
    // One "lock in" point per modeled hour. Made up.
    lockInPotential: Math.round(r.time.hours),
    // Twelve imaginary productivity points per modeled hour. Also made up.
    productivityPoints: Math.round(r.time.hours * 12),
  }
}

/** Optional calorie guess, shown with its formula. Never presented as measured. */
export function calorieLine(r: Pick<AuditResult, 'calories' | 'time'>): string | null {
  if (!r.calories) return null
  const mins = Math.round(r.time.minutes)
  return `${mins.toLocaleString('en-US')} min × ${r.calories.kcalPerMinute} kcal per min = ${Math.round(r.calories.kcal).toLocaleString('en-US')} kcal, your guess. Sitting still burns about ${CALORIES.sittingPerMinute70kg.value.toFixed(1)} per min anyway.`
}

export const FICTIONAL_NOTE = FICTIONAL.auraDebtPerSession.note
