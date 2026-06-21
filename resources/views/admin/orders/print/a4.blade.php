<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice #{{ $order->order_number }}</title>
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; line-height: 1.5; font-size: 14px; margin: 0; padding: 40px; }
        .container { max-width: 800px; margin: 0 auto; }
        .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 2px solid #eee; }
        .logo { font-size: 24px; font-weight: bold; margin: 0; color: #000; }
        .invoice-details { text-align: right; }
        .invoice-details h2 { margin: 0 0 5px 0; font-size: 24px; color: #555; }
        .invoice-details p { margin: 2px 0; color: #777; }
        .addresses { display: flex; justify-content: space-between; margin-bottom: 40px; }
        .address-box { width: 48%; }
        .address-box h3 { font-size: 14px; text-transform: uppercase; color: #888; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
        .address-box p { margin: 3px 0; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        th { text-align: left; padding: 12px; background-color: #f9f9f9; color: #555; border-bottom: 2px solid #ddd; font-size: 13px; text-transform: uppercase; }
        td { padding: 12px; border-bottom: 1px solid #eee; }
        .text-right { text-align: right; }
        .totals { width: 50%; float: right; }
        .total-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
        .total-row.grand-total { font-weight: bold; font-size: 18px; border-bottom: none; border-top: 2px solid #ddd; padding-top: 12px; margin-top: 5px; }
        .footer { clear: both; margin-top: 50px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #777; font-size: 12px; }
        
        @media print {
            body { padding: 0; }
            .container { width: 100%; max-width: none; }
        }
    </style>
</head>
<body onload="window.print()">
    <div class="container">
        <div class="header">
            <div>
                <h1 class="logo">{{ config('app.name', 'Wild Tannery') }}</h1>
                <p>Premium Leather Goods</p>
            </div>
            <div class="invoice-details">
                <h2>INVOICE</h2>
                <p><strong>Order #:</strong> {{ $order->order_number }}</p>
                <p><strong>Date:</strong> {{ $order->created_at->format('M d, Y') }}</p>
                <p><strong>Payment:</strong> {{ ucwords(str_replace('_', ' ', $order->payment_method)) }}</p>
            </div>
        </div>

        <div class="addresses">
            <div class="address-box">
                <h3>Bill/Ship To</h3>
                <p><strong>{{ $order->full_name }}</strong></p>
                <p>{{ $order->phone }}</p>
                <p>{{ nl2br(e($order->address)) }}</p>
            </div>
        </div>

        <table>
            <thead>
                <tr>
                    <th>Item Description</th>
                    <th class="text-right">Qty</th>
                    <th class="text-right">Price</th>
                    <th class="text-right">Total</th>
                </tr>
            </thead>
            <tbody>
                @foreach($order->items as $item)
                <tr>
                    <td>
                        <strong>{{ $item->name }}</strong>
                        @if($item->options && is_array($item->options))
                            <div style="font-size: 12px; color: #777; margin-top: 4px;">
                                @foreach($item->options as $key => $val)
                                    @if($key !== 'image' && $val)
                                        {{ $key }}: {{ $val }}@if(!$loop->last), @endif
                                    @endif
                                @endforeach
                            </div>
                        @endif
                    </td>
                    <td class="text-right">{{ $item->quantity }}</td>
                    <td class="text-right">৳{{ number_format($item->price) }}</td>
                    <td class="text-right">৳{{ number_format($item->price * $item->quantity) }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>

        <div class="totals">
            <div class="total-row">
                <span>Subtotal</span>
                <span>৳{{ number_format($order->subtotal) }}</span>
            </div>
            <div class="total-row">
                <span>Shipping</span>
                <span>৳{{ number_format($order->shipping) }}</span>
            </div>
            <div class="total-row grand-total">
                <span>Total</span>
                <span>৳{{ number_format($order->total) }}</span>
            </div>
        </div>

        <div class="footer">
            <p>Thank you for shopping with {{ config('app.name', 'Wild Tannery') }}!</p>
            <p>If you have any questions about this invoice, please contact our support.</p>
        </div>
    </div>
</body>
</html>
