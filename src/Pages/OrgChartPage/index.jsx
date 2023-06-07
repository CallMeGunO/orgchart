import React, { useState, useEffect } from 'react'
import ChartDataHelper from '../../core/helpers/chartDataHelper'
import Search from '../../Components/Search'
import OrgChart from '../../Views/OrgChart'
import LeftSidebar from '../../Views/LeftSidebar'
import RightSidebar from '../../Views/RightSidebar'
import CompanyEmployeesApi from '../../core/api/companyEmployeesApi'
import BranchesApi from '../../core/api/branchesApi'
import { useExpand } from '../../core/hooks/useExpand'
import ExpandContext from '../../core/contexts/ExpandContext'

const OrgChartPage = () => {
    const [isAllLevelsExpanded, setIsAllLevelsExpanded] = useState(false)

    const [searchValue, setSearchValue] = useState('')
    const [searchResultDepartmentsHierarchy, setSearchResultDepartmentsHierarchy] = useState([])

    const [orgData, setOrgData] = useState([])
    const [orgDataFull, setOrgDataFull] = useState([])

    const [chartViewDepartmentId, setChartViewDepartmentId] = useState(0)
    const [companyEmployeesListItems, setComapnyEmployeesListItems] = useState([])
    const [branchesListItems, setBranchesListItems] = useState([])

    const [isHeightsCalculated, setIsHeightsCalculated] = useState(false)

    const { setChartNodeById, displayMode, setDisplayMode } = useExpand(false, setSearchResultDepartmentsHierarchy)

    useEffect(() => {
        CompanyEmployeesApi.getCompanyEmployeesListItems()
            .then((data) => {
                setComapnyEmployeesListItems(data)
            })
            .catch((error) => console.log(error))
        BranchesApi.getBranchesListItems()
            .then((data) => {
                setBranchesListItems(data)
            })
            .catch((error) => console.log(error))
    }, [])

    useEffect(() => {
        if (companyEmployeesListItems?.length) {
            const prepairedOrgData = ChartDataHelper.getPrepairedChartData(companyEmployeesListItems)
            setOrgData(prepairedOrgData)
            setOrgDataFull(prepairedOrgData)
        }
    }, [companyEmployeesListItems])

    useEffect(() => {
        if (chartViewDepartmentId) {
            setSearchResultDepartmentsHierarchy([])

            const prepairedOrgData = ChartDataHelper.getPrepairedChartData(companyEmployeesListItems, chartViewDepartmentId)
            setOrgData(prepairedOrgData)
        }
    }, [chartViewDepartmentId])

    const allLevelsExpandedHandler = () => {
        const newOrgData = structuredClone(orgDataFull)
        setOrgData(newOrgData)
        setSearchResultDepartmentsHierarchy([])
        setIsAllLevelsExpanded(true)
    }

    return (
        <div className='org-chart-page-container'>
            <ExpandContext.Provider value={{ setChartNodeById, displayMode, setDisplayMode }}>
                <Search
                    searchValue={searchValue}
                    setSearchValue={setSearchValue}
                    searchResultDepartmentsHierarchy={searchResultDepartmentsHierarchy}
                    setSearchResultDepartmentsHierarchy={setSearchResultDepartmentsHierarchy}
                    setChartViewDepartmentId={setChartViewDepartmentId}
                    orgData={orgDataFull}
                    setOrgData={setOrgData}
                    setIsHeightsCalculated={setIsHeightsCalculated}
                />
                <OrgChart
                    data={orgData}
                    isAllLevelsExpanded={isAllLevelsExpanded}
                    searchValue={searchValue}
                    orgDataFull={orgDataFull}
                    isHeightsCalculated={isHeightsCalculated}
                    setIsHeightsCalculated={setIsHeightsCalculated}
                />
                <LeftSidebar branchesData={branchesListItems} />
                <RightSidebar
                    isAllLevelsExpanded={isAllLevelsExpanded}
                    setIsAllLevelsExpanded={setIsAllLevelsExpanded}
                    setChartViewDepartmentId={setChartViewDepartmentId}
                    allLevelsExpandedHandler={allLevelsExpandedHandler}
                />
            </ExpandContext.Provider>
        </div>
    )
}

export default OrgChartPage
