const siteUrl = process.env.SITE_URL

class SharePointApi {
    static defaultGetPayload = {
        method: 'GET',
        headers: { Accept: 'application/json; odata=verbose' },
        credentials: 'include'
    }

    static async getListItems(listUrl, options = '') {
        try {
            const url = `${siteUrl}/_api/web/GetList('${siteUrl}${listUrl}')/items${options}`
            const response = await fetch(url, this.defaultGetPayload)

            if (response.ok) {
                const json = await response.json()
                if (json?.d?.results) {
                    return json.d.results
                }
                return response
            } else {
                return Promise.reject(response)
            }
        } catch (error) {
            console.log(error)
        }
    }
}

export default SharePointApi
