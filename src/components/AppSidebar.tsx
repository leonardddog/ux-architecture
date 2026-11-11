import {
  WuIcon,
  WuSidebarContent,
  WuSidebarFooter,
  WuSidebarGroup,
  WuSidebarItem,
  WuSidebarMenu,
} from '@npm-questionpro/wick-ui-lib'

type AppSidebarProps = {
  activeRoute?: string
}

export function AppSidebar({ activeRoute }: AppSidebarProps) {
  const isActive = (href: string) => activeRoute === href

  return (
    <>
      <WuSidebarContent>
        <WuSidebarMenu>
          <WuSidebarItem
            Icon={<WuIcon icon="wm-home" />}
            isActive={isActive('#/home')}
          >
            <a href="#/home">Home</a>
          </WuSidebarItem>
          <WuSidebarGroup label="UX Research">
            <WuSidebarItem
              Icon={<WuIcon icon="wm-experiment" />}
              isActive={isActive('#/ux-research/usability-tests')}
            >
              <a href="#/ux-research/usability-tests">Usability tests</a>
            </WuSidebarItem>
          </WuSidebarGroup>
          <WuSidebarGroup label="Qualitative Research">
            <WuSidebarItem
              Icon={<WuIcon icon="wm-record-voice-over" />}
              isActive={isActive('#/qualitative-research/interviews')}
            >
              <a href="#/qualitative-research/interviews">Interviews</a>
            </WuSidebarItem>
            <WuSidebarItem
              Icon={<WuIcon icon="wm-groups-2" />}
              isActive={isActive('#/qualitative-research/focus-groups')}
            >
              <a href="#/qualitative-research/focus-groups">Focus groups</a>
            </WuSidebarItem>
            <WuSidebarItem
              Icon={<WuIcon icon="wm-auto-stories" />}
              isActive={isActive('#/qualitative-research/diaries')}
            >
              <a href="#/qualitative-research/diaries">Diaries</a>
            </WuSidebarItem>
          </WuSidebarGroup>
        </WuSidebarMenu>
      </WuSidebarContent>

      <WuSidebarFooter>
        <WuSidebarMenu>
          <WuSidebarItem
            Icon={<WuIcon icon="wm-crowdsource" />}
            isActive={isActive('#/panels')}
          >
            <a href="#/panels">Panels</a>
          </WuSidebarItem>
          <WuSidebarItem
            Icon={<WuIcon icon="wm-insert-chart" />}
            isActive={isActive('#/analytics')}
          >
            <a href="#/analytics">Analytics</a>
          </WuSidebarItem>
          <WuSidebarItem
            Icon={<WuIcon icon="wm-settings" />}
            isActive={isActive('#/settings')}
          >
            <a href="#/settings">Settings</a>
          </WuSidebarItem>
        </WuSidebarMenu>
      </WuSidebarFooter>
    </>
  )
}
