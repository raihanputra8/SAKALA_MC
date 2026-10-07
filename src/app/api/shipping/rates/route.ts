import { NextRequest, NextResponse } from 'next/server';

// Standard Authoritative Rate Card from Bandung origin (Postal Code 40182)
export const FALLBACK_COURIER_RATES = [
  {
    key: 'jne_yes',
    courier: 'jne',
    service: 'YES',
    name: 'JNE YES (Next Day)',
    description: 'Pengiriman kilat 1 hari sampai',
    price: 35000,
    etd: '1 hari',
  },
  {
    key: 'jne_reg',
    courier: 'jne',
    service: 'REG',
    name: 'JNE Reguler',
    description: 'Layanan reguler hemat',
    price: 20000,
    etd: '2 - 3 hari',
  },
  {
    key: 'sicepat_best',
    courier: 'sicepat',
    service: 'BEST',
    name: 'SiCepat BEST',
    description: 'Besok sampai tujuan',
    price: 30000,
    etd: '1 hari',
  },
  {
    key: 'jnt',
    courier: 'jnt',
    service: 'EZ',
    name: 'J&T Express EZ',
    description: 'Reguler ekspres cepat',
    price: 22000,
    etd: '2 - 3 hari',
  },
  {
    key: 'cargo',
    courier: 'jnt_cargo',
    service: 'Cargo',
    name: 'J&T CARGO / Kargo Apparel',
    description: 'Paket kargo jaket/helm & apparel volume besar',
    price: 45000,
    etd: '3 - 5 hari',
  },
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      destination_postal_code = '40182',
      items = [],
    } = body;

    const apiKey = process.env.BITESHIP_API_KEY;

    // If Biteship API key is present, attempt live rate check
    if (apiKey) {
      try {
        const destPostal = Number(destination_postal_code) || 40182;
        const totalItemsCount = Array.isArray(items) && items.length > 0 
          ? items.reduce((acc: number, curr: { quantity?: number }) => acc + (curr.quantity || 1), 0)
          : 1;

        const biteshipRes = await fetch('https://api.biteship.com/v1/rates/couriers', {
          method: 'POST',
          headers: {
            'Authorization': apiKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            origin_postal_code: 40182, // SAKALA Workshop Bandung
            destination_postal_code: destPostal,
            couriers: 'jne,sicepat,jnt',
            items: [
              {
                name: 'SAKALA Apparel & Gear',
                description: 'Official Club Merchandise',
                value: 250000,
                quantity: totalItemsCount,
                weight: Math.max(500, totalItemsCount * 400),
              },
            ],
          }),
          cache: 'no-store',
        });

        const biteshipData = await biteshipRes.json();

        // If Biteship rates are available, map to clean standardized courier options
        if (biteshipRes.ok && biteshipData.success && Array.isArray(biteshipData.pricing) && biteshipData.pricing.length > 0) {
          const liveRates = biteshipData.pricing.map((p: {
            courier_name: string;
            courier_code: string;
            courier_service_name: string;
            courier_service_code: string;
            price: number;
            shipment_duration_range?: string;
            shipment_duration_unit?: string;
            description?: string;
          }) => ({
            key: `${p.courier_code.toLowerCase()}_${p.courier_service_code.toLowerCase()}`,
            courier: p.courier_code,
            service: p.courier_service_name,
            name: `${p.courier_name} ${p.courier_service_name}`,
            description: p.description || `Layanan ${p.courier_name}`,
            price: Number(p.price) || 25000,
            etd: p.shipment_duration_range 
              ? `${p.shipment_duration_range} ${p.shipment_duration_unit || 'hari'}`
              : '1 - 3 hari',
          }));

          return NextResponse.json({
            success: true,
            source: 'biteship_live',
            rates: liveRates,
          });
        }

        // If Biteship returned error (e.g. test balance empty), log and proceed to graceful fallback
        console.warn('Biteship Rates API notice (falling back to standard rate card):', biteshipData.error || biteshipRes.statusText);
      } catch (apiErr) {
        console.warn('Failed to reach Biteship API directly:', apiErr);
      }
    }

    // Graceful fallback to verified standard rate card
    return NextResponse.json({
      success: true,
      source: 'standard_rate_card',
      rates: FALLBACK_COURIER_RATES,
    });
  } catch (err: unknown) {
    console.error('Shipping rates handler error:', err);
    return NextResponse.json({
      success: true,
      source: 'fallback_error',
      rates: FALLBACK_COURIER_RATES,
    });
  }
}
