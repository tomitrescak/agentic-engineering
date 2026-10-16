#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/c2c6958dfbfd505726c7c24a8f8685659b767eb59baadae17990aedc49d61bd4/contract';
import endContract from '../../snapshots/c2c6958dfbfd505726c7c24a8f8685659b767eb59baadae17990aedc49d61bd4/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/ebb8a9e78f22bab48d61fa23c12402fee93b3189ea4f01e8f14b4bf27ce14cde/contract';
import startContract from '../../snapshots/ebb8a9e78f22bab48d61fa23c12402fee93b3189ea4f01e8f14b4bf27ce14cde/contract.json' with { type: 'json' };
import { Migration, MigrationCLI } from '@prisma/orm-sqlite/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addColumn({
        table: 'Post',
        column: {
          name: 'body',
          typeSql: 'TEXT',
          default: { kind: 'literal', value: '' },
          codecRef: { codecId: 'sqlite/text@1' },
          nullable: false,
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
