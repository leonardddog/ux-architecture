import { useEffect, useRef, useState } from 'react'
import {
  WuButton,
  WuIcon,
  WuTab,
  WuToggle,
} from '@npm-questionpro/wick-ui-lib'
import type { IWuTabItem } from '@npm-questionpro/wick-ui-lib'
import { WuContentEditor } from '@npm-questionpro/wick-ui-editor'

const INVITATION_CONTENT = `
  <h1>Title of project...</h1>
  <p>Type in you next big idea here</p>
  <p>Aliquam eleifend quis massa sit amet tincidunt. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut ut augue ipsum. Sed euismod ligula a augue eleifend tempor. Phasellus eget pellentesque leo <strong>tristique quam.</strong> Morbi sed rutrum risus. Ut consectetur metus ipsum, a commodo purus pharetra</p>
`

const DEFAULT_QUOTA = 50

function PlaceholderPanel({ copy }: { copy: string }) {
  return (
    <div className="diary-invitation-panel">
      <p className="diary-invitation-help">{copy}</p>
      <div className="diary-invitation-placeholder">
        <WuIcon icon="wm-settings" style={{ fontSize: 24 }} />
        <p>Coming soon</p>
      </div>
    </div>
  )
}

export function DiaryInvitationSettings({
  active,
  onBack,
}: {
  active: boolean
  onBack: () => void
}) {
  const [subject, setSubject] = useState('QuestionPro UX')
  const [content, setContent] = useState(INVITATION_CONTENT)
  const [quota, setQuota] = useState(DEFAULT_QUOTA)
  const [quotaDraft, setQuotaDraft] = useState(String(DEFAULT_QUOTA))
  const [autoAccept, setAutoAccept] = useState(false)
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (active) {
      headingRef.current?.focus()
    }
  }, [active])

  const saveChanges = () => {
    console.log('save invitation settings', { subject, content })
  }

  const commitQuota = () => {
    const parsed = Number.parseInt(quotaDraft, 10)
    const next = Number.isFinite(parsed) ? Math.max(1, parsed) : DEFAULT_QUOTA

    setQuota(next)
    setQuotaDraft(String(next))

    if (next !== quota) {
      console.log('update invitation quota', next)
    }
  }

  const updateAutoAccept = (checked: boolean) => {
    setAutoAccept(checked)
    console.log('update invitation auto-accept', checked)
  }

  const tabItems: IWuTabItem[] = [
    {
      value: 'invitation',
      Trigger: 'Invitation message',
      Content: (
        <div className="diary-invitation-panel">
          <p className="diary-invitation-help">
            Customize the invitation email for your participants when added to
            the study:
          </p>

          <div className="diary-invitation-fields">
            <div className="diary-invitation-field">
              <label
                className="diary-invitation-label"
                htmlFor="invitation-from"
              >
                From:
              </label>
              <input
                id="invitation-from"
                className="diary-invitation-input diary-invitation-input--disabled"
                value="ux@questionpro.com"
                disabled
              />
            </div>

            <div className="diary-invitation-field">
              <label
                className="diary-invitation-label"
                htmlFor="invitation-name"
              >
                Name:
              </label>
              <input
                id="invitation-name"
                className="diary-invitation-input diary-invitation-input--disabled"
                value="QuestionPro UX"
                disabled
              />
            </div>

            <div className="diary-invitation-field">
              <label
                className="diary-invitation-label"
                htmlFor="invitation-subject"
              >
                Subject
              </label>
              <input
                id="invitation-subject"
                className="diary-invitation-input diary-invitation-input--subject"
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
              />
            </div>
          </div>

          <div className="diary-invitation-editor">
            <WuContentEditor
              defaultValue={INVITATION_CONTENT}
              onUpdate={setContent}
              defaultValues={{ fontFamily: 'Fira Sans', fontSize: 14 }}
              toolbarItems={[
                'block',
                '|',
                'fontFamily',
                '|',
                'fontSize',
                '|',
                'bold',
                'underline',
                'italic',
                'color',
                'bgColor',
                '|',
                'alignment',
                'indent',
                'outdent',
                'list',
                '|',
                'link',
                'image',
                'table',
                'blockquote',
                'codeline',
                'superscript',
                'subscript',
                'clear',
              ]}
              aria-label="Invitation message"
            />
          </div>

          <div className="diary-invitation-actions">
            <WuButton size="md" variant="primary" onClick={saveChanges}>
              Save changes
            </WuButton>
          </div>
        </div>
      ),
    },
    {
      value: 'acceptance',
      Trigger: 'Acceptance message',
      Content: (
        <PlaceholderPanel copy="Customize the acceptance email your participants receive after joining the study." />
      ),
    },
    {
      value: 'settings',
      Trigger: 'Settings',
      Content: (
        <div className="diary-invitation-settings">
          <div className="diary-setting-row">
            <div className="diary-setting-copy">
              <label
                id="invitation-quota-label"
                className="diary-setting-title"
                htmlFor="invitation-quota"
              >
                Quota
              </label>
              <span
                id="invitation-quota-description"
                className="diary-setting-description"
              >
                Set a maximum number of participants for this study. New
                participants will not be accepted once the limit is reached.
              </span>
            </div>
            <input
              id="invitation-quota"
              className="diary-setting-quota"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="off"
              value={quotaDraft}
              aria-labelledby="invitation-quota-label"
              aria-describedby="invitation-quota-description"
              onChange={(event) =>
                setQuotaDraft(event.target.value.replace(/\D/g, ''))
              }
              onBlur={commitQuota}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault()
                  event.currentTarget.blur()
                }
              }}
            />
          </div>

          <div className="diary-setting-row">
            <div className="diary-setting-copy">
              <span id="invitation-auto-accept-label" className="diary-setting-title">
                Auto-accept
              </span>
              <span
                id="invitation-auto-accept-description"
                className="diary-setting-description"
              >
                Automatically accept participants upon signup, allowing them to
                start quests without manual approval.
              </span>
            </div>
            <WuToggle
              checked={autoAccept}
              onChange={updateAutoAccept}
              aria-labelledby="invitation-auto-accept-label"
              aria-describedby="invitation-auto-accept-description"
            />
          </div>
        </div>
      ),
    },
  ]

  return (
    <div className="diary-invitation-view">
      <div className="diary-subview-header">
        <nav className="diary-breadcrumb" aria-label="Breadcrumb">
          <button
            type="button"
            className="diary-icon-button diary-breadcrumb-back"
            aria-label="Back to participants"
            title="Back to participants"
            onClick={onBack}
          >
            <WuIcon icon="wm-keyboard-arrow-left" style={{ fontSize: 18 }} />
          </button>
          <button
            type="button"
            className="diary-breadcrumb-link"
            onClick={onBack}
          >
            Participants
          </button>
          <span className="diary-breadcrumb-separator" aria-hidden="true">
            /
          </span>
          <h1
            ref={headingRef}
            tabIndex={-1}
            className="diary-breadcrumb-current"
          >
            Invitation settings
          </h1>
        </nav>
      </div>

      <div className="diary-participants-content diary-invitation-content">
        <WuTab
          className="diary-invitation-tabs"
          defaultValue="invitation"
          items={tabItems}
          aria-label="Invitation settings"
        />
      </div>
    </div>
  )
}