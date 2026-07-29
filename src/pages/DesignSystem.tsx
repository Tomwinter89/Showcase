import { Heart, X } from 'lucide-react';
import { tokens } from '../styles/tokens';
import { Button } from '../components/Button';
import { useClickSound } from '../hooks/useClickSound';
import { useWebHaptics } from 'web-haptics/react';
import './DesignSystem.css';

export function DesignSystem() {
  const { trigger: triggerSound }  = useClickSound();
  const { trigger: triggerHaptic } = useWebHaptics();

  const handleFeedback = () => {
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      triggerSound();
      triggerHaptic('selection');
    }
  };

  return (
    <main className="ds" id="design-system" aria-label="Design system">
      <h1 className="ds__heading">Design System</h1>
      <p className="ds__meta">Single source of truth: <code>src/styles/tokens.ts</code></p>

      {/* ── Colours ─────────────────────────────────────────────────── */}
      <section className="ds__section" aria-labelledby="ds-colors">
        <h2 className="ds__section-title" id="ds-colors">Colours</h2>
        <div className="ds__swatches">
          {(Object.entries(tokens.colors) as [string, string][]).map(([name, hex]) => (
            <div key={name} className="ds__swatch">
              <div
                className="ds__swatch-block"
                style={{
                  backgroundColor: hex,
                  border: (name === 'white' || name === 'neutral') ? '1px solid rgba(0,0,0,0.1)' : 'none',
                }}
              />
              <span className="ds__swatch-name">{name}</span>
              <span className="ds__swatch-hex">{hex}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Primitive colours ───────────────────────────────────────── */}
      <section className="ds__section" aria-labelledby="ds-primitives">
        <h2 className="ds__section-title" id="ds-primitives">Primitive colours</h2>

        <div className="ds__primitive-group">
          <p className="ds__motion-sublabel">White alpha</p>
          <div className="ds__swatches">
            {(Object.entries(tokens.primitive.color.white) as [string, string][]).map(([key, value]) => (
              <div key={key} className="ds__swatch">
                <div className="ds__swatch-block" style={{ backgroundColor: value, border: '1px solid rgba(8,7,8,0.08)' }} />
                <span className="ds__swatch-name">white-{key}</span>
                <span className="ds__swatch-hex">{key}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="ds__primitive-group">
          <p className="ds__motion-sublabel">Black alpha</p>
          <div className="ds__swatches">
            {(Object.entries(tokens.primitive.color.black) as [string, string][]).map(([key, value]) => (
              <div key={key} className="ds__swatch">
                <div className="ds__swatch-block" style={{ backgroundColor: value, border: '1px solid rgba(8,7,8,0.08)' }} />
                <span className="ds__swatch-name">black-{key}</span>
                <span className="ds__swatch-hex">{key}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="ds__primitive-group">
          <p className="ds__motion-sublabel">Grey</p>
          <div className="ds__swatches">
            {(Object.entries(tokens.primitive.color.grey) as [string, string][]).map(([key, value]) => (
              <div key={key} className="ds__swatch">
                <div className="ds__swatch-block" style={{ backgroundColor: value, border: '1px solid rgba(8,7,8,0.08)' }} />
                <span className="ds__swatch-name">grey-{key}</span>
                <span className="ds__swatch-hex">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Typography ──────────────────────────────────────────────── */}
      <section className="ds__section" aria-labelledby="ds-type">
        <h2 className="ds__section-title" id="ds-type">Typography</h2>
        <div className="ds__type-rows">
          {(Object.entries(tokens.typography) as Array<[string, { size: string; weights: Record<string, number>; fontFamily?: string }]>).map(([scale, def]) => (
            <div key={scale} className="ds__type-row">
              <div className="ds__type-label">
                <code>{scale}</code>
                <span>{def.size}</span>
                {def.fontFamily && <span className="ds__type-font-name">New Title</span>}
              </div>
              <div className="ds__type-samples">
                {Object.entries(def.weights).map(([weightName, weightValue]) => (
                  <span
                    key={weightName}
                    style={{
                      fontSize: def.size,
                      fontWeight: weightValue,
                      ...(def.fontFamily ? { fontFamily: def.fontFamily } : {}),
                    }}
                  >
                    {weightName.charAt(0).toUpperCase() + weightName.slice(1)} — The quick brown fox
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Line Height ──────────────────────────────────────────────── */}
      <section className="ds__section" aria-labelledby="ds-leading">
        <h2 className="ds__section-title" id="ds-leading">Line Height</h2>
        <div className="ds__type-rows">
          {(Object.entries(tokens.lineHeight) as [string, string][]).map(([name, value]) => (
            <div key={name} className="ds__type-row">
              <div className="ds__type-label">
                <code>{name}</code>
                <span>{value}</span>
              </div>
              <p style={{ lineHeight: value, fontSize: tokens.typography.sm.size, maxWidth: '220px', margin: 0 }}>
                The quick brown fox jumped over the lazy dog and kept on running
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Letter Spacing ───────────────────────────────────────────── */}
      <section className="ds__section" aria-labelledby="ds-tracking">
        <h2 className="ds__section-title" id="ds-tracking">Letter Spacing</h2>
        <div className="ds__type-rows">
          {(Object.entries(tokens.letterSpacing) as [string, string][]).map(([name, value]) => (
            <div key={name} className="ds__type-row">
              <div className="ds__type-label">
                <code>{name}</code>
                <span>{value}</span>
              </div>
              <span style={{ letterSpacing: value, fontSize: tokens.typography.base.size }}>
                The quick brown fox
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Spacing ─────────────────────────────────────────────────── */}
      <section className="ds__section" aria-labelledby="ds-space">
        <h2 className="ds__section-title" id="ds-space">Spacing</h2>
        <div className="ds__spacing-rows">
          {tokens.spacing.map((value, i) => (
            <div key={i} className="ds__spacing-row">
              <code className="ds__spacing-index">space-{i}</code>
              <div
                className="ds__spacing-bar"
                style={{ width: value === 0 ? 2 : value, height: 16, backgroundColor: 'var(--color-primary)' }}
              />
              <span className="ds__spacing-value">{value}px</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Border Radius ───────────────────────────────────────────── */}
      <section className="ds__section" aria-labelledby="ds-radius">
        <h2 className="ds__section-title" id="ds-radius">Border Radius</h2>
        <div className="ds__swatches">
          {(Object.entries(tokens.borderRadius) as [string, string][]).map(([name, value]) => (
            <div key={name} className="ds__swatch">
              <div className="ds__radius-block" style={{ borderRadius: value }} />
              <span className="ds__swatch-name">{name}</span>
              <span className="ds__swatch-hex">{value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Shadows ─────────────────────────────────────────────────── */}
      <section className="ds__section" aria-labelledby="ds-shadows">
        <h2 className="ds__section-title" id="ds-shadows">Shadows</h2>
        <div className="ds__swatches">
          {(Object.entries(tokens.shadow) as [string, string][]).map(([name, value]) => (
            <div key={name} className="ds__swatch">
              <div
                className="ds__swatch-block"
                style={{ boxShadow: value, border: 'none', backgroundColor: 'var(--color-white)' }}
              />
              <span className="ds__swatch-name">{name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Button ──────────────────────────────────────────────────── */}
      <section className="ds__section" aria-labelledby="ds-button">
        <h2 className="ds__section-title" id="ds-button">Button</h2>
        <div className="ds__component-row">
          <div className="ds__component-item">
            <Button label="Preview feature" />
            <span className="ds__component-label">Primary</span>
          </div>
          <div className="ds__component-item">
            <Button label="Preview feature" size="sm" />
            <span className="ds__component-label">Primary — sm</span>
          </div>
          <div className="ds__component-item">
            <Button label="Preview feature" variant="secondary" />
            <span className="ds__component-label">Secondary</span>
          </div>
          <div className="ds__component-item">
            <Button label="Preview feature" variant="secondary" size="sm" />
            <span className="ds__component-label">Secondary — sm</span>
          </div>
          <div className="ds__component-item">
            <Button label="Preview feature" variant="tertiary" />
            <span className="ds__component-label">Tertiary</span>
          </div>
          <div className="ds__component-item">
            <Button label="Preview feature" variant="tertiary" size="sm" />
            <span className="ds__component-label">Tertiary — sm</span>
          </div>
          <div className="ds__component-item">
            <Button label="Remove" variant="destructive" />
            <span className="ds__component-label">Destructive</span>
          </div>
          <div className="ds__component-item">
            <Button label="Remove" variant="destructive" size="sm" />
            <span className="ds__component-label">Destructive — sm</span>
          </div>
          <div className="ds__component-item">
            <Button icon={Heart} aria-label="Like" />
            <span className="ds__component-label">Icon — primary</span>
          </div>
          <div className="ds__component-item">
            <Button icon={Heart} aria-label="Like" size="sm" />
            <span className="ds__component-label">Icon — primary, sm</span>
          </div>
          <div className="ds__component-item">
            <Button icon={Heart} aria-label="Like" variant="secondary" />
            <span className="ds__component-label">Icon — secondary</span>
          </div>
          <div className="ds__component-item">
            <Button icon={Heart} aria-label="Like" variant="tertiary" />
            <span className="ds__component-label">Icon — tertiary</span>
          </div>
          <div className="ds__component-item">
            {/* Dark demo backdrop — scrim is designed to sit over imagery, not the DS page bg */}
            <div style={{ background: '#3a3a3a', padding: 12, borderRadius: 12 }}>
              <Button icon={X} aria-label="Close" variant="scrim" size="sm" />
            </div>
            <span className="ds__component-label">Icon — scrim (on imagery)</span>
          </div>
        </div>
      </section>

      {/* ── Raised Surface ──────────────────────────────────────────── */}
      <section className="ds__section" aria-labelledby="ds-surface">
        <h2 className="ds__section-title" id="ds-surface">Raised Surface</h2>
        <div className="ds__component-row">
          <div className="ds__component-item">
            <div className="raised-surface" style={{ width: 120, height: 80 }} />
            <span className="ds__component-label">Level 1 — .raised-surface</span>
          </div>
          <div className="ds__component-item">
            <div className="raised-surface--2" style={{ width: 120, height: 80 }} />
            <span className="ds__component-label">Level 2 — .raised-surface--2</span>
          </div>
        </div>
      </section>

      {/* ── Sound & Haptic ──────────────────────────────────────────── */}
      <section className="ds__section" aria-labelledby="ds-feedback">
        <h2 className="ds__section-title" id="ds-feedback">Sound & Haptic</h2>
        <div className="ds__component-row">
          <div className="ds__component-item">
            <Button label="Tap to feel it" onClick={handleFeedback} />
            <span className="ds__component-label">Selection — fires on feature navigation</span>
          </div>
        </div>
      </section>

      {/* ── Motion ──────────────────────────────────────────────────── */}
      <section className="ds__section" aria-labelledby="ds-motion">
        <h2 className="ds__section-title" id="ds-motion">Motion</h2>

        <div className="ds__motion-group">
          <p className="ds__motion-sublabel">Duration</p>
          {(Object.entries(tokens.motion.duration) as [string, string][]).map(([name, value]) => (
            <div key={name} className="ds__motion-row">
              <code className="ds__motion-name">{name}</code>
              <span className="ds__motion-meta">{value}</span>
              <div className="ds__duration-track">
                <div className="ds__duration-bar" style={{ animationDuration: value }} />
              </div>
            </div>
          ))}
        </div>

        <div className="ds__motion-group">
          <p className="ds__motion-sublabel">Easing</p>
          {(Object.entries(tokens.motion.easing) as [string, string][]).map(([name, value]) => (
            <div key={name} className="ds__motion-row">
              <code className="ds__motion-name">{name}</code>
              <span className="ds__motion-meta ds__motion-meta--mono">{value}</span>
              <div className="ds__easing-track">
                <div
                  className="ds__easing-dot"
                  style={{
                    animationTimingFunction: value,
                    animationDuration: tokens.motion.duration.slow,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
