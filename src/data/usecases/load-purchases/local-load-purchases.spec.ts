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

    test('Should return empty list if load fails', async () => {
        const { sut, cacheStore } = makeSut()
        cacheStore.simulateFetchError()
        const purchases = await sut.loadAll()
        expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch, CacheStoreSpy.Action.delete])
        expect(cacheStore.deleteKey).toEqual('purchases')
        expect(purchases).toEqual([])
    })

    test('Should return a list of purchases if cache is less than 3 days old', async () => {
        const currentDate = new Date()
        const timestamp = new Date(currentDate)
        timestamp.setDate(timestamp.getDate() - 3)
        timestamp.setSeconds(timestamp.getSeconds() + 1)
        const { sut, cacheStore } = makeSut(currentDate)
        cacheStore.fetchResult = {
            timestamp,
            value: mockPurchases()
        }
        const purchases = await sut.loadAll()
        expect(cacheStore.fetchKey).toEqual('purchases')
        expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch])
        expect(purchases).toEqual(cacheStore.fetchResult.value)
    })

    test('Should return an empty list if cache is more than 3 days old', async () => {
        const currentDate = new Date()
        const timestamp = new Date(currentDate)
        timestamp.setDate(timestamp.getDate() - 3)
        timestamp.setSeconds(timestamp.getSeconds() - 1)
        const { sut, cacheStore } = makeSut(currentDate)
        cacheStore.fetchResult = {
            timestamp,
            value: mockPurchases()
        }
        const purchases = await sut.loadAll()
        expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch, CacheStoreSpy.Action.delete])
        expect(cacheStore.fetchKey).toEqual('purchases')
        expect(cacheStore.deleteKey).toEqual('purchases')
        expect(purchases).toEqual([])
    })

    test('Should return an empty list if cache is 3 days old', async () => {
        const currentDate = new Date()
        const timestamp = new Date(currentDate)
        timestamp.setDate(timestamp.getDate() - 3)
        const { sut, cacheStore } = makeSut(currentDate)
        cacheStore.fetchResult = {
            timestamp,
            value: mockPurchases()
        }
        const purchases = await sut.loadAll()
        expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch, CacheStoreSpy.Action.delete])
        expect(cacheStore.fetchKey).toEqual('purchases')
        expect(cacheStore.deleteKey).toEqual('purchases')
        expect(purchases).toEqual([])
    })
})
