import { Service } from 'typedi';
import Redis, { Redis as RedisServer, RedisOptions } from 'ioredis';

@Service('cacheProvider')
export default class CacheProvider {
  private readonly cacheServer: RedisServer;

  constructor(options?: RedisOptions) {
    this.cacheServer = new Redis({
      host: 'localhost',
      port: 6379,
      ...options,
    });
  }

  async set<T>(key: string, value: T): Promise<T> {
    if (!value) return value;

    await this.cacheServer.set(`${key}`, JSON.stringify(value), 'EX', 300);

    return value;
  }

  async recover<T>(key: string): Promise<T | null> {
    const data = await this.cacheServer.get(key);

    if (!data) {
      console.log('Busca no banco');
      return null;
    }

    const value = JSON.parse(data) as T;

    return value;
  }

  async invalidateSingle<T>(key: string): Promise<T | any> {
    const res = await this.cacheServer.del(`${key}`);

    return res;
  }

  async invalidateAll(preffix: string): Promise<string[]> {
    const keys = await this.cacheServer.keys(`${preffix}:*`);

    const pipeline = this.cacheServer.pipeline();

    keys.forEach(key => pipeline.del(key));

    await pipeline.exec();

    return keys;
  }
}
