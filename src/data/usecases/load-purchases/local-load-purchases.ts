import { CacheStore } from "@/data/protocols/cache"
import { SavePurchases } from "@/domain/usecases"

export class LocalLoadPurchases implements SavePurchases {
    
    PURCHASES_KEY = 'purchases'

    constructor(
        private readonly cacheStore: CacheStore
    ) {

    }

    async save(purchases: Array<SavePurchases.Params>): Promise<void> {
        this.cacheStore.delete(this.PURCHASES_KEY)
        this.cacheStore.insert(this.PURCHASES_KEY, purchases)
    }

    async loadAll () : Promise<void> {
        this.cacheStore.fetch(this.PURCHASES_KEY)
    }
}