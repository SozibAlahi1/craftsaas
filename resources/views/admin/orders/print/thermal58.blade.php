<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Receipt #{{ $order->order_number }}</title>
    <style>
        body { font-family: 'Courier New', Courier, monospace; color: #000; line-height: 1.2; font-size: 12px; margin: 0; padding: 0; width: 58mm; text-align: center; }
        .container { padding: 5px; }
        h1 { font-size: 16px; margin: 5px 0 2px; }
        .subtitle { font-size: 10px; margin-bottom: 10px; }
        .divider { border-top: 1px dashed #000; margin: 8px 0; }
        .text-left { text-align: left; }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .flex { display: flex; justify-content: space-between; }
        .mb-1 { margin-bottom: 5px; }
        .mb-2 { margin-bottom: 10px; }
        .bold { font-weight: bold; }
        .item-row { display: flex; justify-content: space-between; margin-bottom: 2px; font-size: 11px; }
        .item-name { text-align: left; margin-bottom: 2px; font-size: 11px; font-weight: bold; }
        .item-details { text-align: left; font-size: 10px; margin-bottom: 5px; color: #333; padding-left: 5px; }
        .total-row { display: flex; justify-content: space-between; margin-top: 3px; font-size: 12px; }
        .grand-total { font-weight: bold; font-size: 14px; margin-top: 5px; border-top: 1px dashed #000; padding-top: 5px; }
        .footer { font-size: 10px; margin-top: 15px; margin-bottom: 20px; }
        
        @media print {
            body { width: 58mm; margin: 0; padding: 0; }
            @page { margin: 0; }
        }
    </style>
</head>
<body onload="window.print()">
    <div class="container">
        <h1>{{ config('app.name', 'Wild Tannery') }}</h1>
        <div class="subtitle">Premium Leather Goods</div>
        
        <div class="divider"></div>
        
        <div class="text-left mb-1">
            <div>Order: <span class="bold">#{{ $order->order_number }}</span></div>
            <div>Date: {{ $order->created_at->format('d/m/Y H:i') }}</div>
        </div>
        
        <div class="divider"></div>
        
        <div class="text-left mb-2">
            <div class="bold">{{ $order->full_name }}</div>
            <div>{{ $order->phone }}</div>
            <div>{{ $order->address }}</div>
        </div>
        
        <div class="divider"></div>
        
        @foreach($order->items as $item)
            <div class="item-name">{{ $item->name }}</div>
            @if($item->options && is_array($item->options))
                <div class="item-details">
                    @foreach($item->options as $key => $val)
                        @if($key !== 'image' && $val)
                            {{ $key }}:{{ $val }} 
                        @endif
                    @endforeach
                </div>
            @endif
            <div class="item-row mb-1">
                <span>{{ $item->quantity }} x {{ $item->price }}</span>
                <span>{{ $item->price * $item->quantity }}</span>
            </div>
        @endforeach
        
        <div class="divider"></div>
        
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
        
        <div class="text-center mt-2 bold" style="margin-top: 10px;">
            {{ ucwords(str_replace('_', ' ', $order->payment_method)) }}
        </div>
        
        <div class="divider"></div>
        
        <div class="footer">
            <div>Thank you!</div>
            <div>Please visit us again</div>
        </div>
    </div>
</body>
</html>
