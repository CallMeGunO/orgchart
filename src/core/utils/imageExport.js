import { toPng } from 'html-to-image'

export default (node, fileName) => {
    if (node) {
        toPng(node)
            .then(function (dataUrl) {
                const a = document.createElement('a')
                a.href = dataUrl
                a.download = fileName
                a.click()
            })
            .catch(function (error) {
                console.error('Error while image export:', error)
            })
    }
}
