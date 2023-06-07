import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { CgArrowTopRightR } from 'react-icons/cg'

export const EmployeesChildren = ({ initialValue = false, pageSize = 6, employeesChildren, isHeightsCalculated }) => {
    const [isExpanded, setIsExpanded] = useState(initialValue)
    const [pageViewIndex, setPageViewIndex] = useState(1)

    useEffect(() => {
        const searchResultIndex = employeesChildren.findIndex((employee) => employee.isSearchResultItem)
        if (searchResultIndex) {
            setPageViewIndex(Math.trunc(searchResultIndex / pageSize) + 1)
        }
    }, [])

    useEffect(() => {
        const searchResultIndex = employeesChildren.findIndex((employee) => employee.isSearchResultItem)
        if (searchResultIndex) {
            setPageViewIndex(Math.trunc(searchResultIndex / pageSize) + 1)
        }
    }, [employeesChildren])

    const userPhotoDefaultUrl = `${process.env.SITE_URL}${process.env.USER_PHOTO_DEFAULT_URL}`

    const userPhotoUrl = (item) => {
        if (item.photoUrl) {
            return item.photoUrl
        } else if (item.email) {
            return `${process.env.SITE_URL}${process.env.USER_PHOTO_BASE_URL_M}${item.email}`
        }
        return userPhotoDefaultUrl
    }

    const handleExpandClick = () => {
        setIsExpanded(true)
    }

    const handleCollapseClick = () => {
        setIsExpanded(false)
    }

    const employeesPagination = () => {
        const pageDots = []
        for (let i = 0; i < Math.ceil(employeesChildren.length / pageSize); i++) {
            pageDots.push(
                <div
                    key={i}
                    className={`employees-pagination-dot ${pageViewIndex === i + 1 ? 'active' : ''}`}
                    onClick={() => {
                        setPageViewIndex(i + 1)
                    }}
                ></div>
            )
        }
        return <div className='employees-pagination'>{pageDots}</div>
    }

    const mapExpandedEmployeesChildren = () => {
        const employees = employeesChildren
        return employees
            .filter((_, index) => index < pageViewIndex * pageSize && index >= pageViewIndex * pageSize - pageSize)
            .map((employee) => {
                return (
                    <div
                        className={`employee-container ${employee.isSearchResultItem ? 'search-result-item' : ''}`}
                        key={employee.id}
                        onClick={() => {
                            if (!employee.hideFromPhoneBook) {
                                window.open(`${process.env.SITE_URL}/SitePages/My-Profile.aspx?userId=${employee.idSp}`, '_blank')
                                return false
                            }
                        }}
                    >
                        <div
                            className='employee-department-city-color-line'
                            style={{ borderRight: `3px solid ${employee?.branch?.color}` }}
                        />

                        <img src={userPhotoUrl(employee)} />

                        <div className='employee-info'>
                            <div className='employee-name'>{employee.fullName}</div>
                            <div className='employee-position'>{employee.position}</div>
                        </div>
                    </div>
                )
            })
    }

    const mapClosedEmployeesChildren = () => {
        const employees = employeesChildren.slice(0, 4)

        return (
            <div className='employees-closed'>
                {employees.map((employee) => {
                    return (
                        <div key={employee.id}>
                            <img src={userPhotoUrl(employee)} />
                        </div>
                    )
                })}
                {employeesChildren.length > 4 && <span>+{employeesChildren.length - 4}</span>}
            </div>
        )
    }

    return (
        <div>
            <div className='employees-container' onClick={handleExpandClick}>
                {isExpanded && isHeightsCalculated ? mapExpandedEmployeesChildren() : mapClosedEmployeesChildren()}
            </div>
            {isExpanded && employeesChildren.length > pageSize && employeesPagination()}
            <div className={`employees-toggle-button ${isExpanded ? 'active' : ''}`}>
                {isExpanded && <CgArrowTopRightR onClick={handleCollapseClick} />}
            </div>
        </div>
    )
}

EmployeesChildren.propTypes = {
    initialValue: PropTypes.bool,
    pageSize: PropTypes.number,
    employeesChildren: PropTypes.array,
    isHeightsCalculated: PropTypes.bool
}
