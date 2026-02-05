import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { PersistenceModule } from "src/infrastructure/persistence/persistence.module";

@Module({
  imports: [PersistenceModule],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}