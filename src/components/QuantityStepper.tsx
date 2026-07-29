import { Minus, Plus } from 'lucide-react';
import { Button } from './Button';
import './QuantityStepper.css';

interface QuantityStepperProps {
  value:      number;
  onChange:   (next: number) => void;
  size?:      'default' | 'sm';
  className?: string;
  /** Names the thing being counted, for screen readers: "Decrease {label} quantity". */
  label?:     string;
}

/**
 * QUANTITY STEPPER — [−] n [+] pill for cart quantities.
 *
 * The pill takes the secondary button's surface (background, radius, height)
 * and nests tertiary icon buttons inside it, so it inherits the Button
 * family's sizing, Lucide icons and 1.5 stroke weight rather than
 * reimplementing any of it.
 *
 * Decrementing past 1 emits 0 — callers treat that as "remove this line".
 */
export function QuantityStepper({ value, onChange, size = 'default', className, label }: QuantityStepperProps) {
  const suffix = label ? ` ${label}` : '';

  return (
    <div className={`qty-stepper qty-stepper--${size}${className ? ` ${className}` : ''}`}>
      <Button
        icon={Minus}
        variant="tertiary"
        size={size}
        aria-label={`Decrease${suffix} quantity`}
        onClick={() => onChange(value - 1)}
      />
      <span className="qty-stepper__value" aria-live="polite">{value}</span>
      <Button
        icon={Plus}
        variant="tertiary"
        size={size}
        aria-label={`Increase${suffix} quantity`}
        onClick={() => onChange(value + 1)}
      />
    </div>
  );
}
