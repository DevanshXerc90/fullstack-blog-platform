import {
    pgTable,
    serial,
    text,
    varchar,
    boolean,
    timestamp,
    integer,
    primaryKey,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// 1. Posts Table
export const posts = pgTable("posts", {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 256 }).notNull(),
    slug: varchar("slug", { length: 256 }).notNull().unique(),
    content: text("content"),
    published: boolean("published").default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 2. Categories Table
export const categories = pgTable("categories", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }).notNull().unique(),
    slug: varchar("slug", { length: 256 }).notNull().unique(),
    description: text("description"),
});

// 3. Posts to Categories Table (Many-to-Many)
export const postsToCategories = pgTable(
    "posts_to_categories",
    {
        postId: integer("post_id")
            .notNull()
            .references(() => posts.id),
        categoryId: integer("category_id")
            .notNull()
            .references(() => categories.id),
    },
    (t) => ({
        pk: primaryKey({ columns: [t.postId, t.categoryId] }),
    })
);

// --- RELATIONS ---

// A post can have many categories
export const postsRelations = relations(posts, ({ many }) => ({
    postsToCategories: many(postsToCategories),
}));

// A category can have many posts
export const categoriesRelations = relations(categories, ({ many }) => ({
    postsToCategories: many(postsToCategories),
}));

// The join table connects to one post and one category
export const postsToCategoriesRelations = relations(
    postsToCategories,
    ({ one }) => ({
        post: one(posts, {
            fields: [postsToCategories.postId],
            references: [posts.id],
        }),
        category: one(categories, {
            fields: [postsToCategories.categoryId],
            references: [categories.id],
        }),
    })
);

