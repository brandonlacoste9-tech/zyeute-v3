import 'dotenv/config';
import { db } from './server/storage';
import { posts, users } from './shared/schema';
import { eq } from 'drizzle-orm';

async function check() {
  console.log('Checking database tables...');
  try {
    const result = await db
      .select({
        count: posts.id
      })
      .from(posts)
      .limit(1);
    console.log('✅ select from posts (publications) successful');
    console.log('Result:', result);
  } catch (error: any) {
    console.error('❌ select from posts (publications) failed:', error.message);
  }

  try {
    const userResult = await db
      .select({
        id: users.id
      })
      .from(users)
      .limit(1);
    console.log('✅ select from users (user_profiles) successful');
    console.log('Result:', userResult);
  } catch (error: any) {
    console.error('❌ select from users (user_profiles) failed:', error.message);
  }
}

check().catch(console.error);
