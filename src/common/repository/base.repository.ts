import { ClsService } from 'nestjs-cls';
import { DataSource, EntityManager } from 'typeorm';

export abstract class BaseRepository<T> {
  protected constructor(
    private readonly entityClass: new () => T,
    protected readonly dataSource: DataSource,
    private readonly cls: ClsService,
  ) {}

  protected getRepository<U>(entityCls: new () => U): Repository<U> {
    const entityManager: EntityManager = this.cls.get(ENTITY_MA);
  }
}
