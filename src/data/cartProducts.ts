// Easter-egg cart contents for the Sheet Stacking demo — a designer's
// shopping list of things nobody actually wants to buy.

/** Shared hero placeholder until real product photography lands. */
export const PLACEHOLDER_HERO =
  'https://images.unsplash.com/photo-1580870069867-74c57ee1bb07?w=640&h=480&fit=crop&q=80';

export interface CartProduct {
  id:           string;
  name:         string;
  /** Unit price in dollars. Line total is price × quantity. */
  price:        number;
  blurb:        string;
  features:     string[];
  instructions: string;
}

export const CART_PRODUCTS: CartProduct[] = [
  {
    id:    'stakeholder-feedback',
    name:  'Assorted Stakeholder Feedback Vague Comments',
    price: 420,
    blurb:
      'A curated selection of feedback that technically contains words. Gathered from six stakeholders across four time zones, none of whom attended the kickoff. Ships unsorted, mutually contradictory, and reliably one day after the deadline.',
    features: [
      '“Can we make it more premium?” ×12',
      '“I’ll know it when I see it” ×8',
      '“Just a quick thought…” ×15',
      'Contains no actionable direction',
      'Arrives exclusively post-handoff',
    ],
    instructions:
      'Read once. Read again. Notice that two comments cancel each other out. Book a follow-up to clarify, which will generate more feedback of exactly this type. Repeat until launch.',
  },
  {
    id:    'single-source',
    name:  'Single Source Of Truth File 3 Pack',
    price: 69,
    blurb:
      'Three definitive, canonical, absolutely-final source files. Each one is the single source of truth. They do not match each other. One of them lives on somebody’s desktop.',
    features: [
      'Final_v2.fig',
      'Final_v2_FINAL.fig',
      'Final_v2_FINAL_use-this-one.fig',
      'Zero (0) matching component states',
      'Last edited “3 minutes ago” by someone who left in March',
    ],
    instructions:
      'Open all three. Compare. Pick whichever feels most recent. Rename it Final_v3. You have now produced a fourth single source of truth.',
  },
  {
    id:    'make-it-pop',
    name:  'Make it Pop! Colouring in set',
    price: 33,
    blurb:
      'Everything you need to make it pop, whatever that means. Includes a full spectrum of colours, none of which are the one they were picturing. Pairs beautifully with an unbriefed drop shadow.',
    features: [
      '24 pencils, 23 of them “not quite right”',
      'One (1) drop shadow, pre-applied',
      'Gradient set — “but subtle”',
      'Complimentary bevel (deprecated)',
      'Does not include a definition of “pop”',
    ],
    instructions:
      'Apply colour. Present. Receive the note “love it, can we make it pop more?”. Raise saturation by 4%. Present again. Revert to the first version. Ship.',
  },
  {
    id:    'component-detacher',
    name:  'Component detacher',
    price: 0.99,
    blurb:
      'A precision instrument for severing any component from its master in one clean motion. No warning, no confirmation, no undo. A favourite of contractors on their final day.',
    features: [
      'Detaches instantly and irreversibly',
      'Works silently across every file you can open',
      'Zero confirmation dialogs',
      'Ergonomic — sits just out of Cmd+Z’s reach',
      'Bulk mode detaches the entire library',
    ],
    instructions:
      'Point at any instance. Detach. Carry on as though nothing happened. Do not reply in the design-system channel.',
  },
  {
    id:    'unnamed-layers',
    name:  '12 page Un-named Layers List',
    price: 24.5,
    blurb:
      'Twelve full pages of Rectangle 47, Frame 1201 and Group 8 Copy Copy. Printed double-sided. A complete record of every layer nobody will ever locate again.',
    features: [
      '412× Rectangle',
      '88× Frame 1201',
      '60× Group 8 Copy Copy',
      '1× layer named “asdf”',
      '0× layers named after their actual purpose',
    ],
    instructions:
      'Scroll the layer panel. Find nothing. Try Cmd+F. Search “button”. Receive 0 results. Rebuild the component from scratch.',
  },
];

/** Starting cart — 9 items across the 5 lines. */
export const INITIAL_QUANTITIES: Record<string, number> = {
  'stakeholder-feedback': 1,
  'single-source':        2,
  'make-it-pop':          4,
  'component-detacher':   1,
  'unnamed-layers':       1,
};
