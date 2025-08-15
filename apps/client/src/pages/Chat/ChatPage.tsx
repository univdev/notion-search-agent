import { Fragment } from 'react/jsx-runtime';

import SidebarWithHeader from '@/widgets/Chat/ui/SidebarWithHeader/SidebarWithHeader';

export default function ChatPage() {
  return (
    <Fragment>
      <SidebarWithHeader />
      <main className="ChatPage w-full flex-auto overflow-y-scroll">Hello world!</main>
    </Fragment>
  );
}
