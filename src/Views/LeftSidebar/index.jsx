import React from 'react'
import PropTypes from 'prop-types'

const LeftSidebar = ({ branchesData }) => {
    return (
        <div className='left-sidebar-container'>
            <div className='page-title'>Оргструктура</div>
            <div>
                {branchesData.map((item) => (
                    <div key={item.Id} className='sidebar-branches-list-item'>
                        <div className='department-city-color-line' style={{ borderTop: `3px solid ${item.Color}` }} />
                        <div>{item?.Title}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}

LeftSidebar.propTypes = {
    branchesData: PropTypes.arrayOf(PropTypes.shape())
}

export default LeftSidebar
