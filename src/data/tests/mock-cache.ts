import { LoadPurchases, SavePurchases } from "@/domain/usecases"
import { CacheStore } from "@/data/protocols/cache"

export const getCacheExpirationDate = (currentDate: Date) : Date => {
    const macCacheAge = new Date(currentDate)
    macCacheAge.setDate(macCacheAge.getDate() - 3)
    return macCacheAge
}

export class CacheStoreSpy implements CacheStore {
    deleteKey: string
    insertKey: string
    fetchKey: string
    insertValues: Array<SavePurchases.Params> 
    actions: Array<CacheStoreSpy.Action> = []
    fetchResult: any

    delete(key: string): void {
        this.deleteKey = key
        this.actions.push(CacheStoreSpy.Action.delete)
    }

    insert(key: string, value: any): void {
        this.insertKey = key
        this.insertValues = value
        this.actions.push(CacheStoreSpy.Action.insert)
    }

    replace(key: string, value: any): void {
        this.delete(key)
        this.insert(key, value)
    }

    fetch(key: string) : any {
        this.fetchKey = key
        this.actions.push(CacheStoreSpy.Action.fetch)
        return this.fetchResult
    }

    simulateDeleteError(): void {
        jest.spyOn(CacheStoreSpy.prototype, 'delete')
            .mockImplementationOnce(() => { 
                this.actions.push(CacheStoreSpy.Action.delete)
                throw new Error() 
            })
    }

    simulateInsertError(): void {
        jest.spyOn(CacheStoreSpy.prototype, 'insert')
            .mockImplementationOnce(() => { 
                this.actions.push(CacheStoreSpy.Action.insert)
                throw new Error() 
            })
    }

    simulateFetchError(): void {
        jest.spyOn(CacheStoreSpy.prototype, 'fetch')
            .mockImplementationOnce(() => { 
                this.actions.push(CacheStoreSpy.Action.fetch)
                throw new Error() 
            })
    }
}

export namespace CacheStoreSpy {
    export enum Action {
        delete,
        insert,
        fetch
    }
}