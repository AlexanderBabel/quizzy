import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { RedisStore, redisStore } from 'cache-manager-redis-yet';
import { readFileSync } from 'fs';

@Injectable()
export class CacheService implements OnModuleInit {
  private scriptShas = new Map<string, string>();
  private redis: RedisStore;

  async set_redis() {
    const redis = await redisStore({
      socket: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
      },
      ttl: 0,
    });

    this.redis = redis;
  }

  async set(key: string, data: any): Promise<void> {
    await this.redis.set(key, data);
  }

  async get(key: string): Promise<any> {
    return await this.redis.get(key);
  }

  private loadScriptFromFile(filepath: string): string {
    const file = readFileSync(filepath, 'utf8');

    return file;
  }

  private async loadScript(name: string, filepath: string): Promise<void> {
    const script = this.loadScriptFromFile(filepath);

    try {
      const scriptSha = await this.redis.client.scriptLoad(script);
      console.log('Scripts loaded successfully!');
      this.scriptShas.set(name, scriptSha);
    } catch (error) {
      console.log('Failed to load scripts!');
    }
  }

  async runScriptByName(
    scriptName: string,
    keys: string[],
    args: any[],
  ): Promise<any> {
    const scriptSha = this.scriptShas.get(scriptName);

    if (!scriptSha) {
      throw new Error('Requested script not loaded!');
    }

    const EvalOptions = {
      keys: keys,
      arguments: args,
    };

    try {
      const result = await this.redis.client.evalSha(scriptSha, EvalOptions);
      return result;
    } catch (error) {
      console.error('Error running lua script: ' + error);
      throw error(error);
    }
  }

  async onModuleInit() {
    await this.set_redis();
    await this.loadScript(
      'joinLobby',
      'src/lobby/lobby/luaScripts/joinLobby.lua',
    ); //Be careful with paths
  }
}
