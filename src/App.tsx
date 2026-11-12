import { useEffect, useRef, useState } from 'react'
import {
  WuAppHeader,
  WuAppHeaderSearch,
  WuButton,
  WuFooter,
  WuIcon,
  WuSidebar,
  useWuSidebar,
} from '@npm-questionpro/wick-ui-lib'
import { demoUser, PRODUCT_NAME, productCategories } from './data/appHeader'
import {
  DIARY_LIBRARY_ROUTE,
  diaryStudyRoute,
  getDiaryEntry,
} from './data/diaryLibrary'
import type { DiaryEntry, DiaryFilter } from './data/diaryLibrary'
import { AppSidebar } from './components/AppSidebar'
import {
  DiaryBreadcrumbs,
  type DiaryBreadcrumbItem,
} from './components/diaries/DiaryBreadcrumbs'
import { DiaryLibrary } from './components/diaries/DiaryLibrary'
import { DiaryStudy } from './components/diaries/DiaryStudy'
import { SectionHeader } from './components/SectionHeader'
import { UsabilityTestLibrary } from './components/usability-tests/UsabilityTestLibrary'

const PAGES: Record<
  string,
  { title: string; body: string; actionLabel?: string }
> = {
  '#/home': {
    title: 'Home',
    body: 'Overview and recent activity will live here.',
  },
  '#/ux-research/usability-tests': {
    title: 'Usability tests',
    body: 'Manage and analyze usability test sessions.',
    actionLabel: 'New usability test',
  },
  '#/qualitative-research/interviews': {
    title: 'Interviews',
    body: 'Schedule and review in-depth interview studies.',
    actionLabel: 'New interview',
  },
  '#/qualitative-research/focus-groups': {
    title: 'Focus groups',
    body: 'Moderate and analyze focus group discussions.',
    actionLabel: 'New focus group',
  },
  '#/qualitative-research/diaries': {
    title: 'Diaries',
    body: 'Longitudinal diary study entries and insights.',
    actionLabel: 'New diary',
  },
  '#/panels': {
    title: 'Panels',
    body: 'Recruit and manage research participant panels.',
  },
  '#/analytics': {
    title: 'Analytics',
    body: 'Cross-study analytics and reporting.',
  },
  '#/settings': {
    title: 'Settings',
    body: 'Workspace and account configuration.',
  },
}

const DEFAULT_ROUTE = '#/home'

/**
 * Keeps the global sidebar in its icon rail while a diary workspace is open,
 * then restores whatever state it had before the diary was entered — except
 * when returning to the diaries list, where it stays collapsed.
 */
function DiarySidebarSync({
  inStudy,
  keepCollapsedOnExit,
  studySidebarOpen,
  onShowStudySidebar,
}: {
  inStudy: boolean
  keepCollapsedOnExit: boolean
  studySidebarOpen: boolean
  onShowStudySidebar: () => void
}) {
  const { open, setOpen } = useWuSidebar()
  const wasOpenRef = useRef<boolean | null>(null)

  // The global sidebar never expands inside a diary.
  useEffect(() => {
    if (!inStudy) return
    if (wasOpenRef.current === null) wasOpenRef.current = open
    if (open) setOpen(false)
  }, [inStudy, open, setOpen])

  useEffect(() => {
    if (inStudy || wasOpenRef.current === null) return
    const previous = wasOpenRef.current
    wasOpenRef.current = null

    // Returning to the diaries list keeps the rail collapsed. The saved
    // pre-diary state is discarded so later navigation does not reopen it.
    if (keepCollapsedOnExit) {
      if (open) setOpen(false)
      return
    }

    if (open !== previous) setOpen(previous)
  }, [inStudy, keepCollapsedOnExit, open, setOpen])

  // While the diary sidebar is hidden its header toggle is gone, so the global
  // trigger is repurposed to bring the diary sidebar back instead of expanding
  // the global rail.
  useEffect(() => {
    if (!inStudy) return
    const onClick = (event: MouseEvent) => {
      const target = event.target as Element | null
      if (!target?.closest('[data-sidebar="trigger"]')) return
      event.preventDefault()
      event.stopPropagation()
      if (!studySidebarOpen) onShowStudySidebar()
    }
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [inStudy, studySidebarOpen, onShowStudySidebar])

  return null
}

function App() {
  const [route, setRoute] = useState(
    () => window.location.hash || DEFAULT_ROUTE,
  )
  const [studySidebarOpen, setStudySidebarOpen] = useState(true)
  const [diaryFilter, setDiaryFilter] = useState<DiaryFilter>({
    type: 'nav',
    value: 'recent',
  })

  useEffect(() => {
    const onHashChange = () =>
      setRoute(window.location.hash || DEFAULT_ROUTE)
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const page = PAGES[route] ?? PAGES[DEFAULT_ROUTE]

  const diaryStudyId = route.startsWith(`${DIARY_LIBRARY_ROUTE}/`)
    ? route.slice(DIARY_LIBRARY_ROUTE.length + 1)
    : null
  const studyEntry = diaryStudyId ? getDiaryEntry(diaryStudyId) : undefined
  const isDiaryLibrary =
    route === DIARY_LIBRARY_ROUTE ||
    (diaryStudyId !== null && studyEntry === undefined)
  const activePage = isDiaryLibrary ? PAGES[DIARY_LIBRARY_ROUTE] : page

  useEffect(() => {
    setStudySidebarOpen(true)
  }, [diaryStudyId])

  const openDiary = (entry: DiaryEntry) => {
    window.location.hash = diaryStudyRoute(entry.id)
  }

  const openDiaryLibrary = (filter: DiaryFilter) => {
    setDiaryFilter(filter)
    if (route !== DIARY_LIBRARY_ROUTE) {
      window.location.hash = DIARY_LIBRARY_ROUTE
    }
  }

  const diarySectionTitle = PAGES[DIARY_LIBRARY_ROUTE].title
  const breadcrumbs: DiaryBreadcrumbItem[] = studyEntry
    ? [
      {
        label: diarySectionTitle,
        href: DIARY_LIBRARY_ROUTE,
        onClick: () => setDiaryFilter({ type: 'nav', value: 'all' }),
      },
      {
        label: studyEntry.folder,
        onClick: () =>
          openDiaryLibrary({ type: 'folder', value: studyEntry.folder }),
      },
      { label: studyEntry.title },
    ]
    : isDiaryLibrary
      ? [{ label: diarySectionTitle }]
      : []

  return (
    <div
      style={studyEntry ? undefined : { minHeight: '100vh' }}
      className={`wu-bg-gray-10${studyEntry ? ' diary-study-page' : ''}${studyEntry && studySidebarOpen ? ' diary-study-open' : ''
        }`}
    >
      <WuAppHeader
        productName={PRODUCT_NAME}
        categories={productCategories}
        user={demoUser}
        onLogout={() => console.log('logout')}
      >
        <div className="app-header-context">
          <DiaryBreadcrumbs items={breadcrumbs} />
          <div className="app-header-search">
            <WuAppHeaderSearch onSearch={(q) => console.log('search:', q)} />
          </div>
        </div>
      </WuAppHeader>
      <WuSidebar Sidebar={<AppSidebar activeRoute={route} />} defaultOpen>
        <DiarySidebarSync
          inStudy={studyEntry !== undefined}
          keepCollapsedOnExit={isDiaryLibrary}
          studySidebarOpen={studySidebarOpen}
          onShowStudySidebar={() => setStudySidebarOpen(true)}
        />
        <div
          className="wu-flex wu-flex-col wu-flex-1 wu-bg-white"
          style={
            studyEntry
              ? {
                height: 'calc(100svh - 48px)',
                maxHeight: 'calc(100svh - 48px)',
                minHeight: 0,
              }
              : undefined
          }
        >
          {studyEntry ? (
            <DiaryStudy
              key={studyEntry.id}
              entry={studyEntry}
              sidebarOpen={studySidebarOpen}
              onSidebarOpenChange={setStudySidebarOpen}
            />
          ) : (
            <>
              <SectionHeader
                title={activePage.title}
                actions={
                  activePage.actionLabel ? (
                    <WuButton
                      variant="primary"
                      Icon={<WuIcon icon="wm-add-2" />}
                      onClick={() =>
                        console.log('new:', activePage.actionLabel)
                      }
                    >
                      {activePage.actionLabel}
                    </WuButton>
                  ) : undefined
                }
              />
              {route === '#/ux-research/usability-tests' ? (
                <UsabilityTestLibrary />
              ) : isDiaryLibrary ? (
                <DiaryLibrary
                  onOpen={openDiary}
                  filter={diaryFilter}
                  onFilterChange={setDiaryFilter}
                />
              ) : (
                <div className="wu-flex-1 wu-p-6">
                  <p className="wu-text-sm wu-text-gray-subtle">
                    {activePage.body}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
        <WuFooter>
          <div className="app-footer-content">
            <span>Information architecture &copy; QuestionPro 2026</span>
            <WuButton
              size="md"
              variant="secondary"
              iconOnly
              aria-label="Lab research"
              Icon={
                <WuIcon
                  icon="wm-lab-research"
                  style={{ color: '#545e6b' }}
                />
              }
              onClick={() => console.log('lab research')}
            />
          </div>
        </WuFooter>
      </WuSidebar>
    </div>
  )
}

export default App
