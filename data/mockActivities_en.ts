const mockActivities_en = [
    // Translated activities 1 through 3...
    {
        id: "1",
        title: "Snowshoe Trekking",
        description:
          "Discover the winter magic of Bariloche by exploring snow-covered trails with snowshoes. Enjoy panoramic viewpoints and snow-covered Andean forests.",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202023-10-23%20at%2011.12.50%20PM-TzEz8Y1wpkOkQdjdfOupduAJgzRNxn.jpeg",
        price: 95,
        duration: "5 hours",
        location: "Refugio Jakob / Cerro López",
        rating: 4.9,
        category: "Winter Trekking",
        season: "winter",
        difficulty: "Moderate",
        included: [
          "Snowshoes and poles",
          "Mountain guide specialized in winter terrain",
          "Roundtrip transport from the city center",
          "Hot drink and energy snacks",
          "Activity insurance",
          "Technical briefing on snowshoe use",
        ],
        notIncluded: [
          "Lunch (optional)",
          "Technical clothing (available for rent)",
        ],
        requirements: [
          "Moderate physical condition",
          "Warm, waterproof clothing",
          "Waterproof footwear",
          "Gloves and hat",
          "Sunscreen",
        ],
        startTimes: ["08:30", "10:00"],
        guide: {
          name: "Ana Montaña",
          image: "/images/guide-ana.png",
          experience: "11 years",
          languages: ["Spanish", "English", "Italian"],
          bio: "Mountain guide specialized in winter activities with extensive experience in the Patagonian and European Andes.",
          phone: "5492944345678",
        },
        images: [
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202023-10-23%20at%2011.12.50%20PM-TzEz8Y1wpkOkQdjdfOupduAJgzRNxn.jpeg",
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/images.jpg-sWP68889lyxaUHXtfhpXCKVMfFgGSJ.jpeg",
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202023-10-23%20at%2011.12.50%20PM-s2ajuJLtFLpKMOWfR33Wh5WiNY1vfq.jpeg",
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-05-16%20at%201.31.37%20PM%20%281%29-fUAriBAulRsLdoIdqb4RoWQeGgY19P.jpeg",
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-05-16%20at%201.31.35%20PM-ePir6RSiYc5mnKjd2uqztldB7MQQAg.jpeg",
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-05-16%20at%2012.57.19%20PM-D6G3jNPH9YPQiwdb0HxmkkISAtWRC1.jpeg",
        ],
      },
      {
        id: "2",
        title: "Climbing in Valle Encantado",
        description:
          "Experience the thrill of climbing in one of Patagonia's top destinations, with rock walls for all levels alongside the Limay River.",
        image: "/images/escalada-valle-encantado.jpeg",
        price: 120,
        duration: "6 hours",
        location: "Valle Encantado",
        rating: 4.9,
        category: "Climbing",
        season: "summer",
        difficulty: "Variable (beginner to advanced)",
        included: [
          "Full climbing gear",
          "Certified instructor",
          "Transport from the city center",
          "Energy snack",
          "Activity insurance"
        ],
        notIncluded: [
          "Lunch",
          "Technical clothing"
        ],
        requirements: [
          "No previous experience required for beginners",
          "Good physical condition",
          "No fear of heights"
        ],
        startTimes: ["08:30", "13:00"],
        guide: {
          name: "Ana Montaña",
          image: "/images/guide-ana.png",
          experience: "11 years",
          languages: ["Spanish", "English", "Italian"],
          bio: "Professional climber with international experience and UIAA certification. Specialist in beginner training.",
          phone: "5492944345678"
        },
        images: [
          "/images/escalada-valle-encantado.jpeg",
          "/images/escalada-valle-encantado-1.jpeg",
          "/images/escalada-valle-encantado-2.jpeg",
          "/images/escalada-valle-encantado-3.jpeg"
        ]
      },
      {
        id: "3",
        title: "Fly Fishing in the Limay River",
        description:
          "Experience fly fishing in one of Patagonia’s top rivers, known for its trout and stunning natural surroundings.",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-05-23%20at%2012.57.23%20PM-Na1uHp91a0gGYbra8d2xvSPPmEAjxy.jpeg",
        price: 180,
        duration: "8 hours",
        location: "Limay River",
        rating: 4.8,
        category: "Fishing",
        season: "summer",
        difficulty: "Low",
        included: [
          "Full fishing gear",
          "Specialized guide",
          "Transport",
          "Gourmet lunch"
        ],
        notIncluded: [
          "Fishing license (can be acquired)"
        ],
        requirements: [
          "No previous experience required"
        ],
        startTimes: ["07:00"],
        guide: {
          name: "Roberto Anzuelo",
          image: "/images/guide-roberto.png",
          experience: "15 years",
          languages: ["Spanish", "English"],
          bio: "Professional angler with deep knowledge of the region’s rivers and lakes.",
          phone: "5492944456789"
        },
        images: [
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-05-23%20at%2012.56.19%20PM-ajYCxUU4f8z0C1UMrPcSpbTEpJPDpp.jpeg",
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-05-23%20at%2012.57.23%20PM-Na1uHp91a0gGYbra8d2xvSPPmEAjxy.jpeg",
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-05-23%20at%2012.56.51%20PM-KGGSB1LoDLGJIIDaowRXIkS6loQHAT.jpeg",
          "/images/fishing-limay.png"
        ]
      },
    {
      id: "4",
      title: "Kayaking in Bahía López",
      description: "Paddle through the crystal-clear waters of Bahía López, surrounded by forests and mountains, with stunning views of Cerro López and Isla Centinela.",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-05-16%20at%2012.24.48%20PM%20%282%29-hPRhyOKDY156xpGQZxZwgVjyqfdHF3.jpeg",
      price: 85,
      duration: "4 hours",
      location: "Bahía López / Lake Nahuel Huapi",
      rating: 4.8,
      category: "Water Activities",
      season: "summer",
      difficulty: "Low",
      included: [
        "Kayak and full equipment",
        "Specialized guide",
        "Transport from the city center",
        "Snack",
        "Activity insurance"
      ],
      notIncluded: [
        "Lunch",
        "Waterproof clothing (available for rent)"
      ],
      requirements: [
        "Must know how to swim",
        "No previous experience required"
      ],
      startTimes: ["09:00", "14:00"],
      guide: {
        name: "Carlos Remero",
        image: "/images/guide-carlos.png",
        experience: "10 years",
        languages: ["Spanish", "English", "Portuguese"],
        bio: "Kayak instructor with extensive experience in Patagonian lakes and international certification.",
        phone: "5492944123456"
      },
      images: [
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-05-16%20at%2012.24.48%20PM%20%282%29-hPRhyOKDY156xpGQZxZwgVjyqfdHF3.jpeg",
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-05-16%20at%2012.24.48%20PM%20%283%29-UKbgSN2ekM54XalUvISf63a09vb3wS.jpeg",
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-05-16%20at%2012.24.48%20PM%20%281%29-rfTzf8CuCHKvPk3xI6U81Z80VH2EG9.jpeg",
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-05-16%20at%2012.24.48%20PM-rhYvFQnTp1LORTuPHrJfrY7E6GCnVT.jpeg",
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-05-16%20at%2012.24.47%20PM-rdmd0ThcTSkWAC9T4zYWji2RcNjrPb.jpeg"
      ]
    },
    {
      id: "5",
      title: "Trekking to Refugio Frey",
      description: "Embark on a full-day trek to the iconic Refugio Frey, surrounded by impressive granite spires and deep-blue mountain lakes.",
      image: "/images/trekking-vista-lago.jpeg",
      price: 75,
      duration: "8 hours",
      location: "Cerro Catedral",
      rating: 4.9,
      category: "Trekking",
      season: "summer",
      difficulty: "High",
      included: [
        "Mountain guide",
        "Trekking poles",
        "Lunch",
        "Transport"
      ],
      notIncluded: [
        "Personal gear",
        "Refuge entrance fee"
      ],
      requirements: [
        "Good physical condition",
        "Previous trekking experience",
        "Appropriate footwear and clothing"
      ],
      startTimes: ["07:30"],
      guide: {
        name: "Martín Cumbre",
        image: "/images/guide-martin.png",
        experience: "12 years",
        languages: ["Spanish", "English", "German"],
        bio: "Experienced mountaineer with ascents throughout the Andes mountain range.",
        phone: "5492944567890"
      },
      images: [
        "/images/trekking-vista-lago.jpeg",
        "/images/trekking-mountain-path.jpeg",
        "/images/trekking-sunset-view.jpeg",
        "/images/trekking-catedral.png"
      ]
    },
    {
      id: "6",
      title: "Kitesurf Lessons",
      description: "Learn or improve your kitesurfing skills with personalized lessons on Bariloche’s best beaches, featuring steady winds and stunning scenery.",
      image: "/images/kitesurf-sunset-bariloche-beach.jpeg",
      price: 90,
      duration: "4 hours",
      location: "Playa Bonita / Lake Nahuel Huapi",
      rating: 4.9,
      category: "Water Activities",
      season: "summer",
      difficulty: "Variable",
      included: [
        "Full kitesurf gear",
        "Certified instructor",
        "Wetsuit",
        "Transport from city center",
        "Activity insurance"
      ],
      notIncluded: [
        "Lunch",
        "Photos and videos (available for an additional cost)"
      ],
      requirements: [
        "Must know how to swim",
        "Basic physical condition",
        "Swimwear"
      ],
      startTimes: ["10:00", "14:00"],
      guide: {
        name: "Laura Viento",
        image: "/images/guide-laura.png",
        experience: "8 years",
        languages: ["Spanish", "English", "Portuguese"],
        bio: "Professional kitesurf instructor with international experience and national champion in the discipline.",
        phone: "5492944678901"
      },
      images: [
        "/images/kitesurf-sunset-bariloche-beach.jpeg",
        "/images/kitesurf-jump.jpeg",
        "/images/kitesurf-sunset.jpeg"
      ]
    },
    {
      id: "7",
      title: "Skiing at Cerro Catedral",
      description: "Enjoy top-notch skiing at South America's largest ski resort, with slopes for all levels.",
      image: "/images/ski-catedral-family-1.jpeg",
      price: 120,
      duration: "6 hours",
      location: "Cerro Catedral",
      rating: 4.9,
      category: "Skiing",
      season: "winter",
      difficulty: "Variable",
      included: [
        "Day pass",
        "Full equipment",
        "Instructor",
        "Transport"
      ],
      notIncluded: [
        "Technical clothing (available for rent)",
        "Lunch"
      ],
      requirements: [
        "Warm clothing",
        "Sunscreen"
      ],
      startTimes: ["08:00", "13:00"],
      guide: {
        name: "Martín Cumbre",
        image: "/images/guide-martin.png",
        experience: "12 years",
        languages: ["Spanish", "English", "German"],
        bio: "Certified ski instructor with experience at the world’s top ski resorts.",
        phone: "5492944890123"
      },
      images: [
        "/images/ski-catedral-family-1.jpeg",
        "/images/ski-catedral-family-2.jpeg"
      ]
    },
    {
      id: "8",
      title: "Backcountry Skiing in Frey",
      description: "Explore the majestic Andes on this ski touring adventure, accessing pristine powder zones and stunning scenery.",
      image: "/images/ski-touring-mountain.jpeg",
      price: 150,
      duration: "8 hours",
      location: "Refugio Frey and surroundings",
      rating: 4.9,
      category: "Skiing",
      season: "winter",
      difficulty: "High",
      included: [
        "Specialized guide",
        "Safety equipment",
        "Transport",
        "Mountain snack"
      ],
      notIncluded: [
        "Ski touring equipment",
        "Full lunch"
      ],
      requirements: [
        "Previous skiing experience",
        "Good physical condition",
        "Proper equipment"
      ],
      startTimes: ["07:00"],
      guide: {
        name: "Martín Cumbre",
        image: "/images/guide-martin.png",
        experience: "12 years",
        languages: ["Spanish", "English", "German"],
        bio: "Mountain guide specialized in ski touring with vast experience in the Patagonian Andes.",
        phone: "5492944901234"
      },
      images: [
        "/images/ski-touring-mountain.jpeg",
        "/images/ski-touring-night.jpeg",
        "/images/ski-touring-panorama.jpeg",
        "/images/ski-touring-ascent.jpeg",
        "/images/ski-touring-bird.jpeg"
      ]
    },
    {
      id: "9",
      title: "Cycling in the Patagonian Steppe",
      description: "Explore the vast landscapes of the Patagonian steppe on an exciting cycling adventure. Ride through remote paths with panoramic views of the transition between the Andes and the steppe, crossing streams and discovering native flora and fauna.",
      image: "/images/ciclismo-estepa.jpeg",
      price: 85,
      duration: "5 hours",
      location: "Patagonian steppe / East of Bariloche",
      rating: 4.7,
      category: "Cycling",
      season: "summer",
      difficulty: "Moderate",
      included: [
        "Mountain bike",
        "Helmet and safety gear",
        "Specialized guide",
        "Transport from the city center",
        "Snacks and drinks"
      ],
      notIncluded: [
        "Full lunch",
        "Technical clothing"
      ],
      requirements: [
        "Moderate physical condition",
        "Basic cycling experience",
        "Comfortable and suitable clothing"
      ],
      startTimes: ["09:00", "14:00"],
      guide: {
        name: "Pedro Rodríguez",
        image: "/images/guide-pedro.png",
        experience: "9 years",
        languages: ["Spanish", "English", "French"],
        bio: "Passionate cyclist and expert on Patagonian trails. Specialist in local flora and fauna.",
        phone: "5492944234567"
      },
      images: [
        "/images/ciclismo-estepa.jpeg",
        "/images/ciclismo-estepa-rio.jpeg",
        "/images/ciclismo-estepa-camino.jpeg",
        "/images/ciclismo-estepa-sendero.jpeg",
        "/images/ciclismo-estepa-montana.jpeg",
        "/images/ciclismo-estepa-vista.jpeg",
        "/images/ciclismo-estepa-descanso.jpeg",
        "/images/ciclismo-estepa-grupo.jpeg"
      ]
    },
    {
      id: "10",
      title: "Paragliding from Cerro Otto",
      description: "Feel the thrill of flying with a tandem paragliding experience from Cerro Otto, offering 360° panoramic views of Bariloche, its lakes, and mountains.",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-05-22%20at%2012.26.10%20PM-6Dhv7nyF3Fos1sMYFizRhGB0ZS2wKY.jpeg",
      price: 150,
      duration: "2 hours",
      location: "Cerro Otto, Bariloche",
      rating: 4.9,
      category: "Aerial Adventure",
      season: "summer",
      difficulty: "Low (no experience required)",
      included: [
        "Tandem flight with certified instructor",
        "Full paragliding equipment",
        "Roundtrip transport from city center",
        "Safety briefing",
        "Flight photos and video",
        "Activity insurance"
      ],
      notIncluded: [
        "Cable car to Cerro Otto (optional)",
        "Meals and drinks"
      ],
      requirements: [
        "Weight between 40kg and 110kg",
        "Closed-toe shoes",
        "Warm clothing (even in summer)",
        "Not suitable for pregnant people or those with heart conditions"
      ],
      startTimes: ["09:00", "11:00", "15:00"],
      guide: {
        name: "Javier Alado",
        image: "/images/guide-javier.png",
        experience: "15 years",
        languages: ["Spanish", "English", "Portuguese", "French"],
        bio: "Professional paraglider with over 5000 flights and South American champion in acrobatic paragliding. Internationally certified instructor.",
        phone: "5492944789012"
      },
      images: [
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-05-22%20at%2012.26.10%20PM-6Dhv7nyF3Fos1sMYFizRhGB0ZS2wKY.jpeg",
        "/placeholder-ls5yk.png",
        "/parapente-aterrizando-bariloche.png",
        "/parapente-lagos-montanas.png"
      ]
    }
  ];
  
  export default mockActivities_en;
  