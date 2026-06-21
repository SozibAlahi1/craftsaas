<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Receipt #{{ $order->order_number }}</title>
    <style>
        body { font-family: 'Courier New', Courier, monospace; color: #000; line-height: 1.3; font-size: 14px; margin: 0; padding: 0; width: 80mm; }
        .container { padding: 10px; }
        h1 { font-size: 20px; margin: 5px 0; text-align: center; }
        .subtitle { font-size: 12px; margin-bottom: 15px; text-align: center; }
        .divider { border-top: 1px dashed #000; margin: 10px 0; }
        .text-left { text-align: left; }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .flex { display: flex; justify-content: space-between; }
        .mb-2 { margin-bottom: 10px; }
        .bold { font-weight: bold; }
        table { width: 100%; border-collapse: collapse; margin: 10px 0; font-size: 13px; }
        th { border-bottom: 1px dashed #000; padding-bottom: 5px; text-align: right; }
        th:first-child { text-align: left; }
        td { padding: 5px 0; vertical-align: top; }
        td.item-col { text-align: left; }
        td.qty-col { text-align: center; width: 15%; }
        td.price-col { text-align: right; width: 25%; }
        .item-options { font-size: 11px; margin-top: 2px; }
        .totals-container { width: 100%; display: flex; flex-direction: column; align-items: flex-end; margin-top: 10px; }
        .total-row { display: flex; justify-content: space-between; width: 60%; font-size: 14px; margin-bottom: 4px; }
        .grand-total { font-weight: bold; font-size: 16px; margin-top: 5px; border-top: 1px dashed #000; padding-top: 5px; }
        .footer { font-size: 12px; margin-top: 25px; margin-bottom: 20px; text-align: center; }
        
        @media print {
            body { width: 80mm; margin: 0; padding: 0; }
            @page { margin: 0; }
        }
    </style>
</head>
<body onload="window.print()">
    <div class="container">
        <h1>{{ config('app.name', 'Wild Tannery') }}</h1>
        <div class="subtitle">Premium Leather Goods</div>
        
        <div class="divider"></div>
        
        <div class="flex mb-2">
            <div class="text-left">
                <div class="bold">Order: #{{ $order->order_number }}</div>
                <div>Date: {{ $order->created_at->format('d/m/Y H:i') }}</div>
            </div>
            <div class="text-right bold">
                {{ ucwords(str_replace('_', ' ', $order->payment_method)) }}
            </div>
        </div>
        
        <div class="divider"></div>
        
        <div class="text-left mb-2">
            <div class="bold" style="font-size: 15px;">{{ $order->full_name }}</div>
            <div>Phone: {{ $order->phone }}</div>
            <div>{{ $order->address }}</div>
        </div>
        
        <div class="divider"></div>
        
        <table>
            <thead>
                <tr>
                    <th>Item</th>
                    <th class="text-center">Qty</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                @foreach($order->items as $item)
                <tr>
                    <td class="item-col">
                        <div class="bold">{{ $item->name }}</div>
                        @if($item->options && is_array($item->options))
                            <div class="item-options">
                                @foreach($item->options as $key => $val)
                                    @if($key !== 'image' && $val)
                                        {{ $key }}:{{ $val }} 
                                    @endif
                                @endforeach
                            </div>
                        @endif
                        <div style="font-size: 11px;">@ {{ $item->price }}</div>
                    </td>
                    <td class="qty-col">{{ $item->quantity }}</td>
                    <td class="price-col">{{ $item->price * $item->quantity }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
        
        <div class="divider"></div>
        
        <div class="totals-container">
            <div class="total-row">
                <span>Subtotal:</span>
                <span>{{ $order->subtotal }}</span>
            </div>
            <div class="total-row">
                <span>Shipping:</span>
                <span>{{ $order->shipping }}</span>
            </div>
            <div class="total-row grand-total">
                <span>Total:</span>
                <span>{{ $order->total }}</span>
            </div>
        </div>
        
        <div class="divider" style="margin-top: 15px;"></div>
        
        <div class="footer">
            <div class="bold" style="font-size: 14px; margin-bottom: 5px;">Thank you!</div>
            <div>Please visit us again</div>
        </div>
    </div>
</body>
</html>
