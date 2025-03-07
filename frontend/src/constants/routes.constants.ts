import type { ValueOf } from '~/types/utility'

export const ROUTES = {
  home: '/',
  learn: '/learn',
  profile: '/profile',
  practice: '/practice',
  wiki: '/wiki',
} as const

export type RoutePath = ValueOf<typeof ROUTES>
