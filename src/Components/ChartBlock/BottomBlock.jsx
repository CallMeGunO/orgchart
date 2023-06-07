import React from 'react'
import { CgChevronUp, CgChevronDown } from 'react-icons/cg'
import PropTypes from 'prop-types'

const BottomBlock = ({ data, isExpanded, setCurrentExpandingBlockId, displayBottomBlock }) => {
    if (data?.children?.length) {
        return (
            displayBottomBlock && (
                <div className={data.isSearchResultItem ? 'search-result-item' : ''}>
                    <div
                        className='bottom-icon'
                        onClick={() => {
                            setCurrentExpandingBlockId(data?.id)
                        }}
                    >
                        {isExpanded ? <CgChevronUp /> : <CgChevronDown />}
                    </div>
                </div>
            )
        )
    }
}

BottomBlock.propTypes = {
    data: PropTypes.object,
    isExpanded: PropTypes.bool,
    setCurrentExpandingBlockId: PropTypes.func,
    displayBottomBlock: PropTypes.bool
}

export default React.memo(BottomBlock)
