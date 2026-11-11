import { useEffect, useState } from 'react'
import {
  WuAppHeader,
  WuAppHeaderSearch,
  WuFooter,
  WuSidebar,
} from '@npm-questionpro/wick-ui-lib'
import { demoUser, PRODUCT_NAME, productCategories } from './data/appHeader'
import { AppSidebar } from './components/AppSidebar'

const PAGES: Record<string, { title: string; body: string }> = {
  '#/home': {
    title: 'Home',
    body: 'Overview and recent activity will live here.',
  },
  '#/ux-research/usability-tests': {
    title: 'Usability tests',
    body: 'Manage and analyze usability test sessions.',
  },
  '#/qualitative-research/interviews': {
    title: 'Interviews',
    body: 'Schedule and review in-depth interview studies.',
  },
  '#/qualitative-research/focus-groups': {
    title: 'Focus groups',
    body: 'Moderate and analyze focus group discussions.',
  },
  '#/qualitative-research/diaries': {
    title: 'Diaries',
    body: 'Longitudinal diary study entries and insights.',
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
        <div className="wu-flex-1 wu-p-6 wu-bg-white">
          <h1 className="wu-text-xl wu-font-semibold wu-text-gray-lead">
            {page.title}
          </h1>
          <p className="wu-mt-2 wu-text-sm wu-text-gray-subtle">{page.body}</p>
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
