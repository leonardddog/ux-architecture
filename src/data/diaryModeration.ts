import type { IWuIcons } from '@npm-questionpro/wick-ui-lib'

export type ModerationDateRange = 'all' | 'today' | 'yesterday' | 'last-7-days'

export interface DiaryModerationAttachment {
  id: string
  name: string
  type: string
  /** Local preview image shown in the attachment card. */
  preview?: string
}

export interface DiaryModerationVote {
  icon: IWuIcons
  label: string
}

export interface DiaryModerationActivity {
  id: string
  participantName: string
  /** ISO timestamp used for sorting, relative labels and date filtering. */
  createdAt: string
  quest: string
  task: string
  taskIcon: IWuIcons
  body?: string
  vote?: DiaryModerationVote
  attachments?: DiaryModerationAttachment[]
}

export interface ModerationFilters {
  query: string
  quest: string
  task: string
  dateRange: ModerationDateRange
}

const HOUR = 60 * 60 * 1000
const DAY = 24 * HOUR

// Freeze the clock when the prototype loads so relative labels stay stable
// while the user interacts with the feed.
const NOW = Date.now()

function ago(offset: number): string {
  return new Date(NOW - offset).toISOString()
}

export const DIARY_MODERATION_ACTIVITIES: DiaryModerationActivity[] = [
  {
    id: 'nathan-lopez-beach-trip',
    participantName: 'Nathan Lopez',
    createdAt: ago(2 * HOUR),
    quest: 'Q1: Vacations 2026',
    task: 'Travel photojournal',
    taskIcon: 'wm-art-track',
    body: 'Took this photo during our beach trip last summer! We found this little spot while walking around after breakfast, and it ended up being one of my favorite moments of the vacation. It was so peaceful, and we stayed there for almost an hour just enjoying the view.',
    attachments: [
      {
        id: 'screenshot-20251204',
        name: 'Screenshot_20251204_163830_CX On The Go',
        type: 'JPEG',
        preview: '/diaries/holidays-2026.png',
      },
    ],
  },
  {
    id: 'lisa-simpson-vacation-plans',
    participantName: 'Lisa Simpson',
    createdAt: ago(26 * HOUR),
    quest: 'Q1: Vacations 2026',
    task: 'Vacation plans',
    taskIcon: 'wm-thumbs-up-down',
    vote: { icon: 'wm-thumb-up', label: 'Agreed' },
  },
  {
    id: 'maya-rodriguez-quiet-trail',
    participantName: 'Maya Rodriguez',
    createdAt: ago(28 * HOUR),
    quest: 'Q1: Vacations 2026',
    task: 'Travel photojournal',
    taskIcon: 'wm-art-track',
    body: 'Found a quiet trail behind the rental house and walked it every morning. The light through the trees was unreal, and it made the whole trip feel slower in the best way.',
  },
  {
    id: 'daniel-okafor-weekend-coffee',
    participantName: 'Daniel Okafor',
    createdAt: ago(30 * HOUR),
    quest: 'Q2: Weekend routines',
    task: 'Morning routine',
    taskIcon: 'wm-schedule',
    body: 'My weekend starts with coffee and a long walk before anyone else is awake. It has become the one routine I refuse to skip, even when the weather is bad.',
  },
  {
    id: 'priya-nair-vacation-plans',
    participantName: 'Priya Nair',
    createdAt: ago(2 * DAY),
    quest: 'Q1: Vacations 2026',
    task: 'Vacation plans',
    taskIcon: 'wm-thumbs-up-down',
    vote: { icon: 'wm-thumb-up', label: 'Strongly agree' },
  },
  {
    id: 'tom-becker-corner-bakery',
    participantName: 'Tom Becker',
    createdAt: ago(3 * DAY),
    quest: 'Q3: Summer food',
    task: 'Local favorites',
    taskIcon: 'wm-breakfast-dining',
    body: 'The tiny bakery on the corner sold out of cinnamon rolls by 8am every day. Worth setting an alarm for — I went back three mornings in a row.',
  },
  {
    id: 'aisha-khan-evening-wind-down',
    participantName: 'Aisha Khan',
    createdAt: ago(4 * DAY),
    quest: 'Q2: Weekend routines',
    task: 'Evening wind-down',
    taskIcon: 'wm-book',
    body: 'I wind down by putting my phone in another room and reading for twenty minutes. It sounds small, but it has made falling asleep noticeably easier.',
  },
  {
    id: 'lucas-ferreira-recipe-swap',
    participantName: 'Lucas Ferreira',
    createdAt: ago(8 * DAY),
    quest: 'Q3: Summer food',
    task: 'Recipe swap',
    taskIcon: 'wm-breakfast-dining',
    vote: { icon: 'wm-thumb-up', label: 'Agreed' },
  },
]

export const MODERATION_QUEST_OPTIONS = [
  ...new Set(DIARY_MODERATION_ACTIVITIES.map((activity) => activity.quest)),
]

export const MODERATION_TASK_OPTIONS = [
  ...new Set(DIARY_MODERATION_ACTIVITIES.map((activity) => activity.task)),
]

export const MODERATION_DATE_OPTIONS: {
  value: ModerationDateRange
  label: string
}[] = [
  { value: 'all', label: 'All time' },
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'last-7-days', label: 'Last 7 days' },
]

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function matchesDateRange(
  createdAt: string,
  range: ModerationDateRange,
): boolean {
  if (range === 'all') {
    return true
  }

  const date = new Date(createdAt)

  if (Number.isNaN(date.getTime())) {
    return false
  }

  const daysAgo = Math.round(
    (startOfDay(new Date()).getTime() - startOfDay(date).getTime()) / DAY,
  )

  if (range === 'today') {
    return daysAgo === 0
  }

  if (range === 'yesterday') {
    return daysAgo === 1
  }

  return daysAgo >= 0 && daysAgo <= 6
}

export function filterModerationActivities(
  activities: DiaryModerationActivity[],
  filters: ModerationFilters,
): DiaryModerationActivity[] {
  const needle = filters.query.trim().toLowerCase()

  return activities
    .filter((activity) => {
      if (filters.quest !== 'all' && activity.quest !== filters.quest) {
        return false
      }

      if (filters.task !== 'all' && activity.task !== filters.task) {
        return false
      }

      if (!matchesDateRange(activity.createdAt, filters.dateRange)) {
        return false
      }

      if (!needle) {
        return true
      }

      const searchable = [
        activity.participantName,
        activity.quest,
        activity.task,
        activity.body ?? '',
        activity.vote?.label ?? '',
        ...(activity.attachments?.map((attachment) => attachment.name) ?? []),
      ]
        .join(' ')
        .toLowerCase()

      return searchable.includes(needle)
    })
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
}

export function formatModerationTime(
  isoDate: string,
  now = Date.now(),
): string {
  const date = new Date(isoDate)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  const daysAgo = Math.round(
    (startOfDay(new Date(now)).getTime() - startOfDay(date).getTime()) / DAY,
  )

  if (daysAgo <= 0) {
    const minutes = Math.max(1, Math.round((now - date.getTime()) / 60_000))

    if (minutes < 60) {
      return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`
    }

    const hours = Math.round(minutes / 60)

    return hours === 1 ? '1 hour ago' : `${hours} hours ago`
  }

  if (daysAgo === 1) {
    return 'Yesterday'
  }

  if (daysAgo < 7) {
    return `${daysAgo} days ago`
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}