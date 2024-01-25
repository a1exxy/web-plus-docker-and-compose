import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { WishesModule } from "./wishes/wishes.module";
import { OffersModule } from "./offers/offers.module";
import { WishlistsModule } from "./wishlists/wishlists.module";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { User } from "./users/entities/user.entity";
import { Offer } from "./offers/entities/offer.entity";
import { Wish } from "./wishes/entities/wish.entity";
import { Wishlist } from "./wishlists/entities/wishlist.entity";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      // schema: process.env.DB_SCHEMA,
      // entities: ["src/**/entities/*.entity{.ts,.js}"],
      entities: [User, Offer, Wish, Wishlist],
      // migrations: ["src/database/migrations/*.ts"],
      synchronize: !(process.env.NODE_ENV === "production"),
    }),
    AuthModule,
    UsersModule,
    WishesModule,
    WishlistsModule,
    OffersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
