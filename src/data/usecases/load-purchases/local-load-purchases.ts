import { CacheStore } from "@/data/protocols/cache"
import { SavePurchases, LoadPurchases } from "@/domain/usecases"

export class LocalLoadPurchases implements SavePurchases, LoadPurchases {
    
    PURCHASES_KEY = 'purchases'

    constructor(
        private readonly cacheStore: CacheStore,
        private readonly timestamp: Date
    ) {

    }

    async save(purchases: Array<SavePurchases.Params>): Promise<void> {
        this.cacheStore.replace(this.PURCHASES_KEY, {
            timestamp: this.timestamp,
            value: purchases
        })
    }

    async loadAll () : Promise<Array<LoadPurchases.Result>> {
        try {
            const cache = this.cacheStore.fetch(this.PURCHASES_KEY)
            return cache.value
        } catch (err) {
            this.cacheStore.delete(this.PURCHASES_KEY)
            return []
        }
    }
}