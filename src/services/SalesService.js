import { TMApi } from "../api/calls"

const url = '/api/manager/sales'

class SalesService {

    getManagerSales(results_per_page = null) {
        return TMApi.get(`${url}`, {
            params: {
                results_per_page
            }
        })
    }
}

export default new SalesService()