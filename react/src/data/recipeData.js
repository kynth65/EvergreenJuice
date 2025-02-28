// recipeData.js
import calamansi from "../assets/calamansi-juice.png";
import mango from "../assets/mango-juice.png";
import coconut from "../assets/coconut-juice.png";
import banana from "../assets/banana-juice.png";
import lemon from "../assets/lemon-juice.png";
import sweet_potato from "../assets/sweet-potato-juice.png";
// Placeholder images for those without dedicated assets
import papaya from "../assets/calamansi-juice.png"; 
import cucumber from "../assets/calamansi-juice.png";

// Complete recipe data for all juices
const recipeData = {
  lemon: {
    id: "LJ1",
    name: "Lemon Juice",
    price: 45,
    image: lemon,
    path: "/recipe/lemon",
    ingredients: [
      "4-5 fresh lemons",
      "4-5 cups of cold water",
      "1/4 to 1/2 cup of sugar or honey (to taste)",
      "Ice cubes",
      "Mint leaves for garnish (optional)",
      "Lemon slices for garnish (optional)"
    ],
    steps: [
      "Wash the lemons thoroughly under running water to remove any dirt or wax.",
      "Cut the lemons in half and squeeze out the juice using a citrus juicer or by hand. Aim to get approximately 1 cup of lemon juice.",
      "Pour the lemon juice into a pitcher through a strainer to remove seeds and pulp.",
      "Add cold water to the pitcher with the lemon juice.",
      "Add sugar or honey and stir until completely dissolved. Start with less sweetener and adjust to taste.",
      "Refrigerate for at least 30 minutes to chill.",
      "Serve over ice cubes with lemon slices and mint leaves as garnish if desired."
    ],
    tips: [
      "For extra flavor, add some lemon zest to the juice.",
      "Roll the lemons on a hard surface while applying pressure before cutting to help extract more juice.",
      "For a twist, add a little bit of ginger or a splash of sparkling water.",
      "Store in the refrigerator for up to 5-7 days in a sealed container."
    ],
    nutritionFacts: {
      "Calories": "45-60 kcal",
      "Sugar": "11-15g",
      "Vitamin C": "30-40% DV",
      "Potassium": "2-3% DV",
      "Carbs": "12-16g",
      "Fiber": "0g"
    }
  },
  
  calamansi: {
    id: "CJ1",
    name: "Calamansi Juice",
    price: 45,
    image: calamansi,
    path: "/recipe/calamansi",
    ingredients: [
      "15-20 calamansi fruits",
      "4 cups of cold water",
      "1/3 cup of sugar or honey (adjust to taste)",
      "Ice cubes",
      "Calamansi slices for garnish (optional)"
    ],
    steps: [
      "Wash the calamansi fruits thoroughly under running water.",
      "Cut each calamansi in half and squeeze out the juice into a bowl. You can use a citrus juicer or squeeze by hand.",
      "Strain the juice to remove seeds and pulp.",
      "In a pitcher, combine the calamansi juice, cold water, and sugar or honey.",
      "Stir well until the sweetener is completely dissolved.",
      "Taste and adjust sweetness if needed.",
      "Refrigerate for at least 1 hour to chill.",
      "Serve over ice with calamansi slices as garnish if desired."
    ],
    tips: [
      "For a more intense flavor, you can add some calamansi zest to the juice.",
      "If the juice is too sour, add more sweetener or dilute with more water.",
      "For a twist, add a pinch of salt to enhance the flavor.",
      "Calamansi juice oxidizes quickly, so it's best consumed fresh."
    ],
    nutritionFacts: {
      "Calories": "35-45 kcal",
      "Sugar": "8-10g",
      "Vitamin C": "100% DV",
      "Potassium": "2% DV",
      "Carbs": "10-12g",
      "Fiber": "0g"
    }
  },
  
  coconut: {
    id: "CN1",
    name: "Coconut Juice",
    price: 55,
    image: coconut,
    path: "/recipe/coconut",
    ingredients: [
      "1 young coconut",
      "Ice cubes",
      "1 tablespoon honey or sugar (optional)",
      "A splash of lime juice (optional)",
      "Coconut flesh for garnish"
    ],
    steps: [
      "Choose a young coconut that feels heavy and has water sloshing inside when shaken.",
      "Carefully cut open the top of the coconut using a sharp knife or cleaver. Make a flat cut first, then use controlled force to open the coconut.",
      "Pour the coconut water into a glass or pitcher.",
      "Using a spoon, scrape out some of the soft coconut flesh from inside.",
      "Strain the coconut water if you want to remove any bits of coconut husk or shell.",
      "Add sweetener if desired and stir until dissolved.",
      "Add ice cubes to chill the drink.",
      "Garnish with pieces of coconut flesh and serve immediately."
    ],
    tips: [
      "For the most refreshing taste, serve coconut juice immediately after opening the coconut.",
      "If you find it difficult to open a coconut, you can use a coconut opening tool.",
      "Refrigerate the coconut before serving for an extra cold drink.",
      "The younger the coconut, the sweeter and more delicate the flavor will be."
    ],
    nutritionFacts: {
      "Calories": "45-60 kcal",
      "Sugar": "6-8g",
      "Potassium": "10% DV",
      "Magnesium": "4% DV",
      "Sodium": "6% DV",
      "Carbs": "9-11g"
    }
  },
  
  papaya: {
    id: "PJ1",
    name: "Papaya Juice",
    price: 50,
    image: papaya,
    path: "/recipe/papaya",
    ingredients: [
      "1 ripe papaya, medium-sized",
      "1 cup cold water or milk",
      "2 tablespoons honey or sugar",
      "1/2 teaspoon vanilla extract (optional)",
      "1/4 teaspoon cinnamon (optional)",
      "Ice cubes",
      "Mint leaves for garnish"
    ],
    steps: [
      "Cut the papaya in half and remove the seeds.",
      "Scoop out the flesh and cut into cubes.",
      "Place the papaya cubes in a blender.",
      "Add water or milk, sweetener, vanilla extract, and cinnamon if using.",
      "Blend until smooth and creamy.",
      "Taste and adjust sweetness if needed.",
      "Pour into glasses over ice cubes.",
      "Garnish with mint leaves and serve immediately."
    ],
    tips: [
      "Choose a papaya that gives slightly to pressure and has a sweet aroma at the stem end.",
      "For a colder drink, freeze the papaya chunks before blending.",
      "Add a squeeze of lime juice to enhance the flavor.",
      "For a creamier version, use coconut milk instead of water.",
      "If your papaya isn't very ripe, add more sweetener."
    ],
    nutritionFacts: {
      "Calories": "80-100 kcal",
      "Sugar": "15-18g",
      "Vitamin C": "150% DV",
      "Vitamin A": "30% DV",
      "Fiber": "3g",
      "Potassium": "8% DV"
    }
  },
  
  cucumber: {
    id: "CU1",
    name: "Cucumber Juice",
    price: 45,
    image: cucumber,
    path: "/recipe/cucumber",
    ingredients: [
      "2 large cucumbers",
      "1 lemon or lime, juiced",
      "1 tablespoon honey or sugar",
      "1/4 cup fresh mint leaves",
      "2 cups cold water",
      "Ice cubes",
      "Cucumber and lemon slices for garnish"
    ],
    steps: [
      "Wash cucumbers thoroughly and peel if desired (peeling is optional and depends on personal preference).",
      "Cut cucumbers into chunks and add to a blender.",
      "Add lemon juice, sweetener, mint leaves, and water to the blender.",
      "Blend until smooth.",
      "Strain the mixture through a fine-mesh sieve or cheesecloth to remove pulp for a smoother drink (optional).",
      "Taste and adjust sweetness or acidity if needed.",
      "Refrigerate for at least 30 minutes to chill.",
      "Serve over ice with cucumber and lemon slices as garnish."
    ],
    tips: [
      "Use cold water and refrigerate the juice for the most refreshing taste.",
      "English cucumbers (also called seedless or hothouse cucumbers) work best as they have fewer seeds.",
      "If you prefer a sweeter drink, add more honey or sugar.",
      "For a twist, add a small piece of peeled ginger to the blender.",
      "Cucumber juice is best consumed the same day it's made."
    ],
    nutritionFacts: {
      "Calories": "30-40 kcal",
      "Sugar": "6-8g",
      "Vitamin K": "20% DV",
      "Vitamin C": "10% DV",
      "Potassium": "5% DV",
      "Water": "95%"
    }
  },
  
  mango: {
    id: "MS1",
    name: "Mango Shake",
    price: 65,
    image: mango,
    path: "/recipe/mango",
    ingredients: [
      "2 ripe mangoes",
      "1 cup milk (dairy or plant-based)",
      "1/2 cup yogurt (optional, for creamier texture)",
      "2 tablespoons honey or sugar (adjust to taste)",
      "1/2 teaspoon cardamom powder (optional)",
      "1 cup ice cubes",
      "Mango chunks and mint for garnish"
    ],
    steps: [
      "Peel the mangoes and cut the flesh away from the pit.",
      "Cut the mango flesh into chunks.",
      "Add mango chunks, milk, yogurt, sweetener, and cardamom (if using) to a blender.",
      "Blend until smooth and creamy.",
      "Add ice cubes and blend again until the shake is cold and frothy.",
      "Taste and adjust sweetness if needed.",
      "Pour into glasses and garnish with mango chunks and mint leaves.",
      "Serve immediately."
    ],
    tips: [
      "Use ripe, sweet mangoes for the best flavor. The mango should give slightly to gentle pressure and have a sweet aroma.",
      "Freeze mango chunks ahead of time for an extra cold and thick shake.",
      "For a dairy-free version, use coconut milk and skip the yogurt.",
      "Add a banana for extra creaminess and natural sweetness.",
      "A pinch of saffron or a splash of rose water makes for a luxurious variation."
    ],
    nutritionFacts: {
      "Calories": "180-220 kcal",
      "Sugar": "25-30g",
      "Protein": "4-6g",
      "Fat": "2-4g",
      "Vitamin C": "60% DV",
      "Vitamin A": "25% DV"
    }
  },
  
  banana: {
    id: "BS1",
    name: "Banana Shake",
    price: 60,
    image: banana,
    path: "/recipe/banana",
    ingredients: [
      "2 ripe bananas",
      "1 cup milk (dairy or plant-based)",
      "1/2 cup Greek yogurt (optional)",
      "1 tablespoon honey or maple syrup",
      "1/4 teaspoon vanilla extract",
      "1/4 teaspoon cinnamon (optional)",
      "1 cup ice cubes",
      "Banana slices and cinnamon for garnish"
    ],
    steps: [
      "Peel the bananas and cut them into chunks.",
      "Add banana chunks, milk, yogurt, sweetener, vanilla extract, and cinnamon to a blender.",
      "Blend until smooth and creamy.",
      "Add ice cubes and blend again until cold and frothy.",
      "Taste and adjust sweetness if needed.",
      "Pour into glasses and garnish with banana slices and a sprinkle of cinnamon.",
      "Serve immediately."
    ],
    tips: [
      "Use very ripe bananas with brown spots for maximum sweetness and flavor.",
      "Freeze banana chunks ahead of time for an extra thick and cold shake.",
      "For a breakfast smoothie version, add a tablespoon of peanut butter and a handful of oats.",
      "Add a few chocolate chips or cocoa powder for a chocolate-banana variation.",
      "For a tropical twist, add a splash of coconut milk or a few chunks of pineapple."
    ],
    nutritionFacts: {
      "Calories": "160-200 kcal",
      "Sugar": "18-22g",
      "Protein": "5-7g",
      "Fat": "2-4g",
      "Potassium": "15% DV",
      "Vitamin B6": "20% DV"
    }
  },
  
  "sweet-potato": {
    id: "SP1",
    name: "Sweet Potato Milk Tea",
    price: 75,
    image: sweet_potato,
    path: "/recipe/sweet-potato",
    ingredients: [
      "1 medium sweet potato",
      "2 cups milk (dairy or plant-based)",
      "2 black tea bags (or 2 tablespoons loose leaf tea)",
      "3 tablespoons brown sugar or honey",
      "1/2 teaspoon vanilla extract",
      "1/4 teaspoon cinnamon",
      "1/8 teaspoon nutmeg",
      "Tapioca pearls (boba) - prepared according to package instructions (optional)",
      "Ice cubes",
      "Whipped cream for topping (optional)"
    ],
    steps: [
      "Wash, peel, and cut the sweet potato into 1-inch cubes.",
      "Place sweet potato cubes in a pot and cover with water. Bring to a boil and cook until very soft, about 15 minutes.",
      "Drain the sweet potato and let it cool slightly.",
      "In another pot, bring 1 cup of water to a boil and steep the tea bags for 5 minutes. Remove tea bags.",
      "In a blender, combine cooked sweet potato, brewed tea, milk, sugar, vanilla, cinnamon, and nutmeg.",
      "Blend until completely smooth and creamy.",
      "Strain the mixture through a fine-mesh sieve for an extra smooth texture (optional).",
      "Chill in the refrigerator for at least 2 hours.",
      "If using boba, prepare according to package instructions and place in serving glasses.",
      "Pour the sweet potato milk tea over the boba and ice.",
      "Top with whipped cream if desired and serve with a wide straw for the boba."
    ],
    tips: [
      "Orange-fleshed sweet potatoes work best for this recipe as they are sweeter and more fragrant.",
      "For a stronger tea flavor, use more tea bags or steep longer.",
      "You can roast the sweet potato instead of boiling for a more caramelized flavor.",
      "For a vegan version, use plant-based milk and skip the whipped cream.",
      "You can make the sweet potato mixture ahead of time and store it in the refrigerator for up to 3 days."
    ],
    nutritionFacts: {
      "Calories": "200-250 kcal",
      "Sugar": "20-25g",
      "Protein": "6-8g",
      "Fat": "4-6g",
      "Vitamin A": "120% DV",
      "Fiber": "3-4g"
    }
  }
};

// Create an array of all menu items
export const menuItems = Object.values(recipeData).map(item => ({
  id: item.id,
  name: item.name,
  price: item.price,
  image: item.image,
  path: item.path
}));

export default recipeData;