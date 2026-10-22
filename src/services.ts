import type { ExamResult, ExamSession, ManagedExam, User } from './types'

const storageKeys = {
  user: 'aviation-cbt-user',
  admin: 'aviation-cbt-admin',
  adminReadResults: 'aviation-cbt-admin-read-results',
  session: 'aviation-cbt-session',
  results: 'aviation-cbt-results',
  exams: 'aviation-cbt-managed-exams'
} as const

const read = <T>(key: string, fallback: T): T => {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) as T : fallback
  } catch {
    return fallback
  }
}

export const auth = {
  login(id: string, password: string): User | null {
    const normalizedId = id.trim()
    if (normalizedId !== 'test-user' || password !== 'test1234') return null

    const user = { id: normalizedId, displayName: normalizedId }
    localStorage.setItem(storageKeys.user, JSON.stringify(user))
    return user
  },
  logout() {
    localStorage.removeItem(storageKeys.user)
  },
  current(): User | null {
    const user = read<User | null>(storageKeys.user, null)
    return user ? { ...user, displayName: user.id } : null
  }
}

export const adminAuth = {
  login(id: string, password: string): boolean {
    if (id.trim() !== 'admin' || password !== 'admin1234') return false
    localStorage.setItem(storageKeys.admin, 'true')
    return true
  },
  logout() {
    localStorage.removeItem(storageKeys.admin)
  },
  isAuthenticated() {
    return localStorage.getItem(storageKeys.admin) === 'true'
  }
}

export const adminNotifications = {
  unreadResultIds(): string[] {
    const readIds = new Set(read<string[]>(storageKeys.adminReadResults, []))
    return storage.allResults().filter(result => !readIds.has(result.id)).map(result => result.id)
  },
  markResultAsRead(id: string) {
    const readIds = read<string[]>(storageKeys.adminReadResults, [])
    if (!readIds.includes(id)) {
      localStorage.setItem(storageKeys.adminReadResults, JSON.stringify([...readIds, id]))
    }
  }
}

export const storage = {
  getSession: () => read<ExamSession | null>(storageKeys.session, null),
  saveSession: (session: ExamSession) => localStorage.setItem(storageKeys.session, JSON.stringify(session)),
  clearSession: () => localStorage.removeItem(storageKeys.session),
  results(userId: string) {
    return read<ExamResult[]>(storageKeys.results, [])
      .filter(result => result.userId === userId)
      .sort((a, b) => b.submittedAt - a.submittedAt)
  },
  allResults() {
    return read<ExamResult[]>(storageKeys.results, [])
      .sort((a, b) => b.submittedAt - a.submittedAt)
  },
  exams() {
    return read<ManagedExam[]>(storageKeys.exams, [])
      .sort((a, b) => b.exam.period.localeCompare(a.exam.period))
  },
  publishedExams() {
    return storage.exams().filter(item => item.status === 'published')
  },
  saveExam(managedExam: ManagedExam) {
    const exams = read<ManagedExam[]>(storageKeys.exams, [])
    const next = exams.filter(item => item.exam.id !== managedExam.exam.id)
    localStorage.setItem(storageKeys.exams, JSON.stringify([managedExam, ...next]))
  },
  updateExamStatus(id: string, status: ManagedExam['status']) {
    const managedExam = storage.exams().find(item => item.exam.id === id)
    if (managedExam) storage.saveExam({ ...managedExam, status, updatedAt: Date.now() })
  },
  saveResult(result: ExamResult) {
    const allResults = read<ExamResult[]>(storageKeys.results, [])
    localStorage.setItem(storageKeys.results, JSON.stringify([result, ...allResults]))
    localStorage.removeItem(storageKeys.session)
  },
  result(id: string, userId: string) {
    return read<ExamResult[]>(storageKeys.results, [])
      .find(result => result.id === id && result.userId === userId)
  }
}
