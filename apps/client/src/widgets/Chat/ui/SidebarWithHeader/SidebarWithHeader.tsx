import { Fragment } from 'react/jsx-runtime';

import Navigation from '@/entities/Navigation/ui/SideBar/Navigation';
import SyncNotionDocumentButton from '@/entities/Notion/ui/SyncNotionDocumentButton/SyncNotionDocumentButton';
import { SidebarTrigger } from '@/shared/Shadcn/ui/sidebar';

export default function SidebarWithHeader() {
  return (
    <Fragment>
      <Navigation />
      <header className="Header flex items-center justify-between w-full p-4 h-[60px]">
        <SidebarTrigger />
        <SyncNotionDocumentButton />
      </header>
    </Fragment>
  );
}
