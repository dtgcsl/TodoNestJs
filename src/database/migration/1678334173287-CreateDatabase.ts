import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDatabase1678334173287 implements MigrationInterface {
    name = 'CreateDatabase1678334173287'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Todo"."todo" ("todoId" SERIAL NOT NULL, "name" character varying NOT NULL, "createAt" TIME WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::time with time zone, "updateAt" TIMESTAMP DEFAULT now(), "createdById" character varying, CONSTRAINT "PK_32c10cf78b9d9301f7ea34e48af" PRIMARY KEY ("todoId"))`);
        await queryRunner.query(`CREATE TABLE "Todo"."usersHasTodos" ("id" SERIAL NOT NULL, "todoId" integer NOT NULL, "uid" integer NOT NULL, CONSTRAINT "PK_0a302a3d7f9985af84453bd05a8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Todo"."users" ("uid" SERIAL NOT NULL, "name" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "PK_6e20ce1edf0678a09f1963f9587" PRIMARY KEY ("uid"))`);
        await queryRunner.query(`CREATE TABLE "Todo"."role" ("rid" SERIAL NOT NULL, "name" character varying, "uid" integer NOT NULL, CONSTRAINT "PK_29005ebc89204fef850a815e5f5" PRIMARY KEY ("rid"))`);
        await queryRunner.query(`CREATE TABLE "Todo"."rolesHasPermissions" ("id" SERIAL NOT NULL, "rid" integer NOT NULL, "permissionId" integer NOT NULL, CONSTRAINT "PK_63f8104b9dcc87fe240f60c044a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Todo"."permission" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_3b8b97af9d9d8807e41e6f48362" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "Todo"."usersHasTodos" ADD CONSTRAINT "FK_9d7216c10b67298b17acfd4afd3" FOREIGN KEY ("uid") REFERENCES "Todo"."users"("uid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Todo"."usersHasTodos" ADD CONSTRAINT "FK_e897f76d815a96e75b53b7bfcd4" FOREIGN KEY ("todoId") REFERENCES "Todo"."todo"("todoId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Todo"."role" ADD CONSTRAINT "FK_914a4da5bf2e66f917f4737908a" FOREIGN KEY ("uid") REFERENCES "Todo"."users"("uid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Todo"."rolesHasPermissions" ADD CONSTRAINT "FK_5cd87b5c9495984ec3924cbc6a7" FOREIGN KEY ("rid") REFERENCES "Todo"."role"("rid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Todo"."rolesHasPermissions" ADD CONSTRAINT "FK_32e898605fc5dd71212f3d00a89" FOREIGN KEY ("permissionId") REFERENCES "Todo"."permission"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Todo"."rolesHasPermissions" DROP CONSTRAINT "FK_32e898605fc5dd71212f3d00a89"`);
        await queryRunner.query(`ALTER TABLE "Todo"."rolesHasPermissions" DROP CONSTRAINT "FK_5cd87b5c9495984ec3924cbc6a7"`);
        await queryRunner.query(`ALTER TABLE "Todo"."role" DROP CONSTRAINT "FK_914a4da5bf2e66f917f4737908a"`);
        await queryRunner.query(`ALTER TABLE "Todo"."usersHasTodos" DROP CONSTRAINT "FK_e897f76d815a96e75b53b7bfcd4"`);
        await queryRunner.query(`ALTER TABLE "Todo"."usersHasTodos" DROP CONSTRAINT "FK_9d7216c10b67298b17acfd4afd3"`);
        await queryRunner.query(`DROP TABLE "Todo"."permission"`);
        await queryRunner.query(`DROP TABLE "Todo"."rolesHasPermissions"`);
        await queryRunner.query(`DROP TABLE "Todo"."role"`);
        await queryRunner.query(`DROP TABLE "Todo"."users"`);
        await queryRunner.query(`DROP TABLE "Todo"."usersHasTodos"`);
        await queryRunner.query(`DROP TABLE "Todo"."todo"`);
    }

}
