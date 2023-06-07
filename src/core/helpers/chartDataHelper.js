import { generateId } from '../utils/generateId'

class ChartDataHelper {
    defaultExpandedLevelsCount = 3

    getPrepairedChartData(comapnyEmployeesListItems) {
        const rootItem = comapnyEmployeesListItems.find((item) => !item.FunctionalManager.Id)

        const result = (currentEmployee) => {
            const levelItems = comapnyEmployeesListItems?.filter(
                (employee) => employee?.FunctionalManager?.Id === currentEmployee.Id
            )

            const preparedLevelItems = levelItems.map((levelItem) => {
                let photoUrl
                if (levelItem.Photo1) {
                    photoUrl = levelItem.Photo1.match(/["']serverRelativeUrl["']:\s?["'](.*?)["']/g)[0]
                        .replace(/['"]/g, '')
                        .split(':')
                        .at(-1)
                }
                const chartBlock = {
                    id: generateId(),
                    idSp: levelItem.Id,
                    parentIdSp: levelItem.FunctionalManager.Id,
                    department: levelItem.Department,
                    position: levelItem.OfficialPosition,
                    fullName: levelItem.Title,
                    branch: {
                        color: levelItem.BranchLookup.Color,
                        title: levelItem.BranchLookup.Title
                    },
                    email: levelItem.Email,
                    photoUrl: photoUrl,
                    hideFromPhoneBook: levelItem.HideFromPhoneBook,
                    children: [...result(levelItem)]
                }

                return chartBlock
            })

            return preparedLevelItems
        }

        let photoUrl
        if (rootItem.Photo1) {
            photoUrl = rootItem.Photo1.match(/["']serverRelativeUrl["']:\s?["'](.*?)["']/g)[0]
                .replace(/['"]/g, '')
                .split(':')
                .at(-1)
        }

        const chartBlock = {
            id: generateId(),
            idSp: rootItem.Id,
            parentIdSp: rootItem.FunctionalManager.Id,
            department: rootItem.Department,
            position: rootItem.OfficialPosition,
            fullName: rootItem.Title,
            branch: {
                color: rootItem.BranchLookup.Color,
                title: rootItem.BranchLookup.Title
            },
            email: rootItem.Email,
            photoUrl: photoUrl,
            children: [...result(rootItem)]
        }

        return [chartBlock]
    }

    setChartExpandedLevels = (orgData, expand = false) => {
        const checkManagerChildren = (data) => {
            return data.children.find((item) => item?.children?.length)
        }

        const result = (data, level) => {
            return data.map((item) => {
                item.level = level

                if (checkManagerChildren(item) && (level < this.defaultExpandedLevelsCount || expand)) {
                    item.isExpanded = true
                } else {
                    item.isExpanded = false
                }
                if (item.children?.length) {
                    item.children = result(item.children, level + 1)
                }
                return item
            })
        }
        return result(orgData, 1)
    }

    setChartExpandedLevelById = (orgData, expandingblockId) => {
        const result = (data, level) => {
            return data.map((item) => {
                item.level = level

                if (item.id === expandingblockId) {
                    item.isExpanded = !item.isExpanded
                }
                if (item.children?.length) {
                    item.children = result(item.children, level + 1)
                }
                return item
            })
        }
        return result(orgData, 1)
    }

    switchOrgChartRoot = (orgData, chartNodeId, isSearchResult = false) => {
        if (orgData) {
            const result = (data, parent = undefined) => {
                data.forEach((item) => {
                    if (item.id === chartNodeId) {
                        item.isSearchResult = true
                    }
                    const chartNode = item.children?.find((child) => {
                        return child.id === chartNodeId
                    })
                    if (chartNode && chartNode.children.length) {
                        chartNode.isExpanded = true
                        item.level = 1
                        item.children = item.children.filter((child) => child?.children?.length === 0)
                        chartNode.level = 2
                        chartNode?.children?.forEach((child) => {
                            child.isExpanded = false
                            child.level = 3
                        })
                        if (isSearchResult) {
                            chartNode.isSearchResultItem = true
                        }
                        item.children.push(chartNode)
                        tempData = [item]
                    } else if (chartNode && isSearchResult) {
                        const tempParent = structuredClone(parent)
                        tempParent.level = 1
                        tempParent.children = tempParent?.children?.filter((item) => item?.children?.length === 0)

                        item.level = 2
                        item.isExpanded = true
                        item?.children?.forEach((child) => {
                            child.isExpanded = false
                            child.level = 3
                        })
                        item.isExpandedEmployees = true
                        const chartNodeIndex = item?.children?.findIndex((child) => child.id === chartNode.id)
                        item.children[chartNodeIndex].isSearchResultItem = true

                        // tempParent.children = [item]
                        tempParent.children.push(item)
                        tempData = [tempParent]
                    } else {
                        if (item.children?.length) {
                            item.children = result(item.children, item)
                        }
                    }
                })
            }
            const orgDataCopy = JSON.parse(JSON.stringify(orgData))
            let tempData
            if (chartNodeId === orgDataCopy[0].id) {
                orgDataCopy[0].isSearchResultItem = true
                tempData = orgDataCopy
            } else if (orgDataCopy[0].children.find((child) => child.id === chartNodeId)) {
                // Золотовицкий
                const specialEmployeeIndex = orgDataCopy[0].children.findIndex((child) => child.id === chartNodeId)
                orgDataCopy[0].children[specialEmployeeIndex].isSearchResultItem = true
                tempData = orgDataCopy
            } else {
                result(orgDataCopy)
            }
            tempData[0].isExpanded = true
            return tempData
        }
    }
}

export default new ChartDataHelper()
