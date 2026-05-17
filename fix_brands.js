const mongoose = require('mongoose');
const Brand = require('./model/Brand');

const cosmeticBrands = [
  { old: /logitech/i, newName: "L'Oréal", newEmail: "contact@loreal.com", newWebsite: "loreal.com", newLogo: "/assets/img/product/premium-cosmetic.png" },
  { old: /sony/i, newName: "MAC Cosmetics", newEmail: "contact@maccosmetics.com", newWebsite: "maccosmetics.com", newLogo: "/assets/img/product/premium-cosmetic.png" },
  { old: /samsung/i, newName: "Estée Lauder", newEmail: "contact@esteelauder.com", newWebsite: "esteelauder.com", newLogo: "/assets/img/product/premium-cosmetic.png" },
  { old: /apple/i, newName: "Clinique", newEmail: "contact@clinique.com", newWebsite: "clinique.com", newLogo: "/assets/img/product/premium-cosmetic.png" },
  { old: /deepcool/i, newName: "Maybelline", newEmail: "contact@maybelline.com", newWebsite: "maybelline.com", newLogo: "/assets/img/product/premium-cosmetic.png" },
  { old: /antec/i, newName: "NARS", newEmail: "contact@narscosmetics.com", newWebsite: "narscosmetics.com", newLogo: "/assets/img/product/premium-cosmetic.png" },
  { old: /lenovo/i, newName: "Sephora", newEmail: "contact@sephora.com", newWebsite: "sephora.com", newLogo: "/assets/img/product/premium-cosmetic.png" },
  { old: /legendary whitetails/i, newName: "The Ordinary", newEmail: "contact@theordinary.com", newWebsite: "theordinary.com", newLogo: "/assets/img/product/premium-cosmetic.png" },
  { old: /nike/i, newName: "Fenty Beauty", newEmail: "contact@fentybeauty.com", newWebsite: "fentybeauty.com", newLogo: "/assets/img/product/premium-cosmetic.png" },
  { old: /inika/i, newName: "INIKA Organic", newEmail: "contact@inikaorganic.com", newWebsite: "inikaorganic.com", newLogo: "/assets/img/product/premium-cosmetic.png" },
  { old: /louisvuitton/i, newName: "Dior Beauty", newEmail: "contact@dior.com", newWebsite: "dior.com", newLogo: "/assets/img/product/premium-cosmetic.png" }
];

mongoose.connect('mongodb://127.0.0.1:27017/shofy').then(async () => {
  const brands = await Brand.find({});
  
  for (let b of brands) {
    const match = cosmeticBrands.find(cb => cb.old.test(b.name));
    if (match) {
      b.name = match.newName;
      b.email = match.newEmail;
      b.website = match.newWebsite;
      b.logo = match.newLogo;
      await b.save();
    }
  }
  
  console.log('Fixed brands to cosmetics only!');
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
