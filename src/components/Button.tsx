import type { LucideIcon } from 'lucide-react';
import './Button.css';

interface ButtonBaseProps {
  variant?:   'primary' | 'secondary' | 'tertiary' | 'scrim' | 'destructive';
  size?:      'default' | 'sm';
  onClick?:   () => void;
  className?: string;
  type?:      'button' | 'submit' | 'reset';
  disabled?:  boolean;
}

interface LabelButtonProps extends ButtonBaseProps {
  label: string;
  icon?: never;
}

interface IconButtonProps extends ButtonBaseProps {
  icon: LucideIcon;
  label?: never;
  /** Required — icon-only buttons have no visible text for assistive tech. */
  'aria-label': string;
}

type ButtonProps = LabelButtonProps | IconButtonProps;

const VARIANT_CLASS = {
  primary:   'btn-primary',
  secondary: 'btn-secondary',
  tertiary:    'btn-tertiary',
  scrim:       'btn-scrim',
  destructive: 'btn-destructive',
} as const;

// Icon glyph size per button size — independent of the button's own
// width/height (40px / 32px, reused from --btn-primary-height / -sm-height).
const ICON_SIZE = { default: 24, sm: 20 } as const;

export function Button(props: ButtonProps) {
  const { variant = 'primary', size = 'default', onClick, className, type = 'button', disabled } = props;

  const classes = [
    VARIANT_CLASS[variant],
    size === 'sm' && 'btn--sm',
    props.icon && 'btn--icon',
    className,
  ].filter(Boolean).join(' ');

  if (props.icon) {
    const Icon = props.icon;
    return (
      <button
        className={classes}
        type={type}
        onClick={onClick}
        disabled={disabled}
        aria-label={props['aria-label']}
      >
        <Icon size={ICON_SIZE[size]} strokeWidth={1.5} aria-hidden="true" />
      </button>
    );
  }

  return (
    <button className={classes} type={type} onClick={onClick} disabled={disabled}>
      {props.label}
    </button>
  );
}
