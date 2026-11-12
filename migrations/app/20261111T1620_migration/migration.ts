#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/576ef895842a97bf73dbca8a1f60c136c4f7572c7f43e7be1bae7042012dcf6e/contract';
import startContract from '../../snapshots/576ef895842a97bf73dbca8a1f60c136c4f7572c7f43e7be1bae7042012dcf6e/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/aa14a01aeeae8cc40cc105573b7d69ccf135dcae61947b2ab2419c157b53e61a/contract';
import endContract from '../../snapshots/aa14a01aeeae8cc40cc105573b7d69ccf135dcae61947b2ab2419c157b53e61a/contract.json' with { type: 'json' };
import { Migration, MigrationCLI } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addRequiredColumnToEmptyTable({
        schema: 'public',
        table: 'Post',
        column: 'userId',
        type: 'int4',
      }),
      this.createIndex({
        schema: 'public',
        table: 'Post',
        index: 'Post_userId_idx_a489d58a',
        columns: ['userId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Post',
        foreignKey: {
          name: 'Post_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'User', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
