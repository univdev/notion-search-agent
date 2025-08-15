import { History, MessageSquareMore } from 'lucide-react';
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
  useSidebar,
} from '@/shared/Shadcn/ui/sidebar';

import { NAVIGATION } from '../../constants/Navigation.constant';

export default function Navigation() {
  const { t } = useTranslation('sidebar');
  const navigate = useNavigate();
  const sidebar = useSidebar();

  const handleClickNavigation = (path: string) => {
    sidebar.setOpen(false);
    navigate(path);
  };

  return (
    <Sidebar className="bg-background">
      <SidebarHeader className="flex items-center justify-center h-[60px]">
        <h2 className="font-bold">{APP.APP_NAME}</h2>
      </SidebarHeader>
      <SidebarContent>
        {NAVIGATION.map(({ label, children }) => (
          <SidebarGroup>
            <SidebarGroupLabel>{t(label)}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {children.map(({ label, icon, path }) => (
                  <SidebarMenuItem key={path} className="h-auto">
                    <SidebarMenuButton className="cursor-pointer" onClick={() => handleClickNavigation(path)}>
                      {icon === 'chat' && <MessageSquareMore />}
                      {icon === 'history' && <History />}
                      {t(label)}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
