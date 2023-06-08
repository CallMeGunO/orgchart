import React, { useState, useEffect, useRef, useContext, createRef } from 'react'
import PropTypes from 'prop-types'
import ChartBlock from '../../Components/ChartBlock'
import ScaleControl from '../../Components/ScaleControl'
import { chartScaleHandler } from '../../core/helpers/chartEventsHelper'
import chartDataHelper from '../../core/helpers/chartDataHelper'
import ExpandContext from '../../core/contexts/ExpandContext'

const OrgChart = ({ data, searchValue, orgDataFull, isHeightsCalculated, setIsHeightsCalculated }) => {
    const [orgData, setOrgData] = useState([])
    const [currentExpandingBlockId, setCurrentExpandingBlockId] = useState(0)
    const [orgDataChangedCount, setOrgDataChangedCount] = useState(0)
    const [chartScaleValue, setChartScaleValue] = useState(1)
    const chartElement = useRef(null)

    const [chartBlockRefs] = useState([])

    const { displayMode, setChartNodeById } = useContext(ExpandContext)

    let chartScrollPosition = { top: 0, left: 0, x: 0, y: 0 }

    useEffect(() => {
        if (
            chartElement.current.children.length &&
            chartElement.current.children[0].localName === 'ul' &&
            orgDataChangedCount >= 3
        ) {
            chartElement.current.children[0].style.zoom = chartScaleValue
        }
        if (!isHeightsCalculated) {
            const definedBlockRefs = chartBlockRefs.filter((item) => item.current)
            if (definedBlockRefs.length) {
                setIsHeightsCalculated(true)
            }
            const heights = {}
            definedBlockRefs.forEach((item) => {
                if (heights[item.current.dataset.level]) {
                    if (heights[item.current.dataset.level] < item.current.offsetHeight) {
                        heights[item.current.dataset.level] = item.current.offsetHeight
                    }
                } else {
                    heights[item.current.dataset.level] = item.current.offsetHeight
                }
            })
            definedBlockRefs.forEach((item) => {
                item.current.style.minHeight = `${heights[item.current.dataset.level]}px`
            })
        }
    })

    useEffect(() => {
        if (Array.isArray(data)) {
            const orgDataForView = chartDataHelper.setChartExpandedLevels(data)
            setIsHeightsCalculated(false)
            setOrgData(orgDataForView)
            setOrgDataChangedCount(orgDataChangedCount + 1)
        }
    }, [data, displayMode])

    useEffect(() => {
        chartElement.current.scrollLeft = (chartElement.current.scrollWidth - chartElement.current.clientWidth) / 2

        if (chartElement.current.children.length && chartElement.current.children[0].localName === 'ul') {
            const currentScaleValue = chartElement.current.offsetWidth / chartElement.current.scrollWidth

            chartElement.current.children[0].style.zoom = orgDataChangedCount < 3 ? currentScaleValue : chartScaleValue

            setChartScaleValue(orgDataChangedCount < 3 ? currentScaleValue : chartScaleValue)
        }
    }, [orgDataChangedCount])

    useEffect(() => {
        if (currentExpandingBlockId) {
            setIsHeightsCalculated(false)
            const orgDataForView = setChartNodeById(orgDataFull, currentExpandingBlockId)
            setCurrentExpandingBlockId(0)
            setOrgData(orgDataForView)

            chartElement.current.children[0].style.zoom = chartScaleValue
        }
    }, [currentExpandingBlockId])

    const childrenView = (children) => {
        if (children?.length) {
            return (
                <ul>
                    {children.map((item) => {
                        if (item.children.length) {
                            const chartBlockRef = createRef(null)
                            chartBlockRefs.push(chartBlockRef)
                            const employeesChildren = item.children.filter((child) => !child.children.length)
                            const isOnlyEmployeesChildren = employeesChildren.length === item.children.length
                            return (
                                <li key={item.id}>
                                    <div className='chart-node'>
                                        <ChartBlock
                                            data={item}
                                            setCurrentExpandingBlockId={setCurrentExpandingBlockId}
                                            employeesChildren={employeesChildren}
                                            isOnlyEmployeesChildren={isOnlyEmployeesChildren}
                                            ref={chartBlockRef}
                                            isHeightsCalculated={isHeightsCalculated}
                                        />
                                    </div>
                                    {item.isExpanded && childrenView(item.children)}
                                </li>
                            )
                        }
                    })}
                </ul>
            )
        }
    }

    const dataView = () => {
        return orgData?.map((item) => {
            const chartBlockRef = createRef(null)
            let specialBlockRef
            chartBlockRefs.push(chartBlockRef)
            const hasNonSpecialSearchResultChild = item.children.find((child) => child.idSp !== 1 && child.isSearchResultItem)
            const specialEmployee = hasNonSpecialSearchResultChild ? undefined : item.children.find((child) => child.idSp === 1)
            const employeesChildren = item.children.filter((child) => !child.children.length)
            if (specialEmployee) {
                specialEmployee.level = 1
                specialBlockRef = createRef(null)
                chartBlockRefs.push(specialBlockRef)
                employeesChildren.splice(
                    employeesChildren.findIndex((child) => child.idSp === 1),
                    1
                )
            }
            const isOnlyEmployeesChildren = employeesChildren.length === item.children.length
            return (
                <ul key={item.id}>
                    <li>
                        <div className='chart-node'>
                            {specialEmployee && (
                                <div className='chart-node special'>
                                    <ChartBlock data={specialEmployee} ref={specialBlockRef} />
                                </div>
                            )}
                            <ChartBlock
                                data={item}
                                ref={chartBlockRef}
                                setCurrentExpandingBlockId={setCurrentExpandingBlockId}
                                employeesChildren={employeesChildren}
                                isOnlyEmployeesChildren={isOnlyEmployeesChildren}
                                specialEmployee={specialEmployee}
                                isHeightsCalculated={isHeightsCalculated}
                            />
                        </div>
                        {item.isExpanded && childrenView(item.children)}
                    </li>
                </ul>
            )
        })
    }

    const mouseDownHandler = function (e) {
        chartElement.current.style.cursor = 'grabbing'
        chartElement.current.style.userSelect = 'none'

        chartScrollPosition = {
            left: chartElement.current.scrollLeft,
            top: chartElement.current.scrollTop,

            x: e.clientX,
            y: e.clientY
        }

        document.addEventListener('mousemove', mouseMoveHandler)
        document.addEventListener('mouseup', mouseUpHandler)
    }

    const mouseMoveHandler = function (e) {
        const dx = e.clientX - chartScrollPosition.x
        const dy = e.clientY - chartScrollPosition.y

        chartElement.current.scrollTop = chartScrollPosition.top - dy
        chartElement.current.scrollLeft = chartScrollPosition.left - dx
    }

    const mouseUpHandler = function () {
        chartElement.current.style.cursor = 'grab'
        chartElement.current.style.removeProperty('user-select')

        document.removeEventListener('mousemove', mouseMoveHandler)
        document.removeEventListener('mouseup', mouseUpHandler)
    }

    const onMouseWheelHandler = (event) => {
        chartScaleHandler(event, chartElement, setChartScaleValue)
    }

    return (
        <div className={`${searchValue?.length ? `org-chart-container blur` : 'org-chart-container'}`}>
            <div
                id='orgChartContent'
                className='org-chart'
                ref={chartElement}
                onMouseDown={mouseDownHandler}
                onWheel={onMouseWheelHandler}
            >
                {dataView()}
                <ScaleControl
                    zoomIn={() => {
                        chartScaleHandler({ deltaY: -1 }, chartElement, setChartScaleValue)
                    }}
                    zoomOut={() => {
                        chartScaleHandler({ deltaY: 1 }, chartElement, setChartScaleValue)
                    }}
                    chartScaleValue={chartScaleValue}
                />
            </div>
        </div>
    )
}

OrgChart.propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape()),
    searchValue: PropTypes.string,
    orgDataFull: PropTypes.arrayOf(PropTypes.shape()),
    isHeightsCalculated: PropTypes.bool,
    setIsHeightsCalculated: PropTypes.func
}

export default OrgChart
