declare global {
  interface ReadRecord {
    id: string
    bookId: string
    title: string
    startDateTime: Date
    endDateTime?: Date
    authors?: string[]
    publisher?: string
    imageLinks?: any
    updateBook?: Object
    userDetail?: any
    note: string
    notePublic: boolean
    [propName: string]: any
  }
}

export {}