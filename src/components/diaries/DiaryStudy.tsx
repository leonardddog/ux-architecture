import { useState } from 'react'
import { WuButton, WuIcon } from '@npm-questionpro/wick-ui-lib'
import type { IWuIcons } from '@npm-questionpro/wick-ui-lib'
import type { DiaryEntry } from '../../data/diaryLibrary'
import { SectionHeader } from '../SectionHeader'
import { DiaryEdit } from './DiaryEdit'
import { DiaryNavIcon } from './DiaryNavIcon'

const FIGMA = {
  border: 'rgba(27, 51, 128, 0.08)',
  shadow: '2px 0px 32px 0px rgba(27, 51, 128, 0.04)',
  textPrimary: '#31373f',
  textNav: '#1b3380',
  textMuted: '#545e6b',
  textSubtle: '#98a2b2',
  activeBg: '#e7eefd',
  successBg: '#f4fbf4',
  success: '#138c13',
  white: '#ffffff',
}

type StudyNavItem = {
  id: string
  label: string
  icon: IWuIcons
}

type StudyNavGroup = {
  label?: string
  items: StudyNavItem[]
}

const STUDY_NAV_GROUPS: StudyNavGroup[] = [
  {
    items: [{ id: 'overview', label: 'Overview', icon: 'wm-dashboard' }],
  },
  {
    label: 'Build',
    items: [{ id: 'edit', label: 'Edit', icon: 'wm-design-services' }],
  },
  {
    label: 'Manage',
    items: [
      { id: 'participants', label: 'Participants', icon: 'wm-group' },
      {
        id: 'moderation',
        label: 'Moderation',
        icon: 'wm-heap-snapshot-thumbnail',
      },
    ],
  },
  {
    label: 'Analyze',
    items: [
      { id: 'responses', label: 'Responses', icon: 'wm-comment' },
      { id: 'analytics', label: 'Analytics', icon: 'wm-analytics' },
    ],
  },
  {
    label: 'Share',
    items: [{ id: 'reports', label: 'Reports', icon: 'wm-assignment' }],
  },
]

const STUDY_BOTTOM_NAV: StudyNavItem[] = [
  { id: 'messages', label: 'Messages', icon: 'wm-forum' },
  { id: 'configuration', label: 'Configuration', icon: 'wm-build' },
]

const DEFAULT_SECTION = 'edit'

const SECTION_COPY: Record<string, string> = {
  overview: 'A summary of this diary study will appear here.',
  edit: 'The diary editor is where the cover, description, quests and tasks are designed.',
  participants: 'Manage who takes part in this diary study.',
  moderation: 'Review and moderate participant diary submissions.',
  responses: 'Browse participant responses as they come in.',
  analytics: 'Track completion, engagement and recurring themes.',
  reports: 'Create and share reports for this study.',
  messages: 'Message participants and your research team.',
  configuration: 'Adjust the study settings and schedule.',
}

const NAV_ITEMS = [
  ...STUDY_NAV_GROUPS.flatMap((group) => group.items),
  ...STUDY_BOTTOM_NAV,
]

function StudyNavRow({
  item,
  active,
  onSelect,
}: {
  item: StudyNavItem
  active: boolean
  onSelect: () => void
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-current={active ? 'page' : undefined}
      className={`diary-nav-item${active ? ' diary-nav-item--active' : ''}`}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onSelect()
        }
      }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        width: '100%',
        minHeight: 32,
        padding: '0 8px',
        borderRadius: 4,
        cursor: 'pointer',
      }}
    >
      <DiaryNavIcon icon={item.icon} color={FIGMA.textNav} />
      <span
        className="wu-flex-1 wu-text-sm wu-truncate"
        style={{ color: FIGMA.textNav, lineHeight: '16px' }}
      >
        {item.label}
      </span>
    </div>
  )
}

function SectionPlaceholder({ item }: { item: StudyNavItem }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        minHeight: 320,
        padding: 48,
        borderRadius: 8,
        border: '1px dashed #c2d1f4',
        background: '#f5f8ff',
        textAlign: 'center',
      }}
    >
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 48,
          height: 48,
          borderRadius: '50%',
          background: FIGMA.activeBg,
          color: FIGMA.textNav,
          marginBottom: 4,
        }}
      >
        <WuIcon icon={item.icon} style={{ fontSize: 24 }} />
      </span>

      <p
        className="wu-text-sm wu-font-medium"
        style={{
          margin: 0,
          color: FIGMA.textPrimary,
          lineHeight: '20px',
        }}
      >
        This section is not built yet
      </p>
      <p
        className="wu-text-sm"
        style={{ margin: 0, color: FIGMA.textMuted, lineHeight: '20px' }}
      >
        {SECTION_COPY[item.id]}
      </p>
    </div>
  )
}

export function DiaryStudy({
  entry,
  sidebarOpen,
  onSidebarOpenChange,
}: {
  entry: DiaryEntry
  sidebarOpen: boolean
  onSidebarOpenChange: (open: boolean) => void
}) {
  const [activeId, setActiveId] = useState(DEFAULT_SECTION)

  const activeItem =
    NAV_ITEMS.find((item) => item.id === activeId) ?? NAV_ITEMS[0]
  const isEdit = activeItem.id === 'edit'
  const isParticipants = activeItem.id === 'participants'

  return (
    <div
      className="wu-flex wu-flex-1"
      style={{
        minHeight: 0,
        background: FIGMA.white,
        alignItems: 'stretch',
        overflow: 'hidden',
      }}
    >
      <aside
        className={`diary-study-aside${
          sidebarOpen ? '' : ' diary-study-aside--hidden'
        }`}
        aria-hidden={!sidebarOpen}
        style={{
          width: 264,
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
          background: FIGMA.white,
          borderRight: `1px solid ${FIGMA.border}`,
          boxShadow: FIGMA.shadow,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            padding: 16,
          }}
        >
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <p
              style={{
                flex: 1,
                minWidth: 0,
                margin: 0,
                fontSize: 14,
                fontWeight: 500,
                lineHeight: '21px',
                color: FIGMA.textPrimary,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {entry.title}
            </p>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                flexShrink: 0,
              }}
            >
              <button
                type="button"
                className="diary-icon-button"
                aria-label={`More actions for ${entry.title}`}
              >
                <WuIcon
                  icon="wm-more-vert"
                  style={{ fontSize: 18, color: FIGMA.textMuted }}
                />
              </button>

              <button
                type="button"
                className="diary-icon-button"
                aria-label="Hide study sidebar"
                onClick={() => onSidebarOpenChange(false)}
              >
                <WuIcon
                  icon="wm-left-panel-close"
                  style={{ fontSize: 18, color: FIGMA.textMuted }}
                />
              </button>
            </div>
          </div>

          <div>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                height: 24,
                padding: '0 6px',
                borderRadius: 20,
                background: FIGMA.successBg,
                color: FIGMA.success,
                fontSize: 12,
                lineHeight: '16px',
              }}
            >
              Active
            </span>
          </div>
        </div>

        <nav
          aria-label="Study sections"
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            padding: '16px 8px 8px',
          }}
        >
          {STUDY_NAV_GROUPS.map((group) => (
            <div
              key={group.label ?? group.items[0].id}
              style={{ display: 'flex', flexDirection: 'column', width: '100%' }}
            >
              {group.label && (
                <div style={{ paddingLeft: 8, marginBottom: 0 }}>
                  <span
                    style={{
                      fontSize: 12,
                      lineHeight: '16px',
                      color: FIGMA.textSubtle,
                    }}
                  >
                    {group.label}
                  </span>
                </div>
              )}

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                  width: '100%',
                }}
              >
                {group.items.map((item) => (
                  <StudyNavRow
                    key={item.id}
                    item={item}
                    active={activeId === item.id}
                    onSelect={() => setActiveId(item.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div
          style={{
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            padding: '16px 8px 8px',
          }}
        >
          {STUDY_BOTTOM_NAV.map((item) => (
            <StudyNavRow
              key={item.id}
              item={item}
              active={activeId === item.id}
              onSelect={() => setActiveId(item.id)}
            />
          ))}
        </div>
      </aside>

      <section
        style={{
          flex: 1,
          minWidth: 0,
          minHeight: 0,
          display: isParticipants ? 'flex' : undefined,
          flexDirection: isParticipants ? 'column' : undefined,
          overflowY: isParticipants ? 'hidden' : 'auto',
          padding: isEdit || isParticipants ? 0 : 32,
          background: FIGMA.white,
        }}
      >
        {isEdit ? (
          <DiaryEdit entry={entry} />
        ) : isParticipants ? (
          <>
            <SectionHeader
              title={activeItem.label}
              actions={
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <WuButton
                    variant="secondary"
                    Icon={<WuIcon icon="wm-settings" />}
                    onClick={() => console.log('invitation settings')}
                  >
                    Invitation settings
                  </WuButton>
                  <WuButton
                    variant="primary"
                    Icon={<WuIcon icon="wm-person-add" />}
                    onClick={() => console.log('add people')}
                  >
                    Add people
                  </WuButton>
                </div>
              }
            />
            <div className="diary-participants-content">
              <SectionPlaceholder item={activeItem} />
            </div>
          </>
        ) : (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span
                className="wu-text-xs"
                style={{ color: FIGMA.textSubtle, lineHeight: '16px' }}
              >
                {entry.folder}
              </span>
              <h1
                className="wu-font-medium"
                style={{
                  margin: 0,
                  fontSize: 18,
                  lineHeight: '32px',
                  color: FIGMA.textPrimary,
                }}
              >
                {activeItem.label}
              </h1>
            </div>

            <div style={{ marginTop: 24 }}>
              <SectionPlaceholder item={activeItem} />
            </div>
          </>
        )}
      </section>
    </div>
  )
}
