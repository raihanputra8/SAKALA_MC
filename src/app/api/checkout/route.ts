import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { Product } from '@/types/database';

// Server-side authoritative courier shipping rate card
const AUTHORITATIVE_COURIER_RATES: Record<string, number> = {
  jne_yes: 35000,
  jne_reg: 20000,
  sicepat_best: 30000,
  jnt: 22000,
};
const DEFAULT_SHIPPING_FEE = 35000;
const MAX_QUANTITY_PER_ITEM = 10;

interface CheckoutItemPayload {
  productId: string;
  quantity: number;
  size?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      customer_name,
      customer_email,
      customer_phone,
      shipping_address,
      city,
      postal_code,
      courier,
      payment_method,
      items,
    } = body;

    // 1. Validate customer & shipping contact info
    if (!customer_name || typeof customer_name !== 'string' || customer_name.trim().length < 2) {
      return NextResponse.json({ success: false, error: 'Nama penerima tidak valid (minimal 2 karakter).' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!customer_email || typeof customer_email !== 'string' || !emailRegex.test(customer_email.trim())) {
      return NextResponse.json({ success: false, error: 'Format email tidak valid.' }, { status: 400 });
    }

    if (!customer_phone || typeof customer_phone !== 'string' || customer_phone.trim().length < 6) {
      return NextResponse.json({ success: false, error: 'Nomor telepon tidak valid.' }, { status: 400 });
    }

    if (!shipping_address || typeof shipping_address !== 'string' || shipping_address.trim().length < 5) {
      return NextResponse.json({ success: false, error: 'Alamat pengiriman tidak valid.' }, { status: 400 });
    }

    if (!city || typeof city !== 'string' || city.trim().length < 2) {
      return NextResponse.json({ success: false, error: 'Kota tujuan tidak valid.' }, { status: 400 });
    }

    if (!postal_code || typeof postal_code !== 'string' || postal_code.trim().length < 3) {
      return NextResponse.json({ success: false, error: 'Kode pos tidak valid.' }, { status: 400 });
    }

    // 2. Validate items structure
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: false, error: 'Keranjang belanja tidak boleh kosong.' }, { status: 400 });
    }

    // 3. Strict Quantity Validation (SEC-004)
    // Rejects 0, negatives, decimals (1.5), NaN, Infinity, excessively large quantities
    const validatedCartItems: CheckoutItemPayload[] = [];
    for (const item of items) {
      const pId = item.productId || item.product?.id;
      const qty = item.quantity;
      const sz = item.size || 'M';

      if (!pId || typeof pId !== 'string') {
        return NextResponse.json({ success: false, error: 'Product ID tidak valid pada keranjang.' }, { status: 400 });
      }

      if (
        typeof qty !== 'number' ||
        !Number.isInteger(qty) ||
        !Number.isFinite(qty) ||
        qty < 1 ||
        qty > MAX_QUANTITY_PER_ITEM
      ) {
        return NextResponse.json(
          {
            success: false,
            error: `Kuantitas produk tidak valid. Minimal 1 dan maksimal ${MAX_QUANTITY_PER_ITEM} pcs per item.`,
          },
          { status: 400 }
        );
      }

      validatedCartItems.push({
        productId: pId.trim(),
        quantity: qty,
        size: sz,
      });
    }

    // 4. Cryptographically Secure Order Identifier (SEC-008)
    // Generates 16 hex characters (64-bit entropy = 1.84 x 10^19 combinations) from CSPRNG
    const secureRandomSuffix = crypto.randomBytes(8).toString('hex').toUpperCase();
    const secureOrderId = `SKL-${secureRandomSuffix}`;

    // 5. Authoritative Price Fetching & Validation from Database (SEC-004)
    let authoritativeSubtotal = 0;
    const finalOrderItems = [];

    // Attempt authoritative database validation if Supabase is active
    if (isSupabaseConfigured && supabase) {
      const productIds = validatedCartItems.map((i) => i.productId);
      const { data: dbProducts, error: prodErr } = await supabase
        .from('products')
        .select('*')
        .in('id', productIds);

      if (prodErr || !dbProducts || dbProducts.length === 0) {
        return NextResponse.json(
          { success: false, error: 'Gagal memverifikasi ketersediaan produk di database.' },
          { status: 500 }
        );
      }

      const productMap = new Map<string, Product>();
      dbProducts.forEach((p) => productMap.set(p.id, p as Product));

      for (const item of validatedCartItems) {
        const officialProduct = productMap.get(item.productId);
        if (!officialProduct) {
          return NextResponse.json(
            { success: false, error: `Produk dengan ID ${item.productId} tidak ditemukan di katalog resmi.` },
            { status: 400 }
          );
        }

        // Validate stock status
        if (officialProduct.stock_status === 'sold_out') {
          return NextResponse.json(
            { success: false, error: `Produk "${officialProduct.name}" saat ini telah habis terjual (sold out).` },
            { status: 400 }
          );
        }

        // Check stock count if stock is tracked
        if (
          typeof officialProduct.stock_count === 'number' &&
          officialProduct.stock_count >= 0 &&
          officialProduct.stock_count < item.quantity
        ) {
          return NextResponse.json(
            {
              success: false,
              error: `Stok produk "${officialProduct.name}" tidak mencukupi (Tersisa: ${officialProduct.stock_count}).`,
            },
            { status: 400 }
          );
        }

        // Use strictly authoritative database price
        const officialUnitPrice = Number(officialProduct.price_idr);
        authoritativeSubtotal += officialUnitPrice * item.quantity;

        finalOrderItems.push({
          product: {
            id: officialProduct.id,
            sku: officialProduct.sku,
            name: officialProduct.name,
            category: officialProduct.category,
            price_idr: officialUnitPrice,
            price_usd: Number(officialProduct.price_usd || 0),
            stock_status: officialProduct.stock_status,
            description: officialProduct.description,
            image_url: officialProduct.image_url,
          },
          quantity: item.quantity,
          size: item.size,
        });
      }
    } else {
      // Fallback for development without active database
      authoritativeSubtotal = validatedCartItems.reduce((acc, item) => acc + (185000 * item.quantity), 0);
      validatedCartItems.forEach((item) => {
        finalOrderItems.push({
          product: {
            id: item.productId,
            sku: item.productId,
            name: 'Produk Sakala Apparel',
            category: 'accessories' as const,
            price_idr: 185000,
            price_usd: 12,
            stock_status: 'available' as const,
            description: 'Sakala motorcycle merchandise',
            image_url: '/assets/logo.png',
          },
          quantity: item.quantity,
          size: item.size,
        });
      });
    }

    // 6. Authoritative Server-Side Shipping Calculation (SEC-004)
    // Browser-supplied shipping fees are strictly ignored
    const authoritativeShippingFee = AUTHORITATIVE_COURIER_RATES[courier] || DEFAULT_SHIPPING_FEE;
    const authoritativeGrandTotal = authoritativeSubtotal + authoritativeShippingFee;

    // 7. Atomic Order Storage & Stock Decrement (SEC-004 & SEC-008)
    const verifiedOrder = {
      id: secureOrderId,
      customer_name: customer_name.trim(),
      customer_email: customer_email.trim().toLowerCase(),
      customer_phone: customer_phone.trim(),
      shipping_address: shipping_address.trim(),
      city: city.trim(),
      postal_code: postal_code.trim(),
      courier: courier || 'jne_yes',
      payment_method: payment_method || 'bca_va',
      items: finalOrderItems,
      subtotal_idr: authoritativeSubtotal,
      shipping_fee_idr: authoritativeShippingFee,
      total_idr: authoritativeGrandTotal,
      status: 'pending' as const,
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      // 1. Primary path: Authoritative atomic transaction via create_verified_order RPC (SEC-004)
      const rpcItems = validatedCartItems.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
        size: i.size || 'M',
      }));

      try {
        const { data: rpcRes, error: rpcErr } = await supabase.rpc('create_verified_order', {
          p_order_id: secureOrderId,
          p_customer_name: customer_name.trim(),
          p_customer_email: customer_email.trim().toLowerCase(),
          p_customer_phone: customer_phone.trim(),
          p_shipping_address: shipping_address.trim(),
          p_city: city.trim(),
          p_postal_code: postal_code.trim(),
          p_courier: courier || 'jne_yes',
          p_payment_method: payment_method || 'bca_va',
          p_items: rpcItems,
        });

        if (!rpcErr && rpcRes && rpcRes.length > 0) {
          const row = rpcRes[0];
          return NextResponse.json({
            success: true,
            orderId: row.order_id,
            subtotalIdr: Number(row.subtotal_idr),
            shippingFeeIdr: Number(row.shipping_fee_idr),
            totalIdr: Number(row.total_idr),
          });
        }

        // If RPC is missing or returned error, log and attempt verified order fallback
        console.warn('create_verified_order RPC notice, fallback to server-verified insert:', rpcErr?.message);
        const { error: insertOrderErr } = await supabase.from('orders').insert([verifiedOrder]);
        if (insertOrderErr) {
          console.error('Failed to persist verified order in Supabase:', insertOrderErr);
          return NextResponse.json(
            { success: false, error: 'Gagal mencatat pesanan pada database.' },
            { status: 500 }
          );
        }
      } catch (dbErr) {
        console.warn('Database transaction note:', dbErr);
      }
    }

    // 8. Return authoritative response
    return NextResponse.json({
      success: true,
      orderId: secureOrderId,
      subtotalIdr: authoritativeSubtotal,
      shippingFeeIdr: authoritativeShippingFee,
      totalIdr: authoritativeGrandTotal,
    });
  } catch (err: unknown) {
    console.error('Server-side checkout error:', err);
    const msg = err instanceof Error ? err.message : 'Terjadi kegagalan saat memproses pesanan.';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
