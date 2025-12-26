/**
 * Centralized API Service for Zyeuté (Supabase Native)
 * Replaces Express backend calls with direct Supabase SDK interactions
 */

import { logger } from '@/lib/logger';
import type { Post, User, Story } from '@/types';
import { supabase } from '@/lib/supabase';

const apiLogger = logger.withContext('API');

// ============ AUTH FUNCTIONS ============
// Most Auth is handled directly by AuthContext/useAuth via supabase.auth
// These helpers remain for legacy compatibility or specific utility needs

export async function getCurrentUser(): Promise<User | null> {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;
  // Fetch full profile
  return getUserProfile(user.id);
}

export async function login(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signup(email: string, password: string, username: string, fullName?: string) {
  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username, full_name: fullName }
    }
  });
}

export async function logout(): Promise<boolean> {
  const { error } = await supabase.auth.signOut();
  return !error;
}

// ============ USER FUNCTIONS ============

export async function getUserProfile(usernameOrId: string): Promise<User | null> {
  let query = supabase.from('user_profiles').select('*');
  
  // Determine if input is UUID or Username
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(usernameOrId);
  
  if (isUuid || usernameOrId === 'me') {
      const id = usernameOrId === 'me' ? (await supabase.auth.getUser()).data.user?.id : usernameOrId;
      if(!id) return null;
      query = query.eq('id', id);
  } else {
      query = query.eq('username', usernameOrId);
  }

  const { data, error } = await query.single();
  
  if (error || !data) {
     apiLogger.warn('Profile fetch failed', error);
     return null;
  }
  return mapBackendUser(data);
}

export async function updateProfile(updates: Partial<User>): Promise<User | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const dbUpdates = {
    display_name: updates.display_name,
    bio: updates.bio,
    avatar_url: updates.avatar_url,
    region: updates.region,
    updated_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from('user_profiles')
    .update(dbUpdates)
    .eq('id', user.id)
    .select()
    .single();

  if (error || !data) return null;
  return mapBackendUser(data);
}

// ============ POSTS FUNCTIONS ============

export async function getFeedPosts(page: number = 0, limit: number = 20): Promise<Post[]> {
  const from = page * limit;
  const to = from + limit - 1;

  // Fetch Public Posts + Posts from Followed Users (Requires complex RLS or View)
  // For V1 RLS: We fetch 'public' visibility posts.
  const { data, error } = await supabase
    .from('publications')
    .select('*, user:user_profiles(*)')
    .eq('visibilite', 'public')
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    apiLogger.warn('Feed fetch failed', error);
    return [];
  }
  return (data || []).map(mapBackendPost);
}

export async function getExplorePosts(page: number = 0, limit: number = 20): Promise<Post[]> {
  // Logic allows showing trending or random high-quality posts
   const from = page * limit;
   const to = from + limit - 1;

   const { data, error } = await supabase
    .from('publications')
    .select('*, user:user_profiles(*)')
    .eq('visibilite', 'public')
    .gt('reactions_count', 0) // Simple 'trending' filter
    .order('reactions_count', { ascending: false })
    .range(from, to);

  if (error) return [];
  return (data || []).map(mapBackendPost);
}

export async function getPostById(postId: string): Promise<Post | null> {
  const { data, error } = await supabase
    .from('publications')
    .select('*, user:user_profiles(*)')
    .eq('id', postId)
    .single();

  if (error || !data) return null;
  return mapBackendPost(data);
}

export async function getUserPosts(userId: string): Promise<Post[]> {
  const { data, error } = await supabase
    .from('publications')
    .select('*, user:user_profiles(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) return [];
  return (data || []).map(mapBackendPost);
}

export async function createPost(postData: any): Promise<Post | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if(!user) return null;

    const { data, error } = await supabase
        .from('publications')
        .insert({
            user_id: user.id,
            media_url: postData.mediaUrl,
            caption: postData.caption,
            visibilite: postData.visibility || 'public',
            region_id: postData.region,
            content: 'Media upload', // Required field
            created_at: new Date().toISOString()
        })
        .select('*, user:user_profiles(*)')
        .single();

    if (error || !data) {
        apiLogger.error("Create Post Failed", error);
        return null;
    }
    return mapBackendPost(data);
}

export async function deletePost(postId: string): Promise<boolean> {
  const { error } = await supabase.from('publications').delete().eq('id', postId);
  return !error;
}

export async function getStories(userId?: string): Promise<Array<{ user: User; story?: Story; isViewed?: boolean }>> {
    // TODO: Implement actual stories logic when table exists.
    // For now return empty array or mock if needed.
    // If table 'stories' exists:
    /*
    const { data } = await supabase.from('stories').select('*, user:user_profiles(*)').gt('expires_at', new Date().toISOString());
    return (data || []).map(s => ({
        user: mapBackendUser(s.user),
        story: s,
        isViewed: false
    }));
    */
    return [];
}

// ============ REACTIONS & COMMENTS ============

export async function togglePostFire(postId: string): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if(!user) return false;

    // Check if exists
    const { data: existing } = await supabase
        .from('reactions')
        .select('id')
        .eq('publication_id', postId)
        .eq('user_id', user.id)
        .single();

    if (existing) {
        const { error } = await supabase.from('reactions').delete().eq('id', existing.id);
        return !error;
    } else {
        const { error } = await supabase.from('reactions').insert({
            publication_id: postId,
            user_id: user.id,
            type: 'fire'
        });
        return !error;
    }
}

export async function checkFollowing(followerId: string, followingId: string): Promise<boolean> {
    const { data, error } = await supabase
        .from('follows')
        .select('*')
        .eq('follower_id', followerId)
        .eq('following_id', followingId)
        .single();
    
    return !!data && !error;
}

export async function toggleFollow(followerId: string, followingId: string, isFollowing: boolean): Promise<boolean> {
    if (isFollowing) {
        const { error } = await supabase
            .from('follows')
            .delete()
            .eq('follower_id', followerId)
            .eq('following_id', followingId);
        return !error;
    } else {
        const { error } = await supabase
            .from('follows')
            .insert({
                follower_id: followerId,
                following_id: followingId
            });
        return !error;
    }
}

export async function getPostComments(postId: string): Promise<any[]> {
    const { data, error } = await supabase
        .from('commentaires')
        .select('*, user:user_profiles(*)')
        .eq('publication_id', postId)
        .order('created_at', { ascending: true });
    
    if(error) return [];
    return data || [];
}

export async function addComment(postId: string, content: string): Promise<any | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if(!user) return null;

    const { data, error } = await supabase
        .from('commentaires')
        .insert({
            publication_id: postId,
            user_id: user.id,
            content: content
        })
        .select('*, user:user_profiles(*)')
        .single();

    if(error) return null;
    return data;
}

// ============ AI FUNCTIONS (EDGE FUNCTIONS) ============

export async function generateImage(prompt: string, aspectRatio: string = "1:1"): Promise<{ imageUrl: string; prompt: string } | null> {
    try {
        const result = await import('./mediaAgent').then(m => m.mediaAgent.generateCinematicMedia({
            prompt,
            aspectRatio: aspectRatio as any,
            style: 'cinematic'
        }));
        
        return {
            imageUrl: result.url,
            prompt: prompt
        };
    } catch (error) {
        apiLogger.error('AI Generation Failed via MediaAgent', error);
        return null;
    }
}

// ============ MAPPERS (Adapting DB Columns to Frontend Types) ============
function mapBackendUser(u: any): User {
    if (!u) return u;
    return {
        id: u.id,
        username: u.username,
        display_name: u.display_name || u.displayName,
        avatar_url: u.avatar_url || u.avatarUrl,
        bio: u.bio,
        is_verified: u.is_verified || false,
        created_at: u.created_at,
        // ... map other fields
    } as User;
}

function mapBackendPost(p: any): Post {
    if (!p) return p;
    return {
        id: p.id,
        user_id: p.user_id,
        media_url: p.media_url || p.mediaUrl || p.original_url,
        caption: p.caption,
        fire_count: p.reactions_count || 0,
        comment_count: p.comments_count || 0,
        user: p.user ? mapBackendUser(p.user) : undefined,
        created_at: p.created_at,
        type: 'photo' // Default
    } as Post;
}
