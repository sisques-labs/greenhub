import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1770751542948 implements MigrationInterface {
    name = 'InitialMigration1770751542948'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "userName" character varying, "name" character varying, "lastName" character varying, "bio" text, "avatarUrl" character varying, "role" "public"."users_role_enum" NOT NULL, "status" "public"."users_status_enum" NOT NULL, CONSTRAINT "UQ_226bb9aa7aa8a69991209d58f59" UNIQUE ("userName"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_226bb9aa7aa8a69991209d58f5" ON "users" ("userName") `);
        await queryRunner.query(`CREATE TABLE "saga_steps" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "sagaInstanceId" character varying NOT NULL, "name" character varying NOT NULL, "order" integer NOT NULL, "status" "public"."saga_steps_status_enum" NOT NULL, "startDate" TIMESTAMP, "endDate" TIMESTAMP, "errorMessage" text, "retryCount" integer NOT NULL DEFAULT '0', "maxRetries" integer NOT NULL DEFAULT '0', "payload" jsonb, "result" jsonb, CONSTRAINT "PK_18232eb771bd51ccd4d3c92b280" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_532bfee37ee41d96127f39e15b" ON "saga_steps" ("sagaInstanceId") `);
        await queryRunner.query(`CREATE TABLE "saga_logs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "sagaInstanceId" character varying NOT NULL, "sagaStepId" character varying NOT NULL, "type" "public"."saga_logs_type_enum" NOT NULL, "message" text NOT NULL, CONSTRAINT "PK_d2c26c6b2452792cc3fc8d9415f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_032ac8999dd3be873f6caf9959" ON "saga_logs" ("sagaStepId") `);
        await queryRunner.query(`CREATE INDEX "IDX_ce2c78d554693e0a0d50449015" ON "saga_logs" ("sagaInstanceId") `);
        await queryRunner.query(`CREATE TABLE "saga_instances" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "name" character varying NOT NULL, "status" "public"."saga_instances_status_enum" NOT NULL, "startDate" TIMESTAMP, "endDate" TIMESTAMP, CONSTRAINT "PK_b1c24390ded9dcc236ada7b882f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_d00916e0ec4cebbf142bd14411" ON "saga_instances" ("name") `);
        await queryRunner.query(`CREATE TABLE "growing-units" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "locationId" uuid NOT NULL, "name" character varying NOT NULL, "type" "public"."growing-units_type_enum" NOT NULL, "capacity" integer NOT NULL, "length" double precision, "width" double precision, "height" double precision, "unit" "public"."growing-units_unit_enum", CONSTRAINT "PK_4e04037c9c66d147953e6386d58" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "plants" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "growingUnitId" uuid NOT NULL, "name" character varying NOT NULL, "species" character varying NOT NULL, "plantedDate" date, "notes" text, "status" "public"."plants_status_enum" NOT NULL, CONSTRAINT "PK_7056d6b283b48ee2bb0e53bee60" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_70e1d326b3b4d23516e303f1f7" ON "plants" ("growingUnitId") `);
        await queryRunner.query(`CREATE TABLE "auths" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "userId" character varying NOT NULL, "provider" "public"."auths_provider_enum" NOT NULL, "providerId" character varying, "email" character varying, "phoneNumber" character varying, "password" character varying, "emailVerified" boolean NOT NULL DEFAULT false, "twoFactorEnabled" boolean NOT NULL DEFAULT false, "lastLoginAt" TIMESTAMP, CONSTRAINT "PK_22fc0631a651972ddc9c5a31090" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_3e65bf4e56bde80b7b5e5b9e13" ON "auths" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_a28e912dc6bde5945582f2be0a" ON "auths" ("email") `);
        await queryRunner.query(`CREATE TABLE "locations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "name" character varying NOT NULL, "type" "public"."locations_type_enum" NOT NULL, "description" character varying, CONSTRAINT "PK_7cc1c9e3853b94816c094825e74" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_2627bb0624a973aa66aefa101e" ON "locations" ("type") `);
        await queryRunner.query(`CREATE INDEX "IDX_227023051ab1fedef7a3b6c7e2" ON "locations" ("name") `);
        await queryRunner.query(`ALTER TABLE "plants" ADD CONSTRAINT "FK_70e1d326b3b4d23516e303f1f71" FOREIGN KEY ("growingUnitId") REFERENCES "growing-units"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "plants" DROP CONSTRAINT "FK_70e1d326b3b4d23516e303f1f71"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_227023051ab1fedef7a3b6c7e2"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2627bb0624a973aa66aefa101e"`);
        await queryRunner.query(`DROP TABLE "locations"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a28e912dc6bde5945582f2be0a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3e65bf4e56bde80b7b5e5b9e13"`);
        await queryRunner.query(`DROP TABLE "auths"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_70e1d326b3b4d23516e303f1f7"`);
        await queryRunner.query(`DROP TABLE "plants"`);
        await queryRunner.query(`DROP TABLE "growing-units"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d00916e0ec4cebbf142bd14411"`);
        await queryRunner.query(`DROP TABLE "saga_instances"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ce2c78d554693e0a0d50449015"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_032ac8999dd3be873f6caf9959"`);
        await queryRunner.query(`DROP TABLE "saga_logs"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_532bfee37ee41d96127f39e15b"`);
        await queryRunner.query(`DROP TABLE "saga_steps"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_226bb9aa7aa8a69991209d58f5"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
