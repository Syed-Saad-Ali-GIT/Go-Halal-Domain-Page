export const PRODUCT_CATEGORIES = [
  "vegan",
  "vegetarian",
  "gluten-free",
  "lactose-free",
  "nut-free",
  "pescatarian",
  "pork-free",
  "shellfish-free",
  "soy-free",
  "tree-nut-free",
  "wheat-free",
  "kosher",
  "peanut-free",
  "egg-free",
  "fresh produce",
  "dairy",
  "meat & poultry",
  "seafood",
  "bakery",
  "beverages",
  "snacks",
  "frozen foods",
  "canned goods",
  "condiments & sauces",
  "pasta & rice",
  "cereals & breakfast foods",
  "spices & seasonings",
  "baking supplies",
  "health & wellness",
  "organic & natural foods",
  "international foods",
];

export const RESTAURANT_CATEGORIES = [
  "italian",
  "chinese",
  "japanese",
  "mexican",
  "american",
  "indian",
  "thai",
  "french",
  "mediterranean",
  "greek",
  "spanish",
  "vietnamese",
  "korean",
  "middle eastern",
  "vegetarian",
  "vegan",
  "seafood",
  "steakhouse",
  "barbecue",
  "fast food",
];

export const NOTIFY_MESSAGE =
  "Thank you for choosing Go Halal! \n\n Before you start using our app, we kindly ask for your support in spreading the word. At Go Halal, our mission is to make it easier for the Muslim community in Australia to find halal food, and we’re continuously adding new features to enhance the experience. \n\n Please help us by sharing our app with others! \n\n Through the App you will see doubtful products, this means our Go Halal AI has detected ingredients which require further checks as they can be halal or haram thus why doubtful! \n Auto-Detected means the product has been scanned by our aritifical intellidence system without human review for now! \n\n Disclaimer: \n\n While we strive to keep our data up to date, some information—especially product details—may become outdated or inaccurate. We recommend using Go Halal as a helpful guide, particularly for products, as they can be more challenging to maintain compared to our restaurant directory, which we keep regularly updated. \n\n We value your feedback! If you have suggestions for new features or notice any data errors, please reach out to us via our social media. Your input helps us improve Go Halal for everyone in the community. \n\nJazakAllah Khair!";
export const MessageComponent = () => {
  return (
    <div>
      {NOTIFY_MESSAGE.split("\n").map((line, index) => (
        <span key={index}>
          {line}
          <br />
        </span>
      ))}
    </div>
  );
};
