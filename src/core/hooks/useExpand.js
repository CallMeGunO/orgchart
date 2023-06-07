import { useState, useCallback } from 'react'
import chartDataHelper from '../helpers/chartDataHelper'

export const useExpand = (initialValue, setSearchResultDepartmentsHierarchy) => {
    const [displayMode, setDisplayMode] = useState(initialValue)
    const setChartNodeById = useCallback(
        (orgDataFull, currentExpandingBlockId) => {
            setSearchResultDepartmentsHierarchy([])
            return displayMode
                ? chartDataHelper.switchOrgChartRoot(orgDataFull, currentExpandingBlockId)
                : chartDataHelper.setChartExpandedLevelById(orgDataFull, currentExpandingBlockId)
        },
        [displayMode]
    )

    return { setChartNodeById, displayMode, setDisplayMode }
}
