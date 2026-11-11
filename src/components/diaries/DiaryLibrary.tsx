import { useState } from 'react'
import {
  WuCheckbox,
  WuIcon,
  WuInput,
  WuPagination,
  WuSegmentedSelector,
  WuSegmentedSelectorItem,
} from '@npm-questionpro/wick-ui-lib'

const FIGMA = {
  border: '#c2d1f4',
  thumbBg: '#f5f8ff',
  textPrimary: '#31373f',
  textNav: '#1b3380',
  textMuted: '#545e6b',
  activeNavBg: '#e7eefd',
  playOverlay: 'rgba(0,0,0,0.3)',
  focusRing: '#7ac1ff',
}

type MediaKind = 'image' | 'video' | 'audio' | 'font' | 'document'

interface DiaryMedia {
  name: string
  ext: string
  kind: MediaKind
  duration?: string
  featured?: boolean
  folder: string
  favorite?: boolean
}

const MEDIA: DiaryMedia[] = [
  { name: 'Holidays 2026', ext: 'image', kind: 'image', folder: 'Default', favorite: true },
  { name: 'Summer consumer behavior', ext: 'image', kind: 'image', folder: 'Q1 Project 2026' },
  { name: 'Office rentals', ext: 'image', kind: 'image', folder: 'Energizer consumer patterns' },
  { name: 'Design patterns during this', ext: 'image', kind: 'image', folder: 'North & Latin America' },
  { name: 'Marketing research', ext: 'image', kind: 'image', folder: 'XDay 2026' },
  { name: 'Screen_Recording_2026_09_15', ext: 'mp4', kind: 'video', folder: 'Default' },
  {
    name: 'Onboarding_walkthrough_v3',
    ext: 'mov',
    kind: 'video',
    duration: '02:17',
    featured: true,
    folder: 'Q1 Project 2026',
    favorite: true,
  },
  { name: 'Dashboard_mockup_dark', ext: 'png', kind: 'image', folder: 'Energizer consumer patterns' },
  { name: 'API_documentation_v4.1', ext: 'pdf', kind: 'document', folder: 'North & Latin America' },
  { name: 'Notification_chime_alt', ext: 'wav', kind: 'audio', folder: 'XDay 2026' },
  { name: 'Icon_set_navigation_24px', ext: 'svg', kind: 'document', folder: 'Default' },
  { name: 'Inter_Variable', ext: 'woff2', kind: 'font', folder: 'Q1 Project 2026' },
  { name: 'Login_page_redesign_v2', ext: 'jpg', kind: 'image', folder: 'Energizer consumer patterns' },
  { name: 'Customer_testimonial_anna', ext: 'mp4', kind: 'video', folder: 'North & Latin America', favorite: true },
]

const NAV_ITEMS = [
  { icon: 'wm-home' as const, label: 'All' },
  { icon: 'wm-history' as const, label: 'Recent' },
  { icon: 'wm-star' as const, label: 'Favorites' },
]

const FOLDERS = [
  'Default',
  'Q1 Project 2026',
  'Energizer consumer patterns',
  'North & Latin America',
  'XDay 2026',
]

function thumbContent(item: DiaryMedia, index: number) {
  switch (item.kind) {
    case 'image': {
      const hue = (index * 47) % 360
      return (
        <div
          className="wu-absolute wu-inset-0"
          style={{
            background: `linear-gradient(135deg, hsl(${hue} 65% 82%), hsl(${(hue + 45) % 360} 55% 68%))`,
          }}
        />
      )
    }
    case 'video':
      return (
        <div className="wu-absolute wu-inset-0 wu-flex wu-items-center wu-justify-center">
          <WuIcon
            icon="wm-videocam"
            style={{ fontSize: 28, color: '#1b3380' }}
          />
        </div>
      )
    case 'audio':
      return (
        <div className="wu-absolute wu-inset-0 wu-flex wu-items-center wu-justify-center">
          <WuIcon
            icon="wm-audio-file"
            style={{ fontSize: 28, color: '#1b3380' }}
          />
        </div>
      )
    case 'font':
      return (
        <div className="wu-absolute wu-inset-0 wu-flex wu-items-center wu-justify-center">
          <span
            style={{
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontSize: 48,
              color: FIGMA.textNav,
            }}
          >
            Aa
          </span>
        </div>
      )
    case 'document':
      return (
        <div className="wu-absolute wu-inset-0 wu-flex wu-items-center wu-justify-center">
          <WuIcon
            icon="wm-text-snippet"
            style={{ fontSize: 28, color: '#1b3380' }}
          />
        </div>
      )
  }
}

function MediaCard({ item, index }: { item: DiaryMedia; index: number }) {
  return (
    <div
      className="wu-flex wu-flex-col wu-bg-white wu-overflow-hidden wu-min-w-0"
      style={{
        border: `1px solid ${FIGMA.border}`,
        borderRadius: item.featured ? 10 : 8,
        flex: '1 1 0',
        outline: item.featured ? `2px solid ${FIGMA.focusRing}` : undefined,
        outlineOffset: 2,
      }}
    >
      <div
        className="wu-relative wu-w-full"
        style={{ aspectRatio: '240 / 150', background: FIGMA.thumbBg }}
      >
        {thumbContent(item, index)}
        {item.kind === 'video' && item.featured && (
          <>
            <div
              className="wu-absolute wu-flex wu-items-center wu-justify-center"
              style={{
                left: '50%',
                top: '50%',
                width: 40,
                height: 40,
                borderRadius: 36,
                background: FIGMA.playOverlay,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <WuIcon
                icon="wm-play-arrow"
                style={{ fontSize: 24, color: '#fff' }}
              />
            </div>
            {item.duration && (
              <div
                className="wu-absolute"
                style={{
                  right: 8,
                  bottom: 8,
                  height: 24,
                  padding: '4px 6px',
                  borderRadius: 4,
                  background: FIGMA.playOverlay,
                  color: '#fff',
                  fontSize: 12,
                }}
              >
                {item.duration}
              </div>
            )}
            <div
              className="wu-absolute wu-flex wu-items-center wu-justify-center"
              style={{
                top: 8,
                right: 8,
                padding: 4,
                borderRadius: 4,
                background: FIGMA.playOverlay,
              }}
            >
              <WuIcon
                icon="wm-more-vert"
                style={{ fontSize: 18, color: '#fff' }}
              />
            </div>
          </>
        )}
      </div>
      <div className="wu-flex wu-items-center wu-w-full" style={{ padding: 16 }}>
        <span
          className="wu-text-sm wu-truncate"
          style={{ color: FIGMA.textPrimary }}
        >
          {item.name}
          <span style={{ color: FIGMA.textMuted }}>.{item.ext}</span>
        </span>
      </div>
    </div>
  )
}

function NavItem({
  icon,
  label,
  active,
  onClick,
}: {
  icon: 'wm-home' | 'wm-history' | 'wm-star' | 'wm-folder'
  label: string
  active?: boolean
  onClick?: () => void
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onClick?.()
      }}
      className="diary-nav-item wu-flex wu-items-center wu-relative wu-cursor-pointer"
      style={{
        gap: 8,
        minHeight: 32,
        padding: '0 8px',
        borderRadius: 4,
        background: active ? FIGMA.activeNavBg : undefined,
      }}
    >
      <WuIcon icon={icon} style={{ fontSize: 16, color: FIGMA.textNav }} />
      <span
        className="wu-flex-1 wu-text-sm wu-truncate"
        style={{ color: FIGMA.textNav }}
      >
        {label}
      </span>
      <div
        className="diary-item-actions wu-flex wu-items-center"
        style={{ gap: 2 }}
      >
        <span
          className="wu-flex wu-items-center wu-justify-center"
          style={{ width: 24, height: 24, borderRadius: 4 }}
        >
          <WuIcon
            icon="wm-more-vert"
            style={{ fontSize: 18, color: FIGMA.textMuted }}
          />
        </span>
      </div>
    </div>
  )
}

function IconButton({ icon }: { icon: 'wm-add-2' | 'wm-keyboard-arrow-up' }) {
  return (
    <span
      className="wu-flex wu-items-center wu-justify-center wu-cursor-pointer"
      style={{ width: 24, height: 24, borderRadius: 4 }}
    >
      <WuIcon icon={icon} style={{ fontSize: 18, color: FIGMA.textMuted }} />
    </span>
  )
}

export function DiaryLibrary() {
  const [view, setView] = useState('grid')
  const [selectAll, setSelectAll] = useState(false)
  const [activeNav, setActiveNav] = useState('Recent')

  const visibleMedia = MEDIA.filter((item) => {
    if (activeNav === 'All' || activeNav === 'Recent') return true
    if (activeNav === 'Favorites') return item.favorite
    return item.folder === activeNav
  })

  return (
    <div
      className="wu-flex-1 wu-flex wu-bg-white"
      style={{ padding: 32, gap: 32, minHeight: 0 }}
    >
      <aside className="wu-flex wu-flex-col" style={{ width: 240, gap: 8 }}>
        <div className="wu-flex wu-flex-col" style={{ gap: 4 }}>
          {NAV_ITEMS.map((item) => (
            <NavItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              active={activeNav === item.label}
              onClick={() => setActiveNav(item.label)}
            />
          ))}
        </div>
        <div
          className="wu-flex wu-items-center wu-justify-between"
          style={{ minHeight: 32 }}
        >
          <span className="wu-text-xs" style={{ color: FIGMA.textMuted }}>
            My folders
          </span>
          <div className="wu-flex wu-items-center" style={{ gap: 4 }}>
            <IconButton icon="wm-add-2" />
            <IconButton icon="wm-keyboard-arrow-up" />
          </div>
        </div>
        <div className="wu-flex wu-flex-col" style={{ gap: 4 }}>
          {FOLDERS.map((folder) => (
            <NavItem
              key={folder}
              icon="wm-folder"
              label={folder}
              active={activeNav === folder}
              onClick={() => setActiveNav(folder)}
            />
          ))}
        </div>
      </aside>

      <div className="wu-flex-1 wu-flex wu-flex-col" style={{ gap: 16 }}>
        <h2
          className="wu-font-medium"
          style={{ fontSize: 16, lineHeight: '24px', color: FIGMA.textPrimary }}
        >
          {activeNav}
        </h2>

        <div className="wu-flex wu-items-start wu-justify-between wu-w-full">
          <div className="wu-flex wu-items-center" style={{ gap: 8 }}>
            <div style={{ width: 240 }}>
              <WuInput
                variant="outlined"
                Icon={<WuIcon icon="wm-search" />}
                placeholder="Search diary"
              />
            </div>
            <WuSegmentedSelector
              iconOnly
              size="sm"
              defaultValue="grid"
              onChange={(value) => setView(value)}
            >
              <WuSegmentedSelectorItem value="grid">
                <WuIcon icon="wm-grid-view" />
              </WuSegmentedSelectorItem>
              <WuSegmentedSelectorItem value="list">
                <WuIcon icon="wm-lists" />
              </WuSegmentedSelectorItem>
            </WuSegmentedSelector>
          </div>
          <WuPagination
            totalRows={visibleMedia.length}
            initialPageSize={100}
          />
        </div>

        <div>
          <WuCheckbox
            id="diary-select-all"
            checked={selectAll}
            onChange={(checked) => setSelectAll(checked)}
            Label={
              <span className="wu-text-xs" style={{ color: FIGMA.textMuted }}>
                Select all
              </span>
            }
          />
        </div>

        <div
          className="wu-grid wu-w-full"
          style={{
            gridTemplateColumns:
              view === 'grid'
                ? 'repeat(5, minmax(0, 1fr))'
                : 'repeat(1, minmax(0, 1fr))',
            gap: 16,
          }}
        >
          {visibleMedia.map((item, index) => (
            <MediaCard key={item.name} item={item} index={index} />
          ))}
        </div>
      </div>
    </div>
  )
}
