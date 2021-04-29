import { LocalLoadPurchases } from '@/data/usecases'
import { CacheStoreSpy, mockPurchases } from '@/data/tests'
import { textChangeRangeIsUnchanged } from 'typescript'

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

describe('LocalLoadPurchases', () => {
    test('Should not delete or insert cache on sut.init', () => {
        const { cacheStore } = makeSut()
        expect(cacheStore.actions).toHaveLength(0)
    })

    test('Should call corrent key on load', async () => {
        const { sut, cacheStore } = makeSut()
        await sut.loadAll()
        expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch])
        expect(cacheStore.fetchKey).toEqual('purchases')
    })

    test('Should return empty list if load fails', async () => {
        const { sut, cacheStore } = makeSut()
        cacheStore.simulateFetchError()
        const purchases = await sut.loadAll()
        expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch, CacheStoreSpy.Action.delete])
        expect(cacheStore.deleteKey).toEqual('purchases')
        expect(purchases).toEqual([])
    })
})
