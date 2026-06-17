import { ClsService } from 'nestjs-cls';
import { DataSource, EntityManager, Repository, ObjectLiteral } from 'typeorm';
import { ENTITY_MANAGER_KEY } from '../interceptors/transaction.interceptor';

// Normally you would write:
// class Example {
//   private entityClass: any;
//   protected dataSource: DataSource;
//   private cls: ClsService;

//   constructor(
//     entityClass: any,
//     dataSource: DataSource,
//     cls: ClsService,
//   ) {
//     this.entityClass = entityClass;
//     this.dataSource = dataSource;
//     this.cls = cls;
//   }
// }

// But TypeScript provides a shortcut:
// constructor(
//   private readonly entityClass: any,
//   protected readonly dataSource: DataSource,
//   private readonly cls: ClsService,
// ) {}

export abstract class BaseRepository<T> {
  protected constructor(
    private readonly entityClass: new () => T,
    protected readonly dataSource: DataSource,
    private readonly cls: ClsService,
  ) {}

  protected getRepository<U>(entityCls: new () => U): Repository<U> {
    const entityManager: EntityManager =
      this.cls.get(ENTITY_MANAGER_KEY) ?? this.dataSource.manager;
    return entityManager.getRepository(entityCls);
  }

  protected get repository(): Repository<T> {
    const em = this.cls.get(ENTITY_MANAGER_KEY) ?? this.dataSource.manager;
    return em.getRepository(this.entityClass);
  }
}
