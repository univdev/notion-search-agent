import SyncronizeNotionDocumentsButton from '@/features/Knowledges/ui/SyncronizeNotionDocumentsButton';
import { SidebarTrigger } from '@/shared/Shadcn/ui/sidebar';
import { cn } from '@/shared/Shadcn/utils';

export type ConversationHeaderProps = {
  className?: string;
};

export default function ConversationHeader({ className }: ConversationHeaderProps) {
  return (
    <header
      className={cn(
        'conversation-header flex items-center justify-between w-full p-4 h-[var(--conversation-header-height)] bg-white',
        className,
      )}
    >
      <SidebarTrigger />
      <SyncronizeNotionDocumentsButton />
    </header>
  );
}
