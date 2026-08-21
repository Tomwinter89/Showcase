export interface Feature {
  id:       string;
  title:    string;
  subtitle: string;
}

export const FEATURES: Feature[] = [
  { id: 'sheet-stacking',  title: 'Sheet stacking',  subtitle: 'Modal on modals, but make it not suck'         },
  { id: 'category-dock',   title: 'Category dock',   subtitle: 'Delight hiding in an everyday component'        },
  { id: 'stack-reveal',    title: 'Stack reveal',    subtitle: 'A reveal that rewards curiosity'                },
  { id: 'bookshelf',       title: 'Bookshelf',       subtitle: 'Pull a spine forward for a closer look'         },
  { id: 'command-palette', title: 'Command palette', subtitle: 'Keyboard-first navigation done right'           },
  { id: 'drag-reorder',    title: 'Drag to reorder', subtitle: 'Lists that feel as good as they look'           },
  { id: 'swipe-actions',   title: 'Swipe actions',   subtitle: 'Hidden options, revealed with intent'           },
  { id: 'live-search',     title: 'Live search',     subtitle: 'Results that evolve as you type'                },
  { id: 'micro-feedback',  title: 'Micro-feedback',  subtitle: 'Tiny moments that make the whole feel polished' },
];

export const TOTAL_FEATURES = FEATURES.length;
