import React from 'react'
import PropTypes from 'prop-types'

const SwitchCheckbox = ({ name, value, onChange, caption }) => {
    return (
        <div className='switch-checkbox-container'>
            <input className='checkbox' id={name} name={name} type='checkbox' checked={value} onChange={onChange} />
            <label className='switch' htmlFor={name} />
            {caption && <div className='caption'>{caption}</div>}
        </div>
    )
}

SwitchCheckbox.defaultProps = {
    value: false
}

SwitchCheckbox.propTypes = {
    name: PropTypes.string,
    value: PropTypes.bool,
    onChange: PropTypes.func,
    caption: PropTypes.string
}

export default SwitchCheckbox
