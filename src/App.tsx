import { useEffect, useState } from 'react'
import {
  WuAppHeader,
  WuAppHeaderSearch,
  WuButton,
  WuFooter,
  WuIcon,
  WuSidebar,
} from '@npm-questionpro/wick-ui-lib'
import { demoUser, PRODUCT_NAME, productCategories } from './data/appHeader'
import { AppSidebar } from './components/AppSidebar'
import { DiaryLibrary } from './components/diaries/DiaryLibrary'
import { SectionHeader } from './components/SectionHeader'

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

function App() {
  const [route, setRoute] = useState(
    () => window.location.hash || DEFAULT_ROUTE,
  )

  useEffect(() => {
    const onHashChange = () =>
      setRoute(window.location.hash || DEFAULT_ROUTE)
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const page = PAGES[route] ?? PAGES[DEFAULT_ROUTE]

  return (
    <div style={{ minHeight: '100vh' }} className="wu-bg-gray-10">
      <WuAppHeader
        productName={PRODUCT_NAME}
        categories={productCategories}
        user={demoUser}
        onLogout={() => console.log('logout')}
      >
        <WuAppHeaderSearch onSearch={(q) => console.log('search:', q)} />
      </WuAppHeader>
      <WuSidebar Sidebar={<AppSidebar activeRoute={route} />} defaultOpen>
        <div className="wu-flex wu-flex-col wu-flex-1 wu-bg-white">
          <SectionHeader
            title={page.title}
            actions={
              page.actionLabel ? (
                <WuButton
                  variant="primary"
                  Icon={<WuIcon icon="wm-add-2" />}
                  onClick={() => console.log('new:', page.actionLabel)}
                >
                  {page.actionLabel}
                </WuButton>
              ) : undefined
            }
          />
          {route === '#/qualitative-research/diaries' ? (
            <DiaryLibrary />
          ) : (
            <div className="wu-flex-1 wu-p-6">
              <p className="wu-text-sm wu-text-gray-subtle">{page.body}</p>
            </div>
          )}
        </div>
        <WuFooter>
          <span>
            Information architecture @QuestionPro UX &copy; QuestionPro 2026
          </span>
        </WuFooter>
      </WuSidebar>
    </div>
  )
}

export default App
