import { MigrationInterface, QueryRunner } from 'typeorm';

export class PlantSpeciesMigration1771573740948 implements MigrationInterface {
	name = 'PlantSpeciesMigration1771573740948';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TYPE "public"."plant_species_category_enum" AS ENUM('VEGETABLE', 'FRUIT', 'HERB', 'FLOWER', 'TREE', 'SHRUB', 'SUCCULENT', 'FERN', 'GRASS', 'OTHER')`,
		);
		await queryRunner.query(
			`CREATE TYPE "public"."plant_species_difficulty_enum" AS ENUM('EASY', 'MEDIUM', 'HARD')`,
		);
		await queryRunner.query(
			`CREATE TYPE "public"."plant_species_growth_rate_enum" AS ENUM('SLOW', 'MEDIUM', 'FAST')`,
		);
		await queryRunner.query(
			`CREATE TYPE "public"."plant_species_light_requirements_enum" AS ENUM('FULL_SUN', 'PARTIAL_SUN', 'PARTIAL_SHADE', 'FULL_SHADE')`,
		);
		await queryRunner.query(
			`CREATE TYPE "public"."plant_species_water_requirements_enum" AS ENUM('LOW', 'MEDIUM', 'HIGH')`,
		);
		await queryRunner.query(
			`CREATE TYPE "public"."plant_species_humidity_requirements_enum" AS ENUM('LOW', 'MEDIUM', 'HIGH')`,
		);
		await queryRunner.query(
			`CREATE TYPE "public"."plant_species_soil_type_enum" AS ENUM('SANDY', 'LOAMY', 'CLAY', 'PEATY', 'CHALKY')`,
		);
		await queryRunner.query(
			`CREATE TABLE "plant_species" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "commonName" character varying(100) NOT NULL, "scientificName" character varying(150) NOT NULL, "family" character varying(100), "description" text, "category" "public"."plant_species_category_enum" NOT NULL, "difficulty" "public"."plant_species_difficulty_enum" NOT NULL, "growthRate" "public"."plant_species_growth_rate_enum" NOT NULL, "lightRequirements" "public"."plant_species_light_requirements_enum" NOT NULL, "waterRequirements" "public"."plant_species_water_requirements_enum" NOT NULL, "temperatureRange" jsonb, "humidityRequirements" "public"."plant_species_humidity_requirements_enum" NOT NULL, "soilType" "public"."plant_species_soil_type_enum" NOT NULL, "phRange" jsonb, "matureSize" jsonb, "growthTime" integer, "tags" jsonb, "isVerified" boolean NOT NULL DEFAULT false, "contributorId" uuid, CONSTRAINT "UQ_plant_species_scientificName" UNIQUE ("scientificName"), CONSTRAINT "PK_plant_species" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE UNIQUE INDEX "IDX_plant_species_scientificName" ON "plant_species" ("scientificName")`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`DROP INDEX "public"."IDX_plant_species_scientificName"`,
		);
		await queryRunner.query(`DROP TABLE "plant_species"`);
		await queryRunner.query(
			`DROP TYPE "public"."plant_species_soil_type_enum"`,
		);
		await queryRunner.query(
			`DROP TYPE "public"."plant_species_humidity_requirements_enum"`,
		);
		await queryRunner.query(
			`DROP TYPE "public"."plant_species_water_requirements_enum"`,
		);
		await queryRunner.query(
			`DROP TYPE "public"."plant_species_light_requirements_enum"`,
		);
		await queryRunner.query(
			`DROP TYPE "public"."plant_species_growth_rate_enum"`,
		);
		await queryRunner.query(
			`DROP TYPE "public"."plant_species_difficulty_enum"`,
		);
		await queryRunner.query(
			`DROP TYPE "public"."plant_species_category_enum"`,
		);
	}
}
