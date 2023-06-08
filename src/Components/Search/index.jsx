import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { CgClose } from 'react-icons/cg'
import chartDataHelper from '../../core/helpers/chartDataHelper'
import userPhotoDefault from '../../../public/additions/userDefault.jpeg'

const Search = ({
    searchValue,
    setSearchValue,
    searchResultDepartmentsHierarchy,
    setSearchResultDepartmentsHierarchy,
    setChartViewDepartmentId,
    orgData,
    setOrgData,
    setIsHeightsCalculated
}) => {
    const [searchResults, setSearchResults] = useState([])
    const [filterBranchTitle, setFilterBranchTitle] = useState('')

    const userPhotoDefaultUrl = userPhotoDefault

    const userPhotoUrl = (item) => {
        if (item.photoUrl) {
            return item.photoUrl
        } else if (item.email) {
            return `${process.env.SITE_URL}${process.env.USER_PHOTO_BASE_URL_M}${item.email}`
        }
        return userPhotoDefaultUrl
    }

    const handleSearch = () => {
        const searchValueStrings = searchValue.toLowerCase().split(' ')

        const foundItems = []
        const result = (data, parentId, departmentsHierarchy) => {
            return data.map((item) => {
                item.parentId = parentId
                item.departmentsHierarchy = Array.isArray(departmentsHierarchy)
                    ? JSON.parse(JSON.stringify(departmentsHierarchy))
                    : []
                item.department &&
                    !item.departmentsHierarchy.find((department) => department === item.department) &&
                    item.departmentsHierarchy.push(item.department)

                const allFieldsValues = `${item?.department?.toLowerCase() || ''} ${item?.position?.toLowerCase() || ''} ${
                    item?.fullName?.toLowerCase() || ''
                } ${item?.email?.toLowerCase() || ''}`

                if (searchValueStrings.every((word) => allFieldsValues.includes(word))) {
                    foundItems.push(item)
                }
                if (item.children?.length) {
                    item.children = result(item.children, item.id, JSON.parse(JSON.stringify(item.departmentsHierarchy)))
                }
                return item
            })
        }

        const updatedOrgData = JSON.parse(JSON.stringify(orgData))
        result(updatedOrgData, 0)

        return foundItems
    }

    const handleSearchResultClick = (selectedItem) => {
        setSearchResultDepartmentsHierarchy(selectedItem.departmentsHierarchy)
        setSearchValue('')

        setIsHeightsCalculated(false)
        setOrgData(chartDataHelper.switchOrgChartRoot(orgData, selectedItem.id, true))

        setChartViewDepartmentId(0)
    }

    useEffect(() => {
        if (searchValue && Array.isArray(orgData)) {
            const searchResults = handleSearch()
            setSearchResults(searchResults)
        } else {
            setSearchResults([])
        }
    }, [searchValue])

    const searchFilters = () => {
        if (searchValue && searchResults.length) {
            const filterValues = searchResults
                .map((result) => result?.branch)
                .reduce((acc, el) => {
                    acc[el.title] = {
                        branch: el,
                        count: (acc[el.title]?.count || 0) + 1
                    }
                    return acc
                }, {})

            const filterValuesArray = []
            for (const key in filterValues) {
                filterValuesArray.push({
                    branch: filterValues[key].branch,
                    count: filterValues[key].count
                })
            }

            return (
                <div className='search-filters-container'>
                    {filterValuesArray.map((item, index) => {
                        return (
                            <div
                                key={item.branch?.id || index}
                                className={`branches-list-item ${filterBranchTitle === item.branch?.title ? 'active' : ''}`}
                                onClick={() => {
                                    if (filterBranchTitle === item.branch?.title) {
                                        setFilterBranchTitle('')
                                    } else {
                                        setFilterBranchTitle(item.branch?.title)
                                    }
                                }}
                            >
                                <div
                                    className='department-city-color-line'
                                    style={{ borderTop: `3px solid ${item.branch?.color || 'black'}` }}
                                />
                                <div>{item?.branch?.title || 'Нет данных'}</div>
                                <div>{item.count}</div>
                            </div>
                        )
                    })}
                </div>
            )
        }
    }

    const searchResultsSet = () => {
        if (filterBranchTitle === '') {
            return searchResults
        } else {
            return searchResults.filter((item) => {
                return item?.branch?.title === filterBranchTitle
            })
        }
    }

    const searchResultsView = () => {
        if (searchValue) {
            if (searchResultsSet().length === 0) {
                return (
                    <div className='search-results-container'>
                        <div className='search-not-found'>Не найдено</div>
                    </div>
                )
            }
            return (
                <div className='search-results-container'>
                    {searchFilters()}

                    <div className='search-results-list'>
                        {searchResultsSet().map((item) => {
                            return (
                                <div
                                    key={item.id}
                                    className='search-user-data'
                                    onClick={() => {
                                        handleSearchResultClick(item)
                                    }}
                                >
                                    <div className='user-photo'>
                                        <img src={userPhotoUrl(item)} />
                                    </div>
                                    <div>
                                        <div className='user-name'>{item?.fullName}</div>
                                        <div>{item?.position}</div>
                                        <div className='user-department'>{item?.department}</div>
                                        {item?.branch?.color && (
                                            <div
                                                className='department-city-color-line'
                                                style={{ borderTop: `3px solid ${item?.branch?.color}` }}
                                            />
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )
        }
    }

    const departmentsHierarchyView = () => {
        return <div className='departments-hierarchy-view'>{searchResultDepartmentsHierarchy.join(' > ')}</div>
    }

    return (
        <div className='search-container'>
            <input
                className='search-input'
                type='text'
                placeholder='Search'
                value={searchValue}
                onChange={(e) => {
                    setSearchValue(e.target.value)
                    setFilterBranchTitle('')
                }}
            />
            {searchValue && (
                <div className='clear-search-value-icon'>
                    <CgClose
                        onClick={() => {
                            setSearchValue('')
                            setFilterBranchTitle('')
                        }}
                    />
                </div>
            )}
            {searchResultsView()}
            {searchResultDepartmentsHierarchy.length > 0 && departmentsHierarchyView()}
        </div>
    )
}

Search.propTypes = {
    searchValue: PropTypes.string,
    setSearchValue: PropTypes.func,
    searchResultDepartmentsHierarchy: PropTypes.arrayOf(PropTypes.shape()),
    setSearchResultDepartmentsHierarchy: PropTypes.func,
    setChartViewDepartmentId: PropTypes.func,
    orgData: PropTypes.arrayOf(PropTypes.shape()),
    setOrgData: PropTypes.func,
    setIsHeightsCalculated: PropTypes.func
}

export default Search
