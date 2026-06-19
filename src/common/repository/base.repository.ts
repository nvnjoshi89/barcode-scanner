import {
  DeepPartial,
  FindOneOptions,
  FindOptionsOrder,
  FindOptionsWhere,
  Repository,
  FindManyOptions,
  ObjectLiteral,
  DataSource,
  EntityManager,
} from 'typeorm';
import { PaginationOptions } from '../dto/pagination.dto';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { ClsService } from 'nestjs-cls';
import { ENTITY_MANAGER_KEY } from '../interceptors/transaction.interceptor';

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
  async findById(id: any): Promise<T | null> {
    return this.repository.findOneBy({ id } as FindOptionsWhere<T>);
  }

  async findOne(where: FindOneOptions<T>): Promise<T | null> {
    return this.repository.findOne(where);
  }

  async findAll(options: FindManyOptions<T> = {}): Promise<T[]> {
    return this.repository.find(options);
  }

  createEntity(data: DeepPartial<T>): T {
    return this.repository.create(data);
  }

  async save(data: DeepPartial<T>): Promise<T> {
    return this.repository.save(data);
  }

  async count(options: FindManyOptions<T> = {}) {
    return this.repository.count(options);
  }

  async updateEntity(
    where: FindOptionsWhere<T>,
    data: DeepPartial<T>,
  ): Promise<T | null> {
    await this.repository.update(where, data as QueryDeepPartialEntity<T>);
    return this.repository.findOne({ where });
  }

  async paginate(
    options: PaginationOptions,
    extraOptions: FindManyOptions<T> = {},
  ): Promise<{
    data: T[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { page = 1, limit = 10, sortBy = 'id', sortOrder = 'ASC' } = options;

    const [data, total] = await this.repository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { [sortBy]: sortOrder } as FindOptionsOrder<T>,
      ...extraOptions,
    });

    return {
      data,
      total,
      page,
      limit,
    };
  }
}
