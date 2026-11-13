import type { IWuIcons } from '@npm-questionpro/wick-ui-lib'

export type ParticipantStatus =
  | 'in-progress'
  | 'finished'
  | 'invited'
  | 'pending-review'
  | 'rejected'

export type ParticipantSegment =
  | 'Panel'
  | 'Customers'
  | 'Beta testers'
  | 'Employees'

export interface DiaryParticipant {
  id: string
  name: string
  email: string
  segment: ParticipantSegment
  status: ParticipantStatus
  completedEntries: number
  totalEntries: number
  /** ISO calendar date (YYYY-MM-DD) of the participant's latest activity. */
  lastActivity: string
  /** Promised incentive in whole dollars. `0` renders as an em dash. */
  incentive: number
}

export interface ParticipantStatusConfig {
  label: string
  icon: IWuIcons
  color: string
  background: string
}

export const PARTICIPANT_TOTAL_ENTRIES = 7

export const PARTICIPANT_STATUS_ORDER: ParticipantStatus[] = [
  'in-progress',
  'finished',
  'invited',
  'pending-review',
  'rejected',
]

export const PARTICIPANT_STATUS_CONFIG: Record<
  ParticipantStatus,
  ParticipantStatusConfig
> = {
  'in-progress': {
    label: 'In progress',
    icon: 'wm-schedule',
    color: '#1b87e6',
    background: '#e7f3fd',
  },
  finished: {
    label: 'Finished',
    icon: 'wm-check-circle',
    color: '#138c13',
    background: '#f4fbf4',
  },
  invited: {
    label: 'Invited',
    icon: 'wm-mail',
    color: '#545e6b',
    background: '#f0f2f5',
  },
  'pending-review': {
    label: 'Pending review',
    icon: 'wm-pending',
    color: '#b26a00',
    background: '#fff6e5',
  },
  rejected: {
    label: 'Rejected',
    icon: 'wm-error',
    color: '#c62828',
    background: '#fdecec',
  },
}

function participant(
  name: string,
  email: string,
  segment: ParticipantSegment,
  status: ParticipantStatus,
  completedEntries: number,
  lastActivity: string,
  incentive: number,
): DiaryParticipant {
  return {
    id: email.split('@')[0].replace(/[^a-z0-9]+/gi, '-').toLowerCase(),
    name,
    email,
    segment,
    status,
    completedEntries,
    totalEntries: PARTICIPANT_TOTAL_ENTRIES,
    lastActivity,
    incentive,
  }
}

export const DIARY_PARTICIPANTS: DiaryParticipant[] = [
  participant(
    'Maya Rodriguez',
    'maya.rodriguez@gmail.com',
    'Panel',
    'in-progress',
    6,
    '2026-11-13',
    50,
  ),
  participant(
    'Daniel Okafor',
    'daniel.okafor@outlook.com',
    'Customers',
    'in-progress',
    4,
    '2026-11-13',
    50,
  ),
  participant(
    'Priya Nair',
    'priya.nair@acme.co',
    'Beta testers',
    'in-progress',
    5,
    '2026-11-12',
    40,
  ),
  participant(
    'Tom Becker',
    'tom.becker@gmail.com',
    'Panel',
    'in-progress',
    2,
    '2026-11-12',
    25,
  ),
  participant(
    'Aisha Khan',
    'aisha.khan@hey.com',
    'Customers',
    'in-progress',
    3,
    '2026-11-11',
    50,
  ),
  participant(
    'Lucas Ferreira',
    'lucas.ferreira@gmail.com',
    'Employees',
    'in-progress',
    1,
    '2026-11-11',
    25,
  ),
  participant(
    'Sofia Rossi',
    'sofia.rossi@fastmail.com',
    'Panel',
    'in-progress',
    6,
    '2026-11-10',
    40,
  ),
  participant(
    'Ethan Wong',
    'ethan.wong@outlook.com',
    'Beta testers',
    'in-progress',
    4,
    '2026-11-10',
    50,
  ),
  participant(
    'Amara Mensah',
    'amara.mensah@gmail.com',
    'Customers',
    'in-progress',
    2,
    '2026-11-09',
    40,
  ),
  participant(
    'Noah Jensen',
    'noah.jensen@proton.me',
    'Panel',
    'in-progress',
    5,
    '2026-11-09',
    25,
  ),
  participant(
    'Hana Sato',
    'hana.sato@acme.co',
    'Employees',
    'in-progress',
    3,
    '2026-11-08',
    50,
  ),
  participant(
    "Liam O'Connor",
    'liam.oconnor@gmail.com',
    'Customers',
    'in-progress',
    4,
    '2026-11-08',
    40,
  ),
  participant(
    'Isabella Moreno',
    'isabella.moreno@gmail.com',
    'Panel',
    'finished',
    7,
    '2026-11-12',
    50,
  ),
  participant(
    'Marcus Reed',
    'marcus.reed@outlook.com',
    'Customers',
    'finished',
    7,
    '2026-11-10',
    75,
  ),
  participant(
    'Yuki Tanaka',
    'yuki.tanaka@fastmail.com',
    'Beta testers',
    'finished',
    7,
    '2026-11-08',
    50,
  ),
  participant(
    'Grace Adeyemi',
    'grace.adeyemi@gmail.com',
    'Employees',
    'finished',
    7,
    '2026-11-06',
    40,
  ),
  participant(
    'Oliver Brandt',
    'oliver.brandt@gmail.com',
    'Panel',
    'invited',
    0,
    '2026-11-12',
    50,
  ),
  participant(
    'Nia Thompson',
    'nia.thompson@outlook.com',
    'Customers',
    'invited',
    0,
    '2026-11-11',
    50,
  ),
  participant(
    'Ravi Patel',
    'ravi.patel@acme.co',
    'Beta testers',
    'invited',
    0,
    '2026-11-10',
    40,
  ),
  participant(
    'Elena Petrova',
    'elena.petrova@proton.me',
    'Panel',
    'invited',
    0,
    '2026-11-09',
    25,
  ),
  participant(
    'Sam Wilson',
    'sam.wilson@gmail.com',
    'Employees',
    'invited',
    0,
    '2026-11-07',
    40,
  ),
  participant(
    'Fatima Al-Hassan',
    'fatima.alhassan@gmail.com',
    'Customers',
    'pending-review',
    7,
    '2026-11-13',
    75,
  ),
  participant(
    'Chris Martin',
    'chris.martin@outlook.com',
    'Panel',
    'rejected',
    6,
    '2026-11-10',
    0,
  ),
  participant(
    'Zoe Kim',
    'zoe.kim@gmail.com',
    'Beta testers',
    'rejected',
    3,
    '2026-11-08',
    0,
  ),
]

export function getParticipantStatusCounts(
  participants: DiaryParticipant[],
): Record<ParticipantStatus, number> {
  const counts = PARTICIPANT_STATUS_ORDER.reduce(
    (accumulator, status) => {
      accumulator[status] = 0
      return accumulator
    },
    {} as Record<ParticipantStatus, number>,
  )

  for (const participant of participants) {
    counts[participant.status] += 1
  }

  return counts
}

export function filterParticipants(
  participants: DiaryParticipant[],
  status: ParticipantStatus,
  query: string,
): DiaryParticipant[] {
  const needle = query.trim().toLowerCase()

  return participants.filter((participant) => {
    if (participant.status !== status) {
      return false
    }

    if (!needle) {
      return true
    }

    return `${participant.name} ${participant.email} ${participant.segment}`
      .toLowerCase()
      .includes(needle)
  })
}

export function getParticipantInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)

  if (parts.length === 0) {
    return '?'
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase()
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}

export function formatParticipantActivity(isoDate: string): string {
  const date = new Date(`${isoDate}T12:00:00`)

  if (Number.isNaN(date.getTime())) {
    return '—'
  }

  const today = new Date()
  const startOfToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  )
  const startOfActivity = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  )
  const daysAgo = Math.round(
    (startOfToday.getTime() - startOfActivity.getTime()) / 86_400_000,
  )

  if (daysAgo <= 0) {
    return 'Today'
  }

  if (daysAgo === 1) {
    return 'Yesterday'
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

export function formatIncentive(amount: number): string {
  if (amount <= 0) {
    return '—'
  }

  return amount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  })
}
