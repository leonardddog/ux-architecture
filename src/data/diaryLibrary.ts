import type { IWuIcons } from '@npm-questionpro/wick-ui-lib'

export type DiaryNavId = 'all' | 'recent' | 'favorites'

const RECENT_LIMIT = 5

export type DiaryView = 'grid' | 'list'

export type DiaryFilter =
  | { type: 'nav'; value: DiaryNavId }
  | { type: 'folder'; value: string }

export interface DiaryNavItem {
  id: DiaryNavId
  label: string
  icon: IWuIcons
}

export interface DiaryEntry {
  id: string
  title: string
  folder: string
  cover: string
  featured?: boolean
  favorite?: boolean
}

export const DIARY_NAV: DiaryNavItem[] = [
  { id: 'all', label: 'All diaries', icon: 'wm-home-storage' },
  { id: 'recent', label: 'Recent', icon: 'wm-history' },
  { id: 'favorites', label: 'Favorites', icon: 'wm-star' },
]

export const DIARY_LIBRARY_ROUTE = '#/qualitative-research/diaries'

export function diaryStudyRoute(id: string): string {
  return `${DIARY_LIBRARY_ROUTE}/${id}`
}

export function getDiaryEntry(id: string): DiaryEntry | undefined {
  return DIARY_ENTRIES.find((entry) => entry.id === id)
}

export const DIARY_FOLDERS = [
  'Default',
  'Q1 Project 2026',
  'Energizer consumer patterns',
  'North & Latin America',
  'XDay 2026',
]

// Covers are generic entry imagery rather than file previews, so a few
// entries intentionally share the same photo.
export const DIARY_ENTRIES: DiaryEntry[] = [
  {
    id: 'holidays-2026',
    title: 'Holidays 2026',
    folder: 'Default',
    cover: '/diaries/holidays-2026.png',
    favorite: true,
  },
  {
    id: 'summer-consumer-behavior',
    title: 'Summer consumer behavior',
    folder: 'Q1 Project 2026',
    cover: '/diaries/summer-consumer-behavior.png',
  },
  {
    id: 'office-rentals',
    title: 'Office rentals',
    folder: 'Energizer consumer patterns',
    cover: '/diaries/office-rentals.png',
  },
  {
    id: 'design-patterns',
    title: 'Design patterns during this',
    folder: 'North & Latin America',
    cover: '/diaries/design-patterns.png',
  },
  {
    id: 'marketing-research',
    title: 'Marketing research',
    folder: 'XDay 2026',
    cover: '/diaries/marketing-research.png',
  },
  {
    id: 'screen-recording-2026-09-15',
    title: 'Screen recording – 2026-09-15',
    folder: 'Default',
    cover: '/diaries/screen-recording.png',
  },
  {
    id: 'onboarding-walkthrough-v3',
    title: 'Onboarding walkthrough v3',
    folder: 'Q1 Project 2026',
    cover: '/diaries/onboarding-walkthrough.png',
    featured: true,
    favorite: true,
  },
  {
    id: 'dashboard-mockup-dark',
    title: 'Dashboard mockup (dark)',
    folder: 'Energizer consumer patterns',
    cover: '/diaries/dashboard-mockup.png',
  },
  {
    id: 'api-documentation-v4-1',
    title: 'API documentation v4.1',
    folder: 'North & Latin America',
    cover: '/diaries/office-rentals.png',
  },
  {
    id: 'notification-chime-alt',
    title: 'Notification chime (alt)',
    folder: 'XDay 2026',
    cover: '/diaries/marketing-research.png',
  },
  {
    id: 'icon-set-navigation-24px',
    title: 'Navigation icon set',
    folder: 'Default',
    cover: '/diaries/design-patterns.png',
  },
  {
    id: 'inter-variable',
    title: 'Inter variable',
    folder: 'Q1 Project 2026',
    cover: '/diaries/summer-consumer-behavior.png',
  },
  {
    id: 'login-page-redesign-v2',
    title: 'Login page redesign v2',
    folder: 'Energizer consumer patterns',
    cover: '/diaries/login-redesign.png',
  },
  {
    id: 'customer-testimonial-anna',
    title: 'Customer testimonial – Anna',
    folder: 'North & Latin America',
    cover: '/diaries/customer-testimonial.png',
    favorite: true,
  },
]

export function getDiaryFilterLabel(filter: DiaryFilter): string {
  if (filter.type === 'folder') {
    return filter.value
  }

  return DIARY_NAV.find((item) => item.id === filter.value)?.label ?? 'All diaries'
}

export function filterDiaryEntries(
  entries: DiaryEntry[],
  filter: DiaryFilter,
  query: string,
): DiaryEntry[] {
  const needle = query.trim().toLowerCase()

  const matches = entries.filter((entry) => {
    if (
      needle &&
      !`${entry.title} ${entry.folder}`.toLowerCase().includes(needle)
    ) {
      return false
    }

    if (filter.type === 'folder') {
      return entry.folder === filter.value
    }

    if (filter.value === 'favorites') {
      return entry.favorite === true
    }

    return true
  })

  if (filter.type === 'nav' && filter.value === 'recent') {
    return matches.slice(0, RECENT_LIMIT)
  }

  return matches
}
