import { History, MessageSquareMore } from 'lucide-react';
import { match } from 'ts-pattern';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import { APP } from '@/shared/Configs/locales/constants/App.constant';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/shared/Shadcn/ui/sidebar';

import { NAVIGATION } from '../../constants/Navigation.constant';
import DefaultNavigationGroup, { DefaultNavigationGroupChild } from './DefaultNavigationGroup';
import ChatHistoriesGroup from './ChatHistoriesGroup';

export default function NavigationSideBar() {
  const { t } = useTranslation('sidebar');
  const navigate = useNavigate();

  const handleClickNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <Sidebar className="bg-background">
      <SidebarHeader className="flex items-center justify-center h-[60px]">
        <h2 className="font-bold">{APP.APP_NAME}</h2>
      </SidebarHeader>
      <SidebarContent>
        {NAVIGATION.map(({ label, children, type }) =>
          match(type)
            .with('default', () => {
              return (
                <DefaultNavigationGroup
                  key={label}
                  children={children as unknown as DefaultNavigationGroupChild[]}
                  label={label}
                  handleClickNavigation={handleClickNavigation}
                />
              );
            })
            .with('chat-histories', () => {
              return <ChatHistoriesGroup key={label} />;
            })
            .run(),
        )}
      </SidebarContent>
    </Sidebar>
  );
}
