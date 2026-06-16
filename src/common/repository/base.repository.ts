import { ClsService } from 'nestjs-cls';
import { DataSource, EntityManager, Repository, EntityTarget } from 'typeorm';
import { ENTITY_MANAGER_KEY } from '../interceptors/transaction.interceptor';

export abstract class BaseRepository<T> {
  protected constructor(
    private readonly entityClass: EntityTarget<T>,
    protected readonly dataSource: DataSource,
    private readonly cls: ClsService,
  ) {}

  protected getRepository<U>(entityCls: EntityTarget<U>): Repository<U> {
    const entityManager: EntityManager =
      this.cls.get(ENTITY_MANAGER_KEY) ?? this.dataSource.manager;
    return entityManager.getRepository(entityCls);
  }
}
