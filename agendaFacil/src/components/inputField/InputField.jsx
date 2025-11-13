import './InputField.css'

export default function InputField ({ label, value, onChange, placeholder, type='text' }) {
    return (
        <div className='inputFieldBackground'>
            <label>{label}</label>
            <input className='inputField'
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
            />
        </div>
    )
}