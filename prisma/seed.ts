import { PrismaClient } from "../lib/generated/prisma/client"
import { PrismaNeon } from "@prisma/adapter-neon"
import { neonConfig } from "@neondatabase/serverless"
import ws from "ws"
import bcrypt from "bcryptjs"

// Required for Neon serverless in Node.js (non-browser) environments
neonConfig.webSocketConstructor = ws

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log("Nettoyage de la base...")
  await prisma.noShowReport.deleteMany()
  await prisma.rating.deleteMany()
  await prisma.booking.deleteMany()
  await prisma.slot.deleteMany()
  await prisma.mission.deleteMany()
  await prisma.associationMember.deleteMany()
  await prisma.association.deleteMany()
  await prisma.session.deleteMany()
  await prisma.account.deleteMany()
  await prisma.user.deleteMany()

  const passwordHash = await bcrypt.hash("Admin1234!", 12)
  const assoPasswordHash = await bcrypt.hash("Asso1234!", 12)
  const volPasswordHash = await bcrypt.hash("Benevole1!", 12)

  console.log("Creation des utilisateurs...")

  const admin = await prisma.user.create({
    data: {
      email: "admin@lasso.fr",
      name: "Admin Lasso",
      firstName: "Admin",
      password: passwordHash,
      roles: ["ADMIN", "VOLUNTEER"],
      reliabilityScore: 5.0,
    },
  })

  const marie = await prisma.user.create({
    data: {
      email: "marie@restos-coeur.fr",
      name: "Marie Dupont",
      firstName: "Marie",
      password: assoPasswordHash,
      roles: ["VOLUNTEER", "ASSOCIATION"],
      arrondissement: 11,
      bio: "Responsable benevoles aux Restos du Coeur Paris 11e.",
      reliabilityScore: 5.0,
    },
  })

  const sophie = await prisma.user.create({
    data: {
      email: "sophie@example.com",
      name: "Sophie Martin",
      firstName: "Sophie",
      password: volPasswordHash,
      roles: ["VOLUNTEER"],
      arrondissement: 11,
      bio: "Etudiante en medecine, envie d'aider.",
      reliabilityScore: 4.8,
    },
  })

  const lucas = await prisma.user.create({
    data: {
      email: "lucas@example.com",
      name: "Lucas Bernard",
      firstName: "Lucas",
      password: volPasswordHash,
      roles: ["VOLUNTEER"],
      arrondissement: 18,
      bio: "Developpeur web, benevole le week-end.",
      reliabilityScore: 4.5,
    },
  })

  const amina = await prisma.user.create({
    data: {
      email: "amina@example.com",
      name: "Amina Diallo",
      firstName: "Amina",
      password: volPasswordHash,
      roles: ["VOLUNTEER"],
      arrondissement: 20,
      bio: "Passionnee par le social et l'entraide.",
      reliabilityScore: 5.0,
    },
  })

  const thomas = await prisma.user.create({
    data: {
      email: "thomas@example.com",
      name: "Thomas Petit",
      firstName: "Thomas",
      password: volPasswordHash,
      roles: ["VOLUNTEER"],
      arrondissement: 5,
      bio: "Prof de maths, dispo les mercredis.",
      reliabilityScore: 3.2,
      noShowCount: 2,
    },
  })

  const lea = await prisma.user.create({
    data: {
      email: "lea@example.com",
      name: "Lea Moreau",
      firstName: "Lea",
      password: volPasswordHash,
      roles: ["VOLUNTEER"],
      arrondissement: 3,
      bio: "Photographe freelance, aime donner de son temps.",
      reliabilityScore: 4.9,
    },
  })

  console.log("Creation des associations...")

  const restos = await prisma.association.create({
    data: {
      name: "Les Restos du Coeur",
      slug: "restos-du-coeur-paris",
      rnaNumber: "W751234567",
      rnaVerified: true,
      humanValidated: true,
      description:
        "Les Restos du Coeur est une association loi de 1901, reconnue d'utilite publique, qui aide les personnes demunies, notamment dans le domaine alimentaire.",
      address: "42 rue du Faubourg Saint-Antoine, 75011 Paris",
      arrondissement: 11,
      lat: 48.8534,
      lng: 2.3741,
      category: "aide_personne",
      website: "https://www.restosducoeur.org",
      avgRating: 4.7,
    },
  })

  const emmaus = await prisma.association.create({
    data: {
      name: "Emmaus Solidarite",
      slug: "emmaus-solidarite",
      rnaNumber: "W751234568",
      rnaVerified: true,
      humanValidated: true,
      description:
        "Emmaus Solidarite agit pour l'hebergement, l'insertion et l'accompagnement social des personnes en difficulte.",
      address: "32 rue des Bourdonnais, 75018 Paris",
      arrondissement: 18,
      lat: 48.8866,
      lng: 2.3522,
      category: "aide_personne",
      website: "https://www.emmaus-solidarite.org",
      avgRating: 4.5,
    },
  })

  const secours = await prisma.association.create({
    data: {
      name: "Secours Populaire Paris",
      slug: "secours-populaire-paris",
      rnaNumber: "W751234569",
      rnaVerified: true,
      humanValidated: true,
      description:
        "Le Secours Populaire agit contre la pauvrete et l'exclusion en France et dans le monde.",
      address: "9 rue Froissart, 75003 Paris",
      arrondissement: 3,
      lat: 48.8631,
      lng: 2.3631,
      category: "aide_personne",
      website: "https://www.secourspopulaire.fr",
      avgRating: 4.6,
    },
  })

  // Lier Marie aux Restos du Coeur
  await prisma.associationMember.create({
    data: {
      userId: marie.id,
      associationId: restos.id,
      isOwner: true,
    },
  })

  console.log("Creation des missions et creneaux...")

  const now = new Date()
  function futureDate(daysFromNow: number, hour: number): Date {
    const d = new Date(now)
    d.setDate(d.getDate() + daysFromNow)
    d.setHours(hour, 0, 0, 0)
    return d
  }

  // Missions Restos du Coeur
  const m1 = await prisma.mission.create({
    data: {
      associationId: restos.id,
      title: "Distribution de repas chauds",
      description:
        "Aidez-nous a distribuer des repas chauds aux personnes dans le besoin dans le 11e arrondissement. Formation sur place.",
      category: "aide_personne",
      address: "42 rue du Faubourg Saint-Antoine, 75011 Paris",
      lat: 48.8534,
      lng: 2.3741,
      durationMin: 120,
      maxVolunteers: 5,
      status: "ACTIVE",
    },
  })

  const m2 = await prisma.mission.create({
    data: {
      associationId: restos.id,
      title: "Tri de vetements solidaires",
      description:
        "Triez et rangez les vetements donnes pour les redistribuer aux familles. Ambiance conviviale garantie !",
      category: "aide_personne",
      address: "42 rue du Faubourg Saint-Antoine, 75011 Paris",
      durationMin: 90,
      maxVolunteers: 3,
      status: "ACTIVE",
    },
  })

  const m3 = await prisma.mission.create({
    data: {
      associationId: restos.id,
      title: "Soutien scolaire collegiens",
      description:
        "Accompagnez des collegiens en difficulte dans leurs devoirs de maths et francais.",
      category: "education",
      address: "42 rue du Faubourg Saint-Antoine, 75011 Paris",
      durationMin: 90,
      maxVolunteers: 4,
      status: "ACTIVE",
    },
  })

  const m4 = await prisma.mission.create({
    data: {
      associationId: restos.id,
      title: "Accueil et orientation des visiteurs",
      description:
        "Accueillez les personnes qui viennent chercher de l'aide et orientez-les vers les bons services.",
      category: "aide_personne",
      address: "42 rue du Faubourg Saint-Antoine, 75011 Paris",
      durationMin: 60,
      maxVolunteers: 2,
      status: "ACTIVE",
    },
  })

  // Missions Emmaus
  const m5 = await prisma.mission.create({
    data: {
      associationId: emmaus.id,
      title: "Maraude de nuit",
      description:
        "Participez a une maraude pour aller a la rencontre des personnes sans-abri. Equipe encadree.",
      category: "aide_personne",
      address: "32 rue des Bourdonnais, 75018 Paris",
      lat: 48.8866,
      lng: 2.3522,
      durationMin: 120,
      maxVolunteers: 6,
      status: "ACTIVE",
    },
  })

  const m6 = await prisma.mission.create({
    data: {
      associationId: emmaus.id,
      title: "Renovation d'un logement solidaire",
      description:
        "Coup de pinceau et petits travaux dans un logement d'insertion. Materiel fourni.",
      category: "aide_personne",
      address: "15 rue Marcadet, 75018 Paris",
      durationMin: 120,
      maxVolunteers: 4,
      status: "ACTIVE",
    },
  })

  const m7 = await prisma.mission.create({
    data: {
      associationId: emmaus.id,
      title: "Animation atelier cuisine",
      description:
        "Animez un atelier cuisine pour les residents du centre d'hebergement. Recettes simples et conviviales.",
      category: "aide_personne",
      address: "32 rue des Bourdonnais, 75018 Paris",
      durationMin: 90,
      maxVolunteers: 3,
      status: "ACTIVE",
    },
  })

  // Missions Secours Populaire
  const m8 = await prisma.mission.create({
    data: {
      associationId: secours.id,
      title: "Collecte alimentaire en supermarche",
      description:
        "Tenez un stand de collecte a l'entree du supermarche et sensibilisez les clients.",
      category: "aide_personne",
      address: "Centre commercial Beaubourg, 75003 Paris",
      lat: 48.8631,
      lng: 2.3631,
      durationMin: 120,
      maxVolunteers: 4,
      status: "ACTIVE",
    },
  })

  const m9 = await prisma.mission.create({
    data: {
      associationId: secours.id,
      title: "Aide aux devoirs ecole primaire",
      description:
        "Aidez des enfants de CP/CE1 a apprendre a lire et compter dans une ecole du 3e.",
      category: "education",
      address: "Ecole Rambuteau, 75003 Paris",
      durationMin: 60,
      maxVolunteers: 3,
      status: "ACTIVE",
    },
  })

  const m10 = await prisma.mission.create({
    data: {
      associationId: secours.id,
      title: "Distribution de colis alimentaires",
      description:
        "Preparez et distribuez des colis alimentaires aux familles inscrites.",
      category: "aide_personne",
      address: "9 rue Froissart, 75003 Paris",
      durationMin: 90,
      maxVolunteers: 5,
      status: "ACTIVE",
    },
  })

  // Slots pour chaque mission (2-3 par mission)
  const missions = [m1, m2, m3, m4, m5, m6, m7, m8, m9, m10]
  const allSlots = []

  for (let i = 0; i < missions.length; i++) {
    const m = missions[i]
    const slotsData = [
      {
        missionId: m.id,
        startsAt: futureDate(3 + i * 2, 10),
        endsAt: futureDate(3 + i * 2, 10 + m.durationMin / 60),
        spotsTotal: m.maxVolunteers,
        spotsRemaining: m.maxVolunteers,
        status: "OPEN" as const,
      },
      {
        missionId: m.id,
        startsAt: futureDate(7 + i * 2, 14),
        endsAt: futureDate(7 + i * 2, 14 + m.durationMin / 60),
        spotsTotal: m.maxVolunteers,
        spotsRemaining: m.maxVolunteers,
        status: "OPEN" as const,
      },
    ]

    if (i % 3 === 0) {
      slotsData.push({
        missionId: m.id,
        startsAt: futureDate(14 + i, 9),
        endsAt: futureDate(14 + i, 9 + m.durationMin / 60),
        spotsTotal: m.maxVolunteers,
        spotsRemaining: m.maxVolunteers,
        status: "OPEN" as const,
      })
    }

    for (const sd of slotsData) {
      const slot = await prisma.slot.create({ data: sd })
      allSlots.push(slot)
    }
  }

  console.log("Creation des bookings...")

  // Sophie reservee sur le 1er slot de m1
  if (allSlots[0]) {
    await prisma.booking.create({
      data: {
        userId: sophie.id,
        slotId: allSlots[0].id,
        status: "CONFIRMED",
      },
    })
    await prisma.slot.update({
      where: { id: allSlots[0].id },
      data: { spotsRemaining: { decrement: 1 } },
    })
  }

  // Lucas reserve sur le 1er slot de m5
  if (allSlots[6]) {
    await prisma.booking.create({
      data: {
        userId: lucas.id,
        slotId: allSlots[6].id,
        status: "CONFIRMED",
      },
    })
    await prisma.slot.update({
      where: { id: allSlots[6].id },
      data: { spotsRemaining: { decrement: 1 } },
    })
  }

  // Amina reservee sur le 2e slot de m8
  if (allSlots[15]) {
    await prisma.booking.create({
      data: {
        userId: amina.id,
        slotId: allSlots[15].id,
        status: "CONFIRMED",
      },
    })
    await prisma.slot.update({
      where: { id: allSlots[15].id },
      data: { spotsRemaining: { decrement: 1 } },
    })
  }

  // Thomas a un no-show sur un ancien slot (on cree un slot passe)
  const pastSlot = await prisma.slot.create({
    data: {
      missionId: m1.id,
      startsAt: futureDate(-7, 10),
      endsAt: futureDate(-7, 12),
      spotsTotal: 5,
      spotsRemaining: 4,
      status: "OPEN",
    },
  })

  const thomasBooking = await prisma.booking.create({
    data: {
      userId: thomas.id,
      slotId: pastSlot.id,
      status: "NO_SHOW",
    },
  })

  await prisma.noShowReport.create({
    data: {
      bookingId: thomasBooking.id,
      reportedBy: restos.id,
      note: "Ne s'est pas presente le jour de la distribution.",
    },
  })

  // Lea a complete une mission
  const completedSlot = await prisma.slot.create({
    data: {
      missionId: m10.id,
      startsAt: futureDate(-3, 14),
      endsAt: futureDate(-3, 15.5),
      spotsTotal: 5,
      spotsRemaining: 4,
      status: "OPEN",
    },
  })

  const leaBooking = await prisma.booking.create({
    data: {
      userId: lea.id,
      slotId: completedSlot.id,
      status: "COMPLETED",
      completedAt: futureDate(-3, 15.5),
    },
  })

  await prisma.rating.create({
    data: {
      bookingId: leaBooking.id,
      fromType: "volunteer",
      fromId: lea.id,
      score: 5,
      comment: "Super experience, equipe tres accueillante !",
      isPublic: true,
    },
  })

  console.log("Seed termine avec succes !")
  console.log(`  - ${1} admin: admin@lasso.fr / Admin1234!`)
  console.log(`  - ${1} asso manager: marie@restos-coeur.fr / Asso1234!`)
  console.log(`  - ${5} benevoles: sophie, lucas, amina, thomas, lea / Benevole1!`)
  console.log(`  - ${3} associations`)
  console.log(`  - ${10} missions`)
  console.log(`  - ${allSlots.length + 2} creneaux`)
}

main()
  .catch((e) => {
    console.error("Erreur seed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
