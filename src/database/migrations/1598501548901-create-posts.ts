import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export default class createPosts1598501548901 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'posts',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isNullable: false,
            isGenerated: true,
          },
          {
            name: 'title',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'text',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'author',
            type: 'integer',
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
            name: 'postAuthor',
            columnNames: ['author'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
          }),
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('posts');
  }
}
