import { ROUTES } from '~src/constants'

export const routes = [
  {
    id: 1,
    name: 'Home',
    url: ROUTES.home,
    color: 'yellow.200',
    img: '/img/menu-panda.svg',
    imgAlt: 'cute panda bear',
  },
  {
    id: 3,
    name: 'Practice',
    url: ROUTES.practice,
    color: 'purple.300',
    img: '/img/menu-monkey.svg',
    imgAlt: 'cute monkey',
  },
  {
    id: 2,
    name: 'Learn',
    url: ROUTES.learn,
    color: 'orange.300',
    img: '/img/menu-tiger.svg',
    imgAlt: 'cute tiger',
  },
  {
    id: 4,
    name: 'Profile',
    url: ROUTES.profile,
    color: 'green.400',
    img: '/img/menu-unicorn.svg',
    imgAlt: 'cute unicorn',
  },
]

export const [ROUTE_1, ROUTE_2, ROUTE_3, ROUTE_4] = routes
