import React, { useCallback, useContext, forwardRef } from 'react'
import PropTypes from 'prop-types'
import { CgChevronUp } from 'react-icons/cg'
import BottomBlock from './BottomBlock'
import UserInfo from './UserInfo'
import ExpandContext from '../../core/contexts/ExpandContext'
import { EmployeesChildren } from './EmployeesChildren'
import userPhotoDefault from '../../../public/additions/userDefault.jpeg'

const ChartBlock = forwardRef(function ChartBlock(
    { data, setCurrentExpandingBlockId, employeesChildren = [], isOnlyEmployeesChildren, isHeightsCalculated },
    ref
) {
    const { displayMode } = useContext(ExpandContext)

    const userPhotoDefaultUrl = userPhotoDefault

    const userPhotoUrl = (item) => {
        if (item.photoUrl) {
            return item.photoUrl
        } else if (item.email) {
            return `${process.env.SITE_URL}${process.env.USER_PHOTO_BASE_URL_M}${item.email}`
        }
        return userPhotoDefaultUrl
    }

    const displayTopChevron = useCallback(() => {
        return displayMode && data.level === 1
    }, [displayMode, data.level])

    const displayBottomBlock = useCallback(() => {
        return !displayMode || (displayMode && data.level === 3)
    }, [displayMode, data.level])

    return (
        <div
            data-id={data.id}
            data-level={data.level}
            ref={ref}
            className={`chart-block-container ${data.isSearchResultItem ? 'search-result-item' : ''}`}
        >
            <div>
                <div className='chart-block-top'>
                    {displayTopChevron() && (
                        <span className='top-icon'>
                            <CgChevronUp
                                onClick={() => {
                                    setCurrentExpandingBlockId(data?.id)
                                }}
                            />
                        </span>
                    )}
                </div>
                <UserInfo data={data} userPhotoUrl={userPhotoUrl(data)} />
            </div>
            <div>
                {employeesChildren.length ? (
                    <EmployeesChildren
                        initialValue={data.isExpandedEmployees}
                        employeesChildren={employeesChildren}
                        isHeightsCalculated={isHeightsCalculated}
                    />
                ) : (
                    ''
                )}
                {!isOnlyEmployeesChildren && (
                    <BottomBlock
                        data={data}
                        isExpanded={data?.isExpanded}
                        setCurrentExpandingBlockId={setCurrentExpandingBlockId}
                        displayBottomBlock={displayBottomBlock()}
                    />
                )}
            </div>
        </div>
    )
})

ChartBlock.propTypes = {
    data: PropTypes.shape({
        id: PropTypes.string,
        idSp: PropTypes.number,
        parentIdSp: PropTypes.number,
        department: PropTypes.string,
        position: PropTypes.string,
        fullName: PropTypes.string,
        branch: PropTypes.shape(),
        email: PropTypes.string,
        children: PropTypes.array,
        isExpanded: PropTypes.bool,
        level: PropTypes.number,
        isSearchResultItem: PropTypes.bool,
        isExpandedEmployees: PropTypes.bool
    }),
    setCurrentExpandingBlockId: PropTypes.func,
    employeesChildren: PropTypes.array,
    isOnlyEmployeesChildren: PropTypes.bool,
    isHeightsCalculated: PropTypes.bool
}

export default ChartBlock
