import { LocalLoadPurchases } from '@/data/usecases'
import { CacheStoreSpy, mockPurchases } from '@/data/tests'

type SutTypes = {
    sut: LocalLoadPurchases,
    cacheStore: CacheStoreSpy
}

const makeSut = () : SutTypes => {
    const cacheStore = new CacheStoreSpy()
    const sut = new LocalLoadPurchases(cacheStore)
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

    test('Should delete old cache on sut.save', async () => {
        const { cacheStore, sut } = makeSut()
        await sut.save(mockPurchases())
        expect(cacheStore.messages).toEqual([
            CacheStoreSpy.Messages.delete,
            CacheStoreSpy.Messages.insert
        ])
        expect(cacheStore.deleteKey).toBe('purchases')
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
        const { cacheStore, sut } = makeSut()
        const purchases = mockPurchases()
        await sut.save(purchases)
        expect(cacheStore.messages).toEqual([
            CacheStoreSpy.Messages.delete,
            CacheStoreSpy.Messages.insert
        ])
        expect(cacheStore.insertKey).toBe('purchases')
        expect(cacheStore.insertValues).toEqual(purchases)
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
