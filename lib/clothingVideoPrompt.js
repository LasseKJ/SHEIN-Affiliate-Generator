const CLOTHING_VIDEO_PROMPT = `
Create a realistic vertical 9:16 fashion video using the uploaded SHEIN clothing product image as the exact product reference.

The uploaded product is the ONLY clothing item that should be promoted.

The final video must show the exact same physical clothing item from the uploaded image.

PRODUCT INFORMATION:

Product name:
{{PRODUCT_NAME}}

Product code:
{{PRODUCT_CODE}}

Price:
{{PRODUCT_PRICE}} {{PRODUCT_CURRENCY}}

IMPORTANT PRODUCT ACCURACY RULES:

Use the uploaded clothing product as the exact visual reference.

Do not redesign the clothing.

Do not change the clothing color.

Do not change the clothing material.

Do not change the clothing pattern.

Do not change the clothing shape.

Do not change the clothing details.

Do not add details to the clothing.

Do not remove details from the clothing.

Do not replace the clothing with another item.

Do not create a different version of the clothing.

The clothing must remain visually identical to the uploaded product.

The product must be clearly visible throughout the video.

VIDEO STYLE:

Realistic AI fashion advertisement.

High quality fashion content.

Natural realistic human model.

Realistic body proportions.

Realistic skin texture.

Realistic clothing physics.

Natural movement.

Natural lighting.

Premium TikTok fashion content.

Autumn inspired atmosphere.

Warm cozy seasonal aesthetic.

Elegant and modern styling.

Vertical 9:16 composition.

No text.

No captions.

No subtitles.

No logos added by the AI.

No watermark.

Do not show additional clothing products.

Do not show other competing products.

SCENE 1:

Start with an attractive autumn fashion scene.

The model is wearing the exact uploaded clothing item.

Use a beautiful realistic autumn environment.

The camera slowly moves toward the model.

The clothing should immediately be visible.

SCENE 2:

Show the model walking naturally.

Use a realistic full body fashion shot.

The camera follows the model smoothly.

The exact clothing item remains clearly visible.

SCENE 3:

Show a closer fashion shot.

Focus on the clothing.

Show the fabric, shape, color and details clearly.

Keep the product identical to the uploaded reference.

SCENE 4:

Show the model naturally interacting with the environment.

Use realistic movement.

Keep the clothing clearly visible.

Maintain the autumn fashion aesthetic.

SCENE 5:

Finish with a beautiful premium fashion shot.

The model is wearing the exact uploaded product.

The clothing remains the main visual focus.

Use natural realistic lighting.

OUTPUT:

9:16 vertical video.

Realistic fashion advertisement.

High quality.

Smooth camera movement.

Natural model movement.

Realistic clothing physics.

The uploaded product must remain the exact same product throughout the entire video.
`;

export function createClothingVideoPrompt(
  product
) {
  return CLOTHING_VIDEO_PROMPT
    .replace(
      "{{PRODUCT_NAME}}",
      product["Product Name"] || ""
    )
    .replace(
      "{{PRODUCT_CODE}}",
      product["Product Code"] || ""
    )
    .replace(
      "{{PRODUCT_PRICE}}",
      product["Price"] || ""
    )
    .replace(
      "{{PRODUCT_CURRENCY}}",
      product["Currency"] || ""
    );
}
