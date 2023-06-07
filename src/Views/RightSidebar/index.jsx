import React, { useContext, useState } from 'react'
import PropTypes from 'prop-types'
import imageExport from '../../core/utils/imageExport'
import { CgClose, CgImage, CgHome } from 'react-icons/cg'
import CheckBox from '../../Components/CheckBox'
import ExpandContext from '../../core/contexts/ExpandContext'

const RightSidebar = ({ isAllLevelsExpanded, setIsAllLevelsExpanded, allLevelsExpandedHandler }) => {
    const { displayMode, setDisplayMode } = useContext(ExpandContext)

    const [isSidebarOpened, setIsSidebarOpened] = useState(false)

    const handleSidebarOpening = () => {
        setIsSidebarOpened(!isSidebarOpened)
    }

    const exportOrgchartImage = () => {
        const node = document.getElementById('orgChartContent')?.childNodes[0]
        imageExport(node, `Orgchart ${new Date().toLocaleDateString()}.png`)
    }

    const displayAllLevelsHandler = () => {
        setIsAllLevelsExpanded(!isAllLevelsExpanded)
        setDisplayMode(false)
    }

    const displayByThreeLevelsHandler = () => {
        setIsAllLevelsExpanded(false)
        setDisplayMode(!displayMode)
    }

    return (
        <div className='right-sidebar-container'>
            <div className='sidebar-control-icon' title='Отображать все уровни'>
                <CgHome onClick={allLevelsExpandedHandler} />
            </div>
            <div className='sidebar-control-icon' title='Экспортировать как изображение'>
                <CgImage onClick={exportOrgchartImage} />
            </div>
            <div className='panel-wrap'>
                <div className='panel'>
                    <div className='sidebar-controls-container'>
                        <div className='sidebar-control-icon right-sidebar-close-icon' title='Скрыть меню'>
                            <CgClose onClick={handleSidebarOpening} />
                        </div>
                        <CheckBox
                            name='displayAllLevels'
                            caption='Отображать все уровни'
                            value={isAllLevelsExpanded}
                            onChange={displayAllLevelsHandler}
                        />
                        <CheckBox
                            name='threeLevels'
                            caption='Отображать по три уровня'
                            value={displayMode}
                            onChange={displayByThreeLevelsHandler}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

RightSidebar.propTypes = {
    isAllLevelsExpanded: PropTypes.bool,
    setIsAllLevelsExpanded: PropTypes.func,
    allLevelsExpandedHandler: PropTypes.func
}

export default RightSidebar
