const chartScaleHandler = (event, chartElement, setChartScaleValue) => {
    if (chartElement.current.children.length) {
        const scaledBlock = chartElement.current.children[0]
        let scaleValue = Number(scaledBlock.style.zoom)

        const delta = event.deltaY || event.detail || event.wheelDelta

        if (delta < 0) {
            scaleValue += 0.05
        } else {
            scaleValue -= 0.05
        }

        if (scaleValue >= 0.05) {
            scaleValue = Math.round((scaleValue + Number.EPSILON) * 20) / 20
            scaledBlock.style.zoom = scaleValue

            setChartScaleValue(scaleValue)
        }
    }
}

export { chartScaleHandler }
