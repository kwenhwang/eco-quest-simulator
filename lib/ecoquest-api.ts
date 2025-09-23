import { supabase } from './supabase'

export async function joinEcoQuest(payload?: {
  username?: string
  avatarUrl?: string
  gameState?: Record<string, unknown>
  resources?: Record<string, unknown>
  settings?: Record<string, unknown>
}) {
  const { data, error } = await supabase.functions.invoke('join', {
    body: {
      user: payload?.username || payload?.avatarUrl
        ? {
            username: payload?.username,
            avatar_url: payload?.avatarUrl,
          }
        : undefined,
      session: payload?.gameState || payload?.resources || payload?.settings
        ? {
            game_state: payload?.gameState,
            resources: payload?.resources,
            settings: payload?.settings,
          }
        : undefined,
    },
  })
  return { data, error }
}

export async function fetchSeasonState() {
  const { data, error } = await supabase.functions.invoke('get-season-state')
  return { data, error }
}

export async function syncGameState(payload: {
  sessionId: string
  gameState?: Record<string, unknown>
  resources?: Record<string, unknown>
  level?: number
  score?: number
}) {
  const { data, error } = await supabase.functions.invoke('player_action', {
    body: {
      type: 'sync_state',
      session_id: payload.sessionId,
      game_state: payload.gameState,
      resources: payload.resources,
      current_level: payload.level,
      current_score: payload.score,
    },
  })
  return { data, error }
}

export async function recordLeaderboard(payload: {
  scoreType: string
  scoreValue: number
  season?: string | null
}) {
  const { data, error } = await supabase.functions.invoke('player_action', {
    body: {
      type: 'record_leaderboard',
      score_type: payload.scoreType,
      score_value: payload.scoreValue,
      season: payload.season,
    },
  })
  return { data, error }
}

export async function updateQuestProgress(payload: {
  questId: string
  status?: string
  completionPercentage?: number
  progress?: Record<string, unknown>
  rewardClaimed?: boolean
}) {
  const { data, error } = await supabase.functions.invoke('player_action', {
    body: {
      type: 'complete_quest',
      quest_id: payload.questId,
      status: payload.status,
      completion_percentage: payload.completionPercentage,
      progress: payload.progress,
      reward_claimed: payload.rewardClaimed,
    },
  })
  return { data, error }
}

export async function fetchLeaderboard(options?: { metric?: string; season?: string; limit?: number }) {
  const { data, error } = await supabase.functions.invoke('leaderboard', {
    body: {
      metric: options?.metric,
      season: options?.season,
      limit: options?.limit,
    },
  })
  return { data, error }
}
