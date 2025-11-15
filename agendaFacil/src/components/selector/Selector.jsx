import './selector.css'

export default function Selector ({ selectorText, options, value, onChange }) {
    return (
        <div className='selector-container'>
            <select
                className='selector-dropdown'
                value={value}
                onChange={(e) => onChange(e.target.value)}
            >
            <option value="">{selectorText ? `Selecionar ${selectorText}` : 'Selecionar...'}</option>
            {options.map((option, index) => (
                <option key={index} value={option.value}>
                    {option.label}
                </option>
            ))}
            </select>
        </div>
    )
}