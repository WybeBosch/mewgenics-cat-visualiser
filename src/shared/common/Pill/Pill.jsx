import './Pill.css';

/**
 * Reusable Pill component for consistent pill UI.
 * Props:
 * - children: pill content
 * - className: additional classes (e.g. siblings, parent-child)
 * - onClick, onMouseEnter, onMouseLeave, tabIndex, ...rest
 */
export function Pill({ children, className = '', ...rest }) {
	return (
		<div className={`warning-pill`}>
			<span className={`badge${className ? ' ' + className : ''}`} {...rest}>
				{children}
			</span>
		</div>
	);
}

export default Pill;
