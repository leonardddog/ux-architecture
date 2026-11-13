import { useMemo, useState } from 'react'
import {
  WuButton,
  WuCheckbox,
  WuIcon,
  WuInput,
  WuMenu,
  WuMenuItem,
  WuPagination,
  WuSegmentedSelector,
  WuSegmentedSelectorItem,
  WuTab,
} from '@npm-questionpro/wick-ui-lib'
import type { IWuTabItem } from '@npm-questionpro/wick-ui-lib'
import {
  DIARY_PARTICIPANTS,
  PARTICIPANT_STATUS_CONFIG,
  PARTICIPANT_STATUS_ORDER,
  filterParticipants,
  formatIncentive,
  formatParticipantActivity,
  getParticipantInitials,
  getParticipantStatusCounts,
} from '../../data/diaryParticipants'
import type {
  DiaryParticipant,
  ParticipantStatus,
} from '../../data/diaryParticipants'

const PAGE_SIZE = 10

const STATUS_COUNTS = getParticipantStatusCounts(DIARY_PARTICIPANTS)

type SortKey =
  | 'name'
  | 'email'
  | 'segment'
  | 'status'
  | 'lastActivity'
  | 'entries'
  | 'incentive'

type SortDirection = 'asc' | 'desc'

type SortState = {
  key: SortKey
  direction: SortDirection
}

const DEFAULT_SORT: SortState = {
  key: 'lastActivity',
  direction: 'desc',
}

const SORTABLE_COLUMNS: Array<{
  key: SortKey
  label: string
  width: number
}> = [
  { key: 'name', label: 'Participant', width: 170 },
  { key: 'email', label: 'Email', width: 180 },
  { key: 'segment', label: 'Segment', width: 95 },
  { key: 'lastActivity', label: 'Last activity', width: 100 },
  { key: 'entries', label: 'Entries', width: 80 },
  { key: 'incentive', label: 'Incentive', width: 85 },
  { key: 'status', label: 'Status', width: 120 },
]

const COLUMN_COUNT = SORTABLE_COLUMNS.length + 2

function compareParticipants(
  left: DiaryParticipant,
  right: DiaryParticipant,
  key: SortKey,
): number {
  switch (key) {
    case 'name':
      return left.name.localeCompare(right.name)
    case 'email':
      return left.email.localeCompare(right.email)
    case 'segment':
      return left.segment.localeCompare(right.segment)
    case 'lastActivity':
      return left.lastActivity.localeCompare(right.lastActivity)
    case 'entries':
      return left.completedEntries - right.completedEntries
    case 'incentive':
      return left.incentive - right.incentive
    case 'status':
      return (
        PARTICIPANT_STATUS_ORDER.indexOf(left.status) -
        PARTICIPANT_STATUS_ORDER.indexOf(right.status)
      )
    default:
      return 0
  }
}

function StatusPill({ status }: { status: ParticipantStatus }) {
  const config = PARTICIPANT_STATUS_CONFIG[status]

  return (
    <span
      className="diary-participant-status"
      style={{ color: config.color, background: config.background }}
    >
      <WuIcon icon={config.icon} style={{ fontSize: 14 }} />
      {config.label}
    </span>
  )
}

function SortIcon({
  active,
  direction,
}: {
  active: boolean
  direction: SortDirection
}) {
  return (
    <WuIcon
      icon={
        active
          ? direction === 'asc'
            ? 'wm-arrow-upward'
            : 'wm-arrow-downward'
          : 'wm-unfold-more'
      }
      className="diary-participant-sort-icon"
      style={{ fontSize: 14 }}
    />
  )
}

function ParticipantActions({ participant }: { participant: DiaryParticipant }) {
  const viewParticipant = () => console.log('view participant', participant.id)
  const remindParticipant = () =>
    console.log('send reminder', participant.id)
  const removeParticipant = () =>
    console.log('remove participant', participant.id)

  return (
    <div className="diary-participant-actions">
      <button
        type="button"
        className="diary-icon-button"
        aria-label={`View ${participant.name}`}
        title="View participant"
        onClick={viewParticipant}
      >
        <WuIcon icon="wm-visibility" style={{ fontSize: 16 }} />
      </button>

      <button
        type="button"
        className="diary-icon-button"
        aria-label={`Send reminder to ${participant.name}`}
        title="Send reminder"
        onClick={remindParticipant}
      >
        <WuIcon icon="wm-forward-to-inbox" style={{ fontSize: 16 }} />
      </button>

      <button
        type="button"
        className="diary-icon-button diary-participant-remove"
        aria-label={`Remove ${participant.name}`}
        title="Remove participant"
        onClick={removeParticipant}
      >
        <WuIcon icon="wm-person-remove" style={{ fontSize: 16 }} />
      </button>

      <WuMenu
        position={{ align: 'end' }}
        Trigger={
          <button
            type="button"
            className="diary-icon-button"
            aria-label={`More actions for ${participant.name}`}
            title="More actions"
          >
            <WuIcon icon="wm-more-vert" style={{ fontSize: 16 }} />
          </button>
        }
      >
        <WuMenuItem
          Icon={<WuIcon icon="wm-visibility" style={{ fontSize: 16 }} />}
          onClick={viewParticipant}
        >
          View profile
        </WuMenuItem>
        <WuMenuItem
          Icon={<WuIcon icon="wm-content-copy" style={{ fontSize: 16 }} />}
          onClick={() => console.log('copy email', participant.email)}
        >
          Copy email
        </WuMenuItem>
        <WuMenuItem
          Icon={
            <WuIcon icon="wm-forward-to-inbox" style={{ fontSize: 16 }} />
          }
          onClick={remindParticipant}
        >
          Send reminder
        </WuMenuItem>
        <WuMenuItem
          Icon={<WuIcon icon="wm-person-remove" style={{ fontSize: 16 }} />}
          onClick={removeParticipant}
        >
          Remove participant
        </WuMenuItem>
      </WuMenu>
    </div>
  )
}

export function DiaryParticipants() {
  const [activeStatus, setActiveStatus] =
    useState<ParticipantStatus>('in-progress')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(0)
  const [sort, setSort] = useState<SortState>(DEFAULT_SORT)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set())

  const filteredParticipants = useMemo(
    () => filterParticipants(DIARY_PARTICIPANTS, activeStatus, query),
    [activeStatus, query],
  )

  const sortedParticipants = useMemo(() => {
    const direction = sort.direction === 'asc' ? 1 : -1

    return [...filteredParticipants].sort(
      (left, right) =>
        compareParticipants(left, right, sort.key) * direction,
    )
  }, [filteredParticipants, sort])

  const pageStart = page * PAGE_SIZE
  const pageParticipants = sortedParticipants.slice(
    pageStart,
    pageStart + PAGE_SIZE,
  )

  const visibleIds = pageParticipants.map((participant) => participant.id)
  const selectedOnPage = visibleIds.filter((id) => selectedIds.has(id)).length
  const allOnPageSelected =
    visibleIds.length > 0 && selectedOnPage === visibleIds.length
  const someOnPageSelected =
    selectedOnPage > 0 && selectedOnPage < visibleIds.length

  const changeStatus = (status: ParticipantStatus) => {
    setActiveStatus(status)
    setPage(0)
    setSelectedIds(new Set())
  }

  const changeQuery = (value: string) => {
    setQuery(value)
    setPage(0)
    setSelectedIds(new Set())
  }

  const changeSort = (key: SortKey) => {
    setSort((current) =>
      current.key === key
        ? {
            key,
            direction: current.direction === 'asc' ? 'desc' : 'asc',
          }
        : { key, direction: 'asc' },
    )
    setPage(0)
  }

  const toggleParticipant = (id: string, checked: boolean) => {
    setSelectedIds((current) => {
      const next = new Set(current)

      if (checked) {
        next.add(id)
      } else {
        next.delete(id)
      }

      return next
    })
  }

  const togglePage = (checked: boolean) => {
    setSelectedIds((current) => {
      const next = new Set(current)

      for (const id of visibleIds) {
        if (checked) {
          next.add(id)
        } else {
          next.delete(id)
        }
      }

      return next
    })
  }

  const isEmpty = pageParticipants.length === 0
  const selectedCount = selectedIds.size

  const participantsPanel = (
    <>
      <div className="diary-participant-toolbar">
        <div className="diary-participant-toolbar-start">
          <div style={{ width: 240 }}>
            <WuInput
              variant="outlined"
              Icon={<WuIcon icon="wm-search" />}
              placeholder="Search participant"
              value={query}
              onChange={(event) => changeQuery(event.target.value)}
              aria-label="Search participant"
            />
          </div>

          <WuSegmentedSelector
            iconOnly
            size="sm"
            value="list"
            aria-label="Participant view"
          >
            <WuSegmentedSelectorItem
              value="grid"
              aria-label="Grid view"
              title="Grid view is not available for participants"
              disabled
            >
              <WuIcon icon="wm-grid-view" />
            </WuSegmentedSelectorItem>
            <WuSegmentedSelectorItem value="list" aria-label="List view">
              <WuIcon icon="wm-lists" />
            </WuSegmentedSelectorItem>
          </WuSegmentedSelector>
        </div>

        <WuPagination
          totalRows={sortedParticipants.length}
          initialPage={page}
          initialPageSize={PAGE_SIZE}
          onPageChange={setPage}
        />
      </div>

      {selectedCount > 0 && (
        <div className="diary-participant-selection">
          <span
            className="diary-participant-selection-count"
            aria-live="polite"
          >
            {selectedCount} selected
          </span>

          <WuButton
            size="sm"
            variant="secondary"
            Icon={<WuIcon icon="wm-forward-to-inbox" />}
            onClick={() => console.log('send reminder', [...selectedIds])}
          >
            Send reminder
          </WuButton>

          <WuButton
            size="sm"
            variant="secondary"
            color="error"
            Icon={<WuIcon icon="wm-person-remove" />}
            onClick={() => console.log('remove participants', [...selectedIds])}
          >
            Remove
          </WuButton>

          <button
            type="button"
            className="diary-participant-clear"
            onClick={() => setSelectedIds(new Set())}
          >
            Clear selection
          </button>
        </div>
      )}

      <div className="diary-participant-table-wrap">
        <table className="diary-participant-table" aria-label="Participants">
          <colgroup>
            <col style={{ width: 40 }} />
            {SORTABLE_COLUMNS.map((column) => (
              <col key={column.key} style={{ width: column.width }} />
            ))}
            <col style={{ width: 120 }} />
          </colgroup>

          <thead>
            <tr>
              <th scope="col" className="diary-participant-checkbox-cell">
                <WuCheckbox
                  id="participants-select-page"
                  checked={allOnPageSelected}
                  partial={someOnPageSelected}
                  onChange={togglePage}
                  aria-label="Select all participants on this page"
                />
              </th>

              {SORTABLE_COLUMNS.map((column) => {
                const active = sort.key === column.key
                const ariaSort = active
                  ? sort.direction === 'asc'
                    ? 'ascending'
                    : 'descending'
                  : 'none'

                return (
                  <th
                    key={column.key}
                    scope="col"
                    aria-sort={ariaSort}
                    className="diary-participant-header-cell"
                  >
                    <button
                      type="button"
                      className="diary-participant-sort"
                      onClick={() => changeSort(column.key)}
                    >
                      <span>{column.label}</span>
                      <SortIcon
                        active={active}
                        direction={sort.direction}
                      />
                    </button>
                  </th>
                )
              })}

              <th
                scope="col"
                className="diary-participant-header-cell diary-participant-actions-heading"
              >
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {isEmpty ? (
              <tr>
                <td
                  colSpan={COLUMN_COUNT}
                  className="diary-participant-empty"
                >
                  {query.trim()
                    ? 'No participants match your search.'
                    : 'No participants have this status yet.'}
                </td>
              </tr>
            ) : (
              pageParticipants.map((participant) => {
                const selected = selectedIds.has(participant.id)

                return (
                  <tr
                    key={participant.id}
                    className={`diary-participant-row${
                      selected ? ' diary-participant-row--selected' : ''
                    }`}
                  >
                    <td className="diary-participant-checkbox-cell">
                      <WuCheckbox
                        id={`participant-select-${participant.id}`}
                        checked={selected}
                        onChange={(checked) =>
                          toggleParticipant(participant.id, checked)
                        }
                        aria-label={`Select ${participant.name}`}
                      />
                    </td>

                    <td>
                      <div className="diary-participant-person">
                        <span
                          className="diary-participant-avatar"
                          aria-hidden="true"
                        >
                          {getParticipantInitials(participant.name)}
                        </span>
                        <button
                          type="button"
                          className="diary-participant-name"
                          title={participant.name}
                          onClick={() =>
                            console.log('view participant', participant.id)
                          }
                        >
                          {participant.name}
                        </button>
                      </div>
                    </td>

                    <td>
                      <span
                        className="diary-participant-email"
                        title={participant.email}
                      >
                        {participant.email}
                      </span>
                    </td>

                    <td>{participant.segment}</td>

                    <td>
                      <span
                        className="diary-participant-activity"
                        title={participant.lastActivity}
                      >
                        {formatParticipantActivity(participant.lastActivity)}
                      </span>
                    </td>

                    <td>
                      <span className="diary-participant-entries">
                        {participant.completedEntries} /{' '}
                        {participant.totalEntries}
                      </span>
                    </td>

                    <td>
                      <span className="diary-participant-incentive">
                        {formatIncentive(participant.incentive)}
                      </span>
                    </td>

                    <td>
                      <StatusPill status={participant.status} />
                    </td>

                    <td>
                      <ParticipantActions participant={participant} />
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </>
  )

  const tabItems: IWuTabItem[] = PARTICIPANT_STATUS_ORDER.map((status) => ({
    value: status,
    Trigger: (
      <>
        <span>{PARTICIPANT_STATUS_CONFIG[status].label}</span>
        <span className="diary-participant-tab-count">
          {STATUS_COUNTS[status]}
        </span>
      </>
    ),
    Content: participantsPanel,
  }))

  return (
    <WuTab
      className="diary-participants"
      value={activeStatus}
      onValueChange={(value) => changeStatus(value as ParticipantStatus)}
      items={tabItems}
      aria-label="Participant status"
    />
  )
}
