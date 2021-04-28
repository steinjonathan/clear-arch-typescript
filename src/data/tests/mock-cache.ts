import { SavePurchases } from "@/domain/usecases"
import { CacheStore } from "@/data/protocols/cache"

export class CacheStoreSpy implements CacheStore {
    deleteKey: string
    insertKey: string
    insertValues: Array<SavePurchases.Params> 
    messages: Array<CacheStoreSpy.Messages> = []

    delete(key: string): void {
        this.deleteKey = key
        this.messages.push(CacheStoreSpy.Messages.delete)
    }

    insert(key: string, value: any): void {
        this.insertKey = key
        this.insertValues = value
        this.messages.push(CacheStoreSpy.Messages.insert)
    }

    simulateDeleteError(): void {
        jest.spyOn(CacheStoreSpy.prototype, 'delete')
            .mockImplementationOnce(() => { 
                this.messages.push(CacheStoreSpy.Messages.delete)
                throw new Error() 
            })
    }

    simulateInsertError(): void {
        jest.spyOn(CacheStoreSpy.prototype, 'insert')
            .mockImplementationOnce(() => { 
                this.messages.push(CacheStoreSpy.Messages.insert)
                throw new Error() 
            })
    }
}

export namespace CacheStoreSpy {
    export enum Messages {
        delete,
        insert
    }
}