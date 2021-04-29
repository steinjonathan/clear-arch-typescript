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

describe('LocalLoadPurchases', () => {
    test('Should not delete or insert cache on sut.init', () => {
        const { cacheStore } = makeSut()
        expect(cacheStore.messages).toHaveLength(0)
    })
})
