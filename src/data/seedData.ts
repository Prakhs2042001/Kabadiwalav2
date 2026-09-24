import {
  PartnerWarehouse,
  Kabadiwala,
  Household,
  Pickup,
  Recycler,
  WasteCategoryItem
} from '../types';

export const WASTE_CATEGORIES: WasteCategoryItem[] = [
  {
    id: 'cat-paper',
    name: 'Paper',
    description: 'Newspaper, cardboard, carton boxes, office records & books',
    iconName: 'FileText',
    examples: ['Newspapers (Raddi)', 'Cardboard Boxes (Gatta)', 'Magazines', 'Office Paper', 'Old Books']
  },
  {
    id: 'cat-plastic',
    name: 'Plastic',
    description: 'PET bottles, milk pouches, oil containers & hard plastic',
    iconName: 'Package',
    examples: ['PET Water/Soda Bottles', 'HDPE Containers', 'Oil Tins', 'Buckets & Crates', 'Mixed Soft Plastic']
  },
  {
    id: 'cat-metal',
    name: 'Metal',
    description: 'Iron, steel, copper, aluminium, brass & alloy scrap',
    iconName: 'Wrench',
    examples: ['Iron Rods & Sheets (Loha)', 'Copper Wire & Pipe (Tamba)', 'Aluminium Utensils', 'Brass (Peetal)']
  },
  {
    id: 'cat-ewaste',
    name: 'E-Waste',
    description: 'Electronic waste, appliances, circuit boards & mobile parts',
    iconName: 'Cpu',
    examples: ['Old Laptops & PCs', 'Smartphones & Tablets', 'Motherboards & PCBs', 'Printers & UPS', 'Chargers & Cables']
  }
];

export const INITIAL_WAREHOUSES: PartnerWarehouse[] = [
  {
    warehouse_id: 'wh-asansol-01',
    name: 'Partner Warehouse — Asansol Central Hub',
    location: 'G.T. Road, Near Murgasol',
    area: 'Murgasol',
    city: 'Asansol',
    state: 'West Bengal',
    pin_code: '713303',
    latitude: 23.6825,
    longitude: 86.9812,
    contact_person: 'Subrata Mukherjee (Aggregator Head)',
    phone: '+91 94340 12890',
    email: 'asansol.hub@partnerwarehouses.in',
    status: 'Connected',
    connected_kabadiwalas_count: 8,
    last_data_update: 'Today, 2:30 PM',
    created_at: '2026-01-10T09:00:00Z',
    updated_at: '2026-09-23T14:30:00Z'
  },
  {
    warehouse_id: 'wh-gurugram-02',
    name: 'Partner Warehouse — Gurugram North Aggregator',
    location: 'Plot 48, Old Delhi Gurgaon Rd, Sector 14 Industrial',
    area: 'Sector 14',
    city: 'Gurugram',
    state: 'Haryana',
    pin_code: '122001',
    latitude: 28.4715,
    longitude: 77.0456,
    contact_person: 'Vikramjit Singh',
    phone: '+91 98112 55670',
    email: 'gurugram.hub@partnerwarehouses.in',
    status: 'Connected',
    connected_kabadiwalas_count: 6,
    last_data_update: 'Today, 11:15 AM',
    created_at: '2026-02-15T10:00:00Z',
    updated_at: '2026-09-23T11:15:00Z'
  }
];

export const INITIAL_KABADIWALAS: Kabadiwala[] = [
  // --- Asansol Cluster ---
  {
    kabadiwala_id: 'kab-as-01',
    warehouse_id: 'wh-asansol-01',
    warehouse_name: 'Partner Warehouse — Asansol Central Hub',
    business_name: 'Maa Scrap Dealer',
    owner_name: 'Tarun Mondal',
    phone: '+91 98321 44520',
    email: 'maascrap.asansol@gmail.com',
    address: 'Shop 14, Burnpur Main Road, Opposite Chitra Cinema',
    area: 'Burnpur Road',
    locality: 'Murgasol / Burnpur',
    city: 'Asansol',
    pin_code: '713325',
    latitude: 23.6852,
    longitude: 86.9745,
    service_radius: 4.5,
    verification_status: 'Verified',
    pickup_available: true,
    operating_hours: '9:00 AM – 7:00 PM',
    status: 'Active',
    rating: 4.8,
    review_count: 142,
    waste_categories: ['Paper', 'Plastic', 'Metal', 'E-Waste'],
    rate_managed_by: 'warehouse',
    created_at: '2026-02-01T10:00:00Z',
    updated_at: '2026-09-23T14:30:00Z',
    rates: [
      {
        rate_id: 'r-01',
        kabadiwala_id: 'kab-as-01',
        category: 'Paper',
        sub_category: 'Newspaper & Cartons',
        rate_per_kg: 20,
        updated_at: '2026-09-23T14:30:00Z',
        updated_ago_text: '1 hour ago'
      },
      {
        rate_id: 'r-02',
        kabadiwala_id: 'kab-as-01',
        category: 'Plastic',
        sub_category: 'PET & Rigid Containers',
        rate_per_kg: 23,
        updated_at: '2026-09-23T14:30:00Z',
        updated_ago_text: '1 hour ago'
      },
      {
        rate_id: 'r-03',
        kabadiwala_id: 'kab-as-01',
        category: 'Metal',
        sub_category: 'Iron & Mixed Scrap',
        rate_per_kg: 45,
        updated_at: '2026-09-23T14:30:00Z',
        updated_ago_text: '1 hour ago'
      },
      {
        rate_id: 'r-04',
        kabadiwala_id: 'kab-as-01',
        category: 'E-Waste',
        sub_category: 'Old Laptops & Circuit Boards',
        rate_per_kg: 165,
        updated_at: '2026-09-23T14:30:00Z',
        updated_ago_text: '1 hour ago'
      }
    ]
  },
  {
    kabadiwala_id: 'kab-as-02',
    warehouse_id: 'wh-asansol-01',
    warehouse_name: 'Partner Warehouse — Asansol Central Hub',
    business_name: 'Raj Scrap Centre',
    owner_name: 'Rajesh Shaw',
    phone: '+91 97320 88912',
    email: 'rajscrap.shaw@yahoo.com',
    address: 'Near Old Bus Stand, G.T. Road, Asansol Bazar',
    area: 'G.T. Road',
    locality: 'Asansol Bazar',
    city: 'Asansol',
    pin_code: '713301',
    latitude: 23.6874,
    longitude: 86.9839,
    service_radius: 3.5,
    verification_status: 'Verified',
    pickup_available: true,
    operating_hours: '8:30 AM – 7:30 PM',
    status: 'Active',
    rating: 4.7,
    review_count: 98,
    waste_categories: ['Paper', 'Plastic', 'Metal', 'E-Waste'],
    rate_managed_by: 'warehouse',
    created_at: '2026-02-10T11:00:00Z',
    updated_at: '2026-09-23T13:45:00Z',
    rates: [
      {
        rate_id: 'r-05',
        kabadiwala_id: 'kab-as-02',
        category: 'Paper',
        sub_category: 'Newspaper & Cartons',
        rate_per_kg: 18,
        updated_at: '2026-09-23T13:45:00Z',
        updated_ago_text: '2 hours ago'
      },
      {
        rate_id: 'r-06',
        kabadiwala_id: 'kab-as-02',
        category: 'Plastic',
        sub_category: 'PET & Rigid Containers',
        rate_per_kg: 25,
        updated_at: '2026-09-23T13:45:00Z',
        updated_ago_text: '2 hours ago'
      },
      {
        rate_id: 'r-07',
        kabadiwala_id: 'kab-as-02',
        category: 'Metal',
        sub_category: 'Iron & Mixed Scrap',
        rate_per_kg: 42,
        updated_at: '2026-09-23T13:45:00Z',
        updated_ago_text: '2 hours ago'
      },
      {
        rate_id: 'r-08',
        kabadiwala_id: 'kab-as-02',
        category: 'E-Waste',
        sub_category: 'Old Laptops & Circuit Boards',
        rate_per_kg: 180,
        updated_at: '2026-09-23T13:45:00Z',
        updated_ago_text: '2 hours ago'
      }
    ]
  },
  {
    kabadiwala_id: 'kab-as-03',
    warehouse_id: 'wh-asansol-01',
    warehouse_name: 'Partner Warehouse — Asansol Central Hub',
    business_name: 'Green Scrap Services',
    owner_name: 'Md. Farhan',
    phone: '+91 94741 33201',
    email: 'greenscrap.asansol@gmail.com',
    address: 'SB Gorai Road, Near Court Compound',
    area: 'Hutton Road',
    locality: 'Court Area',
    city: 'Asansol',
    pin_code: '713304',
    latitude: 23.6912,
    longitude: 86.9885,
    service_radius: 5.0,
    verification_status: 'Verified',
    pickup_available: true,
    operating_hours: '9:00 AM – 6:30 PM',
    status: 'Active',
    rating: 4.6,
    review_count: 76,
    waste_categories: ['Paper', 'Metal', 'Plastic'],
    rate_managed_by: 'warehouse',
    created_at: '2026-03-01T12:00:00Z',
    updated_at: '2026-09-23T12:30:00Z',
    rates: [
      {
        rate_id: 'r-09',
        kabadiwala_id: 'kab-as-03',
        category: 'Paper',
        sub_category: 'Newspaper & Cartons',
        rate_per_kg: 19,
        updated_at: '2026-09-23T12:30:00Z',
        updated_ago_text: '3 hours ago'
      },
      {
        rate_id: 'r-10',
        kabadiwala_id: 'kab-as-03',
        category: 'Plastic',
        sub_category: 'PET & Rigid Containers',
        rate_per_kg: 22,
        updated_at: '2026-09-23T12:30:00Z',
        updated_ago_text: '3 hours ago'
      },
      {
        rate_id: 'r-11',
        kabadiwala_id: 'kab-as-03',
        category: 'Metal',
        sub_category: 'Iron & Mixed Scrap',
        rate_per_kg: 40,
        updated_at: '2026-09-23T12:30:00Z',
        updated_ago_text: '3 hours ago'
      }
    ]
  },
  {
    kabadiwala_id: 'kab-as-04',
    warehouse_id: 'wh-asansol-01',
    warehouse_name: 'Partner Warehouse — Asansol Central Hub',
    business_name: 'Bharat Metal & Paper Mart',
    owner_name: 'Suresh Agarwal',
    phone: '+91 94344 77123',
    email: 'bharatscrap.asansol@rediffmail.com',
    address: 'Ushagram East, Near Police Line',
    area: 'Ushagram',
    locality: 'Ushagram',
    city: 'Asansol',
    pin_code: '713303',
    latitude: 23.6791,
    longitude: 86.9942,
    service_radius: 4.0,
    verification_status: 'Verified',
    pickup_available: true,
    operating_hours: '8:00 AM – 8:00 PM',
    status: 'Active',
    rating: 4.9,
    review_count: 210,
    waste_categories: ['Paper', 'Metal', 'Plastic', 'E-Waste'],
    rate_managed_by: 'warehouse',
    created_at: '2026-01-20T10:00:00Z',
    updated_at: '2026-09-23T10:00:00Z',
    rates: [
      {
        rate_id: 'r-12',
        kabadiwala_id: 'kab-as-04',
        category: 'Paper',
        sub_category: 'Newspaper & Cartons',
        rate_per_kg: 21,
        updated_at: '2026-09-23T10:00:00Z',
        updated_ago_text: '5 hours ago'
      },
      {
        rate_id: 'r-13',
        kabadiwala_id: 'kab-as-04',
        category: 'Plastic',
        sub_category: 'PET & Rigid Containers',
        rate_per_kg: 24,
        updated_at: '2026-09-23T10:00:00Z',
        updated_ago_text: '5 hours ago'
      },
      {
        rate_id: 'r-14',
        kabadiwala_id: 'kab-as-04',
        category: 'Metal',
        sub_category: 'Iron & Mixed Scrap',
        rate_per_kg: 46,
        updated_at: '2026-09-23T10:00:00Z',
        updated_ago_text: '5 hours ago'
      },
      {
        rate_id: 'r-15',
        kabadiwala_id: 'kab-as-04',
        category: 'E-Waste',
        sub_category: 'Old Laptops & Circuit Boards',
        rate_per_kg: 175,
        updated_at: '2026-09-23T10:00:00Z',
        updated_ago_text: '5 hours ago'
      }
    ]
  },
  {
    kabadiwala_id: 'kab-as-05',
    warehouse_id: 'wh-asansol-01',
    warehouse_name: 'Partner Warehouse — Asansol Central Hub',
    business_name: 'Sonu Kabadi Centre',
    owner_name: 'Sonu Rawani',
    phone: '+91 91223 99801',
    email: 'sonukabadi.rawani@gmail.com',
    address: 'Kalyanpur Housing Sector 2, Asansol',
    area: 'Kalyanpur',
    locality: 'Kalyanpur Housing',
    city: 'Asansol',
    pin_code: '713305',
    latitude: 23.7015,
    longitude: 86.9621,
    service_radius: 3.0,
    verification_status: 'Verified',
    pickup_available: false, // Walk-in / Drop only for demo diversity
    operating_hours: '10:00 AM – 6:00 PM',
    status: 'Active',
    rating: 4.4,
    review_count: 45,
    waste_categories: ['Paper', 'Plastic', 'Metal'],
    rate_managed_by: 'warehouse',
    created_at: '2026-04-12T09:00:00Z',
    updated_at: '2026-09-23T08:00:00Z',
    rates: [
      {
        rate_id: 'r-16',
        kabadiwala_id: 'kab-as-05',
        category: 'Paper',
        sub_category: 'Newspaper & Cartons',
        rate_per_kg: 17,
        updated_at: '2026-09-23T08:00:00Z',
        updated_ago_text: '7 hours ago'
      },
      {
        rate_id: 'r-17',
        kabadiwala_id: 'kab-as-05',
        category: 'Plastic',
        sub_category: 'PET & Rigid Containers',
        rate_per_kg: 21,
        updated_at: '2026-09-23T08:00:00Z',
        updated_ago_text: '7 hours ago'
      },
      {
        rate_id: 'r-18',
        kabadiwala_id: 'kab-as-05',
        category: 'Metal',
        sub_category: 'Iron & Mixed Scrap',
        rate_per_kg: 39,
        updated_at: '2026-09-23T08:00:00Z',
        updated_ago_text: '7 hours ago'
      }
    ]
  },

  // --- Gurugram Cluster ---
  {
    kabadiwala_id: 'kab-ggn-01',
    warehouse_id: 'wh-gurugram-02',
    warehouse_name: 'Partner Warehouse — Gurugram North Aggregator',
    business_name: 'Haryana Scrap Corporation',
    owner_name: 'Ramesh Yadav',
    phone: '+91 98188 43210',
    email: 'haryanascrap@gmail.com',
    address: 'Near Sector 14 Market, Old DLF Colony',
    area: 'Sector 14',
    locality: 'Sector 14',
    city: 'Gurugram',
    pin_code: '122001',
    latitude: 28.4728,
    longitude: 77.0435,
    service_radius: 5.5,
    verification_status: 'Verified',
    pickup_available: true,
    operating_hours: '8:30 AM – 7:30 PM',
    status: 'Active',
    rating: 4.8,
    review_count: 184,
    waste_categories: ['Paper', 'Plastic', 'Metal', 'E-Waste'],
    rate_managed_by: 'warehouse',
    created_at: '2026-02-18T10:00:00Z',
    updated_at: '2026-09-23T14:00:00Z',
    rates: [
      {
        rate_id: 'r-ggn-01',
        kabadiwala_id: 'kab-ggn-01',
        category: 'Paper',
        sub_category: 'Newspaper & Office Paper',
        rate_per_kg: 22,
        updated_at: '2026-09-23T14:00:00Z',
        updated_ago_text: '1 hour ago'
      },
      {
        rate_id: 'r-ggn-02',
        kabadiwala_id: 'kab-ggn-01',
        category: 'Plastic',
        sub_category: 'PET & Rigid Containers',
        rate_per_kg: 26,
        updated_at: '2026-09-23T14:00:00Z',
        updated_ago_text: '1 hour ago'
      },
      {
        rate_id: 'r-ggn-03',
        kabadiwala_id: 'kab-ggn-01',
        category: 'Metal',
        sub_category: 'Iron, Aluminium & Copper',
        rate_per_kg: 48,
        updated_at: '2026-09-23T14:00:00Z',
        updated_ago_text: '1 hour ago'
      },
      {
        rate_id: 'r-ggn-04',
        kabadiwala_id: 'kab-ggn-01',
        category: 'E-Waste',
        sub_category: 'Old Laptops & Circuit Boards',
        rate_per_kg: 190,
        updated_at: '2026-09-23T14:00:00Z',
        updated_ago_text: '1 hour ago'
      }
    ]
  },
  {
    kabadiwala_id: 'kab-ggn-02',
    warehouse_id: 'wh-gurugram-02',
    warehouse_name: 'Partner Warehouse — Gurugram North Aggregator',
    business_name: 'Shree Balaji Eco Scrap',
    owner_name: 'Devinder Sharma',
    phone: '+91 99110 33445',
    email: 'shreebalajiscrap@yahoo.com',
    address: 'Shop 8, Sushant Lok Phase 1, Near Galleria',
    area: 'Sushant Lok 1',
    locality: 'Galleria Market Area',
    city: 'Gurugram',
    pin_code: '122009',
    latitude: 28.4682,
    longitude: 77.0821,
    service_radius: 4.0,
    verification_status: 'Verified',
    pickup_available: true,
    operating_hours: '9:00 AM – 7:00 PM',
    status: 'Active',
    rating: 4.7,
    review_count: 112,
    waste_categories: ['Paper', 'Plastic', 'Metal', 'E-Waste'],
    rate_managed_by: 'warehouse',
    created_at: '2026-03-05T09:00:00Z',
    updated_at: '2026-09-23T12:00:00Z',
    rates: [
      {
        rate_id: 'r-ggn-05',
        kabadiwala_id: 'kab-ggn-02',
        category: 'Paper',
        sub_category: 'Newspaper & Cartons',
        rate_per_kg: 20,
        updated_at: '2026-09-23T12:00:00Z',
        updated_ago_text: '3 hours ago'
      },
      {
        rate_id: 'r-ggn-06',
        kabadiwala_id: 'kab-ggn-02',
        category: 'Plastic',
        sub_category: 'PET Bottles & Containers',
        rate_per_kg: 24,
        updated_at: '2026-09-23T12:00:00Z',
        updated_ago_text: '3 hours ago'
      },
      {
        rate_id: 'r-ggn-07',
        kabadiwala_id: 'kab-ggn-02',
        category: 'Metal',
        sub_category: 'Iron & Household Metal',
        rate_per_kg: 44,
        updated_at: '2026-09-23T12:00:00Z',
        updated_ago_text: '3 hours ago'
      },
      {
        rate_id: 'r-ggn-08',
        kabadiwala_id: 'kab-ggn-02',
        category: 'E-Waste',
        sub_category: 'PCBs & Appliance scrap',
        rate_per_kg: 175,
        updated_at: '2026-09-23T12:00:00Z',
        updated_ago_text: '3 hours ago'
      }
    ]
  },
  {
    kabadiwala_id: 'kab-ggn-03',
    warehouse_id: 'wh-gurugram-02',
    warehouse_name: 'Partner Warehouse — Gurugram North Aggregator',
    business_name: 'Cyber City Scrap Solutions',
    owner_name: 'Mukesh Kumar',
    phone: '+91 98711 22998',
    email: 'cybercityscrap@gmail.com',
    address: 'DLF Phase 3, Near Moulsari Avenue Metro',
    area: 'DLF Phase 3',
    locality: 'Cyber City',
    city: 'Gurugram',
    pin_code: '122002',
    latitude: 28.4912,
    longitude: 77.0934,
    service_radius: 5.0,
    verification_status: 'Verified',
    pickup_available: true,
    operating_hours: '9:00 AM – 8:00 PM',
    status: 'Active',
    rating: 4.9,
    review_count: 240,
    waste_categories: ['Paper', 'Plastic', 'Metal', 'E-Waste'],
    rate_managed_by: 'warehouse',
    created_at: '2026-01-15T11:00:00Z',
    updated_at: '2026-09-23T15:00:00Z',
    rates: [
      {
        rate_id: 'r-ggn-09',
        kabadiwala_id: 'kab-ggn-03',
        category: 'Paper',
        sub_category: 'Office Paper & Shredding',
        rate_per_kg: 24,
        updated_at: '2026-09-23T15:00:00Z',
        updated_ago_text: '45 mins ago'
      },
      {
        rate_id: 'r-ggn-10',
        kabadiwala_id: 'kab-ggn-03',
        category: 'Plastic',
        sub_category: 'Clean Mixed Plastics',
        rate_per_kg: 27,
        updated_at: '2026-09-23T15:00:00Z',
        updated_ago_text: '45 mins ago'
      },
      {
        rate_id: 'r-ggn-11',
        kabadiwala_id: 'kab-ggn-03',
        category: 'Metal',
        sub_category: 'Aluminium & Iron',
        rate_per_kg: 50,
        updated_at: '2026-09-23T15:00:00Z',
        updated_ago_text: '45 mins ago'
      },
      {
        rate_id: 'r-ggn-12',
        kabadiwala_id: 'kab-ggn-03',
        category: 'E-Waste',
        sub_category: 'IT Hardware & Servers',
        rate_per_kg: 210,
        updated_at: '2026-09-23T15:00:00Z',
        updated_ago_text: '45 mins ago'
      }
    ]
  }
];

export const INITIAL_HOUSEHOLDS: Household[] = [
  {
    household_id: 'hh-01',
    name: 'Rahul Verma',
    phone: '+91 98765 43210',
    email: 'rahul.verma@example.com',
    address: 'Flat 402, Green Valley Enclave, Burnpur Road',
    area: 'Burnpur Road',
    pin_code: '713325',
    latitude: 23.6841,
    longitude: 86.9734,
    created_at: '2026-03-01T10:00:00Z'
  },
  {
    household_id: 'hh-02',
    name: 'Priya Sharma',
    phone: '+91 98101 22334',
    email: 'priya.sharma@example.com',
    address: 'House 52, Sector 14, Opposite Community Centre',
    area: 'Sector 14',
    pin_code: '122001',
    latitude: 28.4732,
    longitude: 77.0428,
    created_at: '2026-03-12T14:00:00Z'
  }
];

export const INITIAL_PICKUPS: Pickup[] = [
  {
    pickup_id: 'KC-PK-1082',
    household_id: 'hh-01',
    household_name: 'Rahul Verma',
    household_phone: '+91 98765 43210',
    kabadiwala_id: 'kab-as-01',
    kabadiwala_name: 'Maa Scrap Dealer',
    kabadiwala_phone: '+91 98321 44520',
    kabadiwala_area: 'Burnpur Road, Asansol',
    warehouse_id: 'wh-asansol-01',
    pickup_address: 'Flat 402, Green Valley Enclave, Burnpur Road, Asansol',
    area: 'Burnpur Road',
    pin_code: '713325',
    latitude: 23.6841,
    longitude: 86.9734,
    scheduled_date: 'Tomorrow, 25 Sep 2026',
    time_slot: '10:00 AM – 12:00 PM',
    status: 'Accepted',
    items: [
      {
        category: 'Metal',
        sub_category: 'Iron & Mixed Scrap',
        estimated_kg: 10,
        rate_per_kg: 45,
        calculated_estimate: 450
      },
      {
        category: 'Plastic',
        sub_category: 'PET & Rigid Containers',
        estimated_kg: 5,
        rate_per_kg: 23,
        calculated_estimate: 115
      }
    ],
    estimated_weight: 15,
    estimated_value: 565,
    special_instructions: 'Please bring hanging digital scale. Intercom at gate is 402.',
    status_timeline: [
      {
        status: 'Requested',
        timestamp: 'Today, 10:15 AM',
        note: 'Household requested doorstep pickup via connected warehouse network'
      },
      {
        status: 'Accepted',
        timestamp: 'Today, 10:30 AM',
        note: 'Maa Scrap Dealer confirmed appointment slot'
      }
    ],
    created_at: '2026-09-23T10:15:00Z',
    updated_at: '2026-09-23T10:30:00Z'
  },
  {
    pickup_id: 'KC-PK-1049',
    household_id: 'hh-01',
    household_name: 'Rahul Verma',
    household_phone: '+91 98765 43210',
    kabadiwala_id: 'kab-as-02',
    kabadiwala_name: 'Raj Scrap Centre',
    kabadiwala_phone: '+91 97320 88912',
    kabadiwala_area: 'G.T. Road, Asansol Bazar',
    warehouse_id: 'wh-asansol-01',
    pickup_address: 'Flat 402, Green Valley Enclave, Burnpur Road, Asansol',
    area: 'Burnpur Road',
    pin_code: '713325',
    latitude: 23.6841,
    longitude: 86.9734,
    scheduled_date: '20 Sep 2026',
    time_slot: '2:00 PM – 4:00 PM',
    status: 'Completed',
    items: [
      {
        category: 'Paper',
        sub_category: 'Newspaper & Cartons',
        estimated_kg: 20,
        rate_per_kg: 18,
        calculated_estimate: 360,
        actual_kg: 22.4,
        final_amount: 403.2
      }
    ],
    estimated_weight: 20,
    estimated_value: 360,
    actual_weight: 22.4,
    final_amount: 403,
    status_timeline: [
      {
        status: 'Requested',
        timestamp: '20 Sep, 09:00 AM',
        note: 'Pickup scheduled'
      },
      {
        status: 'Accepted',
        timestamp: '20 Sep, 09:40 AM',
        note: 'Confirmed by Raj Scrap'
      },
      {
        status: 'On the Way',
        timestamp: '20 Sep, 02:15 PM',
        note: 'Collector en route with digital scale'
      },
      {
        status: 'Completed',
        timestamp: '20 Sep, 02:50 PM',
        note: 'Weighed 22.4 kg. UPI payment ₹403 completed.'
      }
    ],
    created_at: '2026-09-20T09:00:00Z',
    updated_at: '2026-09-20T14:50:00Z'
  }
];

export const INITIAL_RECYCLERS: Recycler[] = [
  {
    recycler_id: 'rec-01',
    business_name: 'Durgapur Industrial Green Smelters Ltd.',
    contact_person: 'Aniruddha Banerjee',
    phone: '+91 94340 98112',
    email: 'procurement@durgapursmelters.com',
    facility_location: 'Industrial Area Phase 2, Durgapur, WB',
    city: 'Durgapur',
    state: 'West Bengal',
    cpcb_license_number: 'CPCB/WB/MET-2024/9021',
    materials_accepted: ['Metal'],
    monthly_processing_capacity: '1,800 Metric Tons/month',
    current_procurement_demands: [
      { category: 'Metal', required_tons: 150, procurement_price_per_ton: 49500 }
    ],
    status: 'Active'
  },
  {
    recycler_id: 'rec-02',
    business_name: 'Kolkata Circular Polymers & Flakes',
    contact_person: 'Sarmistha Roy',
    phone: '+91 98302 44781',
    email: 'intake@kolkatapolymer.org',
    facility_location: 'Uluberia Industrial Park, Howrah, WB',
    city: 'Howrah',
    state: 'West Bengal',
    cpcb_license_number: 'CPCB/WB/PLS-2025/1109',
    materials_accepted: ['Plastic'],
    monthly_processing_capacity: '850 Metric Tons/month',
    current_procurement_demands: [
      { category: 'Plastic', required_tons: 65, procurement_price_per_ton: 29000 }
    ],
    status: 'Active'
  },
  {
    recycler_id: 'rec-03',
    business_name: 'EcoRecycle Kraft Paper Mills',
    contact_person: 'Harpreet Singh Gill',
    phone: '+91 98144 88321',
    email: 'raddi@ecorecyclemills.in',
    facility_location: 'Kundli Industrial Corridor, Sonipat / Delhi NCR',
    city: 'Sonipat',
    state: 'Haryana',
    cpcb_license_number: 'CPCB/HR/PPR-2024/4401',
    materials_accepted: ['Paper'],
    monthly_processing_capacity: '3,200 Metric Tons/month',
    current_procurement_demands: [
      { category: 'Paper', required_tons: 220, procurement_price_per_ton: 22500 }
    ],
    status: 'Active'
  }
];
