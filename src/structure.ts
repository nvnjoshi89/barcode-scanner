// 1. entity          → defines database table
// 2. dto             → defines data shape (insert, update, response)
// 3. repository      → database queries
// 4. service.interface → defines service contract/methods
// 5. service         → business logic
// 6. controller      → API endpoints
// 7. module          → wire everything together
// 8. app.module.ts   → register new module

import { DataSource } from 'typeorm';
import { FileDetails } from './file-details/file-detail.entity';

export class FileDetailRepository {
  private repository;
  constructor() {
    const datasource = new DataSource({
      type: 'mysql',
      host: 'localhost',
    });
    this.repository = datasource.getRepository(FileDetails);
  }

  async findById(id: number) {
    return this.repository.findOne({ where: { id } });
  }
}
