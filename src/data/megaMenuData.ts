// Types for the menu data structure
export interface MenuCategory {
  id: string;
  title: string;
  icon: string;
  subcategories: SubCategory[];
}

export interface SubCategory {
  id: string;
  title: string;
  items: MenuItem[];
}

export interface MenuItem {
  id: string;
  name: string;
  href: string;
}

// Main menu data configuration
export const megaMenuData: MenuCategory[] = [
  {
    id: 'building-construction',
    title: 'Building & Construction',
    icon: '/assets/MegaMenu/mm1.png',
    subcategories: [
      {
        id: 'wood-plywood',
        title: 'Wood, Plywood, Veneer & Laminates',
        items: [
          { id: 'plywoods', name: 'Plywoods', href: '/products/plywoods' },
          { id: 'laminate-sheets', name: 'Laminate Sheets', href: '/products/laminate-sheets' },
          { id: 'mdf-board', name: 'MDF Board', href: '/products/mdf-board' },
          { id: 'wooden-planks', name: 'Wooden Planks', href: '/products/wooden-planks' },
          { id: 'wpc-board', name: 'WPC Board', href: '/products/wpc-board' },
          { id: 'wood-veneer', name: 'Wood Veneer', href: '/products/wood-veneer' },
        ]
      },
      {
        id: 'steel-bars',
        title: 'Steel Bars, Rods, Plates & Sheets',
        items: [
          { id: 'tmt-bars', name: 'TMT Bars', href: '/products/tmt-bars' },
          { id: 'steel-plates', name: 'Steel Plates', href: '/products/steel-plates' },
          { id: 'stainless-steel-sheet', name: 'Stainless Steel Sheet', href: '/products/stainless-steel-sheet' },
          { id: 'steel-rods', name: 'Steel Rods', href: '/products/steel-rods' },
          { id: 'mild-steel-bars', name: 'Mild Steel Bars', href: '/products/mild-steel-bars' },
          { id: 'steel-bars', name: 'Steel Bars', href: '/products/steel-bars' },
          { id: 'steel-round-bars', name: 'Steel Round Bars', href: '/products/steel-round-bars' },
          { id: 'stainless-steel-bars', name: 'Stainless Steel Bars', href: '/products/stainless-steel-bars' },
        ]
      },
      {
        id: 'roofing',
        title: 'Roofing and False ceiling',
        items: [
          { id: 'roofing-sheets', name: 'Roofing Sheets', href: '/products/roofing-sheets' },
          { id: 'false-ceiling', name: 'False Ceiling', href: '/products/false-ceiling' },
          { id: 'metal-roofing-sheet', name: 'Metal Roofing Sheet', href: '/products/metal-roofing-sheet' },
          { id: 'gi-sheets', name: 'GI Sheets', href: '/products/gi-sheets' },
          { id: 'polycarbonate-sheet', name: 'Polycarbonate Sheet', href: '/products/polycarbonate-sheet' },
          { id: 'roof-tiles', name: 'Roof Tiles', href: '/products/roof-tiles' },
          { id: 'ceiling-panels', name: 'Ceiling Panels', href: '/products/ceiling-panels' },
          { id: 'profile-sheets', name: 'Profile Sheets', href: '/products/profile-sheets' },
          { id: 'ceiling-accessories', name: 'Ceiling Accessories', href: '/products/ceiling-accessories' },
        ]
      },
      {
        id: 'pipes',
        title: 'PVC, FRP, HDPE & Other Plastic Pipes',
        items: [
          { id: 'pvc-pipes', name: 'PVC Pipes', href: '/products/pvc-pipes' },
          { id: 'plumbing-pipe', name: 'Plumbing Pipe', href: '/products/plumbing-pipe' },
          { id: 'borewell-pipes', name: 'Borewell Pipes', href: '/products/borewell-pipes' },
          { id: 'industrial-plastic-pipes', name: 'Industrial Plastic Pipes', href: '/products/industrial-plastic-pipes' },
          { id: 'cpvc-pipe', name: 'CPVC Pipe', href: '/products/cpvc-pipe' },
          { id: 'drainage-pipe', name: 'Drainage Pipe', href: '/products/drainage-pipe' },
          { id: 'upvc-water-pipes', name: 'UPVC Water Pipes', href: '/products/upvc-water-pipes' },
          { id: 'sanitary-pipes', name: 'Sanitary Pipes', href: '/products/sanitary-pipes' },
          { id: 'drip-irrigation-pipes', name: 'Drip Irrigation Pipes', href: '/products/drip-irrigation-pipes' },
        ]
      }
    ]
  },
  {
    id: 'healthcare',
    title: 'Healthcare & Medical',
    icon: '/assets/MegaMenu/mm2.png',
    subcategories: [
      {
        id: 'ayurvedic',
        title: 'Ayurvedic & Herbal Products',
        items: [
          { id: 'areca-nut', name: 'Areca Nut', href: '/products/areca-nut' },
          { id: 'betel-nuts', name: 'Betel Nuts', href: '/products/betel-nuts' },
          { id: 'herbal-tablets', name: 'Herbal Tablets', href: '/products/herbal-tablets' },
          { id: 'ayurvedic-churna', name: 'Ayurvedic Churna', href: '/products/ayurvedic-churna' },
        ]
      },
      {
        id: 'nutraceuticals',
        title: 'Nutraceuticals & Dietary Supplements',
        items: [
          { id: 'nutritional-supplements', name: 'Nutritional Supplements', href: '/products/nutritional-supplements' },
          { id: 'weight-gain-nutrition', name: 'Weight Gain Nutrition', href: '/products/weight-gain-nutrition' },
          { id: 'protein-powder', name: 'Protein Powder', href: '/products/protein-powder' },
          { id: 'tablets', name: 'Tablets', href: '/products/tablets' },
          { id: 'syrup', name: 'Syrup', href: '/products/syrup' },
          { id: 'capsules', name: 'Capsules', href: '/products/capsules' },
          { id: 'dexorange-syrup', name: 'Dexorange Syrup', href: '/products/dexorange-syrup' },
          { id: 'coenzyme-q10', name: 'Coenzyme Q10', href: '/products/coenzyme-q10' },
          { id: 'calcium-tablet', name: 'Calcium Tablet', href: '/products/calcium-tablet' },
          { id: 'whey-protein', name: 'Whey Protein', href: '/products/whey-protein' },
        ]
      },
      {
        id: 'anti-infective',
        title: 'Anti Infective Drugs & Medicines',
        items: [
          { id: 'hydroxychloroquine', name: 'Hydroxychloroquine Sulphate', href: '/products/hydroxychloroquine' },
          { id: 'chloroquine', name: 'Chloroquine Phosphate', href: '/products/chloroquine' },
          { id: 'antifungal-cream', name: 'Antifungal Cream', href: '/products/antifungal-cream' },
          { id: 'azithromycin', name: 'Azithromycin Tablets', href: '/products/azithromycin' },
          { id: 'tenofovir', name: 'Tenofovir Tablet', href: '/products/tenofovir' },
          { id: 'anti-hiv-drugs', name: 'Anti HIV Drugs', href: '/products/anti-hiv-drugs' },
          { id: 'antiretroviral', name: 'Antiretroviral Drug', href: '/products/antiretroviral' },
          { id: 'itraconazole', name: 'Itraconazole Medicine', href: '/products/itraconazole' },
          { id: 'anti-infective-agent', name: 'Anti Infective Agent', href: '/products/anti-infective-agent' },
          { id: 'cefixime', name: 'Cefixime', href: '/products/cefixime' },
        ]
      },
      {
        id: 'cardiovascular',
        title: 'Cardiovascular Drugs & Medication',
        items: [
          { id: 'erythropoietin', name: 'Erythropoietin Injection', href: '/products/erythropoietin' },
          { id: 'insulin-pen', name: 'Insulin Pen', href: '/products/insulin-pen' },
          { id: 'metformin', name: 'Metformin Tablets', href: '/products/metformin' },
          { id: 'antidiabetic', name: 'Antidiabetic Medicine', href: '/products/antidiabetic' },
          { id: 'enoxaparin', name: 'Enoxaparin Injection', href: '/products/enoxaparin' },
          { id: 'darbepoetin', name: 'Darbepoetin Alfa Injection', href: '/products/darbepoetin' },
          { id: 'mephentermine', name: 'Mephentermine Sulphate Injection', href: '/products/mephentermine' },
          { id: 'metformin-hcl', name: 'Metformin Hydrochloride', href: '/products/metformin-hcl' },
        ]
      }
    ]
  },
  {
    id: 'electronics',
    title: 'Electronics & Electrical',
    icon: '/assets/MegaMenu/mm3.png',
    subcategories: [
      {
        id: 'consumer-electronics',
        title: 'Consumer Electronics',
        items: [
          { id: 'smartphones', name: 'Smartphones', href: '/products/smartphones' },
          { id: 'tablets', name: 'Tablets', href: '/products/tablets' },
          { id: 'laptops', name: 'Laptops', href: '/products/laptops' },
          { id: 'cameras', name: 'Cameras', href: '/products/cameras' },
          { id: 'headphones', name: 'Headphones', href: '/products/headphones' },
        ]
      },
      {
        id: 'home-appliances',
        title: 'Home Appliances',
        items: [
          { id: 'refrigerators', name: 'Refrigerators', href: '/products/refrigerators' },
          { id: 'washing-machines', name: 'Washing Machines', href: '/products/washing-machines' },
          { id: 'air-conditioners', name: 'Air Conditioners', href: '/products/air-conditioners' },
          { id: 'microwaves', name: 'Microwaves', href: '/products/microwaves' },
          { id: 'vacuum-cleaners', name: 'Vacuum Cleaners', href: '/products/vacuum-cleaners' },
        ]
      }
    ]
  },
  {
    id: 'textiles',
    title: 'Textiles & Garments',
    icon: '/assets/MegaMenu/mm4.png',
    subcategories: [
      {
        id: 'fabrics',
        title: 'Fabrics & Raw Materials',
        items: [
          { id: 'cotton-fabric', name: 'Cotton Fabric', href: '/products/cotton-fabric' },
          { id: 'silk-fabric', name: 'Silk Fabric', href: '/products/silk-fabric' },
          { id: 'wool-fabric', name: 'Wool Fabric', href: '/products/wool-fabric' },
          { id: 'synthetic-fabric', name: 'Synthetic Fabric', href: '/products/synthetic-fabric' },
        ]
      },
      {
        id: 'garments',
        title: 'Ready-made Garments',
        items: [
          { id: 'mens-clothing', name: 'Men\'s Clothing', href: '/products/mens-clothing' },
          { id: 'womens-clothing', name: 'Women\'s Clothing', href: '/products/womens-clothing' },
          { id: 'kids-clothing', name: 'Kids Clothing', href: '/products/kids-clothing' },
          { id: 'accessories', name: 'Accessories', href: '/products/accessories' },
        ]
      }
    ]
  },
  {
    id: 'food-beverages',
    title: 'Food & Beverages',
    icon: '/assets/MegaMenu/mm5.png',
    subcategories: [
      {
        id: 'food-products',
        title: 'Food Products',
        items: [
          { id: 'grains-cereals', name: 'Grains & Cereals', href: '/products/grains-cereals' },
          { id: 'spices', name: 'Spices', href: '/products/spices' },
          { id: 'oil-ghee', name: 'Oil & Ghee', href: '/products/oil-ghee' },
          { id: 'dairy-products', name: 'Dairy Products', href: '/products/dairy-products' },
        ]
      },
      {
        id: 'beverages',
        title: 'Beverages',
        items: [
          { id: 'tea-coffee', name: 'Tea & Coffee', href: '/products/tea-coffee' },
          { id: 'juices', name: 'Juices', href: '/products/juices' },
          { id: 'soft-drinks', name: 'Soft Drinks', href: '/products/soft-drinks' },
          { id: 'energy-drinks', name: 'Energy Drinks', href: '/products/energy-drinks' },
        ]
      }
    ]
  },
  {
    id: 'automotive',
    title: 'Automotive & Transportation',
    icon: '/assets/MegaMenu/mm6.png',
    subcategories: [
      {
        id: 'auto-parts',
        title: 'Auto Parts & Accessories',
        items: [
          { id: 'engine-parts', name: 'Engine Parts', href: '/products/engine-parts' },
          { id: 'brake-parts', name: 'Brake Parts', href: '/products/brake-parts' },
          { id: 'suspension-parts', name: 'Suspension Parts', href: '/products/suspension-parts' },
          { id: 'electrical-parts', name: 'Electrical Parts', href: '/products/electrical-parts' },
        ]
      },
      {
        id: 'vehicles',
        title: 'Vehicles',
        items: [
          { id: 'cars', name: 'Cars', href: '/products/cars' },
          { id: 'motorcycles', name: 'Motorcycles', href: '/products/motorcycles' },
          { id: 'commercial-vehicles', name: 'Commercial Vehicles', href: '/products/commercial-vehicles' },
          { id: 'spare-parts', name: 'Spare Parts', href: '/products/spare-parts' },
        ]
      }
    ]
  }
];

// Helper function to get category by ID
export const getCategoryById = (id: string): MenuCategory | undefined => {
  return megaMenuData.find(category => category.id === id);
};

// Helper function to get all categories
export const getAllCategories = (): MenuCategory[] => {
  return megaMenuData;
};

// Helper function to search items across all categories
export const searchItems = (query: string): MenuItem[] => {
  const results: MenuItem[] = [];
  
  megaMenuData.forEach(category => {
    category.subcategories.forEach(subcategory => {
      subcategory.items.forEach(item => {
        if (item.name.toLowerCase().includes(query.toLowerCase())) {
          results.push(item);
        }
      });
    });
  });
  
  return results;
};
