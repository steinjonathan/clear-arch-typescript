import { CacheStore } from "@/data/protocols/cache"
import { SavePurchases } from "@/domain/usecases"

export class LocalLoadPurchases implements SavePurchases {
    
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

    async loadAll () : Promise<void> {
        this.cacheStore.fetch(this.PURCHASES_KEY)
    }
}