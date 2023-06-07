import SharePointApi from './sharePointApi'

const companyEmployeesListUrl = process.env.COMPANY_EMPLOYEES

const companyEmployeesRequestOptions = () => {
    return `?$select=Id,Title,OfficialPosition,Photo1,Department,Email,HideFromPhoneBook,FunctionalManager/Id,BranchLookup/Title,BranchLookup/Color&$expand=FunctionalManager,BranchLookup&$top=10000`
}

class CompanyEmployeesApi extends SharePointApi {
    static async getCompanyEmployeesListItems() {
        const response = await this.getListItems(companyEmployeesListUrl, companyEmployeesRequestOptions())

        if (Array.isArray(response)) {
            return response
        }
        return []
    }
}

export default CompanyEmployeesApi
