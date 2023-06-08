import { generateId } from '../utils/generateId'

class ChartDataHelper {
    defaultExpandedLevelsCount = 3

    getPrepairedChartData(users, cities) {
        const rootItem = users.find((item) => !item.parent)

        const result = (currentUser) => {
            const levelItems = users?.filter((user) => user.parent === currentUser.id)

            const preparedLevelItems = levelItems.map((levelItem) => {
                const city = cities.find((item) => item.title === levelItem.city)

                const chartBlock = {
                    id: generateId(),
                    department: levelItem.department,
                    position: levelItem.position,
                    fullName: levelItem.name,
                    branch: {
                        color: city.color,
                        title: city.title
                    },
                    children: [...result(levelItem)]
                }

                return chartBlock
            })

            return preparedLevelItems
        }

        const rootCity = cities.find((city) => city.title === rootItem.city)

        const chartBlock = {
            id: generateId(),
            department: rootItem.department,
            position: rootItem.position,
            fullName: rootItem.name,
            branch: {
                color: rootCity.color,
                title: rootCity.title
            },
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
