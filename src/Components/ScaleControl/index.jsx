import React from 'react'
import PropTypes from 'prop-types'
import { CgZoomIn, CgZoomOut } from 'react-icons/cg'

const ScaleControl = ({ zoomIn, zoomOut, chartScaleValue }) => {
    return (
        <div className='scale-controls-container'>
            <div className='scale-control-icon' onClick={zoomOut}>
                <CgZoomOut />
            </div>
            <div className='scale-value'>{`${Math.round(chartScaleValue * 100)}%`}</div>
            <div className='scale-control-icon' onClick={zoomIn}>
                <CgZoomIn />
            </div>
        </div>
    )
}

ScaleControl.propTypes = {
    zoomIn: PropTypes.func,
    zoomOut: PropTypes.func,
    chartScaleValue: PropTypes.number
}

export default ScaleControl
