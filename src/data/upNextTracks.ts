// Shared between StackReveal (list variant) and StackRevealFan (grid
// variant) — same queue, two different presentations.
export interface Track {
  title:  string;
  artist: string;
}

export const TRACKS: Track[] = [
  { title: 'Jammin',        artist: 'RUBII' },
  { title: 'Dedpresidents', artist: 'Knxwledge' },
  { title: 'Bad Company',   artist: 'Yazmin Lacey' },
];
