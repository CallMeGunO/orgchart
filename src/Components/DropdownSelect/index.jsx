import React from 'react'
import PropTypes from 'prop-types'

const DropdownSelect = ({ name, options, label, setValue, additionalClasses }) => {
    const createOptions = () => {
        return options.map((option, index) => (
            <option key={index} value={option.value}>
                {option.name}
            </option>
        ))
    }

    return (
        <div className='dropdown-container'>
            <select
                name={name}
                id={name}
                onChange={(e) => {
                    setValue(e.target.value)
                }}
                className={`dropdown-select ${additionalClasses.join(' ')}`}
            >
                {createOptions()}
            </select>
            <label htmlFor={name} className='dropdown-label'>
                {label}
            </label>
        </div>
    )
}

DropdownSelect.propTypes = {
    name: PropTypes.string,
    options: PropTypes.array,
    label: PropTypes.string,
    setValue: PropTypes.func,
    additionalClasses: PropTypes.arrayOf(PropTypes.string)
}

DropdownSelect.defaultProps = {
    additionalClasses: []
}

export default DropdownSelect
