'use server';

import { z } from 'zod';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// ─── Zod Server Schemas ───────────────────────────────────────────────────────

const registerServerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const loginServerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type AuthActionResult = {
  success: boolean;
  message?: string;
  user?: {
    id: string;
    name: string | null;
    email: string;
    credits: number;
    tier: string;
  };
};

// ─── 1. Register Server Action ────────────────────────────────────────────────

export async function registerUserAction(formData: {
  name: string;
  email: string;
  password: string;
}): Promise<AuthActionResult> {
  try {
    // 1. Validate on Server
    const parsed = registerServerSchema.safeParse(formData);
    if (!parsed.success) {
      return {
        success: false,
        message: parsed.error.issues[0]?.message || 'Invalid form data',
      };
    }

    const { name, email, password } = parsed.data;
    const normalizedEmail = email.toLowerCase().trim();

    // 2. Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return {
        success: false,
        message: 'An account with this email already exists. Please sign in instead.',
      };
    }

    // 3. Hash Password securely with bcrypt (10 rounds)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create User in PostgreSQL with 3 free recommendation credits
    const newUser = await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        password: hashedPassword,
        subscriptionTier: 'FREE',
        recommendationCredits: 3,
      },
    });

    console.log(`✅ Successfully registered user in DB: ${newUser.email}`);

    return {
      success: true,
      message: 'Account created successfully! You received 3 free AI recommendation credits.',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        credits: newUser.recommendationCredits,
        tier: newUser.subscriptionTier,
      },
    };
  } catch (error) {
    console.error('❌ Server registration error:', error);
    return {
      success: false,
      message: 'Something went wrong on the server. Please try again.',
    };
  }
}

// ─── 2. Login Server Action ───────────────────────────────────────────────────

export async function loginUserAction(formData: {
  email: string;
  password: string;
}): Promise<AuthActionResult> {
  try {
    // 1. Validate on Server
    const parsed = loginServerSchema.safeParse(formData);
    if (!parsed.success) {
      return {
        success: false,
        message: parsed.error.issues[0]?.message || 'Invalid form data',
      };
    }

    const { email, password } = parsed.data;
    const normalizedEmail = email.toLowerCase().trim();

    // 2. Find User in DB
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user || !user.password) {
      return {
        success: false,
        message: 'Invalid email or password. Please check your credentials.',
      };
    }

    // 3. Verify Password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return {
        success: false,
        message: 'Invalid email or password. Please check your credentials.',
      };
    }

    console.log(`✅ User logged in successfully: ${user.email}`);

    return {
      success: true,
      message: 'Signed in successfully!',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        credits: user.recommendationCredits,
        tier: user.subscriptionTier,
      },
    };
  } catch (error) {
    console.error('❌ Server login error:', error);
    return {
      success: false,
      message: 'Something went wrong on the server. Please try again.',
    };
  }
}
