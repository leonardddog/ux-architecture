import type { IWuIcons } from '@npm-questionpro/wick-ui-lib'

export type LibraryNavId = 'all' | 'recent' | 'favorites'

const RECENT_LIMIT = 5

export type LibraryView = 'grid' | 'list'

export type MediaKind = 'image' | 'video' | 'audio' | 'document' | 'font'

export type LibraryFilter =
  | { type: 'nav'; value: LibraryNavId }
  | { type: 'folder'; value: string }

export interface LibraryNavItem {
  id: LibraryNavId
  label: string
  icon: IWuIcons
}

export interface LibraryMedia {
  id: string
  name: string
  extension: string
  kind: MediaKind
  folder: string
  image?: string
  duration?: string
  featured?: boolean
  favorite?: boolean
}

export const LIBRARY_NAV: LibraryNavItem[] = [
  { id: 'all', label: 'All tests', icon: 'wm-home-storage' },
  { id: 'recent', label: 'Recent', icon: 'wm-history' },
  { id: 'favorites', label: 'Favorites', icon: 'wm-star' },
]

export const LIBRARY_FOLDERS = [
  'Default',
  'Q1 Project 2026',
  'Mobile checkout study',
  'Onboarding research',
  'Accessibility audit',
]

export const LIBRARY_MEDIA: LibraryMedia[] = [
  {
    id: 'checkout-flow-baseline',
    name: 'Checkout flow – baseline',
    extension: 'png',
    kind: 'image',
    folder: 'Default',
    image: '/usability-tests/checkout-flow.png',
    favorite: true,
  },
  {
    id: 'mobile-navigation-test',
    name: 'Mobile navigation test',
    extension: 'mp4',
    kind: 'video',
    folder: 'Mobile checkout study',
    image: '/usability-tests/mobile-navigation.png',
    duration: '03:42',
  },
  {
    id: 'search-filters-test',
    name: 'Search & filters test',
    extension: 'png',
    kind: 'image',
    folder: 'Mobile checkout study',
    image: '/usability-tests/search-filters.png',
  },
  {
    id: 'dashboard-first-click',
    name: 'Dashboard first-click study',
    extension: 'jpg',
    kind: 'image',
    folder: 'Onboarding research',
    image: '/usability-tests/dashboard-first-click.png',
  },
  {
    id: 'task-success-summary',
    name: 'Task success summary',
    extension: 'pdf',
    kind: 'document',
    folder: 'Mobile checkout study',
  },
  {
    id: 'onboarding-walkthrough-v3',
    name: 'Onboarding walkthrough v3',
    extension: 'mov',
    kind: 'video',
    folder: 'Q1 Project 2026',
    image: '/usability-tests/onboarding-walkthrough.png',
    duration: '02:17',
    featured: true,
    favorite: true,
  },
  {
    id: 'prototype-v2-walkthrough',
    name: 'Prototype v2 walkthrough',
    extension: 'png',
    kind: 'image',
    folder: 'Default',
    image: '/usability-tests/prototype-v2.png',
  },
  {
    id: 'sus-questionnaire-results',
    name: 'SUS questionnaire results',
    extension: 'pdf',
    kind: 'document',
    folder: 'Q1 Project 2026',
  },
  {
    id: 'session-04-p12',
    name: 'Session 04 – P12',
    extension: 'png',
    kind: 'image',
    folder: 'Q1 Project 2026',
    image: '/usability-tests/session-04.png',
    favorite: true,
  },
  {
    id: 'consent-form-template',
    name: 'Consent form template',
    extension: 'docx',
    kind: 'document',
    folder: 'Default',
  },
  {
    id: 'session-audio-p07',
    name: 'Session audio – P07',
    extension: 'wav',
    kind: 'audio',
    folder: 'Onboarding research',
  },
  {
    id: 'card-sort-results',
    name: 'Card sort results',
    extension: 'png',
    kind: 'image',
    folder: 'Onboarding research',
    image: '/usability-tests/card-sort-results.png',
  },
  {
    id: 'heatmap-export',
    name: 'Heatmap export',
    extension: 'png',
    kind: 'image',
    folder: 'Accessibility audit',
    image: '/usability-tests/heatmap-export.png',
  },
  {
    id: 'accessibility-audit-notes',
    name: 'Accessibility audit notes',
    extension: 'pdf',
    kind: 'document',
    folder: 'Accessibility audit',
  },
  {
    id: 'screen-reader-walkthrough',
    name: 'Screen reader walkthrough',
    extension: 'mp4',
    kind: 'video',
    folder: 'Accessibility audit',
    image: '/usability-tests/task-success.png',
    duration: '05:08',
  },
]

export function getLibraryFilterLabel(filter: LibraryFilter): string {
  if (filter.type === 'folder') {
    return filter.value
  }

  return LIBRARY_NAV.find((item) => item.id === filter.value)?.label ?? 'All tests'
}

export function filterLibraryMedia(
  media: LibraryMedia[],
  filter: LibraryFilter,
  query: string,
): LibraryMedia[] {
  const needle = query.trim().toLowerCase()

  const matches = media.filter((item) => {
    if (
      needle &&
      !`${item.name}.${item.extension} ${item.folder}`
        .toLowerCase()
        .includes(needle)
    ) {
      return false
    }

    if (filter.type === 'folder') {
      return item.folder === filter.value
    }

    if (filter.value === 'favorites') {
      return item.favorite === true
    }

    return true
  })

  if (filter.type === 'nav' && filter.value === 'recent') {
    return matches.slice(0, RECENT_LIMIT)
  }

  return matches
}
