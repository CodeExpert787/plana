
const mockActivities = [
  {
    "id": "1",
    "title": "Trekking con Raquetas",
    "description": "Descubre la magia invernal de Bariloche recorriendo senderos nevados con raquetas. Disfruta de miradores panorámicos y bosques andinos cubiertos de nieve.",
    "image": "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202023-10-23%20at%2011.12.50%20PM-TzEz8Y1wpkOkQdjdfOupduAJgzRNxn.jpeg",
    "price": 95,
    "duration": "5 horas",
    "location": "Refugio Jakob / Cerro López",
    "rating": 4.9,
    "category": "Trekking Invernal",
    "season": "invierno",
    "difficulty": "Moderada",
    "included": [
      "Raquetas de nieve y bastones",
      "Guía especializado en montaña invernal",
      "Transporte ida y vuelta desde el centro",
      "Refrigerio caliente y snacks energéticos",
      "Seguro de actividad",
      "Charla técnica sobre uso de raquetas"
    ],
    "notIncluded": [
      "Almuerzo (se puede contratar)",
      "Ropa técnica (se puede alquilar)"
    ],
    "requirements": [
      "Condición física moderada",
      "Ropa abrigada e impermeable",
      "Calzado impermeable",
      "Guantes y gorro",
      "Protector solar"
    ],
    "startTimes": [
      "08:30",
      "10:00"
    ],
    "guide": {
      "name": "Ana Montaña",
      "image": "/images/guide-ana.png",
      "experience": "11 años",
      "languages": [
        "Español",
        "Inglés",
        "Italiano"
      ],
      "bio": "Guía de montaña especializada en actividades invernales con amplia experiencia en los Andes patagónicos y europeos.",
      "phone": "5492944345678"
    },
    "images": [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202023-10-23%20at%2011.12.50%20PM-TzEz8Y1wpkOkQdjdfOupduAJgzRNxn.jpeg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/images.jpg-sWP68889lyxaUHXtfhpXCKVMfFgGSJ.jpeg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202023-10-23%20at%2011.12.50%20PM-s2ajuJLtFLpKMOWfR33Wh5WiNY1vfq.jpeg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-05-16%20at%201.31.37%20PM%20%281%29-fUAriBAulRsLdoIdqb4RoWQeGgY19P.jpeg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-05-16%20at%201.31.35%20PM-ePir6RSiYc5mnKjd2uqztldB7MQQAg.jpeg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-05-16%20at%2012.57.19%20PM-D6G3jNPH9YPQiwdb0HxmkkISAtWRC1.jpeg"
    ]
  },
  {
    "id": "2",
    "title": "Escalada en Valle Encantado",
    "description": "Vive la emoción de escalar en uno de los mejores destinos de Patagonia, con paredes de roca para todos los niveles junto al río Limay.",
    "image": "/images/escalada-valle-encantado.jpeg",
    "price": 120,
    "duration": "6 horas",
    "location": "Valle Encantado",
    "rating": 4.9,
    "category": "Escalada",
    "season": "verano",
    "difficulty": "Variable (principiante a avanzado)",
    "included": [
      "Equipo completo de escalada",
      "Instructor certificado",
      "Transporte desde el centro",
      "Refrigerio energético",
      "Seguro de actividad"
    ],
    "notIncluded": [
      "Almuerzo",
      "Ropa técnica"
    ],
    "requirements": [
      "No requiere experiencia previa para nivel principiante",
      "Buena condición física",
      "No tener miedo a las alturas"
    ],
    "startTimes": [
      "08:30",
      "13:00"
    ],
    "guide": {
      "name": "Ana Montaña",
      "image": "/images/guide-ana.png",
      "experience": "11 años",
      "languages": [
        "Español",
        "Inglés",
        "Italiano"
      ],
      "bio": "Escaladora profesional con experiencia internacional y certificación UIAA. Especialista en enseñanza a principiantes.",
      "phone": "5492944345678"
    },
    "images": [
      "/images/escalada-valle-encantado.jpeg",
      "/images/escalada-valle-encantado-1.jpeg",
      "/images/escalada-valle-encantado-2.jpeg",
      "/images/escalada-valle-encantado-3.jpeg"
    ]
  },
  {
    "id": "3",
    "title": "Pesca en el Río Limay",
    "description": "Experimenta la pesca con mosca en uno de los mejores ríos de la Patagonia, famoso por sus truchas y el hermoso entorno natural.",
    "image": "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-05-23%20at%2012.57.23%20PM-Na1uHp91a0gGYbra8d2xvSPPmEAjxy.jpeg",
    "price": 180,
    "duration": "8 horas",
    "location": "Río Limay",
    "rating": 4.8,
    "category": "Pesca",
    "season": "verano",
    "difficulty": "Baja",
    "included": [
      "Equipo completo de pesca",
      "Guía especializado",
      "Transporte",
      "Almuerzo gourmet"
    ],
    "notIncluded": [
      "Licencia de pesca (se puede adquirir)"
    ],
    "requirements": [
      "No se requiere experiencia previa"
    ],
    "startTimes": [
      "07:00"
    ],
    "guide": {
      "name": "Roberto Anzuelo",
      "image": "/images/guide-roberto.png",
      "experience": "15 años",
      "languages": [
        "Español",
        "Inglés"
      ],
      "bio": "Pescador profesional con amplio conocimiento de los ríos y lagos de la región.",
      "phone": "5492944456789"
    },
    "images": [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-05-23%20at%2012.56.19%20PM-ajYCxUU4f8z0C1UMrPcSpbTEpJPDpp.jpeg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-05-23%20at%2012.57.23%20PM-Na1uHp91a0gGYbra8d2xvSPPmEAjxy.jpeg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-05-23%20at%2012.56.51%20PM-KGGSB1LoDLGJIIDaowRXIkS6loQHAT.jpeg",
      "/images/fishing-limay.png"
    ]
  },
  {
    "id": "4",
    "title": "Kayak en Bahía López",
    "description": "Navega en kayak por las cristalinas aguas de Bahía López, rodeado de bosques y montañas, con vistas privilegiadas del Cerro López y la Isla Centinela.",
    "image": "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-05-16%20at%2012.24.48%20PM%20%282%29-hPRhyOKDY156xpGQZxZwgVjyqfdHF3.jpeg",
    "price": 85,
    "duration": "4 horas",
    "location": "Bahía López / Lago Nahuel Huapi",
    "rating": 4.8,
    "category": "Acuático",
    "season": "verano",
    "difficulty": "Baja",
    "included": [
      "Kayak y equipo completo",
      "Guía especializado",
      "Transporte desde el centro",
      "Refrigerio",
      "Seguro de actividad"
    ],
    "notIncluded": [
      "Almuerzo",
      "Ropa impermeable (se puede alquilar)"
    ],
    "requirements": [
      "Saber nadar",
      "No se requiere experiencia previa"
    ],
    "startTimes": [
      "09:00",
      "14:00"
    ],
    "guide": {
      "name": "Carlos Remero",
      "image": "/images/guide-carlos.png",
      "experience": "10 años",
      "languages": [
        "Español",
        "Inglés",
        "Portugués"
      ],
      "bio": "Instructor de kayak con amplia experiencia en los lagos patagónicos y certificación internacional.",
      "phone": "5492944123456"
    },
    "images": [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-05-16%20at%2012.24.48%20PM%20%282%29-hPRhyOKDY156xpGQZxZwgVjyqfdHF3.jpeg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-05-16%20at%2012.24.48%20PM%20%283%29-UKbgSN2ekM54XalUvISf63a09vb3wS.jpeg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-05-16%20at%2012.24.48%20PM%20%281%29-rfTzf8CuCHKvPk3xI6U81Z80VH2EG9.jpeg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-05-16%20at%2012.24.48%20PM-rhYvFQnTp1LORTuPHrJfrY7E6GCnVT.jpeg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-05-16%20at%2012.24.47%20PM-rdmd0ThcTSkWAC9T4zYWji2RcNjrPb.jpeg"
    ]
  },
  {
    "id": "5",
    "title": "Trekking",
    "description": "Aventúrate en este trekking de día completo hasta el icónico Refugio Frey, rodeado de impresionantes agujas de granito y lagos de montaña de un intenso color azul.",
    "image": "/images/trekking-vista-lago.jpeg",
    "price": 75,
    "duration": "8 horas",
    "location": "Cerro Catedral",
    "rating": 4.9,
    "category": "Trekking",
    "season": "verano",
    "difficulty": "Alta",
    "included": [
      "Guía de montaña",
      "Bastones de trekking",
      "Almuerzo",
      "Transporte"
    ],
    "notIncluded": [
      "Equipo personal",
      "Entrada al refugio"
    ],
    "requirements": [
      "Buena condición física",
      "Experiencia previa en trekking",
      "Calzado y ropa adecuados"
    ],
    "startTimes": [
      "07:30"
    ],
    "guide": {
      "name": "Martín Cumbre",
      "image": "/images/guide-martin.png",
      "experience": "12 años",
      "languages": [
        "Español",
        "Inglés",
        "Alemán"
      ],
      "bio": "Montañista experimentado con ascensos en toda la cordillera de los Andes.",
      "phone": "5492944567890"
    },
    "images": [
      "/images/trekking-vista-lago.jpeg",
      "/images/trekking-mountain-path.jpeg",
      "/images/trekking-sunset-view.jpeg",
      "/images/trekking-catedral.png"
    ]
  },
  {
    "id": "6",
    "title": "Clases de Kitesurf",
    "description": "Aprende o perfecciona tus habilidades en kitesurf con clases personalizadas en las mejores playas de Bariloche, con vientos constantes y paisajes espectaculares.",
    "image": "/images/kitesurf-sunset-bariloche-beach.jpeg",
    "price": 90,
    "duration": "4 horas",
    "location": "Playa Bonita / Lago Nahuel Huapi",
    "rating": 4.9,
    "category": "Acuático",
    "season": "verano",
    "difficulty": "Variable",
    "included": [
      "Equipo completo de kitesurf",
      "Instructor certificado",
      "Traje de neopreno",
      "Transporte desde el centro",
      "Seguro de actividad"
    ],
    "notIncluded": [
      "Almuerzo",
      "Fotos y videos (disponibles por un costo adicional)"
    ],
    "requirements": [
      "Saber nadar",
      "Condición física básica",
      "Ropa de baño"
    ],
    "startTimes": [
      "10:00",
      "14:00"
    ],
    "guide": {
      "name": "Laura Viento",
      "image": "/images/guide-laura.png",
      "experience": "8 años",
      "languages": [
        "Español",
        "Inglés",
        "Portugués"
      ],
      "bio": "Instructora profesional de kitesurf con experiencia internacional y campeona nacional en la disciplina.",
      "phone": "5492944678901"
    },
    "images": [
      "/images/kitesurf-sunset-bariloche-beach.jpeg",
      "/images/kitesurf-jump.jpeg",
      "/images/kitesurf-sunset.jpeg"
    ]
  },
  {
    "id": "7",
    "title": "Esquí en Cerro Catedral",
    "description": "Disfruta del mejor esquí en el centro de esquí más grande de Sudamérica, con pistas para todos los niveles.",
    "image": "/images/ski-catedral-family-1.jpeg",
    "price": 120,
    "duration": "6 horas",
    "location": "Cerro Catedral",
    "rating": 4.9,
    "category": "Esquí",
    "season": "invierno",
    "difficulty": "Variable",
    "included": [
      "Pase diario",
      "Equipo completo",
      "Instructor",
      "Transporte"
    ],
    "notIncluded": [
      "Ropa técnica (se puede alquilar)",
      "Almuerzo"
    ],
    "requirements": [
      "Ropa abrigada",
      "Protector solar"
    ],
    "startTimes": [
      "08:00",
      "13:00"
    ],
    "guide": {
      "name": "Martín Cumbre",
      "image": "/images/guide-martin.png",
      "experience": "12 años",
      "languages": [
        "Español",
        "Inglés",
        "Alemán"
      ],
      "bio": "Instructor de esquí certificado con experiencia en las mejores estaciones de esquí del mundo.",
      "phone": "5492944890123"
    },
    "images": [
      "/images/ski-catedral-family-1.jpeg",
      "/images/ski-catedral-family-2.jpeg"
    ]
  },
  {
    "id": "8",
    "title": "Esquí de Travesía en Frey",
    "description": "Explora la majestuosa cordillera de los Andes con esta aventura de esquí de travesía, accediendo a zonas vírgenes de nieve polvo y paisajes impresionantes.",
    "image": "/images/ski-touring-mountain.jpeg",
    "price": 150,
    "duration": "8 horas",
    "location": "Refugio Frey y alrededores",
    "rating": 4.9,
    "category": "Esquí",
    "season": "invierno",
    "difficulty": "Alta",
    "included": [
      "Guía especializado",
      "Equipo de seguridad",
      "Transporte",
      "Refrigerio de montaña"
    ],
    "notIncluded": [
      "Equipo de esquí de travesía",
      "Almuerzo completo"
    ],
    "requirements": [
      "Experiencia previa en esquí",
      "Buena condición física",
      "Equipo adecuado"
    ],
    "startTimes": [
      "07:00"
    ],
    "guide": {
      "name": "Martín Cumbre",
      "image": "/images/guide-martin.png",
      "experience": "12 años",
      "languages": [
        "Español",
        "Inglés",
        "Alemán"
      ],
      "bio": "Guía de montaña especializado en esquí de travesía con amplia experiencia en la cordillera patagónica.",
      "phone": "5492944901234"
    },
    "images": [
      "/images/ski-touring-mountain.jpeg",
      "/images/ski-touring-night.jpeg",
      "/images/ski-touring-panorama.jpeg",
      "/images/ski-touring-ascent.jpeg",
      "/images/ski-touring-bird.jpeg"
    ]
  },
  {
    "id": "9",
    "title": "Ciclismo en la estepa patagónica",
    "description": "Explora los vastos paisajes de la estepa patagónica en una emocionante aventura en bicicleta. Recorre caminos poco transitados con vistas panorámicas de la transición entre los Andes y la estepa, cruzando arroyos y descubriendo la flora y fauna autóctona.",
    "image": "/images/ciclismo-estepa.jpeg",
    "price": 85,
    "duration": "5 horas",
    "location": "Estepa patagónica / Este de Bariloche",
    "rating": 4.7,
    "category": "Ciclismo",
    "season": "verano",
    "difficulty": "Moderada",
    "included": [
      "Bicicleta de montaña",
      "Casco y equipo de seguridad",
      "Guía especializado",
      "Transporte desde el centro",
      "Refrigerio y bebidas"
    ],
    "notIncluded": [
      "Almuerzo completo",
      "Ropa técnica"
    ],
    "requirements": [
      "Condición física moderada",
      "Experiencia básica en ciclismo",
      "Ropa cómoda y adecuada para la actividad"
    ],
    "startTimes": [
      "09:00",
      "14:00"
    ],
    "guide": {
      "name": "Pedro Rodríguez",
      "image": "/images/guide-pedro.png",
      "experience": "9 años",
      "languages": [
        "Español",
        "Inglés",
        "Francés"
      ],
      "bio": "Ciclista apasionado y conocedor de todos los senderos de la región patagónica. Especialista en flora y fauna local.",
      "phone": "5492944234567"
    },
    "images": [
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
    "id": "10",
    "title": "Parapente desde el Cerro Otto",
    "description": "Experimenta la emoción de volar en parapente desde el Cerro Otto con vistas panorámicas de 360° de Bariloche, sus lagos y montañas.",
    "image": "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-05-22%20at%2012.26.10%20PM-6Dhv7nyF3Fos1sMYFizRhGB0ZS2wKY.jpeg",
    "price": 150,
    "duration": "2 horas",
    "location": "Cerro Otto, Bariloche",
    "rating": 4.9,
    "category": "Aventura Aérea",
    "season": "verano",
    "difficulty": "Baja (no requiere experiencia)",
    "included": [
      "Vuelo tándem con instructor certificado",
      "Equipo completo de parapente",
      "Transporte ida y vuelta desde el centro",
      "Briefing de seguridad",
      "Fotos y video del vuelo",
      "Seguro de actividad"
    ],
    "notIncluded": [
      "Teleférico al Cerro Otto (opcional)",
      "Comidas y bebidas"
    ],
    "requirements": [
      "Peso entre 40kg y 110kg",
      "Calzado cerrado",
      "Ropa abrigada (incluso en verano)",
      "No apto para personas con problemas cardíacas o embarazadas"
    ],
    "startTimes": [
      "09:00",
      "11:00",
      "15:00"
    ],
    "guide": {
      "name": "Javier Alado",
      "image": "/images/guide-javier.png",
      "experience": "15 años",
      "languages": [
        "Español",
        "Inglés",
        "Portugués",
        "Francés"
      ],
      "bio": "Piloto profesional de parapente con más de 5000 vuelos y campeón sudamericano de parapente acrobático. Instructor certificado internacionalmente.",
      "phone": "5492944789012"
    },
    "images": [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-05-22%20at%2012.26.10%20PM-6Dhv7nyF3Fos1sMYFizRhGB0ZS2wKY.jpeg",
      "/placeholder-ls5yk.png",
      "/parapente-aterrizando-bariloche.png",
      "/parapente-lagos-montanas.png"
    ]
  },
  {
    "id": "11",
    "title": "test",
    "description": "tett",
    "image": "",
    "price": "123145",
    "duration": "4 horas",
    "location": "Colonia Suiza",
    "rating": 0,
    "category": "Trekking",
    "season": "-",
    "difficulty": "Principiante",
    "included": [],
    "notIncluded": [],
    "requirements": [],
    "startTimes": [],
    "guide": {
      "name": "aaa aaa",
      "image": "",
      "experience": "5 años",
      "languages": [],
      "bio": "test",
      "phone": "13151176857"
    },
    "images": []
  },
  {
    "id": "12",
    "title": "dsffasfffs",
    "description": "asfsasff",
    "image": "",
    "price": "234",
    "duration": "3 horas",
    "location": "Llao Llao",
    "rating": 0,
    "category": "Trekking",
    "season": "-",
    "difficulty": "Experto",
    "included": [],
    "notIncluded": [],
    "requirements": [],
    "startTimes": [],
    "guide": {
      "name": "aaa aaa",
      "image": "",
      "experience": "3 años",
      "languages": [],
      "bio": "ff",
      "phone": "asfsasf"
    },
    "images": []
  },
  {
    "id": "13",
    "title": "324234",
    "description": "afasf",
    "image": "",
    "price": "1231123",
    "duration": "3 horas",
    "location": "Colonia Suiza",
    "rating": 0,
    "category": "Escalada",
    "season": "-",
    "difficulty": "Experto",
    "included": [],
    "notIncluded": [],
    "requirements": [],
    "startTimes": [],
    "guide": {
      "name": "demo-bma",
      "image": "",
      "experience": "5 años",
      "languages": [],
      "bio": "324234",
      "phone": "1312312312"
    },
    "images": []
  },
  {
    "id": "14",
    "title": "123123",
    "description": "1231123",
    "image": "",
    "price": "1231123",
    "duration": "123 horas",
    "location": "Colonia Suiza",
    "rating": 0,
    "category": "Escalada",
    "season": "-",
    "difficulty": "Principiante",
    "included": [],
    "notIncluded": [],
    "requirements": [],
    "startTimes": [],
    "guide": {
      "name": "demo-bma",
      "image": "",
      "experience": "4 años",
      "languages": [],
      "bio": "123123123",
      "phone": "123123123123"
    },
    "images": []
  }
]

export default mockActivities
