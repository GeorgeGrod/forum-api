#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/2f40eedb3e60f20343cabc23b1ca9ca9b8fbae5f5d01dde540658de4b2e08a9f/contract';
import startContract from '../../snapshots/2f40eedb3e60f20343cabc23b1ca9ca9b8fbae5f5d01dde540658de4b2e08a9f/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/e6e66efc3e73f56c695d5942213965be1fadebe925924b5784aa53e26113cac9/contract';
import endContract from '../../snapshots/e6e66efc3e73f56c695d5942213965be1fadebe925924b5784aa53e26113cac9/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.dropColumn({ schema: 'public', table: 'Post', column: 'category' }),
      this.createTable({
        schema: 'public',
        table: 'Category',
        columns: [
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addRequiredColumnToEmptyTable({
        schema: 'public',
        table: 'Post',
        column: 'categoryId',
        type: 'int4',
      }),
      this.createIndex({
        schema: 'public',
        table: 'Post',
        index: 'Post_categoryId_idx_15c304f2',
        columns: ['categoryId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Post',
        foreignKey: {
          name: 'Post_categoryId_fkey',
          columns: ['categoryId'],
          references: { schema: 'public', table: 'Category', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
