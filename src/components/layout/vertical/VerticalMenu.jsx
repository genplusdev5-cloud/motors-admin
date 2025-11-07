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
            className: 'bs-full overflow-y-auto overflow-x-hidden',
            onScroll: container => scrollMenu(container, false)
          }
        : {
            options: { wheelPropagation: false, suppressScrollX: true },
            onScrollY: container => scrollMenu(container, true)
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
        <MenuItem href={`/${locale}/dashboard`} icon={<i className='tabler-smart-home' />}>
          Dashboard
        </MenuItem>

        <SubMenu label='Masters' icon={<i className='tabler-database' />}>
          <MenuItem href={`/${locale}/company`}>{'Company'}</MenuItem>
          <MenuItem href={`/${locale}/category`}>{'Category'}</MenuItem>
          <MenuItem href={`/${locale}/subcategory`}>{'SubCategory'}</MenuItem>
         
          <MenuItem href={`/${locale}/vehicle-make`}>{'Vehicle Make'}</MenuItem>
          <MenuItem href={`/${locale}/colors`}>{'Colors'}</MenuItem>
           <MenuItem href={`/${locale}/vehicle-type`}>{'Vehicle Type'}</MenuItem>
          <MenuItem href={`/${locale}/body-type`}>{'Body Type'}</MenuItem>
          <MenuItem href={`/${locale}/engine-type`}>{'Engine Type'}</MenuItem>
          <MenuItem href={`/${locale}/cylinders`}>{'Cylinders'}</MenuItem>
          <MenuItem href={`/${locale}/gearbox-type`}>{'GearBox Type'}</MenuItem>
          <MenuItem href={`/${locale}/fuel-type`}>{' Fuel Type'}</MenuItem>
          <MenuItem href={`/${locale}/record-year`}>{'Record Year'}</MenuItem>
          <MenuItem href={`/${locale}/banners-type`}>{'Banners Type'}</MenuItem>
          <MenuItem href={`/${locale}/vehicle-model `}>{'Vehicle Model'}</MenuItem>
          <MenuItem href={`/${locale}/settings `}>{'Settings'}</MenuItem>
        </SubMenu>



        <SubMenu label='User Roles' icon={<i className='tabler-users' />}>
          <MenuItem href={`/${locale}/admin-user-role`}>{'Admin User Roles'}</MenuItem>
          <MenuItem href={`/${locale}/dealer-user-role`}>{'Dealer User Roles'}</MenuItem>
        </SubMenu>

         <MenuItem href={`/${locale}/plans`} icon={<i className='tabler-credit-card' />}>
          Plans
        </MenuItem>

        <MenuItem href={`/${locale}/subscription`} icon={<i className='tabler-table' />}>
          Subscription
        </MenuItem>

        <MenuItem href={`/${locale}/dealership`} icon={<i className='tabler-building-store' />}>
          DealerShip
        </MenuItem>

        <MenuItem href={`/${locale}/buyer`} icon={<i className='tabler-shopping-cart' />}>
          Buyer
        </MenuItem>

        <MenuItem href={`/${locale}/seller`} icon={<i className='tabler-package' />}>
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
