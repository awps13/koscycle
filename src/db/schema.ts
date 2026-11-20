import { relations, sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

/* ------------------------------------------------------------------ */
/* Better Auth tables (user, session, account, verification)          */
/* ------------------------------------------------------------------ */

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  // Field tambahan KosCycle
  campus: text("campus"),
  whatsapp: text("whatsapp"),
  ktmUrl: text("ktm_url"),
  ktmVerified: boolean("ktm_verified").notNull().default(false),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (t) => [index("session_user_idx").on(t.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [index("account_user_idx").on(t.userId)],
);

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

/* ------------------------------------------------------------------ */
/* KosCycle tables                                                    */
/* ------------------------------------------------------------------ */

export const listingTypeEnum = pgEnum("listing_type", ["jual", "barter", "hibah"]);
export const listingStatusEnum = pgEnum("listing_status", ["aktif", "dipesan", "terjual"]);
export const conditionEnum = pgEnum("item_condition", ["seperti_baru", "baik", "layak"]);

export type ListingImage = { url: string; publicId?: string };

export const listing = pgTable(
  "listing",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    sellerId: text("seller_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description").notNull(),
    category: text("category").notNull(),
    campus: text("campus").notNull(),
    area: text("area"),
    type: listingTypeEnum("type").notNull(),
    price: integer("price"),
    barterWish: text("barter_wish"),
    condition: conditionEnum("condition").notNull().default("baik"),
    images: jsonb("images").$type<ListingImage[]>().notNull().default(sql`'[]'::jsonb`),
    status: listingStatusEnum("status").notNull().default("aktif"),
    soldAt: timestamp("sold_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [
    index("listing_seller_idx").on(t.sellerId),
    index("listing_browse_idx").on(t.status, t.category, t.campus, t.type),
    index("listing_created_idx").on(t.createdAt),
  ],
);

export const favorite = pgTable(
  "favorite",
  {
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    listingId: uuid("listing_id")
      .notNull()
      .references(() => listing.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.listingId] })],
);

export const conversation = pgTable(
  "conversation",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    listingId: uuid("listing_id")
      .notNull()
      .references(() => listing.id, { onDelete: "cascade" }),
    buyerId: text("buyer_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    sellerId: text("seller_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("conversation_listing_buyer_uq").on(t.listingId, t.buyerId),
    index("conversation_buyer_idx").on(t.buyerId),
    index("conversation_seller_idx").on(t.sellerId),
  ],
);

export const message = pgTable(
  "message",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    conversationId: uuid("conversation_id")
      .notNull()
      .references(() => conversation.id, { onDelete: "cascade" }),
    senderId: text("sender_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    body: text("body").notNull(),
    readAt: timestamp("read_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("message_conversation_idx").on(t.conversationId, t.createdAt)],
);

/* ------------------------------------------------------------------ */
/* Relations                                                          */
/* ------------------------------------------------------------------ */

export const userRelations = relations(user, ({ many }) => ({
  listings: many(listing),
  sessions: many(session),
  accounts: many(account),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, { fields: [session.userId], references: [user.id] }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, { fields: [account.userId], references: [user.id] }),
}));

export const listingRelations = relations(listing, ({ one, many }) => ({
  seller: one(user, { fields: [listing.sellerId], references: [user.id] }),
  favorites: many(favorite),
}));

export const favoriteRelations = relations(favorite, ({ one }) => ({
  user: one(user, { fields: [favorite.userId], references: [user.id] }),
  listing: one(listing, { fields: [favorite.listingId], references: [listing.id] }),
}));

export const conversationRelations = relations(conversation, ({ one, many }) => ({
  listing: one(listing, { fields: [conversation.listingId], references: [listing.id] }),
  buyer: one(user, { fields: [conversation.buyerId], references: [user.id], relationName: "buyer" }),
  seller: one(user, { fields: [conversation.sellerId], references: [user.id], relationName: "seller" }),
  messages: many(message),
}));

export const messageRelations = relations(message, ({ one }) => ({
  conversation: one(conversation, {
    fields: [message.conversationId],
    references: [conversation.id],
  }),
  sender: one(user, { fields: [message.senderId], references: [user.id] }),
}));

export type User = typeof user.$inferSelect;
export type Listing = typeof listing.$inferSelect;
export type NewListing = typeof listing.$inferInsert;
export type Message = typeof message.$inferSelect;
