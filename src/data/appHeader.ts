import type { IWuAppHeaderAccount, IWuAppHeaderMenuItem } from '@npm-questionpro/wick-ui-lib'

export const PRODUCT_NAME = 'QuestionPro UX'

export const productCategories: IWuAppHeaderMenuItem[] = [
  {
    name: 'Experience Management',
    logo: '/logos/experience-management.svg',
    active: true,
    products: [
      { name: 'QuestionPro', link: 'https://www.questionpro.com', icon: 'e313', active: true, order: 1 },
      { name: 'QuestionPro UX', link: '/', icon: 'e382', active: true, order: 2 },
      { name: 'QuestionPro Communities', link: '#', icon: 'e314', active: true, order: 3 },
    ],
  },
  {
    name: 'Research',
    logo: '/logos/research.svg',
    active: true,
    products: [
      { name: 'QuestionPro Surveys', link: '#', icon: 'e308', active: true, order: 1 },
      { name: 'QuestionPro Audience', link: '#', icon: 'e309', active: true, order: 2 },
      { name: 'QuestionPro BI', link: '#', icon: 'e381', active: true, order: 3 },
    ],
  },
  {
    name: 'Insights',
    logo: '/logos/insights.svg',
    active: true,
    products: [
      { name: 'QuestionPro Insights', link: '#', icon: 'e317', active: true, order: 1 },
      { name: 'QuestionPro Reputation', link: '#', icon: 'e316', active: true, order: 2 },
    ],
  },
]

export const demoUser: IWuAppHeaderAccount = {
  profile: {
    title: 'Jane Doe',
    subtitle: 'jane.doe@questionpro.com',
    companyName: 'Acme Inc.',
    initials: 'JD',
  },
  license: {
    title: 'Enterprise',
    subtitle: 'Renews annually',
    showExpiryDate: true,
    expiryDate: '2027-01-31',
    expiryDatePostFixString: 'License expires on',
  },
  settings: [
    { title: 'Account Settings', url: '#', canDisplay: true, displayIcon: true },
    { title: 'Team Members', url: '#', canDisplay: true, displayIcon: true },
  ],
}
