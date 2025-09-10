import { match } from 'ts-pattern';
import { useNavigate } from 'react-router';

import { APP } from '@/shared/config/App.constant';
import { Sidebar, SidebarContent, SidebarHeader, SidebarProvider } from '@/shared/shadcn-ui/sidebar';
import { NAVIGATION } from '@/widgets/Navigation/models/Navigation.constant';
import ChatHistoriesGroup from '@/features/Navigation/ui/ConversationsNavigationGroup/ConversationsNavigationGroup';
import { ReactNode } from 'react';
import NormalNavigationGroup, {
  NormalNavigationGroupChild,
} from '@/entities/Navigation/ui/NormalNavigationGroup/NormalNavigationGroup';
import { cn } from '@/shared/shadcn-utils';

export type NavigationSidebarProps = {
  className?: string;
  children: ReactNode;
};

export default function NavigationSidebar({ children, className }: NavigationSidebarProps) {
  const navigate = useNavigate();

  const handleClickNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <SidebarProvider>
      <Sidebar className={cn('bg-background', className)}>
        <SidebarHeader className="flex items-center justify-center h-[60px]">
          <h2 className="font-bold">{APP.APP_NAME}</h2>
        </SidebarHeader>
        <SidebarContent>
          {NAVIGATION.map(({ label, children, type }) =>
            match(type)
              .with('default', () => {
                return (
                  <NormalNavigationGroup
                    key={label}
                    children={children as unknown as NormalNavigationGroupChild[]}
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
      {children}
    </SidebarProvider>
  );
}
