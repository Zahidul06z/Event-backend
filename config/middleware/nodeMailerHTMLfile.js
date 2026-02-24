function generateOrderEmailHTML(newOrder) {
  const itemRows = Object.values(newOrder.items).map((item,index)  => `
    <div style="display:flex; justify-content:between; align-items:center; background:#f3f4f6; padding:10px; margin:10px 0;">
      <div style="display:flex;">
        <img src="cid:product-image-${index + 1}" alt="image" style="width:60px;" />
        <div style="flex">
          <h4 style="margin:0 0 5px 0;">${item.title}</h4>
          <div style="display:flex; ">
            <span style="font-weight:bold;">৳${item.price} &#215; </span><span style="font-weight:bold;">${item.quantity} &#8758;  </span>  <span style="font-weight:bold;"> ৳${item.total}</span>
          </div>
        </div>
      </div>
      
    </div>
  `).join('');

  return `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;">
    <h2 style="font-weight: 600; font-size: 28px;">Your order successfull</h2>
    <h2 style="font-weight: 600; font-size: 24px;">Thank you for your purchase</h2>
    <h3 style="font-weight: normal; font-size: 18px;">We've received your order. It will ship in 5–7 days.</h3>
    <h3 style="font-weight: 600; font-size: 18px;">Your order number ID: ${newOrder._id}</h3>

    <h2 style="text-transform: capitalize; font-weight: 600; margin-top: 30px;">Order Summary</h2>
    ${itemRows}

    <div style="display:flex; justify-content:space-between; background:#f3f4f6; padding:10px; margin-top:20px;">
      <h4 style="margin:0;">Shipping ${newOrder.shippingCost === 100 ? 'Barisal' : 'Outside Barisal'} : </h4>
      <span style="font-weight:600;">৳${newOrder.shippingCost}</span>
    </div>

    <div style="display:flex; justify-content:space-between; background:#f3f4f6; padding:10px; margin-top:10px; font-size: 20px; font-weight: 600;">
      <h3 style="margin:0;">Total : </h3>
      <span>৳${newOrder.totalAmount}</span>
    </div>

    <h3 style="text-transform: capitalize; font-weight: 600; margin-top: 30px;">Shipping Address</h3>
    <p style="margin:0;">${newOrder.customerName}</p>
    <p style="margin:0;">${newOrder.shippingAddress.delivaryAddress}</p>
    <p style="margin:0;">${newOrder.shippingAddress.city}</p>
    <p style="margin:0;">${newOrder.shippingAddress.postCode}</p>
    <p style="margin:0;">${newOrder.shippingAddress.country}</p>
    <p style="margin:0;">${newOrder.phone}</p>

    <div style="margin-top: 30px;">
      <p style="margin:0; color:#666; font-size: 12px;">Date</p>
      <p style="margin:0; font-weight:600;">${new Date(newOrder.createdAt).toLocaleString()}</p>
    </div>
  </div>
  `;
}

export default generateOrderEmailHTML

// <div style="font-weight:bold;">৳${item.total}</div>