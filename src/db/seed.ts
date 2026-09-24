// src/db/seed.ts
import { db } from './index.ts';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import {
  users,
  partnerWarehouses,
  kabadiwalas,
  wasteCategories,
  wasteSubcategories,
  kabadiwalaRates,
  households,
  householdAddresses,
  pickups,
  pickupItems,
  pickupStatusHistory,
  transactions,
  reviews,
  platformSettings,
  notifications,
} from './schema.ts';

export async function runSeed() {
  console.log('--- Starting Cloud SQL Database Seed for Navonmesh ---');

  // 1. Platform Settings
  await db
    .insert(platformSettings)
    .values([
      { key: 'MAX_SEARCH_RADIUS_KM', value: '10', description: 'Platform maximum Kabadiwala search radius' },
      { key: 'DEFAULT_SEARCH_RADIUS_KM', value: '5', description: 'Default radius for nearby searches' },
      { key: 'PLATFORM_NAME', value: 'Navonmesh', description: 'Public platform branding' },
    ])
    .onConflictDoNothing();

  // 2. Partner Warehouses
  const insertedWarehouses = await db
    .insert(partnerWarehouses)
    .values([
      {
        name: 'Asansol Central Scrap Aggregator Hub',
        location: 'Burnpur Industrial Estate, Near Rail Goods Yard',
        area: 'Burnpur',
        city: 'Asansol',
        state: 'West Bengal',
        pinCode: '713325',
        contactName: 'Debabrata Mukherjee',
        contactPhone: '+91 98321 44550',
        contactEmail: 'burnpur.hub@partnerwarehouses.in',
        status: 'ACTIVE',
      },
      {
        name: 'Gurugram Sector 14 Material Recovery Depot',
        location: 'Old Delhi Gurgaon Road, Industrial Area Phase 1',
        area: 'Sector 14',
        city: 'Gurugram',
        state: 'Haryana',
        pinCode: '122001',
        contactName: 'Sanjay Yadav',
        contactPhone: '+91 98112 39011',
        contactEmail: 'gurugram.depot@partnerwarehouses.in',
        status: 'ACTIVE',
      },
      {
        name: 'Bengaluru East Resource Recovery Yard',
        location: 'Old Madras Road, Baiyappanahalli Junction',
        area: 'Indiranagar / CV Raman Nagar',
        city: 'Bengaluru',
        state: 'Karnataka',
        pinCode: '560038',
        contactName: 'K. Venkatesh',
        contactPhone: '+91 94480 88219',
        contactEmail: 'bengaluru.east@partnerwarehouses.in',
        status: 'ACTIVE',
      },
    ])
    .returning();

  const warehouseAsansol = insertedWarehouses[0] || (await db.select().from(partnerWarehouses).limit(1))[0];
  const warehouseGurugram = insertedWarehouses[1] || warehouseAsansol;
  const warehouseBlr = insertedWarehouses[2] || warehouseAsansol;

  // 3. Waste Categories & Subcategories
  const cats = await db
    .insert(wasteCategories)
    .values([
      { name: 'Paper', description: 'Newspapers, cardboard cartons, office paper, notebooks & magazines', icon: 'FileText' },
      { name: 'Plastic', description: 'PET water bottles, HDPE milk pouches, hard plastics & containers', icon: 'Layers' },
      { name: 'Metal', description: 'Iron rods, tin cans, aluminium cookware, brass, copper wires', icon: 'Coins' },
      { name: 'E-Waste', description: 'Old smartphones, laptops, cables, PCBs, motherboards, chargers', icon: 'Cpu' },
    ])
    .onConflictDoNothing()
    .returning();

  const allCategories = await db.select().from(wasteCategories);
  const paperCat = allCategories.find((c) => c.name === 'Paper')!;
  const plasticCat = allCategories.find((c) => c.name === 'Plastic')!;
  const metalCat = allCategories.find((c) => c.name === 'Metal')!;
  const eWasteCat = allCategories.find((c) => c.name === 'E-Waste')!;

  // Subcategories
  await db
    .insert(wasteSubcategories)
    .values([
      { categoryId: paperCat.id, name: 'Old Newspaper (Raddi)', indicativeBaseRate: '16.00' },
      { categoryId: paperCat.id, name: 'Corrugated Cardboard (Gatta)', indicativeBaseRate: '12.00' },
      { categoryId: paperCat.id, name: 'Office White Paper / Books', indicativeBaseRate: '15.00' },
      { categoryId: plasticCat.id, name: 'PET Bottles (Clean)', indicativeBaseRate: '22.00' },
      { categoryId: plasticCat.id, name: 'Mixed Rigid Plastics', indicativeBaseRate: '18.00' },
      { categoryId: metalCat.id, name: 'Iron & Steel Scrap', indicativeBaseRate: '32.00' },
      { categoryId: metalCat.id, name: 'Aluminium Utensils & Sheets', indicativeBaseRate: '140.00' },
      { categoryId: metalCat.id, name: 'Pure Copper Wire', indicativeBaseRate: '520.00' },
      { categoryId: metalCat.id, name: 'Brass / Peetal', indicativeBaseRate: '340.00' },
      { categoryId: eWasteCat.id, name: 'Laptops & Computers', indicativeBaseRate: '110.00' },
      { categoryId: eWasteCat.id, name: 'Mixed Electronics & Cables', indicativeBaseRate: '45.00' },
    ])
    .onConflictDoNothing();

  // 4. Create Platform Admin & Initial Users
  const defaultPasswordHash = await bcrypt.hash('Password@123', 10);

  const adminUser = await db
    .insert(users)
    .values({
      uid: 'admin_master_001',
      name: 'Platform Admin',
      email: 'admin@kabadiwalaconnect.org',
      phone: '+91 99000 11223',
      passwordHash: defaultPasswordHash,
      role: 'ADMIN',
      status: 'ACTIVE',
      emailVerified: true,
      phoneVerified: true,
    })
    .onConflictDoNothing()
    .returning();

  // Households
  const hUsers = await db
    .insert(users)
    .values([
      {
        uid: 'demo_household_rahul',
        name: 'Rahul Sharma',
        email: 'rahul.sharma@example.com',
        phone: '+91 98765 43210',
        passwordHash: defaultPasswordHash,
        role: 'HOUSEHOLD',
        status: 'ACTIVE',
        emailVerified: true,
      },
      {
        uid: 'demo_household_priya',
        name: 'Priya Sen',
        email: 'priya.sen@example.com',
        phone: '+91 98711 22334',
        passwordHash: defaultPasswordHash,
        role: 'HOUSEHOLD',
        status: 'ACTIVE',
        emailVerified: true,
      },
    ])
    .onConflictDoNothing()
    .returning();

  const activeHouseholdUser = hUsers[0] || (await db.select().from(users).where(eq(users.role, 'HOUSEHOLD')).limit(1))[0];

  if (activeHouseholdUser) {
    const hh = await db
      .insert(households)
      .values({
        userId: activeHouseholdUser.id,
        address: 'Flat 402, Green Valley Apartments, Burnpur Road',
        area: 'Burnpur',
        city: 'Asansol',
        state: 'West Bengal',
        pinCode: '713325',
        latitude: '23.688860',
        longitude: '86.983320',
      })
      .onConflictDoNothing()
      .returning();

    if (hh[0]) {
      await db
        .insert(householdAddresses)
        .values([
          {
            householdId: hh[0].id,
            label: 'Home',
            address: 'Flat 402, Green Valley Apartments, Burnpur Road',
            area: 'Burnpur',
            city: 'Asansol',
            state: 'West Bengal',
            pinCode: '713325',
            latitude: '23.688860',
            longitude: '86.983320',
            isDefault: true,
          },
          {
            householdId: hh[0].id,
            label: 'Parents House',
            address: 'House 14, Riverside Colony',
            area: 'Burnpur',
            city: 'Asansol',
            state: 'West Bengal',
            pinCode: '713325',
            latitude: '23.685200',
            longitude: '86.979100',
            isDefault: false,
          },
        ])
        .onConflictDoNothing();
    }
  }

  // 5. Seed 15 Verified Kabadiwalas across clusters (Burnpur/Asansol, Gurugram, Bengaluru)
  const kabadiwalaRawData = [
    // Asansol / Burnpur Cluster (Near Lat: 23.6889, Lng: 86.9833)
    {
      businessName: 'Maa Tara Scrap Trader',
      ownerName: 'Subhashish Ghosal',
      phone: '+91 94341 89201',
      email: 'maatara.scrap@gmail.com',
      address: 'Shop 12, Station Bazaar, Burnpur',
      area: 'Burnpur',
      locality: 'Burnpur Station Road',
      city: 'Asansol',
      state: 'West Bengal',
      pinCode: '713325',
      latitude: '23.685400',
      longitude: '86.982100',
      serviceRadiusKm: '6.50',
      warehouseId: warehouseAsansol.id,
      rates: [
        { cat: paperCat.id, rate: '17.50' },
        { cat: plasticCat.id, rate: '24.00' },
        { cat: metalCat.id, rate: '34.50' },
        { cat: eWasteCat.id, rate: '50.00' },
      ],
    },
    {
      businessName: 'Raj Scrap Centre & Metal Traders',
      ownerName: 'Rajendra Prasad Shaw',
      phone: '+91 98322 11980',
      email: 'rajscrap.asansol@gmail.com',
      address: 'Plot 45, G.T. Road By-pass, Asansol Market',
      area: 'Court Area',
      locality: 'Court More',
      city: 'Asansol',
      state: 'West Bengal',
      pinCode: '713304',
      latitude: '23.689900',
      longitude: '86.987500',
      serviceRadiusKm: '5.00',
      warehouseId: warehouseAsansol.id,
      rates: [
        { cat: paperCat.id, rate: '16.50' },
        { cat: plasticCat.id, rate: '22.00' },
        { cat: metalCat.id, rate: '36.00' },
      ],
    },
    {
      businessName: 'Bengal Eco Scrap Collectors',
      ownerName: 'Bikash Mondal',
      phone: '+91 94745 09312',
      email: 'bengaleco@gmail.com',
      address: 'Hirapur Police Gate, Burnpur Road',
      area: 'Hirapur',
      locality: 'Hirapur More',
      city: 'Asansol',
      state: 'West Bengal',
      pinCode: '713325',
      latitude: '23.682100',
      longitude: '86.979000',
      serviceRadiusKm: '4.50',
      warehouseId: warehouseAsansol.id,
      rates: [
        { cat: paperCat.id, rate: '18.00' },
        { cat: plasticCat.id, rate: '25.00' },
        { cat: metalCat.id, rate: '33.00' },
        { cat: eWasteCat.id, rate: '48.00' },
      ],
    },
    {
      businessName: 'Hindustan Kabadi Store',
      ownerName: 'Mohammad Shamim',
      phone: '+91 97321 55678',
      email: 'hindustan.kabadi@yahoo.com',
      address: 'Near Old Bus Stand, Kalyanpur Housing',
      area: 'Kalyanpur',
      locality: 'Kalyanpur Satellite Township',
      city: 'Asansol',
      state: 'West Bengal',
      pinCode: '713305',
      latitude: '23.702000',
      longitude: '86.965000',
      serviceRadiusKm: '7.00',
      warehouseId: warehouseAsansol.id,
      rates: [
        { cat: paperCat.id, rate: '16.00' },
        { cat: plasticCat.id, rate: '23.50' },
        { cat: metalCat.id, rate: '35.00' },
      ],
    },
    {
      businessName: 'Damodar Metal & Electronic Scrap',
      ownerName: 'Tarak Das',
      phone: '+91 98001 77234',
      email: 'damodar.scrap@gmail.com',
      address: 'Damodar Ghat Road, Santa Work Area',
      area: 'Santa',
      locality: 'Damodar Bank',
      city: 'Asansol',
      state: 'West Bengal',
      pinCode: '713325',
      latitude: '23.675000',
      longitude: '86.991000',
      serviceRadiusKm: '5.50',
      warehouseId: warehouseAsansol.id,
      rates: [
        { cat: metalCat.id, rate: '37.00' },
        { cat: eWasteCat.id, rate: '55.00' },
        { cat: paperCat.id, rate: '15.50' },
      ],
    },
    // Gurugram Cluster (Near Lat: 28.4730, Lng: 77.0320)
    {
      businessName: 'Yadav Scrap Traders',
      ownerName: 'Ramesh Yadav',
      phone: '+91 98101 22390',
      email: 'yadav.scrap@gmail.com',
      address: 'Near Maruti Gate 2, Sector 14 Market',
      area: 'Sector 14',
      locality: 'Old DLF Colony',
      city: 'Gurugram',
      state: 'Haryana',
      pinCode: '122001',
      latitude: '28.473500',
      longitude: '77.032100',
      serviceRadiusKm: '6.00',
      warehouseId: warehouseGurugram.id,
      rates: [
        { cat: paperCat.id, rate: '19.00' },
        { cat: plasticCat.id, rate: '26.00' },
        { cat: metalCat.id, rate: '38.00' },
        { cat: eWasteCat.id, rate: '60.00' },
      ],
    },
    {
      businessName: 'Gurugram Green Kabadiwala',
      ownerName: 'Joginder Singh',
      phone: '+91 98118 76543',
      email: 'greengurugram@gmail.com',
      address: 'Shop 8, Sector 15 Part 2',
      area: 'Sector 15',
      locality: 'Civil Lines Road',
      city: 'Gurugram',
      state: 'Haryana',
      pinCode: '122001',
      latitude: '28.468000',
      longitude: '77.041000',
      serviceRadiusKm: '5.00',
      warehouseId: warehouseGurugram.id,
      rates: [
        { cat: paperCat.id, rate: '18.50' },
        { cat: plasticCat.id, rate: '25.00' },
        { cat: metalCat.id, rate: '36.00' },
      ],
    },
    {
      businessName: 'Millennium City Recyclers',
      ownerName: 'Vikas Kumar',
      phone: '+91 99100 44321',
      email: 'vikas.mcity@gmail.com',
      address: 'Sector 31 Commercial Complex',
      area: 'Sector 31',
      locality: 'Huda Market',
      city: 'Gurugram',
      state: 'Haryana',
      pinCode: '122001',
      latitude: '28.455000',
      longitude: '77.050000',
      serviceRadiusKm: '7.50',
      warehouseId: warehouseGurugram.id,
      rates: [
        { cat: paperCat.id, rate: '20.00' },
        { cat: plasticCat.id, rate: '27.00' },
        { cat: metalCat.id, rate: '40.00' },
        { cat: eWasteCat.id, rate: '65.00' },
      ],
    },
    // Bengaluru Cluster (Near Lat: 12.9784, Lng: 77.6408)
    {
      businessName: 'Indiranagar Dry Waste Solutions',
      ownerName: 'S. Manjunath',
      phone: '+91 98450 11982',
      email: 'manjunath.drywaste@gmail.com',
      address: '100 Feet Road, 12th Main Crossing',
      area: 'Indiranagar',
      locality: 'HAL 2nd Stage',
      city: 'Bengaluru',
      state: 'Karnataka',
      pinCode: '560038',
      latitude: '12.978300',
      longitude: '77.640900',
      serviceRadiusKm: '6.00',
      warehouseId: warehouseBlr.id,
      rates: [
        { cat: paperCat.id, rate: '21.00' },
        { cat: plasticCat.id, rate: '28.00' },
        { cat: metalCat.id, rate: '42.00' },
        { cat: eWasteCat.id, rate: '75.00' },
      ],
    },
    {
      businessName: 'Swachh CV Raman Nagar Scrap',
      ownerName: 'Prashanth Gowda',
      phone: '+91 98860 33441',
      email: 'prashanth.gowda@gmail.com',
      address: 'Kaggadasapura Main Road',
      area: 'CV Raman Nagar',
      locality: 'DRDO Township',
      city: 'Bengaluru',
      state: 'Karnataka',
      pinCode: '560093',
      latitude: '12.985000',
      longitude: '77.665000',
      serviceRadiusKm: '5.50',
      warehouseId: warehouseBlr.id,
      rates: [
        { cat: paperCat.id, rate: '19.50' },
        { cat: plasticCat.id, rate: '26.50' },
        { cat: metalCat.id, rate: '39.00' },
      ],
    },
    {
      businessName: 'Namma Bengaluru Raddi Mart',
      ownerName: 'Abdul Khader',
      phone: '+91 97410 88776',
      email: 'abdul.raddimart@gmail.com',
      address: 'Thippasandra 80 Feet Road',
      area: 'Thippasandra',
      locality: 'Near Post Office',
      city: 'Bengaluru',
      state: 'Karnataka',
      pinCode: '560075',
      latitude: '12.971000',
      longitude: '77.653000',
      serviceRadiusKm: '5.00',
      warehouseId: warehouseBlr.id,
      rates: [
        { cat: paperCat.id, rate: '20.50' },
        { cat: plasticCat.id, rate: '27.50' },
        { cat: metalCat.id, rate: '41.00' },
        { cat: eWasteCat.id, rate: '70.00' },
      ],
    },
  ];

  for (const item of kabadiwalaRawData) {
    const kUser = await db
      .insert(users)
      .values({
        uid: `kabadiwala_auth_${item.phone.replace(/[^0-9]/g, '')}`,
        name: item.ownerName,
        email: item.email,
        phone: item.phone,
        passwordHash: defaultPasswordHash,
        role: 'KABADIWALA',
        status: 'ACTIVE',
        emailVerified: true,
      })
      .onConflictDoNothing()
      .returning();

    const createdKUser = kUser[0] || (await db.select().from(users).where(eq(users.email, item.email)).limit(1))[0];

    const insertedK = await db
      .insert(kabadiwalas)
      .values({
        userId: createdKUser ? createdKUser.id : null,
        warehouseId: item.warehouseId,
        businessName: item.businessName,
        ownerName: item.ownerName,
        phone: item.phone,
        email: item.email,
        address: item.address,
        area: item.area,
        locality: item.locality,
        city: item.city,
        state: item.state,
        pinCode: item.pinCode,
        latitude: item.latitude,
        longitude: item.longitude,
        serviceRadiusKm: item.serviceRadiusKm,
        verificationStatus: 'VERIFIED',
        pickupAvailable: true,
        operatingHours: '8:30 AM – 6:30 PM',
        status: 'ACTIVE',
        source: 'WAREHOUSE_VERIFIED_IMPORT',
        sourceReference: `WH-IMP-2026-${item.pinCode}`,
      })
      .returning();

    const kabadiwalaRecord = insertedK[0];
    if (kabadiwalaRecord) {
      for (const r of item.rates) {
        await db.insert(kabadiwalaRates).values({
          kabadiwalaId: kabadiwalaRecord.id,
          categoryId: r.cat,
          ratePerKg: r.rate,
          currency: 'INR',
          updatedBy: 'WAREHOUSE_DATA_SYNC',
          status: 'ACTIVE',
        });
      }
    }
  }

  // 6. Sample Live Bookings, Transactions & Reviews
  const firstK = (await db.select().from(kabadiwalas).limit(1))[0];
  const firstH = (await db.select().from(households).limit(1))[0];

  if (firstK && firstH) {
    // Booking 1: Completed
    const completedPickup = await db
      .insert(pickups)
      .values({
        bookingNumber: 'KC-2026-0001',
        householdId: firstH.id,
        kabadiwalaId: firstK.id,
        pickupAddress: firstH.address,
        scheduledDate: '2026-09-22',
        timeSlot: '10:00 AM - 12:00 PM',
        status: 'COMPLETED',
        estimatedTotal: '450.00',
        finalTotal: '468.00',
        notes: 'Doorstep pickup completed with calibrated digital scale.',
      })
      .returning();

    if (completedPickup[0]) {
      const pid = completedPickup[0].id;
      await db.insert(pickupItems).values([
        {
          pickupId: pid,
          categoryId: paperCat.id,
          categoryName: 'Paper',
          subcategoryName: 'Old Newspaper',
          estimatedWeight: '12.00',
          rateAtBooking: '17.50',
          estimatedAmount: '210.00',
          actualWeight: '13.00',
          finalRate: '17.50',
          finalAmount: '227.50',
        },
        {
          pickupId: pid,
          categoryId: metalCat.id,
          categoryName: 'Metal',
          subcategoryName: 'Iron Scrap',
          estimatedWeight: '7.00',
          rateAtBooking: '34.50',
          estimatedAmount: '241.50',
          actualWeight: '7.00',
          finalRate: '34.50',
          finalAmount: '241.50',
        },
      ]);

      await db.insert(pickupStatusHistory).values([
        { pickupId: pid, status: 'REQUESTED', changedBy: 'HOUSEHOLD', notes: 'Scheduled via web portal' },
        { pickupId: pid, status: 'ACCEPTED', changedBy: 'KABADIWALA', notes: 'Confirmed slot 10 AM' },
        { pickupId: pid, status: 'ON_THE_WAY', changedBy: 'KABADIWALA', notes: 'Collector en route' },
        { pickupId: pid, status: 'COMPLETED', changedBy: 'KABADIWALA', notes: 'Doorstep digital scale weigh-in confirmed' },
      ]);

      await db.insert(transactions).values({
        pickupId: pid,
        householdId: firstH.id,
        kabadiwalaId: firstK.id,
        totalWeightKg: '20.00',
        totalAmount: '468.00',
        paymentMethod: 'UPI',
        receiptNumber: 'REC-KC-2026-0922-01',
        digitalScaleVerified: true,
      });

      await db.insert(reviews).values({
        pickupId: pid,
        householdId: firstH.id,
        kabadiwalaId: firstK.id,
        rating: 5,
        comment: 'Very polite collector. Used calibrated electronic scale right in front of me and paid instantly via UPI!',
      });
    }

    // Booking 2: Active / Upcoming (Requested / Accepted)
    const upcomingPickup = await db
      .insert(pickups)
      .values({
        bookingNumber: 'KC-2026-0002',
        householdId: firstH.id,
        kabadiwalaId: firstK.id,
        pickupAddress: firstH.address,
        scheduledDate: '2026-09-24',
        timeSlot: '02:00 PM - 04:00 PM',
        status: 'ACCEPTED',
        estimatedTotal: '380.00',
        notes: 'Call on reaching gate.',
      })
      .returning();

    if (upcomingPickup[0]) {
      const pid2 = upcomingPickup[0].id;
      await db.insert(pickupItems).values([
        {
          pickupId: pid2,
          categoryId: plasticCat.id,
          categoryName: 'Plastic',
          subcategoryName: 'PET Bottles',
          estimatedWeight: '10.00',
          rateAtBooking: '24.00',
          estimatedAmount: '240.00',
        },
        {
          pickupId: pid2,
          categoryId: paperCat.id,
          categoryName: 'Paper',
          subcategoryName: 'Cardboard Boxes',
          estimatedWeight: '8.00',
          rateAtBooking: '17.50',
          estimatedAmount: '140.00',
        },
      ]);

      await db.insert(pickupStatusHistory).values([
        { pickupId: pid2, status: 'REQUESTED', changedBy: 'HOUSEHOLD', notes: 'Scheduled via app' },
        { pickupId: pid2, status: 'ACCEPTED', changedBy: 'KABADIWALA', notes: 'Assigned for afternoon run' },
      ]);
    }
  }

  console.log('--- Seed Completed Successfully! ---');
}
