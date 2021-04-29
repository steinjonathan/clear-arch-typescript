import { LocalLoadPurchases } from '@/data/usecases'
import { CacheStoreSpy, mockPurchases } from '@/data/tests'

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

describe('LocalSavePurchases', () => {
    test('Should not delete or insert cache on sut.init', () => {
        const { cacheStore } = makeSut()
        expect(cacheStore.messages).toHaveLength(0)
    })

    test('Should not insert new Cache if delete fails', async () => {
        const { cacheStore, sut } = makeSut()
        cacheStore.simulateDeleteError()
        const promise = sut.save(mockPurchases())
        expect(cacheStore.messages).toEqual([
            CacheStoreSpy.Messages.delete
        ])
        await expect(promise).rejects.toThrow()
    })

    test('Should insert new Cache if delete succeeds', async () => {
        const timestamp = new Date()
        const { cacheStore, sut } = makeSut(timestamp)
        const purchases = mockPurchases()
        await sut.save(purchases)
        expect(cacheStore.messages).toEqual([
            CacheStoreSpy.Messages.delete,
            CacheStoreSpy.Messages.insert
        ])
        expect(cacheStore.deleteKey).toBe('purchases')
        expect(cacheStore.insertKey).toBe('purchases')
        expect(cacheStore.insertValues).toEqual({
            timestamp,
            value: purchases
        })
    })

    test('Should throw if insert throws', async () => {
        const { cacheStore, sut } = makeSut()
        cacheStore.simulateInsertError()
        const promise = sut.save(mockPurchases())
        expect(cacheStore.messages).toEqual([
            CacheStoreSpy.Messages.delete,
            CacheStoreSpy.Messages.insert
        ])
        await expect(promise).rejects.toThrow()
    })
})
