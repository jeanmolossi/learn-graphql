import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export default class createComments1598801774393 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'comments',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isNullable: false,
            isGenerated: true,
          },
          {
            name: 'text',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'post_id',
            type: 'number',
            isNullable: true,
          },
          {
            name: 'author_id',
            type: 'number',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIME',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIME',
          },
        ],
        foreignKeys: [
          new TableForeignKey({
            name: 'postComment',
            columnNames: ['post_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'posts',
          }),
          new TableForeignKey({
            name: 'commentAuthor',
            columnNames: ['author_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
          }),
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('comments');
  }
}
