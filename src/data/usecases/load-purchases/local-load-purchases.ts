import { CacheStore, CachePolicy } from "@/data/protocols/cache"
import { SavePurchases, LoadPurchases } from "@/domain/usecases"

export class LocalLoadPurchases implements SavePurchases, LoadPurchases {
    
    PURCHASES_KEY = 'purchases'

    constructor(
        private readonly cacheStore: CacheStore,
        private readonly currentDate: Date
    ) {

    }

    async save(purchases: Array<SavePurchases.Params>): Promise<void> {
        this.cacheStore.replace(this.PURCHASES_KEY, {
            timestamp: this.currentDate,
            value: purchases
        })
    }

    async loadAll () : Promise<Array<LoadPurchases.Result>> {
        try {
            const cache = this.cacheStore.fetch(this.PURCHASES_KEY)
            if (CachePolicy.validate(cache.timestamp, this.currentDate)) {
                return cache.value
            } else {
                this.cacheStore.delete(this.PURCHASES_KEY)
                return []
        }
        } catch (err) {
            return []
        }
    }
}