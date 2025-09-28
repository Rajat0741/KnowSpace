import { useSidebarContext } from './src/Components/ui/Nav-Bar/sidebar-utils';

export function useSidebarState() {
  // Returns { open, state, ... } from SidebarContext
  return useSidebarContext();
}
