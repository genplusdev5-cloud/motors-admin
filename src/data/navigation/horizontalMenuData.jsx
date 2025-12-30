const horizontalMenuData = dictionary => [
  // This is how you will normally render submenu
  {
    label: dictionary['navigation'].dashboards,
    icon: 'tabler-smart-home',
    children: [
      // This is how you will normally render menu item
      {
        label: dictionary['navigation'].crm,
        icon: 'tabler-chart-pie-2',
        href: '/admin/dashboards/crm'
      },
      {
        label: dictionary['navigation'].analytics,
        icon: 'tabler-trending-up',
        href: '/admin/dashboards/analytics'
      },
      {
        label: dictionary['navigation'].eCommerce,
        icon: 'tabler-shopping-cart',
        href: '/admin/dashboards/ecommerce'
      },
      {
        label: dictionary['navigation'].academy,
        icon: 'tabler-school',
        href: '/admin/dashboards/academy'
      },
      {
        label: dictionary['navigation'].logistics,
        icon: 'tabler-truck',
        href: '/admin/dashboards/logistics'
      }
    ]
  },
  {
    label: dictionary['navigation'].apps,
    icon: 'tabler-mail',
    children: [
      {
        label: dictionary['navigation'].eCommerce,
        icon: 'tabler-shopping-cart',
        children: [
          {
            label: dictionary['navigation'].dashboard,
            href: '/admin/apps/ecommerce/dashboard'
          },
          {
            label: dictionary['navigation'].products,
            children: [
              {
                label: dictionary['navigation'].list,
                href: '/admin/apps/ecommerce/products/list'
              },
              {
                label: dictionary['navigation'].add,
                href: '/admin/apps/ecommerce/products/add'
              },
              {
                label: dictionary['navigation'].category,
                href: '/admin/apps/ecommerce/products/category'
              }
            ]
          },
          {
            label: dictionary['navigation'].orders,
            children: [
              {
                label: dictionary['navigation'].list,
                href: '/admin/apps/ecommerce/orders/list'
              },
              {
                label: dictionary['navigation'].details,
                href: '/admin/apps/ecommerce/orders/details/5434',
                exactMatch: false,
                activeUrl: '/apps/ecommerce/orders/details'
              }
            ]
          },
          {
            label: dictionary['navigation'].customers,
            children: [
              {
                label: dictionary['navigation'].list,
                href: '/admin/apps/ecommerce/customers/list'
              },
              {
                label: dictionary['navigation'].details,
                href: '/admin/apps/ecommerce/customers/details/879861',
                exactMatch: false,
                activeUrl: '/apps/ecommerce/customers/details'
              }
            ]
          },
          {
            label: dictionary['navigation'].manageReviews,
            href: '/admin/apps/ecommerce/manage-reviews'
          },
          {
            label: dictionary['navigation'].referrals,
            href: '/admin/apps/ecommerce/referrals'
          },
          {
            label: dictionary['navigation'].settings,
            href: '/admin/apps/ecommerce/settings'
          }
        ]
      },
      {
        label: dictionary['navigation'].academy,
        icon: 'tabler-school',
        children: [
          {
            label: dictionary['navigation'].dashboard,
            href: '/admin/apps/academy/dashboard'
          },
          {
            label: dictionary['navigation'].myCourses,
            href: '/admin/apps/academy/my-courses'
          },
          {
            label: dictionary['navigation'].courseDetails,
            href: '/admin/apps/academy/course-details'
          }
        ]
      },
      {
        label: dictionary['navigation'].logistics,
        icon: 'tabler-truck',
        children: [
          {
            label: dictionary['navigation'].dashboard,
            href: '/admin/apps/logistics/dashboard'
          },
          {
            label: dictionary['navigation'].fleet,
            href: '/admin/apps/logistics/fleet'
          }
        ]
      },
      {
        label: dictionary['navigation'].email,
        icon: 'tabler-mail',
        href: '/admin/apps/email',
        exactMatch: false,
        activeUrl: '/apps/email'
      },
      {
        label: dictionary['navigation'].chat,
        icon: 'tabler-message-circle-2',
        href: '/admin/apps/chat'
      },
      {
        label: dictionary['navigation'].calendar,
        icon: 'tabler-calendar',
        href: '/admin/apps/calendar'
      },
      {
        label: dictionary['navigation'].kanban,
        icon: 'tabler-copy',
        href: '/admin/apps/kanban'
      },
      {
        label: dictionary['navigation'].invoice,
        icon: 'tabler-file-description',
        children: [
          {
            label: dictionary['navigation'].list,
            icon: 'tabler-circle',
            href: '/admin/apps/invoice/list'
          },
          {
            label: dictionary['navigation'].preview,
            icon: 'tabler-circle',
            href: '/admin/apps/invoice/preview/4987',
            exactMatch: false,
            activeUrl: '/apps/invoice/preview'
          },
          {
            label: dictionary['navigation'].edit,
            icon: 'tabler-circle',
            href: '/admin/apps/invoice/edit/4987',
            exactMatch: false,
            activeUrl: '/apps/invoice/edit'
          },
          {
            label: dictionary['navigation'].add,
            icon: 'tabler-circle',
            href: '/admin/apps/invoice/add'
          }
        ]
      },
      {
        label: dictionary['navigation'].user,
        icon: 'tabler-user',
        children: [
          {
            label: dictionary['navigation'].list,
            icon: 'tabler-circle',
            href: '/admin/apps/user/list'
          },
          {
            label: dictionary['navigation'].view,
            icon: 'tabler-circle',
            href: '/admin/apps/user/view'
          }
        ]
      },
      {
        label: dictionary['navigation'].rolesPermissions,
        icon: 'tabler-lock',
        children: [
          {
            label: dictionary['navigation'].roles,
            icon: 'tabler-circle',
            href: '/admin/apps/roles'
          },
          {
            label: dictionary['navigation'].permissions,
            icon: 'tabler-circle',
            href: '/admin/apps/permissions'
          }
        ]
      }
    ]
  },
  {
    label: dictionary['navigation'].pages,
    icon: 'tabler-file',
    children: [
      {
        label: dictionary['navigation'].userProfile,
        icon: 'tabler-user-circle',
        href: '/admin/pages/user-profile'
      },
      {
        label: dictionary['navigation'].accountSettings,
        icon: 'tabler-settings',
        href: '/admin/pages/account-settings'
      },
      {
        label: dictionary['navigation'].faq,
        icon: 'tabler-help-circle',
        href: '/admin/pages/faq'
      },
      {
        label: dictionary['navigation'].pricing,
        icon: 'tabler-currency-dollar',
        href: '/admin/pages/pricing'
      },
      {
        label: dictionary['navigation'].miscellaneous,
        icon: 'tabler-file-info',
        children: [
          {
            label: dictionary['navigation'].comingSoon,
            icon: 'tabler-circle',
            href: '/admin/pages/misc/coming-soon',
            target: '_blank'
          },
          {
            label: dictionary['navigation'].underMaintenance,
            icon: 'tabler-circle',
            href: '/admin/pages/misc/under-maintenance',
            target: '_blank'
          },
          {
            label: dictionary['navigation'].pageNotFound404,
            icon: 'tabler-circle',
            href: '/admin/pages/misc/404-not-found',
            target: '_blank'
          },
          {
            label: dictionary['navigation'].notAuthorized401,
            icon: 'tabler-circle',
            href: '/admin/pages/misc/401-not-authorized',
            target: '_blank'
          }
        ]
      },
      {
        label: dictionary['navigation'].authPages,
        icon: 'tabler-shield-lock',
        children: [
          {
            label: dictionary['navigation'].login,
            icon: 'tabler-circle',
            children: [
              {
                label: dictionary['navigation'].loginV1,
                icon: 'tabler-circle',
                href: '/admin/pages/auth/login-v1',
                target: '_blank'
              },
              {
                label: dictionary['navigation'].loginV2,
                icon: 'tabler-circle',
                href: '/admin/pages/auth/login-v2',
                target: '_blank'
              }
            ]
          },
          {
            label: dictionary['navigation'].register,
            icon: 'tabler-circle',
            children: [
              {
                label: dictionary['navigation'].registerV1,
                icon: 'tabler-circle',
                href: '/admin/pages/auth/register-v1',
                target: '_blank'
              },
              {
                label: dictionary['navigation'].registerV2,
                icon: 'tabler-circle',
                href: '/admin/pages/auth/register-v2',
                target: '_blank'
              },
              {
                label: dictionary['navigation'].registerMultiSteps,
                icon: 'tabler-circle',
                href: '/admin/pages/auth/register-multi-steps',
                target: '_blank'
              }
            ]
          },
          {
            label: dictionary['navigation'].verifyEmail,
            icon: 'tabler-circle',
            children: [
              {
                label: dictionary['navigation'].verifyEmailV1,
                icon: 'tabler-circle',
                href: '/admin/pages/auth/verify-email-v1',
                target: '_blank'
              },
              {
                label: dictionary['navigation'].verifyEmailV2,
                icon: 'tabler-circle',
                href: '/admin/pages/auth/verify-email-v2',
                target: '_blank'
              }
            ]
          },
          {
            label: dictionary['navigation'].forgotPassword,
            icon: 'tabler-circle',
            children: [
              {
                label: dictionary['navigation'].forgotPasswordV1,
                icon: 'tabler-circle',
                href: '/admin/pages/auth/forgot-password-v1',
                target: '_blank'
              },
              {
                label: dictionary['navigation'].forgotPasswordV2,
                icon: 'tabler-circle',
                href: '/admin/pages/auth/forgot-password-v2',
                target: '_blank'
              }
            ]
          },
          {
            label: dictionary['navigation'].resetPassword,
            icon: 'tabler-circle',
            children: [
              {
                label: dictionary['navigation'].resetPasswordV1,
                icon: 'tabler-circle',
                href: '/admin/pages/auth/reset-password-v1',
                target: '_blank'
              },
              {
                label: dictionary['navigation'].resetPasswordV2,
                icon: 'tabler-circle',
                href: '/admin/pages/auth/reset-password-v2',
                target: '_blank'
              }
            ]
          },
          {
            label: dictionary['navigation'].twoSteps,
            icon: 'tabler-circle',
            children: [
              {
                label: dictionary['navigation'].twoStepsV1,
                icon: 'tabler-circle',
                href: '/admin/pages/auth/two-steps-v1',
                target: '_blank'
              },
              {
                label: dictionary['navigation'].twoStepsV2,
                icon: 'tabler-circle',
                href: '/admin/pages/auth/two-steps-v2',
                target: '_blank'
              }
            ]
          }
        ]
      },
      {
        label: dictionary['navigation'].wizardExamples,
        icon: 'tabler-dots',
        children: [
          {
            label: dictionary['navigation'].checkout,
            icon: 'tabler-circle',
            href: '/admin/pages/wizard-examples/checkout'
          },
          {
            label: dictionary['navigation'].propertyListing,
            icon: 'tabler-circle',
            href: '/admin/pages/wizard-examples/property-listing'
          },
          {
            label: dictionary['navigation'].createDeal,
            icon: 'tabler-circle',
            href: '/admin/pages/wizard-examples/create-deal'
          }
        ]
      },
      {
        label: dictionary['navigation'].dialogExamples,
        icon: 'tabler-square',
        href: '/admin/pages/dialog-examples'
      },
      {
        label: dictionary['navigation'].widgetExamples,
        icon: 'tabler-chart-bar',
        children: [
          {
            label: dictionary['navigation'].basic,
            href: '/admin/pages/widget-examples/basic'
          },
          {
            label: dictionary['navigation'].advanced,
            icon: 'tabler-circle',
            href: '/admin/pages/widget-examples/advanced'
          },
          {
            label: dictionary['navigation'].statistics,
            icon: 'tabler-circle',
            href: '/admin/pages/widget-examples/statistics'
          },
          {
            label: dictionary['navigation'].charts,
            icon: 'tabler-circle',
            href: '/admin/pages/widget-examples/charts'
          },
          {
            label: dictionary['navigation'].actions,
            href: '/admin/pages/widget-examples/actions'
          }
        ]
      },
      {
        label: dictionary['navigation'].frontPages,
        icon: 'tabler-files',
        children: [
          {
            label: dictionary['navigation'].landing,
            href: '/front-pages/landing-page',
            target: '_blank',
            excludeLang: true
          },
          {
            label: dictionary['navigation'].pricing,
            href: '/front-pages/pricing',
            target: '_blank',
            excludeLang: true
          },
          {
            label: dictionary['navigation'].payment,
            href: '/front-pages/payment',
            target: '_blank',
            excludeLang: true
          },
          {
            label: dictionary['navigation'].checkout,
            href: '/front-pages/checkout',
            target: '_blank',
            excludeLang: true
          },
          {
            label: dictionary['navigation'].helpCenter,
            href: '/front-pages/help-center',
            target: '_blank',
            excludeLang: true
          }
        ]
      }
    ]
  },
  {
    label: dictionary['navigation'].formsAndTables,
    icon: 'tabler-file-invoice',
    children: [
      {
        label: dictionary['navigation'].formLayouts,
        icon: 'tabler-layout',
        href: '/admin/forms/form-layouts'
      },
      {
        label: dictionary['navigation'].formValidation,
        icon: 'tabler-checkup-list',
        href: '/admin/forms/form-validation'
      },
      {
        label: dictionary['navigation'].formWizard,
        icon: 'tabler-git-merge',
        href: '/admin/forms/form-wizard'
      },
      {
        label: dictionary['navigation'].reactTable,
        icon: 'tabler-table',
        href: '/admin/react-table'
      },
      {
        label: dictionary['navigation'].formELements,
        icon: 'tabler-checkbox',
        suffix: <i className='tabler-external-link text-xl' />,
        href: `${process.env.NEXT_PUBLIC_DOCS_URL}/docs/user-interface/form-elements`,
        target: '_blank'
      },
      {
        label: dictionary['navigation'].muiTables,
        icon: 'tabler-layout-board-split',
        href: `${process.env.NEXT_PUBLIC_DOCS_URL}/docs/user-interface/mui-table`,
        suffix: <i className='tabler-external-link text-xl' />,
        target: '_blank'
      }
    ]
  },
  {
    label: dictionary['navigation'].charts,
    icon: 'tabler-chart-donut-2',
    children: [
      {
        label: dictionary['navigation'].apex,
        icon: 'tabler-chart-ppf',
        href: '/admin/charts/apex-charts'
      },
      {
        label: dictionary['navigation'].recharts,
        icon: 'tabler-chart-sankey',
        href: '/admin/charts/recharts'
      }
    ]
  },
  {
    label: dictionary['navigation'].others,
    icon: 'tabler-dots',
    children: [
      {
        label: dictionary['navigation'].foundation,
        icon: 'tabler-cards',
        href: `${process.env.NEXT_PUBLIC_DOCS_URL}/docs/user-interface/foundation`,
        suffix: <i className='tabler-external-link text-xl' />,
        target: '_blank'
      },
      {
        label: dictionary['navigation'].components,
        icon: 'tabler-atom',
        href: `${process.env.NEXT_PUBLIC_DOCS_URL}/docs/user-interface/components`,
        suffix: <i className='tabler-external-link text-xl' />,
        target: '_blank'
      },
      {
        label: dictionary['navigation'].menuExamples,
        icon: 'tabler-list-search',
        href: `${process.env.NEXT_PUBLIC_DOCS_URL}/docs/menu-examples/overview`,
        suffix: <i className='tabler-external-link text-xl' />,
        target: '_blank'
      },
      {
        label: dictionary['navigation'].raiseSupport,
        icon: 'tabler-lifebuoy',
        suffix: <i className='tabler-external-link text-xl' />,
        target: '_blank',
        href: 'https://pixinvent.ticksy.com'
      },
      {
        label: dictionary['navigation'].documentation,
        icon: 'tabler-book-2',
        suffix: <i className='tabler-external-link text-xl' />,
        target: '_blank',
        href: `${process.env.NEXT_PUBLIC_DOCS_URL}`
      },
      {
        suffix: {
          label: 'New',
          color: 'info'
        },
        label: dictionary['navigation'].itemWithBadge,
        icon: 'tabler-notification'
      },
      {
        label: dictionary['navigation'].externalLink,
        icon: 'tabler-link',
        href: 'https://pixinvent.com',
        target: '_blank',
        suffix: <i className='tabler-external-link text-xl' />
      },
      {
        label: dictionary['navigation'].menuLevels,
        icon: 'tabler-menu-2',
        children: [
          {
            label: dictionary['navigation'].menuLevel2,
            icon: 'tabler-circle'
          },
          {
            label: dictionary['navigation'].menuLevel2,
            icon: 'tabler-circle',
            children: [
              {
                label: dictionary['navigation'].menuLevel3,
                icon: 'tabler-circle'
              },
              {
                label: dictionary['navigation'].menuLevel3,
                icon: 'tabler-circle'
              }
            ]
          }
        ]
      },
      {
        label: dictionary['navigation'].disabledMenu,
        disabled: true
      }
    ]
  }
]

export default horizontalMenuData
