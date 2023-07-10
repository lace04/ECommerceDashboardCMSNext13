import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function PATCH(
  request: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await request.json();
    const { name } = body;

    if (!userId) return new NextResponse('unauthorized', { status: 401 });

    if (!name) return new NextResponse('name is required', { status: 400 });

    if (!params.storeId)
      return new NextResponse('storeId is required', { status: 400 });

    const store = await prismadb.store.updateMany({
      where: {
        id: params.storeId,
        userId,
      },
      data: {
        name,
      },
    });

    // return new NextResponse(JSON.stringify(store), { status: 200 });
    return NextResponse.json(store, { status: 200 });
  } catch (error) {
    console.log('[STORE_PATCH]', error);
    return new NextResponse('internal error', { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) return new NextResponse('unauthorized', { status: 401 });

    if (!params.storeId)
      return new NextResponse('storeId is required', { status: 400 });

    const store = await prismadb.store.deleteMany({
      where: {
        id: params.storeId,
        userId,
      },
    });

    // return new NextResponse(JSON.stringify(store), { status: 200 });
    return NextResponse.json(store, { status: 200 });
  } catch (error) {
    console.log('[STORE_DELETE]', error);
    return new NextResponse('internal error', { status: 500 });
  }
}
