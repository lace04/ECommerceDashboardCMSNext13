import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { userId } = auth();
    const body = await request.json();

    const { name } = body;

    if (!userId) return new NextResponse('unauthorized', { status: 401 });

    if (!name) return new NextResponse('name is required', { status: 400 });

    const store = await prismadb.store.create({
      data: {
        name,
        userId,
      },
    });
    return new NextResponse(JSON.stringify(store), { status: 201 });
  } catch (error) {
    console.log('[STORES_POST]', error);
    return new NextResponse('internal error', { status: 500 });
  }
}
