import { useState } from 'react'
import type { ReactNode } from 'react'
import {
  WuButton,
  WuCard,
  WuCardHeader,
  WuIcon,
  WuPagination,
} from '@npm-questionpro/wick-ui-lib'
import {
  ANALYTICS_COMPLETION,
  ANALYTICS_SUMMARY,
  ANALYTICS_THEMES,
  ANALYTICS_TIMELINE,
  COMPLETION_SCOPES,
  SENTIMENT_COLORS,
  THEME_PAGE_SIZE,
} from '../../data/diaryAnalytics'
import type {
  AnalyticsTheme,
  AnalyticsTimelinePoint,
  CompletionScope,
  CompletionSegment,
} from '../../data/diaryAnalytics'
import { SectionHeader } from '../SectionHeader'

const CARD_BORDER = 'rgba(0, 0, 0, 0.2)'

function AnalyticsCard({
  title,
  action,
  className,
  children,
}: {
  title: string
  action?: ReactNode
  className?: string
  children: ReactNode
}) {
  return (
    <WuCard
      rounded
      className={`diary-analytics-card wu-flex wu-flex-col${
        className ? ` ${className}` : ''
      }`}
      style={{
        padding: 16,
        gap: 16,
        border: `1px solid ${CARD_BORDER}`,
        borderRadius: 8,
        background: '#fff',
      }}
    >
      <WuCardHeader
        className="diary-analytics-card-header wu-flex wu-items-center wu-justify-between"
        style={{
          minHeight: 40,
          marginBottom: 0,
          padding: '0 8px',
          borderBottomColor: '#d8d8d8',
        }}
      >
        <h2 className="diary-analytics-card-title">{title}</h2>
        {action && (
          <div className="diary-analytics-card-action">{action}</div>
        )}
      </WuCardHeader>

      {children}
    </WuCard>
  )
}

function SummaryCard() {
  return (
    <AnalyticsCard title="Summary">
      <div className="diary-analytics-summary-grid">
        {ANALYTICS_SUMMARY.map((metric) => (
          <div className="diary-analytics-metric" key={metric.id}>
            <span className="diary-analytics-metric-value">
              {metric.value}
            </span>
            <span className="diary-analytics-metric-rule" aria-hidden="true" />
            <span className="diary-analytics-metric-label">
              <WuIcon
                icon={metric.icon}
                aria-hidden="true"
                style={{ fontSize: 20 }}
              />
              <span>{metric.label}</span>
            </span>
          </div>
        ))}
      </div>
    </AnalyticsCard>
  )
}

const CHART_WIDTH = 1000
const CHART_HEIGHT = 248
const Y_AXIS_LABELS = Array.from({ length: 10 }, (_, index) => 100 - index * 10)

function timelineY(value: number): number {
  return CHART_HEIGHT - (value / 100) * CHART_HEIGHT
}

function buildTimelinePaths(points: AnalyticsTimelinePoint[]) {
  if (points.length === 0) {
    return { line: '', area: '' }
  }

  const step = CHART_WIDTH / points.length
  let path = `M 0 ${timelineY(points[0].value)}`

  points.forEach((point, index) => {
    if (index === 0) {
      return
    }

    path += ` H ${step * index} V ${timelineY(point.value)}`
  })

  const line = `${path} H ${CHART_WIDTH}`

  return {
    line,
    area: `${line} V ${CHART_HEIGHT} H 0 Z`,
  }
}

function TimelineChart() {
  const { line, area } = buildTimelinePaths(ANALYTICS_TIMELINE)

  return (
    <div
      className="diary-analytics-chart"
      role="img"
      aria-label="Task response timeline from November 1 to November 17"
    >
      <div className="diary-analytics-chart-body" aria-hidden="true">
        <div className="diary-analytics-y-axis">
          {Y_AXIS_LABELS.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>

        <div className="diary-analytics-plot">
          <svg
            viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
            preserveAspectRatio="none"
          >
            {Y_AXIS_LABELS.map((label) => (
              <line
                key={`h-${label}`}
                x1={0}
                x2={CHART_WIDTH}
                y1={timelineY(label)}
                y2={timelineY(label)}
                stroke="#d8d8d8"
                strokeWidth={1}
                vectorEffect="non-scaling-stroke"
              />
            ))}

            {ANALYTICS_TIMELINE.map((point, index) => {
              const x = (index / ANALYTICS_TIMELINE.length) * CHART_WIDTH

              return (
                <line
                  key={`v-${point.date}`}
                  x1={x}
                  x2={x}
                  y1={0}
                  y2={CHART_HEIGHT}
                  stroke="#d8d8d8"
                  strokeWidth={1}
                  vectorEffect="non-scaling-stroke"
                />
              )
            })}

            <path d={area} fill="#6d71d9" fillOpacity={0.2} />
            <path
              d={line}
              fill="none"
              stroke="#6d71d9"
              strokeWidth={2}
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          <div className="diary-analytics-chart-values">
            {ANALYTICS_TIMELINE.map((point, index) => (
              <span
                key={point.date}
                style={{
                  left: `${((index + 0.5) / ANALYTICS_TIMELINE.length) * 100}%`,
                  top: `${(1 - point.value / 100) * 100}%`,
                }}
              >
                {point.value}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="diary-analytics-chart-footer" aria-hidden="true">
        <span className="diary-analytics-y-axis-spacer" />
        <div className="diary-analytics-x-axis">
          {ANALYTICS_TIMELINE.map((point) => (
            <span key={point.date}>{point.date}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

function TimelineCard() {
  return (
    <AnalyticsCard title="Task response timeline">
      <button
        className="diary-analytics-date"
        type="button"
        onClick={() => console.log('select timeline date')}
      >
        Select Date
        <WuIcon icon="wm-calendar-today" style={{ fontSize: 20 }} />
      </button>

      <TimelineChart />
    </AnalyticsCard>
  )
}

const DONUT_SIZE = 264
const DONUT_CENTER = DONUT_SIZE / 2
const DONUT_RADIUS = 110
const DONUT_STROKE = 42
const DONUT_CIRCUMFERENCE = 2 * Math.PI * DONUT_RADIUS
const DONUT_GAP = 2

function DonutChart({
  segments,
  scopeLabel,
}: {
  segments: CompletionSegment[]
  scopeLabel: string
}) {
  let offset = 0

  const arcs = segments.map((segment) => {
    const length = (segment.percent / 100) * DONUT_CIRCUMFERENCE
    const arc = {
      ...segment,
      length,
      offset,
      midAngle:
        -90 + (offset / DONUT_CIRCUMFERENCE) * 360 + (length / DONUT_CIRCUMFERENCE) * 180,
    }

    offset += length
    return arc
  })

  return (
    <div className="diary-analytics-donut">
      <svg
        className="diary-analytics-donut-chart"
        viewBox={`0 0 ${DONUT_SIZE} ${DONUT_SIZE}`}
        role="img"
        aria-label={`${scopeLabel} completion: ${segments
          .map((segment) => `${segment.percent}% ${segment.label.toLowerCase()}`)
          .join(', ')}`}
      >
        <g transform={`rotate(-90 ${DONUT_CENTER} ${DONUT_CENTER})`}>
          {arcs.map((arc) => (
            <circle
              key={arc.id}
              cx={DONUT_CENTER}
              cy={DONUT_CENTER}
              r={DONUT_RADIUS}
              fill="none"
              stroke={arc.color}
              strokeWidth={DONUT_STROKE}
              strokeDasharray={`${Math.max(
                arc.length - DONUT_GAP,
                0,
              )} ${DONUT_CIRCUMFERENCE}`}
              strokeDashoffset={-arc.offset}
            />
          ))}
        </g>

        {arcs.map((arc) => {
          const angle = (arc.midAngle * Math.PI) / 180
          const x = DONUT_CENTER + DONUT_RADIUS * Math.cos(angle)
          const y = DONUT_CENTER + DONUT_RADIUS * Math.sin(angle)

          return (
            <text
              key={`${arc.id}-label`}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="central"
              fill="#fff"
              fontSize={12}
            >
              {arc.percent}%
            </text>
          )
        })}
      </svg>

      <div className="diary-analytics-donut-legend">
        {segments.map((segment) => (
          <span className="diary-analytics-donut-legend-item" key={segment.id}>
            <span
              className="diary-analytics-donut-swatch"
              style={{ background: segment.color }}
              aria-hidden="true"
            />
            {segment.label}
          </span>
        ))}
      </div>
    </div>
  )
}

function CompletionCard({
  scope,
  onScopeChange,
}: {
  scope: CompletionScope
  onScopeChange: (scope: CompletionScope) => void
}) {
  const segments = ANALYTICS_COMPLETION[scope]
  const scopeLabel =
    COMPLETION_SCOPES.find((option) => option.value === scope)?.label ?? 'Quests'

  return (
    <AnalyticsCard
      className="diary-analytics-card--completion"
      title="Completion progress"
      action={
        <label className="diary-analytics-select">
          <span className="diary-analytics-sr-only">
            Completion metric
          </span>
          <select
            value={scope}
            onChange={(event) =>
              onScopeChange(event.target.value as CompletionScope)
            }
          >
            {COMPLETION_SCOPES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <WuIcon
            icon="wm-arrow-drop-down"
            aria-hidden="true"
            className="diary-analytics-select-arrow"
          />
        </label>
      }
    >
      <DonutChart segments={segments} scopeLabel={scopeLabel} />
    </AnalyticsCard>
  )
}

function ThemeRow({ theme }: { theme: AnalyticsTheme }) {
  const barLabel = `${theme.title}: ${theme.responses} responses, ${theme.completionPercent}% complete. ${theme.positive}% positive, ${theme.neutral}% neutral, ${theme.negative}% negative.`

  return (
    <div className="diary-analytics-theme-row">
      <div className="diary-analytics-theme-copy">
        <p className="diary-analytics-theme-title">{theme.title}</p>
        <p className="diary-analytics-theme-meta">
          {theme.responses} responses ({theme.completionPercent}%)
        </p>
      </div>

      <div className="diary-analytics-theme-bar-wrap">
        <div
          className="diary-analytics-theme-bar"
          role="img"
          aria-label={barLabel}
        >
          <span
            style={{
              width: `${theme.positive}%`,
              background: SENTIMENT_COLORS.positive,
            }}
          />
          <span
            style={{
              width: `${theme.neutral}%`,
              background: SENTIMENT_COLORS.neutral,
            }}
          />
          <span
            style={{
              width: `${theme.negative}%`,
              background: SENTIMENT_COLORS.negative,
            }}
          />
        </div>

        <div className="diary-analytics-theme-values" aria-hidden="true">
          <span style={{ left: `${theme.positive / 2}%` }}>
            {theme.positive}%
          </span>
          <span
            style={{ left: `${theme.positive + theme.neutral / 2}%` }}
          >
            {theme.neutral}%
          </span>
          <span
            style={{
              left: `${theme.positive + theme.neutral + theme.negative / 2}%`,
            }}
          >
            {theme.negative}%
          </span>
        </div>
      </div>
    </div>
  )
}

function ThematicCard() {
  const [page, setPage] = useState(0)
  const themes = ANALYTICS_THEMES.slice(
    page * THEME_PAGE_SIZE,
    page * THEME_PAGE_SIZE + THEME_PAGE_SIZE,
  )

  return (
    <AnalyticsCard
      className="diary-analytics-card--thematic"
      title="Thematic analysis"
      action={
        <WuPagination
          className="diary-analytics-pagination"
          totalRows={ANALYTICS_THEMES.length}
          initialPage={page}
          initialPageSize={THEME_PAGE_SIZE}
          onPageChange={setPage}
        />
      }
    >
      <div className="diary-analytics-sentiment">
        <span className="diary-analytics-sentiment-item">
          <span
            className="diary-analytics-sentiment-dot"
            style={{ background: SENTIMENT_COLORS.positive }}
            aria-hidden="true"
          />
          Positive
        </span>
        <span className="diary-analytics-sentiment-item">
          <span
            className="diary-analytics-sentiment-dot"
            style={{ background: SENTIMENT_COLORS.neutral }}
            aria-hidden="true"
          />
          Neutral
        </span>
        <span className="diary-analytics-sentiment-item">
          <span
            className="diary-analytics-sentiment-dot"
            style={{ background: SENTIMENT_COLORS.negative }}
            aria-hidden="true"
          />
          Negative
        </span>
      </div>

      <div className="diary-analytics-theme-list">
        {themes.map((theme) => (
          <ThemeRow key={theme.id} theme={theme} />
        ))}
      </div>
    </AnalyticsCard>
  )
}

export function DiaryAnalytics() {
  const [completionScope, setCompletionScope] =
    useState<CompletionScope>('quests')

  return (
    <div className="diary-analytics">
      <SectionHeader
        title="Analytics"
        actions={
          <WuButton
            variant="primary"
            onClick={() => console.log('generate report')}
          >
            Generate report
          </WuButton>
        }
      />

      <div className="diary-analytics-scroll">
        <div className="diary-analytics-stack">
          <SummaryCard />
          <TimelineCard />

          <div className="diary-analytics-split">
            <CompletionCard
              scope={completionScope}
              onScopeChange={setCompletionScope}
            />
            <ThematicCard />
          </div>
        </div>
      </div>
    </div>
  )
}