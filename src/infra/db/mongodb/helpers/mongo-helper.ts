import { MongoClient, Collection } from "mongodb";

export const MongoHelper = {
  client: null as unknown as MongoClient,

  async connect(url: string): Promise<void> {
    this.client = await MongoClient.connect(url);
  },

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close(true);
    }
  },

  getCollection(name: string): Collection {
    return this.client.db().collection(name);
  },

  map(collection: any): any {
    const { _id, ...data } = collection;
    return { id: _id, ...data };
  },
};
