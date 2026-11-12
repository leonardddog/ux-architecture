import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import {
  WuCard,
  WuCheckbox,
  WuIcon,
  WuInput,
  WuPagination,
  WuSegmentedSelector,
  WuSegmentedSelectorItem,
} from '@npm-questionpro/wick-ui-lib'
import type { IWuIcons } from '@npm-questionpro/wick-ui-lib'
import {
  DIARY_ENTRIES,
  DIARY_FOLDERS,
  DIARY_NAV,
  filterDiaryEntries,
  getDiaryFilterLabel,
} from '../../data/diaryLibrary'
import type { DiaryEntry, DiaryFilter, DiaryView } from '../../data/diaryLibrary'

const FIGMA = {
  border: '#c2d1f4',
  thumbBg: '#f5f8ff',
  textPrimary: '#31373f',
  textNav: '#1b3380',
  textMuted: '#545e6b',
  white: '#ffffff',
}

const PAGE_SIZE = 100

function EntryCover({
  entry,
  compact = false,
}: {
  entry: DiaryEntry
  compact?: boolean
}) {
  return (
    <div
      style={{
        position: 'relative',
        width: compact ? 64 : '100%',
        height: compact ? 48 : undefined,
        aspectRatio: compact ? undefined : '240 / 150',
        flexShrink: 0,
        overflow: 'hidden',
        background: FIGMA.thumbBg,
      }}
    >
      <img
        src={entry.cover}
        alt=""
        loading="lazy"
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />

      {!compact && (
        <button
          type="button"
          aria-label={`More actions for ${entry.title}`}
          className="diary-icon-button diary-cover-action"
          onClick={(event) => event.stopPropagation()}
        >
          <WuIcon
            icon="wm-more-vert"
            style={{ fontSize: 18, color: FIGMA.white }}
          />
        </button>
      )}
    </div>
  )
}

function EntryCard({
  entry,
  onOpen,
}: {
  entry: DiaryEntry
  onOpen?: (entry: DiaryEntry) => void
}) {
  return (
    <WuCard
      rounded
      role="link"
      tabIndex={0}
      aria-label={`Open ${entry.title}`}
      className="diary-media-card wu-overflow-hidden wu-flex wu-flex-col wu-min-w-0 wu-cursor-pointer"
      onClick={() => onOpen?.(entry)}
      onKeyDown={(event) => {
        if (event.target !== event.currentTarget) {
          return
        }

        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onOpen?.(entry)
        }
      }}
      style={{
        padding: 0,
        flex: '1 1 0',
        borderRadius: 8,
        border: `1px solid ${FIGMA.border}`,
        background: FIGMA.white,
      }}
    >
      <EntryCover entry={entry} />

      <div
        className="wu-flex wu-items-center wu-w-full"
        style={{ padding: 16, minWidth: 0 }}
      >
        <span
          className="wu-text-sm wu-truncate"
          style={{ color: FIGMA.textPrimary, lineHeight: '16px' }}
        >
          {entry.title}
        </span>
      </div>
    </WuCard>
  )
}

function EntryListRow({
  entry,
  onOpen,
}: {
  entry: DiaryEntry
  onOpen?: (entry: DiaryEntry) => void
}) {
  return (
    <div
      className="diary-list-row wu-cursor-pointer"
      role="link"
      tabIndex={0}
      aria-label={`Open ${entry.title}`}
      onClick={() => onOpen?.(entry)}
      onKeyDown={(event) => {
        if (event.target !== event.currentTarget) {
          return
        }

        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onOpen?.(entry)
        }
      }}
    >
      <EntryCover entry={entry} compact />

      <div style={{ flex: 1, minWidth: 0 }}>
        <span
          className="wu-text-sm wu-truncate"
          style={{ color: FIGMA.textPrimary }}
        >
          {entry.title}
        </span>
        <div
          className="wu-text-xs"
          style={{ color: FIGMA.textMuted, marginTop: 2 }}
        >
          {entry.folder}
        </div>
      </div>

      {entry.featured && <span className="diary-featured-chip">Featured</span>}

      <button
        type="button"
        aria-label={`More actions for ${entry.title}`}
        className="diary-icon-button"
        onClick={(event) => event.stopPropagation()}
        onKeyDown={(event) => event.stopPropagation()}
      >
        <WuIcon
          icon="wm-more-vert"
          style={{ fontSize: 18, color: FIGMA.textMuted }}
        />
      </button>
    </div>
  )
}

function NavRow({
  icon,
  label,
  active,
  onClick,
}: {
  icon: IWuIcons
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={active}
      className={`diary-nav-item${active ? ' diary-nav-item--active' : ''}`}
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onClick()
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
      <WuIcon icon={icon} style={{ fontSize: 16, color: FIGMA.textNav }} />
      <span
        className="wu-flex-1 wu-text-sm wu-truncate"
        style={{ color: FIGMA.textNav, lineHeight: '16px' }}
      >
        {label}
      </span>
      <span className="diary-item-actions">
        <button
          type="button"
          aria-label={`More actions for ${label}`}
          className="diary-icon-button"
          onClick={(event) => event.stopPropagation()}
        >
          <WuIcon
            icon="wm-more-vert"
            style={{ fontSize: 18, color: FIGMA.textMuted }}
          />
        </button>
      </span>
    </div>
  )
}

function DiarySidebar({
  activeFilter,
  onFilter,
}: {
  activeFilter: DiaryFilter
  onFilter: (filter: DiaryFilter) => void
}) {
  const [foldersOpen, setFoldersOpen] = useState(true)

  return (
    <aside
      style={{
        width: 240,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
    >
      <div className="wu-flex wu-flex-col" style={{ gap: 4 }}>
        {DIARY_NAV.map((item) => (
          <NavRow
            key={item.id}
            icon={item.icon}
            label={item.label}
            active={activeFilter.type === 'nav' && activeFilter.value === item.id}
            onClick={() => onFilter({ type: 'nav', value: item.id })}
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
          <button
            type="button"
            aria-label="Add folder"
            className="diary-icon-button"
          >
            <WuIcon
              icon="wm-add-2"
              style={{ fontSize: 18, color: FIGMA.textMuted }}
            />
          </button>
          <button
            type="button"
            aria-label={foldersOpen ? 'Collapse folders' : 'Expand folders'}
            className="diary-icon-button"
            onClick={() => setFoldersOpen((open) => !open)}
          >
            <WuIcon
              icon={
                foldersOpen ? 'wm-keyboard-arrow-up' : 'wm-keyboard-arrow-down'
              }
              style={{ fontSize: 18, color: FIGMA.textMuted }}
            />
          </button>
        </div>
      </div>

      {foldersOpen && (
        <div className="wu-flex wu-flex-col" style={{ gap: 4 }}>
          {DIARY_FOLDERS.map((folder) => (
            <NavRow
              key={folder}
              icon="wm-folder"
              label={folder}
              active={
                activeFilter.type === 'folder' && activeFilter.value === folder
              }
              onClick={() => onFilter({ type: 'folder', value: folder })}
            />
          ))}
        </div>
      )}
    </aside>
  )
}

export function DiaryLibrary({
  onOpen,
  filter: activeFilter,
  onFilterChange,
}: {
  onOpen?: (entry: DiaryEntry) => void
  filter: DiaryFilter
  onFilterChange: (filter: DiaryFilter) => void
}) {
  const [query, setQuery] = useState('')
  const [view, setView] = useState<DiaryView>('grid')
  const [selectAll, setSelectAll] = useState(false)
  const [page, setPage] = useState(0)

  const visibleEntries = useMemo(
    () => filterDiaryEntries(DIARY_ENTRIES, activeFilter, query),
    [activeFilter, query],
  )

  const pagedEntries = visibleEntries.slice(
    page * PAGE_SIZE,
    (page + 1) * PAGE_SIZE,
  )

  const handleFilter = (filter: DiaryFilter) => {
    onFilterChange(filter)
    setPage(0)
    setSelectAll(false)
  }

  const handleQuery = (value: string) => {
    setQuery(value)
    setPage(0)
    setSelectAll(false)
  }

  const contentRef = useRef<HTMLDivElement>(null)
  const previousFilter = useRef<string | null>(null)

  useLayoutEffect(() => {
    const filterKey = `${activeFilter.type}:${activeFilter.value}`

    if (previousFilter.current === filterKey) {
      return
    }

    previousFilter.current = filterKey

    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const items = contentRef.current?.querySelectorAll(
        '.diary-media-card, .diary-list-row',
      )

      if (!items?.length) {
        return
      }

      gsap.fromTo(
        items,
        { opacity: 0.75, y: 4 },
        {
          opacity: 1,
          y: 0,
          duration: 0.18,
          ease: 'sine.out',
          stagger: 0.01,
          overwrite: 'auto',
          clearProps: 'transform,opacity',
        },
      )
    })

    return () => mm.revert()
  }, [activeFilter])

  return (
    <div
      className="wu-flex"
      style={{
        flex: 1,
        gap: 32,
        padding: 32,
        background: FIGMA.white,
        minHeight: 0,
        alignItems: 'flex-start',
      }}
    >
      <DiarySidebar activeFilter={activeFilter} onFilter={handleFilter} />

      <div
        className="wu-flex wu-flex-col"
        style={{ flex: 1, minWidth: 0, gap: 16 }}
      >
        <h2
          className="wu-font-medium"
          style={{
            margin: 0,
            fontSize: 16,
            lineHeight: '24px',
            color: FIGMA.textPrimary,
          }}
        >
          {getDiaryFilterLabel(activeFilter)}
        </h2>

        <div
          className="wu-flex wu-items-center wu-justify-between wu-w-full"
          style={{ gap: 16, flexWrap: 'wrap' }}
        >
          <div className="wu-flex wu-items-center" style={{ gap: 8 }}>
            <div style={{ width: 240 }}>
              <WuInput
                variant="outlined"
                Icon={<WuIcon icon="wm-search" />}
                placeholder="Search diaries"
                value={query}
                onChange={(event) => handleQuery(event.target.value)}
              />
            </div>

            <WuSegmentedSelector
              iconOnly
              size="sm"
              value={view}
              onChange={(value) => setView(value as DiaryView)}
            >
              <WuSegmentedSelectorItem value="grid" aria-label="Grid view">
                <WuIcon icon="wm-grid-view" />
              </WuSegmentedSelectorItem>
              <WuSegmentedSelectorItem value="list" aria-label="List view">
                <WuIcon icon="wm-lists" />
              </WuSegmentedSelectorItem>
            </WuSegmentedSelector>
          </div>

          <WuPagination
            totalRows={visibleEntries.length}
            initialPage={page}
            initialPageSize={PAGE_SIZE}
            onPageChange={setPage}
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

        <div ref={contentRef}>
          {pagedEntries.length === 0 ? (
            <div
              className="wu-text-sm wu-text-gray-subtle"
              style={{ padding: '32px 0', textAlign: 'center' }}
            >
              No items match this view.
            </div>
          ) : view === 'grid' ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
                gap: 16,
              }}
            >
              {pagedEntries.map((entry) => (
                <EntryCard key={entry.id} entry={entry} onOpen={onOpen} />
              ))}
            </div>
          ) : (
            <div className="wu-flex wu-flex-col" style={{ gap: 8 }}>
              {pagedEntries.map((entry) => (
                <EntryListRow key={entry.id} entry={entry} onOpen={onOpen} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
