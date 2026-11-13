import { useMemo, useState } from 'react'
import { WuIcon, WuInput, WuTab } from '@npm-questionpro/wick-ui-lib'
import type { IWuTabItem } from '@npm-questionpro/wick-ui-lib'
import {
  DIARY_MODERATION_ACTIVITIES,
  MODERATION_DATE_OPTIONS,
  MODERATION_QUEST_OPTIONS,
  MODERATION_TASK_OPTIONS,
  filterModerationActivities,
  formatModerationTime,
} from '../../data/diaryModeration'
import type {
  DiaryModerationActivity,
  DiaryModerationAttachment,
  ModerationDateRange,
} from '../../data/diaryModeration'
import { getParticipantInitials } from '../../data/diaryParticipants'
import { SectionHeader } from '../SectionHeader'

const ACTIVITY_COUNT = DIARY_MODERATION_ACTIVITIES.length

const DEFAULT_QUEST = 'all'
const DEFAULT_TASK = 'all'
const DEFAULT_DATE_RANGE: ModerationDateRange = 'all'

function formatAbsoluteTime(isoDate: string): string {
  const date = new Date(isoDate)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function ActivityAttachment({
  attachment,
}: {
  attachment: DiaryModerationAttachment
}) {
  const download = () => console.log('download attachment', attachment.id)

  return (
    <div className="diary-moderation-attachment">
      {attachment.preview ? (
        <img
          className="diary-moderation-attachment-preview"
          src={attachment.preview}
          alt=""
        />
      ) : (
        <span className="diary-moderation-attachment-preview" aria-hidden="true">
          <WuIcon icon="wm-description" style={{ fontSize: 20 }} />
        </span>
      )}

      <span className="diary-moderation-attachment-copy">
        <button
          className="diary-moderation-attachment-name"
          type="button"
          title={attachment.name}
          onClick={download}
        >
          {attachment.name}
        </button>
        <span className="diary-moderation-attachment-type">
          {attachment.type}
        </span>
      </span>

      <button
        className="diary-moderation-attachment-download"
        type="button"
        aria-label={`Download ${attachment.name}`}
        title="Download"
        onClick={download}
      >
        <WuIcon icon="wm-download" style={{ fontSize: 18 }} />
      </button>
    </div>
  )
}

function ActivityCard({
  activity,
  attachmentsOpen,
  onToggleAttachments,
}: {
  activity: DiaryModerationActivity
  attachmentsOpen: boolean
  onToggleAttachments: () => void
}) {
  const activityId = `moderation-activity-${activity.id}`
  const attachmentsId = `${activityId}-attachments`
  const attachmentCount = activity.attachments?.length ?? 0

  return (
    <article className="diary-moderation-card" aria-labelledby={activityId}>
      <span className="diary-moderation-avatar" aria-hidden="true">
        {getParticipantInitials(activity.participantName)}
      </span>

      <div className="diary-moderation-card-content">
        <div className="diary-moderation-card-heading">
          <div className="diary-moderation-identity">
            <h2 className="diary-moderation-name" id={activityId}>
              {activity.participantName}
            </h2>
            <time
              className="diary-moderation-time"
              dateTime={activity.createdAt}
              title={formatAbsoluteTime(activity.createdAt)}
            >
              {formatModerationTime(activity.createdAt)}
            </time>
          </div>

          <div className="diary-moderation-card-actions">
            <button
              className="diary-moderation-icon-button"
              type="button"
              aria-label={`Edit activity from ${activity.participantName}`}
              title="Edit"
              onClick={() => console.log('edit activity', activity.id)}
            >
              <WuIcon icon="wm-edit" style={{ fontSize: 18 }} />
            </button>
            <button
              className="diary-moderation-icon-button diary-moderation-icon-button--danger"
              type="button"
              aria-label={`Delete activity from ${activity.participantName}`}
              title="Delete"
              onClick={() => console.log('delete activity', activity.id)}
            >
              <WuIcon icon="wm-delete" style={{ fontSize: 18 }} />
            </button>
          </div>
        </div>

        <div className="diary-moderation-meta">
          <span>{activity.quest}</span>
          <span className="diary-moderation-meta-divider" aria-hidden="true" />
          <span className="diary-moderation-task">
            <WuIcon
              icon={activity.taskIcon}
              aria-hidden="true"
              style={{ fontSize: 16 }}
            />
            <span>{activity.task}</span>
          </span>
        </div>

        {activity.body && (
          <p className="diary-moderation-body">{activity.body}</p>
        )}

        {activity.vote && (
          <div className="diary-moderation-vote">
            <span>Voted</span>
            <WuIcon
              icon={activity.vote.icon}
              aria-hidden="true"
              style={{ fontSize: 16, color: '#545e6b' }}
            />
            <span>&ldquo;{activity.vote.label}&rdquo;</span>
          </div>
        )}

        {attachmentCount > 0 && (
          <div className="diary-moderation-attachments">
            <button
              className="diary-moderation-attachment-toggle"
              type="button"
              aria-expanded={attachmentsOpen}
              aria-controls={attachmentsId}
              aria-label={`${attachmentsOpen ? 'Hide' : 'Show'} ${attachmentCount} ${
                attachmentCount === 1 ? 'attachment' : 'attachments'
              }`}
              onClick={onToggleAttachments}
            >
              <span>
                {attachmentCount}{' '}
                {attachmentCount === 1 ? 'attachment' : 'attachments'}
              </span>
              <span className="diary-moderation-attachment-chevron">
                <WuIcon
                  icon={
                    attachmentsOpen
                      ? 'wm-keyboard-arrow-up'
                      : 'wm-keyboard-arrow-down'
                  }
                  style={{ fontSize: 18 }}
                />
              </span>
            </button>

            {attachmentsOpen && (
              <div
                className="diary-moderation-attachment-list"
                id={attachmentsId}
              >
                {activity.attachments?.map((attachment) => (
                  <ActivityAttachment
                    key={attachment.id}
                    attachment={attachment}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        <div className="diary-moderation-actions">
          {!activity.vote && (
            <>
              <button
                className="diary-moderation-action"
                type="button"
                onClick={() => console.log('reply', activity.id)}
              >
                Reply
                <WuIcon icon="wm-reply" style={{ fontSize: 16 }} />
              </button>
              <button
                className="diary-moderation-action"
                type="button"
                onClick={() => console.log('save as quote', activity.id)}
              >
                Save as quote
                <WuIcon icon="wm-format-quote" style={{ fontSize: 16 }} />
              </button>
            </>
          )}
          <button
            className="diary-moderation-action"
            type="button"
            onClick={() => console.log('open response', activity.id)}
          >
            Open response
            <WuIcon icon="wm-open-in-new" style={{ fontSize: 16 }} />
          </button>
        </div>
      </div>
    </article>
  )
}

export function DiaryModeration() {
  const [query, setQuery] = useState('')
  const [quest, setQuest] = useState(DEFAULT_QUEST)
  const [task, setTask] = useState(DEFAULT_TASK)
  const [dateRange, setDateRange] =
    useState<ModerationDateRange>(DEFAULT_DATE_RANGE)
  const [collapsedAttachments, setCollapsedAttachments] = useState<Set<string>>(
    () => new Set(),
  )

  const taskOptions = useMemo(() => {
    if (quest === DEFAULT_QUEST) {
      return MODERATION_TASK_OPTIONS
    }

    return [
      ...new Set(
        DIARY_MODERATION_ACTIVITIES.filter(
          (activity) => activity.quest === quest,
        ).map((activity) => activity.task),
      ),
    ]
  }, [quest])

  const activities = useMemo(
    () =>
      filterModerationActivities(DIARY_MODERATION_ACTIVITIES, {
        query,
        quest,
        task,
        dateRange,
      }),
    [query, quest, task, dateRange],
  )

  const hasFilters =
    query.trim() !== '' ||
    quest !== DEFAULT_QUEST ||
    task !== DEFAULT_TASK ||
    dateRange !== DEFAULT_DATE_RANGE

  const clearFilters = () => {
    setQuery('')
    setQuest(DEFAULT_QUEST)
    setTask(DEFAULT_TASK)
    setDateRange(DEFAULT_DATE_RANGE)
  }

  const changeQuest = (value: string) => {
    setQuest(value)
    setTask(DEFAULT_TASK)
  }

  const toggleAttachments = (activityId: string) => {
    setCollapsedAttachments((current) => {
      const next = new Set(current)

      if (next.has(activityId)) {
        next.delete(activityId)
      } else {
        next.add(activityId)
      }

      return next
    })
  }

  const activityFeedPanel = (
    <div className="diary-moderation-panel">
      <div className="diary-moderation-toolbar">
        <div className="diary-moderation-search">
          <WuInput
            variant="outlined"
            Icon={<WuIcon icon="wm-search" />}
            placeholder="Search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Search activity"
          />
        </div>

        <div className="diary-moderation-filters">
          <label
            className="diary-moderation-select"
            style={quest === DEFAULT_QUEST ? { width: 104 } : undefined}
          >
            <span className="diary-moderation-sr-only">Filter by quest</span>
            <select
              value={quest}
              onChange={(event) => changeQuest(event.target.value)}
            >
              <option value={DEFAULT_QUEST}>All quests</option>
              {MODERATION_QUEST_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <WuIcon
              icon="wm-arrow-drop-down"
              aria-hidden="true"
              className="diary-moderation-select-arrow"
            />
          </label>

          <label
            className="diary-moderation-select"
            style={task === DEFAULT_TASK ? { width: 104 } : undefined}
          >
            <span className="diary-moderation-sr-only">Filter by task</span>
            <select
              value={task}
              onChange={(event) => setTask(event.target.value)}
            >
              <option value={DEFAULT_TASK}>All tasks</option>
              {taskOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <WuIcon
              icon="wm-arrow-drop-down"
              aria-hidden="true"
              className="diary-moderation-select-arrow"
            />
          </label>

          <label
            className="diary-moderation-select diary-moderation-select--date"
            style={
              dateRange === DEFAULT_DATE_RANGE ? { width: 104 } : undefined
            }
          >
            <span className="diary-moderation-sr-only">Filter by date</span>
            <WuIcon
              icon="wm-calendar-today"
              aria-hidden="true"
              className="diary-moderation-select-calendar"
            />
            <select
              value={dateRange}
              onChange={(event) =>
                setDateRange(event.target.value as ModerationDateRange)
              }
            >
              {MODERATION_DATE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <WuIcon
              icon="wm-arrow-drop-down"
              aria-hidden="true"
              className="diary-moderation-select-arrow"
            />
          </label>
        </div>
      </div>

      <div className="diary-moderation-feed">
        {activities.length > 0 ? (
          activities.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              attachmentsOpen={!collapsedAttachments.has(activity.id)}
              onToggleAttachments={() => toggleAttachments(activity.id)}
            />
          ))
        ) : (
          <div className="diary-moderation-empty" role="status">
            <span className="diary-moderation-empty-icon" aria-hidden="true">
              <WuIcon icon="wm-search" style={{ fontSize: 24 }} />
            </span>
            <p className="diary-moderation-empty-title">No activity found</p>
            <p className="diary-moderation-empty-copy">
              Try a different search or clear the filters to see all activity.
            </p>
            {hasFilters && (
              <button
                className="diary-moderation-clear-filters"
                type="button"
                onClick={clearFilters}
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )

  const browseContentPanel = (
    <div className="diary-moderation-browse">
      <div className="diary-moderation-placeholder">
        <span className="diary-moderation-placeholder-icon" aria-hidden="true">
          <WuIcon icon="wm-art-track" style={{ fontSize: 24 }} />
        </span>
        <p className="diary-moderation-placeholder-title">
          Browse content is coming soon
        </p>
        <p className="diary-moderation-placeholder-copy">
          This view is still being designed. In the meantime, review participant
          activity in the Activity feed.
        </p>
      </div>
    </div>
  )

  const tabItems: IWuTabItem[] = [
    {
      value: 'activity-feed',
      Trigger: (
        <>
          <span>Activity feed</span>
          <span
            className="diary-moderation-tab-count"
            aria-label={`${ACTIVITY_COUNT} activities`}
          >
            {ACTIVITY_COUNT}
          </span>
        </>
      ),
      Content: activityFeedPanel,
    },
    {
      value: 'browse-content',
      Trigger: <span>Browse content</span>,
      Content: browseContentPanel,
    },
  ]

  return (
    <div className="diary-moderation">
      <SectionHeader
        title="Moderation"
        actions={
          <button
            className="diary-moderation-refresh"
            type="button"
            onClick={() => console.log('refresh moderation')}
          >
            Refresh
            <WuIcon icon="wm-refresh" style={{ fontSize: 18 }} />
          </button>
        }
      />

      <WuTab
        className="diary-moderation-tabs"
        items={tabItems}
        aria-label="Moderation content"
      />
    </div>
  )
}