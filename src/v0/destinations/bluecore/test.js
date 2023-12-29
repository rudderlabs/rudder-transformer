const eventProcessor = require('./transform');

const sampleEvent = {
  message: {
    type: 'TRACK',
    event: 'Product Viewed', 
    userId: '27340af5c8819',
    properties: {
      product_id: '622c6f5d5cf86a4c77358033',
      sku: '8472-998-0112',
      category: 'Games',
      name: 'Cones of Dunshire',
      brand: 'Wyatt Games',
      variant: 'exapansion pack',
      price: 49.99,
      quantity: 5,
      coupon: 'PREORDER15',
      currency: 'USD',
      position: 1,
      url: 'https://www.website.com/product/path',
      image_url: 'https://www.website.com/product/path.webp',
    },
  },
  destination: {
   
  },
};

eventProcessor.process(sampleEvent)
  .then(response => {
    console.log('Response:', response);
  })
  .catch(error => {
    console.error('Error:', error);
  });
