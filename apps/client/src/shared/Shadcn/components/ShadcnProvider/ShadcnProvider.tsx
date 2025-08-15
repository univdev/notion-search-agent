import { SidebarProvider } from '../../ui/sidebar';

export default function ShadcnProvider({ children }: { children: React.ReactNode }) {
  return <SidebarProvider className="flex flex-col w-full h-full">{children}</SidebarProvider>;
}
