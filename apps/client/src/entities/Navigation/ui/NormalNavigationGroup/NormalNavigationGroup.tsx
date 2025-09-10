import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/shared/shadcn-ui/sidebar';
import { History, MessageSquareMore } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export type NormalNavigationGroupChild = {
  label: string;
  icon: string;
  path: string;
};

export type NormalNavigationGroupProps = {
  label: string;
  children: NormalNavigationGroupChild[];
  handleClickNavigation: (path: string) => void;
};

export default function NormalNavigationGroup({ label, children, handleClickNavigation }: NormalNavigationGroupProps) {
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
