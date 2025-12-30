// Next Imports
import { useParams } from 'next/navigation'

// MUI Imports
import { useTheme } from '@mui/material/styles'

// Third-party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'

// Component Imports
import { Menu, SubMenu, MenuItem, MenuSection } from '@menu/vertical-menu'
import CustomChip from '@core/components/mui/Chip'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'

// Styled Component Imports
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'

// Style Imports
// This import will now bring in the updated logic for dark mode
import menuItemStyles from '@core/styles/vertical/menuItemStyles'
import menuSectionStyles from '@core/styles/vertical/menuSectionStyles'

const RenderExpandIcon = ({ open, transitionDuration }) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <i className='tabler-chevron-right' />
  </StyledVerticalNavExpandIcon>
)

const VerticalMenu = ({ dictionary, scrollMenu }) => {
  // Hooks
  const theme = useTheme()
  const verticalNavOptions = useVerticalNav()
  const params = useParams()

  // Vars
  const { isBreakpointReached, transitionDuration } = verticalNavOptions
  const { lang: locale } = params
  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar

  return (
    <ScrollWrapper
      {...(isBreakpointReached
        ? {
            className: 'bs-full overflow-y-auto overflow-x-hidden'
            // ❌ Removed scrollMenu auto-scroll
          }
        : {
            options: { wheelPropagation: false, suppressScrollX: true }
            // ❌ Removed scrollMenu auto-scroll
          })}
    >
      {/* Vertical Menu */}
      <Menu
        popoutMenuOffset={{ mainAxis: 23 }}
        menuItemStyles={menuItemStyles(verticalNavOptions, theme)}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{ icon: <i className='tabler-circle text-xs' /> }}
        menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
      >
        <MenuItem href={`/${locale}/admin/dashboard`} icon={<i className='tabler-smart-home' />}>
          Dashboard
        </MenuItem>

        <SubMenu label='Masters' icon={<i className='tabler-database' />}>
          <MenuItem href={`/${locale}/admin/company`}>{'Company'}</MenuItem>
          <MenuItem href={`/${locale}/admin/category`}>{'Category'}</MenuItem>

          <MenuItem href={`/${locale}/admin/vehicle-make`}>{'Vehicle Make'}</MenuItem>
          <MenuItem href={`/${locale}/admin/colors`}>{'Colors'}</MenuItem>

          <MenuItem href={`/${locale}/admin/body-type`}>{'Body Type'}</MenuItem>
          <MenuItem href={`/${locale}/admin/engine-type`}>{'Engine Type'}</MenuItem>
          <MenuItem href={`/${locale}/admin/fuel-type`}>{'Fuel Type'}</MenuItem>
          <MenuItem href={`/${locale}/admin/vehicle-model`}>{'Vehicle Model'}</MenuItem>
          <MenuItem href={`/${locale}/admin/subscription-type`}>{'Subscription Type'}</MenuItem>
          <MenuItem href={`/${locale}/admin/bank-finance`}>{'Bank & Finance'}</MenuItem>
          <MenuItem href={`/${locale}/admin/insurance`}>{'Insurance'}</MenuItem>
          <MenuItem href={`/${locale}/admin/settings`}>{'Settings'}</MenuItem>

          {/* 🔽 New masters */}
          <MenuItem href={`/${locale}/admin/suspension-type`}>{'Suspension Type'}</MenuItem>
          <MenuItem href={`/${locale}/admin/steering-type`}>{'Steering Type'}</MenuItem>
          <MenuItem href={`/${locale}/admin/tyre-size`}>{'Tyre Size'}</MenuItem>
          <MenuItem href={`/${locale}/admin/tyre-type`}>{'Tyre Type'}</MenuItem>
          <MenuItem href={`/${locale}/admin/garage`}>{'Garage'}</MenuItem>
          <MenuItem href={`/${locale}/admin/variant`}>{'Variant'}</MenuItem>
        </SubMenu>

        <SubMenu label='User Roles' icon={<i className='tabler-users' />}>
          <MenuItem href={`/${locale}/admin/admin-roles`}>{'Admin Roles'}</MenuItem>
          <MenuItem href={`/${locale}/admin/dealer-user-role`}>{'Dealer Roles'}</MenuItem>
        </SubMenu>

        <MenuItem href={`/${locale}/admin/plans`} icon={<i className='tabler-credit-card' />}>
          Plans
        </MenuItem>

        <MenuItem href={`/${locale}/admin/subscription`} icon={<i className='tabler-table' />}>
          Subscription
        </MenuItem>

        <MenuItem href={`/${locale}/admin/dealership`} icon={<i className='tabler-building-store' />}>
          DealerShip
        </MenuItem>

        <MenuItem href={`/${locale}/admin/buyer`} icon={<i className='tabler-shopping-cart' />}>
          Buyer
        </MenuItem>

        <MenuItem href={`/${locale}/admin/seller`} icon={<i className='tabler-package' />}>
          Seller
        </MenuItem>
      </Menu>

      <Menu
        popoutMenuOffset={{ mainAxis: 23 }}
        menuItemStyles={menuItemStyles(verticalNavOptions, theme)}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{ icon: <i className='tabler-circle text-xs' /> }}
        menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
      >
        {/* Master + Party in section */}
        <MenuSection
          label={dictionary['navigation'].master}
          sx={{ mt: 1.5 } /* This seems to be a redundant section in your original code, kept here for completeness */}
        ></MenuSection>
      </Menu>
    </ScrollWrapper>
  )
}

export default VerticalMenu
