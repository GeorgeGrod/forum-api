#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/576ef895842a97bf73dbca8a1f60c136c4f7572c7f43e7be1bae7042012dcf6e/contract';
import endContract from '../../snapshots/576ef895842a97bf73dbca8a1f60c136c4f7572c7f43e7be1bae7042012dcf6e/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/e6e66efc3e73f56c695d5942213965be1fadebe925924b5784aa53e26113cac9/contract';
import startContract from '../../snapshots/e6e66efc3e73f56c695d5942213965be1fadebe925924b5784aa53e26113cac9/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'User',
        columns: [
          col('email', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('passwordHash', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addUnique({
        schema: 'public',
        table: 'User',
        constraint: 'User_email_key',
        columns: ['email'],
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
