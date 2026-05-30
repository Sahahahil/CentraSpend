import React from 'react';

/**
 * Text field with a left icon — padding and stacking are handled so typed text never sits under the icon.
 */
export default function InputWithIcon({ icon: Icon, className = '', ...inputProps }) {
  return (
    <div className="input-with-icon">
      <span className="input-with-icon__icon" aria-hidden="true">
        <Icon />
      </span>
      <input className={`input-warm input-with-icon__field ${className}`.trim()} {...inputProps} />
    </div>
  );
}
