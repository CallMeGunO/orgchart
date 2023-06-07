import SharePointApi from './sharePointApi'

const branchesListUrl = process.env.BRANCHES

const companyEmployeesRequestOptions = () => {
    return `?$select=Id,Title,Color&$top=10000`
}

class BranchesApi extends SharePointApi {
    static async getBranchesListItems() {
        const response = await this.getListItems(branchesListUrl, companyEmployeesRequestOptions())

        if (Array.isArray(response)) {
            return response
        }
        return []
    }
}

export default BranchesApi
