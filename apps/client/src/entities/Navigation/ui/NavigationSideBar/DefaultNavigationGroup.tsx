import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/shared/Shadcn/ui/sidebar';
import { History, MessageSquareMore } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export type DefaultNavigationGroupChild = {
  label: string;
  icon: string;
  path: string;
};

export type DefaultNavigationGroupProps = {
  label: string;
  children: DefaultNavigationGroupChild[];
  handleClickNavigation: (path: string) => void;
};

export default function DefaultNavigationGroup({
  label,
  children,
  handleClickNavigation,
}: DefaultNavigationGroupProps) {
  const { t } = useTranslation('sidebar');

  return (
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
  );
}
