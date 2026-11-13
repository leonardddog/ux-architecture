import type { IWuIcons } from '@npm-questionpro/wick-ui-lib'

export type AnalyticsMetric = {
  id: string
  value: string
  label: string
  icon: IWuIcons
}

export const ANALYTICS_SUMMARY: AnalyticsMetric[] = [
  {
    id: 'participants',
    value: '123',
    label: 'Total participants',
    icon: 'wm-group',
  },
  {
    id: 'completion',
    value: '87%',
    label: 'Completion rate',
    icon: 'wm-donut-large',
  },
  { id: 'quests', value: '8', label: 'Quests', icon: 'wm-fact-check' },
  { id: 'tasks', value: '32', label: 'Total tasks', icon: 'wm-list-alt' },
  {
    id: 'days',
    value: '14',
    label: 'Days elapsed',
    icon: 'wm-calendar-today',
  },
]

export type AnalyticsTimelinePoint = {
  date: string
  value: number
}

const TIMELINE_VALUES = [
  40, 65, 55, 30, 60, 80, 65, 58, 72, 91, 65, 58, 72, 81, 38, 45, 30,
]

export const ANALYTICS_TIMELINE: AnalyticsTimelinePoint[] = TIMELINE_VALUES.map(
  (value, index) => ({
    date: `Nov ${String(index + 1).padStart(2, '0')}`,
    value,
  }),
)

export type CompletionScope = 'quests' | 'tasks'

export type CompletionSegmentId = 'completed' | 'in-progress' | 'incomplete'

export type CompletionSegment = {
  id: CompletionSegmentId
  label: string
  percent: number
  color: string
}

export const COMPLETION_SCOPES: Array<{
  value: CompletionScope
  label: string
}> = [
  { value: 'quests', label: 'Quests' },
  { value: 'tasks', label: 'Tasks' },
]

export const ANALYTICS_COMPLETION: Record<
  CompletionScope,
  CompletionSegment[]
> = {
  quests: [
    {
      id: 'completed',
      label: 'Completed',
      percent: 35,
      color: '#184994',
    },
    {
      id: 'in-progress',
      label: 'In progress',
      percent: 25,
      color: '#67a3db',
    },
    {
      id: 'incomplete',
      label: 'Incomplete',
      percent: 40,
      color: '#aad0ff',
    },
  ],
  tasks: [
    {
      id: 'completed',
      label: 'Completed',
      percent: 48,
      color: '#184994',
    },
    {
      id: 'in-progress',
      label: 'In progress',
      percent: 32,
      color: '#67a3db',
    },
    {
      id: 'incomplete',
      label: 'Incomplete',
      percent: 20,
      color: '#aad0ff',
    },
  ],
}

export type AnalyticsTheme = {
  id: string
  title: string
  responses: number
  completionPercent: number
  positive: number
  neutral: number
  negative: number
}

export const THEME_PAGE_SIZE = 4

export const ANALYTICS_THEMES: AnalyticsTheme[] = [
  {
    id: 'morning-routine',
    title: '#1: Morning routine',
    responses: 340,
    completionPercent: 70,
    positive: 20,
    neutral: 60,
    negative: 20,
  },
  {
    id: 'work-environment',
    title: '#2: Work environment',
    responses: 400,
    completionPercent: 100,
    positive: 50,
    neutral: 20,
    negative: 30,
  },
  {
    id: 'wellness-check',
    title: '#3: Wellness check',
    responses: 200,
    completionPercent: 50,
    positive: 15,
    neutral: 15,
    negative: 70,
  },
  {
    id: 'daily-reflection',
    title: '#4: Daily reflection',
    responses: 320,
    completionPercent: 62,
    positive: 35,
    neutral: 35,
    negative: 30,
  },
  {
    id: 'evening-wind-down',
    title: '#5: Evening wind-down',
    responses: 280,
    completionPercent: 55,
    positive: 40,
    neutral: 35,
    negative: 25,
  },
  {
    id: 'social-connection',
    title: '#6: Social connection',
    responses: 240,
    completionPercent: 48,
    positive: 55,
    neutral: 20,
    negative: 25,
  },
  {
    id: 'screen-time',
    title: '#7: Screen time',
    responses: 300,
    completionPercent: 60,
    positive: 30,
    neutral: 45,
    negative: 25,
  },
  {
    id: 'weekend-habits',
    title: '#8: Weekend habits',
    responses: 260,
    completionPercent: 52,
    positive: 45,
    neutral: 30,
    negative: 25,
  },
]

export const SENTIMENT_COLORS = {
  positive: '#42bd84',
  neutral: '#f1da7e',
  negative: '#f85271',
}