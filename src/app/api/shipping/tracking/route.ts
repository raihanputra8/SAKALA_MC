import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const waybillId = searchParams.get('waybill_id');
    const courier = searchParams.get('courier') || 'jne';

    if (!waybillId || waybillId.trim().length < 4) {
      return NextResponse.json(
        { success: false, error: 'Nomor resi (waybill ID) tidak valid.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.BITESHIP_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'Layanan pelacakan resi belum terkonfigurasi.',
      }, { status: 503 });
    }

    const biteshipRes = await fetch(
      `https://api.biteship.com/v1/trackings/${encodeURIComponent(waybillId.trim())}?courier=${encodeURIComponent(courier.trim().toLowerCase())}`,
      {
        headers: {
          'Authorization': apiKey,
        },
        cache: 'no-store',
      }
    );

    const data = await biteshipRes.json();

    if (!biteshipRes.ok || !data.success) {
      return NextResponse.json({
        success: false,
        error: data.error || 'Resi belum terdaftar pada sistem kurir atau sedang diproses.',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      tracking: {
        waybill_id: data.waybill_id,
        courier: data.courier,
        status: data.status,
        history: data.history || [],
        origin: data.origin,
        destination: data.destination,
      },
    });
  } catch (err: unknown) {
    console.error('Shipping tracking handler error:', err);
    return NextResponse.json({
      success: false,
      error: 'Gagal menghubungi server pelacakan resi.',
    }, { status: 500 });
  }
}
