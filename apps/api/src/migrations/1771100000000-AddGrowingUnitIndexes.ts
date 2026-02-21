import { MigrationInterface, QueryRunner } from "typeorm";

export class AddGrowingUnitIndexes1771100000000 implements MigrationInterface {
    name = 'AddGrowingUnitIndexes1771100000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX "idx_growing_unit_location_id" ON "growing-units" ("locationId") `);
        await queryRunner.query(`CREATE INDEX "idx_growing_unit_location_not_deleted" ON "growing-units" ("locationId", "deletedAt") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."idx_growing_unit_location_not_deleted"`);
        await queryRunner.query(`DROP INDEX "public"."idx_growing_unit_location_id"`);
    }

}
