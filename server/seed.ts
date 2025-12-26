/**
 * Seed script to populate the database with sample data
 * OPERATION GHOST TOWN: Populating feed for Launch Social Proof
 */
import { db } from './storage.js';
import { users, posts, follows, stories, comments } from '../shared/schema.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { sql } from 'drizzle-orm';

async function seed() {
  console.log('🌱 Seeding database for VIP Launch (Operation Ghost Town)...');
  
  try {
    // CLEANUP: Reset DB to ensure fresh "Launch Day" state
    console.log('🧹 Cleaning up old data...');
    // Delete in order to avoid foreign key constraints
    await db.delete(comments);
    await db.delete(stories);
    await db.delete(follows);
    await db.delete(posts);
    await db.delete(users);

    const hashedPassword = await bcrypt.hash('demo123', 10);
    
    // 1. CREATE USERS (The Squad)
    const demoUsers = [
      {
        id: crypto.randomUUID(),
        username: 'team_zyeute',
        email: 'team@zyeute.qc.ca',
        displayName: "L'Équipe Zyeuté",
        bio: 'Compte officiel de Zyeuté. On surveille tout! 👀',
        avatarUrl: 'https://images.unsplash.com/photo-1579547621869-0ddb29f36e11?w=400',
        region: 'montreal' as const,
        isVerified: true,
      },
      {
        id: crypto.randomUUID(),
        username: 'julie_mtl',
        email: 'julie@zyeute.qc.ca',
        displayName: 'Julie Coté',
        bio: 'Maman de 2 tannants. Fan de vin et de déco. 🍷✨',
        avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
        region: 'montreal' as const,
        isVerified: false,
      },
      {
        id: crypto.randomUUID(),
        username: 'patrice_outdoors',
        email: 'patrice@zyeute.qc.ca',
        displayName: 'Patrice Lemieux',
        bio: 'Chasse, pêche, chalet. Le bois c\'est la vie. 🌲🦌',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
        region: 'quebec' as const,
        isVerified: false,
      },
      {
        id: crypto.randomUUID(),
        username: 'catlover_qc',
        email: 'cats@zyeute.qc.ca',
        displayName: 'Sophie & Moustache',
        bio: 'Mes chats sont mes patrons. 🐱🐈‍⬛',
        avatarUrl: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=400',
        region: 'laval' as const,
        isVerified: false,
      },
      {
        id: crypto.randomUUID(),
        username: 'demo',
        email: 'demo@zyeute.ca',
        password: hashedPassword,
        displayName: 'Demo User',
        bio: 'Compte demo pour tester Zyeuté',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
        region: 'montreal' as const,
        isVerified: false,
      },
    ];
    
    const createdUsers = await db.insert(users).values(demoUsers).returning();
    console.log(`✅ Created ${createdUsers.length} users (The Squad is here)`);
    
    const teamUser = createdUsers.find(u => u.username === 'team_zyeute')!;
    const julie = createdUsers.find(u => u.username === 'julie_mtl')!;
    const patrice = createdUsers.find(u => u.username === 'patrice_outdoors')!;
    const sophie = createdUsers.find(u => u.username === 'catlover_qc')!;

    // 2. CREATE POSTS (Content Fill)
    // We explicitly set createdAt to ensure order. Launch post is NEWEST.
    
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const twoHoursAgo = new Date(now.getTime() - 120 * 60 * 1000);
    const threeHoursAgo = new Date(now.getTime() - 180 * 60 * 1000);

    const samplePosts = [
      // THE LAUNCH POST (Top of feed)
      {
        id: crypto.randomUUID(),
        userId: teamUser.id,
        type: 'photo',
        mediaUrl: 'https://images.unsplash.com/photo-1549603091-a621c9777f99?w=800', // Fireworks
        content: "🚨 ALERTE LANCEMENT! On donne 3 mois VIP aux 100 premiers! Taggue un ami qui a besoin de voir ça! 👇 #Zyeute #Quebec #VIP",
        caption: "🚨 ALERTE LANCEMENT! On donne 3 mois VIP aux 100 premiers! Taggue un ami qui a besoin de voir ça! 👇 #Zyeute #Quebec #VIP",
        hashtags: ['Zyeute', 'Quebec', 'Lancement'],
        region: 'montreal' as const,
        visibility: 'public' as const,
        fireCount: 842,
        createdAt: now,
      },
      
      // JULIE'S POSTS
      {
        id: crypto.randomUUID(),
        userId: julie.id,
        type: 'photo',
        mediaUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800', // Wine
        content: "Petit verre de rouge pour fêter le réveillon! 🍷 Joyeux Noël tout le monde! #vino #noel",
        caption: "Petit verre de rouge pour fêter le réveillon! 🍷 Joyeux Noël tout le monde! #vino #noel",
        region: 'montreal' as const,
        fireCount: 45,
        createdAt: oneHourAgo,
      },
      {
        id: crypto.randomUUID(),
        userId: julie.id,
        type: 'photo',
        mediaUrl: 'https://images.unsplash.com/photo-1544965850-6f8a627a8c8f?w=800', // Decor
        content: "Ma table est prête! 🎄✨ J'espère que vous passez du bon temps en famille.",
        caption: "Ma table est prête! 🎄✨ J'espère que vous passez du bon temps en famille.",
        region: 'montreal' as const,
        fireCount: 32,
        createdAt: threeHoursAgo,
      },

      // PATRICE'S POSTS
      {
        id: crypto.randomUUID(),
        userId: patrice.id,
        type: 'photo',
        mediaUrl: 'https://images.unsplash.com/photo-1517175956041-3315629c1d09?w=800', // Winter walk
        content: "Petite marche digestive dans le clos. Y fait frette mais c'est beau! ❄️🚶‍♂️",
        caption: "Petite marche digestive dans le clos. Y fait frette mais c'est beau! ❄️🚶‍♂️",
        region: 'quebec' as const,
        fireCount: 67,
        createdAt: oneHourAgo,
      },
      {
        id: crypto.randomUUID(),
        userId: patrice.id,
        type: 'photo',
        mediaUrl: 'https://images.unsplash.com/photo-1518737003272-da77977784e7?w=800', // Dog in snow
        content: "Rocky aime la neige plus que moi je pense 😂🐶",
        caption: "Rocky aime la neige plus que moi je pense 😂🐶",
        region: 'quebec' as const,
        fireCount: 124,
        createdAt: twoHoursAgo,
      },

      // SOPHIE'S POSTS
      {
        id: crypto.randomUUID(),
        userId: sophie.id,
        type: 'photo',
        mediaUrl: 'https://images.unsplash.com/photo-1577215933066-886915f7957e?w=800', // Cat in tree
        content: "Moustache a encore essayé de grimper dans le sapin... 🤦‍♀️😼 #NoelDesChats",
        caption: "Moustache a encore essayé de grimper dans le sapin... 🤦‍♀️😼 #NoelDesChats",
        region: 'laval' as const,
        fireCount: 89,
        createdAt: oneHourAgo,
      },
      {
        id: crypto.randomUUID(),
        userId: sophie.id,
        type: 'photo',
        mediaUrl: 'https://images.unsplash.com/photo-1499636138143-bd630f5cf386?w=800', // Cookies
        content: "Biscuits pour le Père Noël (et pour moi) 🍪🥛",
        caption: "Biscuits pour le Père Noël (et pour moi) 🍪🥛",
        region: 'laval' as const,
        fireCount: 56,
        createdAt: threeHoursAgo,
      }
    ];
    
    // @ts-ignore - manual timestamp override
    const createdPosts = await db.insert(posts).values(samplePosts).returning();
    console.log(`✅ Created ${createdPosts.length} posts (Ghost Town populated!)`);

    // 3. CREATE COMMENTS (Social Proof on Launch Post)
    const launchPost = createdPosts.find(p => p.userId === teamUser.id);
    
    if (launchPost) {
      const socialProofComments = [
        {
          postId: launchPost.id,
          userId: julie.id,
          content: "Yessir! J'ai eu mon VIP! 🎉 Merci l'équipe!",
        },
        {
          postId: launchPost.id,
          userId: patrice.id,
          content: "Ça commence fort! Joyeux Noël la gang 🎄",
        },
        {
          postId: launchPost.id,
          userId: sophie.id,
          content: "Trop hâte de tester ça! 😻 C'est tiguidou!",
        },
        {
          postId: launchPost.id,
          userId: createdUsers.find(u => u.username === 'demo')!.id,
          content: "Let's gooo! 🔥",
        }
      ];

      await db.insert(comments).values(socialProofComments);
      console.log(`✅ Added ${socialProofComments.length} hype comments to the launch post`);
    }

    // 4. FOLLOWS
    // Everyone follows Team Zyeuté
    const followsData = createdUsers
      .filter(u => u.id !== teamUser.id)
      .map(u => ({
        followerId: u.id,
        followingId: teamUser.id,
      }));
    await db.insert(follows).values(followsData);
    console.log(`✅ Everyone is following Team Zyeuté`);

    console.log('\n🎉 OPERATION GHOST TOWN COMPLETE!');
    console.log('   The feed is alive. The hype is real.');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  }
}

seed()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
