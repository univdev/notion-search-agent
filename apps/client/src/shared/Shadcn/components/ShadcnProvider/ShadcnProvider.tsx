import { SidebarProvider } from '../../ui/sidebar';

export default function ShadcnProvider({ children }: { children: React.ReactNode }) {
  return <SidebarProvider>{children}</SidebarProvider>;
}
