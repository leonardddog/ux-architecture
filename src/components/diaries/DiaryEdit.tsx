import { useState } from 'react'
import { WuIcon, WuToggle } from '@npm-questionpro/wick-ui-lib'
import type { IWuIcons } from '@npm-questionpro/wick-ui-lib'
import type { DiaryEntry } from '../../data/diaryLibrary'

const EDIT = {
  blue: '#1b87e6',
  textPrimary: '#31373f',
  textBody: '#545e6b',
  textSubtle: '#9b9b9b',
  border: '#d8d8d8',
  cardBorder: 'rgba(0, 0, 0, 0.1)',
  liveBg: '#e5f8c5',
  liveText: '#227700',
  closedBg: '#ffd9d9',
  closedText: '#ba0000',
}

type EditTab = 'quests' | 'topics'

type QuestType = 'Standard' | 'Diary'
type QuestStatus = 'Live' | 'Closed'

type Quest = {
  id: string
  title: string
  type: QuestType
  questions: number
  participants: number
  status: QuestStatus
  thumbnail: string
}

const QUEST_ICONS: Record<QuestType, IWuIcons> = {
  Standard: 'wm-fact-check',
  Diary: 'wm-chronic',
}

const QUESTS: Quest[] = [
  {
    id: 'quest-1',
    title: 'Getting started',
    type: 'Standard',
    questions: 4,
    participants: 25,
    status: 'Live',
    thumbnail: '/diaries/customer-testimonial.png',
  },
  {
    id: 'quest-2',
    title: 'Daily photo check-in',
    type: 'Diary',
    questions: 12,
    participants: 154,
    status: 'Closed',
    thumbnail: '/diaries/holidays-2026.png',
  },
  {
    id: 'quest-3',
    title: 'End-of-study reflection',
    type: 'Standard',
    questions: 8,
    participants: 900,
    status: 'Closed',
    thumbnail: '/diaries/onboarding-walkthrough.png',
  },
]

function QuestMeta({
  icon,
  label,
}: {
  icon: IWuIcons
  label: string
}) {
  return (
    <span className="diary-edit-meta-item">
      <WuIcon icon={icon} style={{ fontSize: 20, color: EDIT.textSubtle }} />
      <span>{label}</span>
    </span>
  )
}

function HoverAction({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="diary-icon-button diary-edit-hover-action"
      aria-label={label}
    >
      <WuIcon
        icon="wm-more-vert"
        style={{ fontSize: 18, color: EDIT.textBody }}
      />
    </button>
  )
}

function QuestCard({ quest }: { quest: Quest }) {
  const statusClass =
    quest.status === 'Live'
      ? 'diary-edit-status--live'
      : 'diary-edit-status--closed'

  return (
    <article className="diary-edit-quest">
      <img
        className="diary-edit-quest-thumb"
        src={quest.thumbnail}
        alt=""
        loading="lazy"
      />

      <div className="diary-edit-quest-content">
        <div className="diary-edit-quest-heading">
          <h3 className="diary-edit-quest-title">{quest.title}</h3>
          <HoverAction label={`More actions for ${quest.title}`} />
        </div>

        <div className="diary-edit-quest-meta-row">
          <div className="diary-edit-quest-meta">
            <QuestMeta icon={QUEST_ICONS[quest.type]} label={quest.type} />
            <span className="diary-edit-meta-separator" aria-hidden="true" />
            <QuestMeta icon="wm-list-alt" label={String(quest.questions)} />
            <span className="diary-edit-meta-separator" aria-hidden="true" />
            <QuestMeta icon="wm-groups-2" label={String(quest.participants)} />
          </div>

          <span className={`diary-edit-status ${statusClass}`}>
            {quest.status}
          </span>
        </div>
      </div>
    </article>
  )
}

export function DiaryEdit({ entry }: { entry: DiaryEntry }) {
  const [tab, setTab] = useState<EditTab>('quests')
  const [progressiveDisclosure, setProgressiveDisclosure] = useState(false)

  return (
    <div className="diary-edit">
      <div className="diary-edit-hero">
        <img
          className="diary-edit-hero-image"
          src={entry.cover}
          alt=""
          fetchPriority="high"
        />
        <div className="diary-edit-hero-scrim" aria-hidden="true" />
        <h1 className="diary-edit-hero-title">{entry.title}</h1>
      </div>

      <div className="diary-edit-body">
        <div className="diary-edit-column diary-edit-column--left">
          <section className="diary-edit-card diary-edit-description">
            <div className="diary-edit-card-heading">
              <h2 className="diary-edit-card-title">Description</h2>
              <HoverAction label="More actions for description" />
            </div>

            <p className="diary-edit-card-copy">
              Use this space to introduce {entry.title}. Explain what
              participants will be asked to do each day, how long the study
              runs, and how their entries will be used. Clear context helps
              participants share richer, more consistent reflections.
            </p>
          </section>

          <section className="diary-edit-card diary-edit-video">
            <div className="diary-edit-card-heading">
              <h2 className="diary-edit-card-title">Introductory video</h2>
              <HoverAction label="More actions for introductory video" />
            </div>

            <p className="diary-edit-card-copy">
              Help participants understand the research context and objectives
              before they begin responding to quests.
            </p>

            <button
              type="button"
              className="diary-edit-upload"
              aria-label="Drag your video here or click to browse"
            >
              <WuIcon
                icon="wm-cloud-upload"
                style={{ fontSize: 40, color: EDIT.textBody }}
              />
              <span className="diary-edit-upload-copy">
                Drag your <span className="diary-edit-upload-keyword">video</span>{' '}
                here or <span className="diary-edit-upload-link">click to browse</span>
              </span>
            </button>
          </section>
        </div>

        <div className="diary-edit-column diary-edit-column--right">
          <div className="diary-edit-tabbar" role="tablist" aria-label="Edit sections">
            <button
              type="button"
              role="tab"
              id="diary-edit-quests-tab"
              aria-selected={tab === 'quests'}
              aria-controls="diary-edit-quests-panel"
              className={`diary-edit-tab${
                tab === 'quests' ? ' diary-edit-tab--active' : ''
              }`}
              onClick={() => setTab('quests')}
            >
              Quests
            </button>
            <button
              type="button"
              role="tab"
              id="diary-edit-topics-tab"
              aria-selected={tab === 'topics'}
              aria-controls="diary-edit-topics-panel"
              className={`diary-edit-tab${
                tab === 'topics' ? ' diary-edit-tab--active' : ''
              }`}
              onClick={() => setTab('topics')}
            >
              Topics
            </button>
          </div>

          {tab === 'quests' ? (
            <div
              className="diary-edit-tabpanel"
              role="tabpanel"
              id="diary-edit-quests-panel"
              aria-labelledby="diary-edit-quests-tab"
            >
              <div className="diary-edit-toolbar">
                <button type="button" className="diary-edit-new-quest">
                  <span className="diary-edit-new-quest-icon" aria-hidden="true">
                    <WuIcon
                      icon="wm-add-2"
                      style={{ fontSize: 18, color: EDIT.blue }}
                    />
                  </span>
                  <span>New quest</span>
                </button>

                <WuToggle
                  checked={progressiveDisclosure}
                  onChange={setProgressiveDisclosure}
                  labelPosition="left"
                  Label={
                    <span className="diary-edit-toggle-label">
                      Progressive quest disclosure
                    </span>
                  }
                />
              </div>

              <div className="diary-edit-quests">
                {QUESTS.map((quest) => (
                  <QuestCard key={quest.id} quest={quest} />
                ))}
              </div>
            </div>
          ) : (
            <div
              className="diary-edit-tabpanel"
              role="tabpanel"
              id="diary-edit-topics-panel"
              aria-labelledby="diary-edit-topics-tab"
            >
              <div className="diary-edit-empty">
                <span className="diary-edit-empty-icon" aria-hidden="true">
                  <WuIcon
                    icon="wm-topic"
                    style={{ fontSize: 24, color: EDIT.blue }}
                  />
                </span>
                <p className="diary-edit-empty-title">No topics yet</p>
                <p className="diary-edit-empty-copy">
                  Topics group quests around a theme so participants can follow
                  a thread across the whole study.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
