import 'dotenv/config';
import { db } from './index';
import { categories, posts, postsToCategories } from './schema';

async function main() {
  console.log('Seeding database...');
  const insertedCategories = await Promise.all([
    db.insert(categories).values({ name: 'General', slug: 'general', description: 'General topics' }).onConflictDoNothing().returning(),
    db.insert(categories).values({ name: 'Tech', slug: 'tech', description: 'Technology and programming' }).onConflictDoNothing().returning(),
    db.insert(categories).values({ name: 'Life', slug: 'life', description: 'Life and productivity' }).onConflictDoNothing().returning(),
  ]);

  const flatCats = insertedCategories.flat().filter(Boolean);
  const general = flatCats.find((c) => c.slug === 'general');
  const tech = flatCats.find((c) => c.slug === 'tech');

  const [hello] = await db
    .insert(posts)
    .values({ title: 'Hello World', slug: 'hello-world', content: 'This is **markdown** content.', published: true })
    .onConflictDoNothing()
    .returning();

  if (hello && general) {
    await db.insert(postsToCategories).values({ postId: hello.id, categoryId: general.id }).onConflictDoNothing();
  }
  if (hello && tech) {
    await db.insert(postsToCategories).values({ postId: hello.id, categoryId: tech.id }).onConflictDoNothing();
  }

  console.log('Seed completed.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
