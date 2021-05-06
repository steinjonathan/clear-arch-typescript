import { LocalLoadPurchases } from '@/data/usecases'
import { CacheStoreSpy, mockPurchases, getCacheExpirationDate } from '@/data/tests'

type SutTypes = {
    sut: LocalLoadPurchases,
    cacheStore: CacheStoreSpy
}

const makeSut = (timestamp : Date = new Date()) : SutTypes => {
    const cacheStore = new CacheStoreSpy()
    const sut = new LocalLoadPurchases(cacheStore, timestamp)
    return {
        sut,
        cacheStore
    }
}

describe('LocalValidatePurchases', () => {
    test('Should not delete or insert cache on sut.init', () => {
        const { cacheStore } = makeSut()
        expect(cacheStore.actions).toHaveLength(0)
    })

    test('Should delete cache if load fails', () => {
        const { sut, cacheStore } = makeSut()
        cacheStore.simulateFetchError()
        sut.validate()
        expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch, CacheStoreSpy.Action.delete])
        expect(cacheStore.deleteKey).toEqual('purchases')
    })

    test('Should hasnt side effect if load succeeds', async () => {
        const currentDate = new Date()
        const timestamp = getCacheExpirationDate(currentDate)
        timestamp.setSeconds(timestamp.getSeconds() + 1)
        const { sut, cacheStore } = makeSut(currentDate)
        cacheStore.fetchResult = { timestamp }
        sut.validate()
        expect(cacheStore.fetchKey).toEqual('purchases')
        expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch])
    })


})
