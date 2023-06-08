import React, { useState, useEffect, useContext } from 'react'
import ChartDataHelper from '../../core/helpers/chartDataHelper'
import Search from '../../Components/Search'
import OrgChart from '../../Views/OrgChart'
import LeftSidebar from '../../Views/LeftSidebar'
// import RightSidebar from '../../Views/RightSidebar'
import { useExpand } from '../../core/hooks/useExpand'
import ExpandContext from '../../core/contexts/ExpandContext'
import { collection, getDocs, getFirestore } from 'firebase/firestore/lite'
import FirebaseContext from '../../core/contexts/FirebaseContext'

const OrgChartPage = () => {
    const [searchValue, setSearchValue] = useState('')
    const [searchResultDepartmentsHierarchy, setSearchResultDepartmentsHierarchy] = useState([])

    const [orgData, setOrgData] = useState([])
    const [orgDataFull, setOrgDataFull] = useState([])

    const [chartViewDepartmentId, setChartViewDepartmentId] = useState(0)
    const [users, setUsers] = useState([])
    const [cities, setCities] = useState([])

    const [isHeightsCalculated, setIsHeightsCalculated] = useState(false)

    const { setChartNodeById, displayMode, setDisplayMode } = useExpand(false, setSearchResultDepartmentsHierarchy)

    const { app } = useContext(FirebaseContext)

    useEffect(() => {
        const db = getFirestore(app)
        const firebaseFetch = async () => {
            const users = collection(db, 'users')
            const usersSnapshot = await getDocs(users)
            const usersItems = usersSnapshot.docs.map((doc) => {
                const data = doc.data()
                return {
                    id: doc.id,
                    ...data
                }
            })
            setUsers(usersItems)

            const cities = collection(db, 'cities')
            const citiesSnapshot = await getDocs(cities)
            const citiesItems = citiesSnapshot.docs.map((doc) => doc.data())
            setCities(citiesItems)
        }
        firebaseFetch()
    }, [app])

    useEffect(() => {
        if (users?.length && cities?.length) {
            const prepairedOrgData = ChartDataHelper.getPrepairedChartData(users, cities)
            setOrgData(prepairedOrgData)
            setOrgDataFull(prepairedOrgData)
        }
    }, [users, cities])

    useEffect(() => {
        if (chartViewDepartmentId) {
            setSearchResultDepartmentsHierarchy([])

            const prepairedOrgData = ChartDataHelper.getPrepairedChartData(users, chartViewDepartmentId)
            setOrgData(prepairedOrgData)
        }
    }, [chartViewDepartmentId])

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
                    searchValue={searchValue}
                    orgDataFull={orgDataFull}
                    isHeightsCalculated={isHeightsCalculated}
                    setIsHeightsCalculated={setIsHeightsCalculated}
                />
                <LeftSidebar branchesData={cities} />
            </ExpandContext.Provider>
        </div>
    )
}

export default OrgChartPage
