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
  LIBRARY_FOLDERS,
  LIBRARY_MEDIA,
  LIBRARY_NAV,
  filterLibraryMedia,
  getLibraryFilterLabel,
} from '../../data/usabilityTestLibrary'
import type {
  LibraryFilter,
  LibraryMedia,
  LibraryView,
  MediaKind,
} from '../../data/usabilityTestLibrary'

const COLORS = {
  ink: '#31373f',
  nav: '#1b3380',
  muted: '#545e6b',
  border: '#c2d1f4',
  thumbBg: '#f5f8ff',
  focusRing: '#7ac1ff',
  overlay: 'rgba(0, 0, 0, 0.3)',
  white: '#ffffff',
} as const

const PAGE_SIZE = 100

function mediaKindIcon(kind: MediaKind): IWuIcons {
  switch (kind) {
    case 'video':
      return 'wm-videocam'
    case 'audio':
      return 'wm-audio-file'
    case 'document':
      return 'wm-text-snippet'
    case 'font':
      return 'wm-text-fields'
    default:
      return 'wm-image'
  }
}

function mediaKindBackground(kind: MediaKind): string {
  switch (kind) {
    case 'video':
      return 'linear-gradient(135deg, #e7eefd, #c2d1f4)'
    case 'audio':
      return 'linear-gradient(135deg, #eef3fb, #dbe6fb)'
    case 'document':
      return 'linear-gradient(135deg, #f5f8ff, #e7eefd)'
    case 'font':
      return 'linear-gradient(135deg, #f5f5f5, #e7eefd)'
    default:
      return 'linear-gradient(135deg, #f5f8ff, #e7eefd)'
  }
}

function MediaThumb({
  item,
  compact = false,
}: {
  item: LibraryMedia
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
        background: COLORS.thumbBg,
      }}
    >
      {item.image ? (
        <img
          src={item.image}
          alt=""
          loading="lazy"
          style={{
            display: 'block',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      ) : (
        <div
          className="wu-flex wu-items-center wu-justify-center"
          style={{
            position: 'absolute',
            inset: 0,
            background: mediaKindBackground(item.kind),
          }}
        >
          <WuIcon
            icon={mediaKindIcon(item.kind)}
            style={{
              fontSize: compact ? 20 : 28,
              color: COLORS.nav,
            }}
          />
        </div>
      )}

      {item.kind === 'video' && !compact && (
        <>
          <div
            className="wu-flex wu-items-center wu-justify-center"
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: 40,
              height: 40,
              borderRadius: 36,
              background: COLORS.overlay,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <WuIcon
              icon="wm-play-arrow"
              style={{ fontSize: 24, color: COLORS.white }}
            />
          </div>

          {item.duration && (
            <div
              style={{
                position: 'absolute',
                right: 8,
                bottom: 8,
                height: 24,
                padding: '4px 6px',
                borderRadius: 4,
                background: COLORS.overlay,
                color: COLORS.white,
                fontSize: 12,
                lineHeight: '16px',
              }}
            >
              {item.duration}
            </div>
          )}

          <button
            type="button"
            aria-label={`More actions for ${item.name}`}
            className="usability-icon-button usability-thumb-action"
            onClick={(event) => event.stopPropagation()}
          >
            <WuIcon
              icon="wm-more-vert"
              style={{ fontSize: 18, color: COLORS.white }}
            />
          </button>
        </>
      )}
    </div>
  )
}

function MediaCard({ item }: { item: LibraryMedia }) {
  return (
    <WuCard
      rounded
      className="usability-media-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
        padding: 0,
        overflow: 'hidden',
        borderRadius: 8,
        border: `1px solid ${COLORS.border}`,
        background: COLORS.white,
        outline: item.featured ? `2px solid ${COLORS.focusRing}` : undefined,
        outlineOffset: item.featured ? 2 : undefined,
      }}
    >
      <MediaThumb item={item} />

      <div
        className="wu-flex wu-items-center wu-w-full"
        style={{ padding: 16, minWidth: 0 }}
      >
        <span
          className="wu-text-sm wu-truncate"
          style={{ color: COLORS.ink, lineHeight: '16px' }}
        >
          {item.name}
          <span style={{ color: COLORS.muted }}>.{item.extension}</span>
        </span>
      </div>
    </WuCard>
  )
}

function MediaListRow({ item }: { item: LibraryMedia }) {
  return (
    <div className="usability-list-row">
      <MediaThumb item={item} compact />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          className="wu-flex wu-items-baseline"
          style={{ gap: 4, minWidth: 0 }}
        >
          <span
            className="wu-text-sm wu-truncate"
            style={{ color: COLORS.ink }}
          >
            {item.name}
            <span style={{ color: COLORS.muted }}>.{item.extension}</span>
          </span>
        </div>
        <div
          className="wu-text-xs"
          style={{ color: COLORS.muted, marginTop: 2 }}
        >
          {item.folder}
          {item.duration ? ` · ${item.duration}` : ''}
        </div>
      </div>

      {item.featured && <span className="usability-featured-chip">Featured</span>}

      <button
        type="button"
        aria-label={`More actions for ${item.name}`}
        className="usability-icon-button"
      >
        <WuIcon
          icon="wm-more-vert"
          style={{ fontSize: 18, color: COLORS.muted }}
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
      className={`usability-nav-item${active ? ' usability-nav-item--active' : ''}`}
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
      <WuIcon icon={icon} style={{ fontSize: 16, color: COLORS.nav }} />
      <span
        className="wu-flex-1 wu-text-sm wu-truncate"
        style={{ color: COLORS.nav, lineHeight: '16px' }}
      >
        {label}
      </span>
      <span className="usability-nav-actions">
        <button
          type="button"
          aria-label={`More actions for ${label}`}
          className="usability-icon-button"
          onClick={(event) => event.stopPropagation()}
        >
          <WuIcon
            icon="wm-more-vert"
            style={{ fontSize: 18, color: COLORS.muted }}
          />
        </button>
      </span>
    </div>
  )
}

function LibrarySidebar({
  activeFilter,
  onFilter,
}: {
  activeFilter: LibraryFilter
  onFilter: (filter: LibraryFilter) => void
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
        {LIBRARY_NAV.map((item) => (
          <NavRow
            key={item.id}
            icon={item.icon}
            label={item.label}
            active={
              activeFilter.type === 'nav' && activeFilter.value === item.id
            }
            onClick={() => onFilter({ type: 'nav', value: item.id })}
          />
        ))}
      </div>

      <div
        className="wu-flex wu-items-center wu-justify-between"
        style={{ minHeight: 32 }}
      >
        <span className="wu-text-xs" style={{ color: COLORS.muted }}>
          My folders
        </span>
        <div className="wu-flex wu-items-center" style={{ gap: 4 }}>
          <button
            type="button"
            aria-label="Add folder"
            className="usability-icon-button"
          >
            <WuIcon
              icon="wm-add-2"
              style={{ fontSize: 18, color: COLORS.muted }}
            />
          </button>
          <button
            type="button"
            aria-label={foldersOpen ? 'Collapse folders' : 'Expand folders'}
            className="usability-icon-button"
            onClick={() => setFoldersOpen((open) => !open)}
          >
            <WuIcon
              icon={
                foldersOpen ? 'wm-keyboard-arrow-up' : 'wm-keyboard-arrow-down'
              }
              style={{ fontSize: 18, color: COLORS.muted }}
            />
          </button>
        </div>
      </div>

      {foldersOpen && (
        <div className="wu-flex wu-flex-col" style={{ gap: 4 }}>
          {LIBRARY_FOLDERS.map((folder) => (
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

export function UsabilityTestLibrary() {
  const [activeFilter, setActiveFilter] = useState<LibraryFilter>({
    type: 'nav',
    value: 'recent',
  })
  const [query, setQuery] = useState('')
  const [view, setView] = useState<LibraryView>('grid')
  const [selectAll, setSelectAll] = useState(false)
  const [page, setPage] = useState(0)

  const visibleMedia = useMemo(
    () => filterLibraryMedia(LIBRARY_MEDIA, activeFilter, query),
    [activeFilter, query],
  )

  const pagedMedia = visibleMedia.slice(
    page * PAGE_SIZE,
    (page + 1) * PAGE_SIZE,
  )

  const handleFilter = (filter: LibraryFilter) => {
    setActiveFilter(filter)
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
        '.usability-media-card, .usability-list-row',
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
        background: COLORS.white,
        minHeight: 0,
        alignItems: 'flex-start',
      }}
    >
      <LibrarySidebar activeFilter={activeFilter} onFilter={handleFilter} />

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
            color: COLORS.ink,
          }}
        >
          {getLibraryFilterLabel(activeFilter)}
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
                placeholder="Search usability tests"
                value={query}
                onChange={(event) => handleQuery(event.target.value)}
              />
            </div>

            <WuSegmentedSelector
              iconOnly
              size="sm"
              value={view}
              onChange={(value) => setView(value as LibraryView)}
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
            totalRows={visibleMedia.length}
            initialPage={page}
            initialPageSize={PAGE_SIZE}
            onPageChange={setPage}
          />
        </div>

        <div>
          <WuCheckbox
            id="usability-library-select-all"
            checked={selectAll}
            onChange={(checked) => setSelectAll(checked)}
            Label={
              <span className="wu-text-xs" style={{ color: COLORS.muted }}>
                Select all
              </span>
            }
          />
        </div>

        <div ref={contentRef}>
          {pagedMedia.length === 0 ? (
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
              {pagedMedia.map((item) => (
                <MediaCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="wu-flex wu-flex-col" style={{ gap: 8 }}>
              {pagedMedia.map((item) => (
                <MediaListRow key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
