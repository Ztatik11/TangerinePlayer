import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  try {
    await prisma.usuarios.create({
      data: {
        ID: 1,
        Usuario: 'a',
        Nombre: 'Alvaro',
        Apellidos: 'Carrasco Garcia',
        Email: 'alvarocarrascogarcia6@gmail.com',
        Clave: '$2a$04$gyqP9DFVTuPMwpnhwOtJee.XyTGdLlNS66I0s3mSKUt7y/RWKp576',
        Fecha_nacimiento: new Date('2000-10-10T00:00:00.000Z'),
        Playlists: {
          create: [
            {
              Nombre: 'Mix Diario 1',
              description: 'Tu mix personalizado de hoy',
              coverUrl: 'https://picsum.photos/seed/playlist1/300/300',
              Playlist_canciones: {
                create: [
                  {
                    Canciones: {
                      create: {
                        id: '1',
                        title: 'Midnight Dreams',
                        artist: 'Luna Eclipse',
                        album: 'Nocturnal Journey',
                        duration: '3:45',
                        coverUrl: 'https://picsum.photos/seed/song1/300/300',
                        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
                      },
                    },
                  },
                  {
                    Canciones: {
                      create: {
                        id: '2',
                        title: 'Urban Sunset',
                        artist: 'The City Lights',
                        album: 'Metropolitan',
                        duration: '4:12',
                        coverUrl: 'https://picsum.photos/seed/song2/300/300',
                        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
                      },
                    },
                  },
                  {
                    Canciones: {
                      create: {
                        id: '3',
                        title: 'Desert Wind',
                        artist: 'Nomad Soul',
                        album: 'Wanderlust',
                        duration: '5:03',
                        coverUrl: 'https://picsum.photos/seed/song3/300/300',
                        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
                      },
                    },
                  },
                ],
              },
            },
            {
              Nombre: 'Mix Diario 2',
              description: 'Basado en tu historial',
              coverUrl: 'https://picsum.photos/seed/playlist2/300/300',
              Playlist_canciones: {
                create: [
                  {
                    Canciones: {
                      create: {
                        id: '4',
                        title: 'Electric Dreams',
                        artist: 'Synth Wave',
                        album: 'Digital Age',
                        duration: '4:30',
                        coverUrl: 'https://picsum.photos/seed/song4/300/300',
                        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
                      },
                    },
                  },
                  {
                    Canciones: {
                      create: {
                        id: '5',
                        title: 'Ocean Breeze',
                        artist: 'Coastal Vibes',
                        album: 'Summer Days',
                        duration: '3:55',
                        coverUrl: 'https://picsum.photos/seed/song5/300/300',
                        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
                      },
                    },
                  },
                ],
              },
            },
            {
              Nombre: 'Rock Clásico',
              description: 'Los mejores clásicos',
              coverUrl: 'https://picsum.photos/seed/rock1/300/300',
              Playlist_canciones: {
                create: [
                  {
                    Canciones: {
                      create: {
                        id: '12',
                        title: 'Highway Dreams',
                        artist: 'The Rolling Stones',
                        album: 'Rock Classics',
                        duration: '4:15',
                        coverUrl: 'https://picsum.photos/seed/rock12/300/300',
                        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
                      },
                    },
                  },
                  {
                    Canciones: {
                      create: {
                        id: '13',
                        title: 'Stairway',
                        artist: 'Led Zeppelin',
                        album: 'Rock Anthems',
                        duration: '5:30',
                        coverUrl: 'https://picsum.photos/seed/rock13/300/300',
                        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
                      },
                    },
                  },
                ],
              },
            },
            {
              Nombre: 'Rock Alternativo',
              description: 'Lo mejor del rock alternativo',
              coverUrl: 'https://picsum.photos/seed/rock2/300/300',
              Playlist_canciones: {
                create: [
                  {
                    Canciones: {
                      create: {
                        id: '14',
                        title: 'Dark Matter',
                        artist: 'Alternative Minds',
                        album: 'New Wave',
                        duration: '3:45',
                        coverUrl: 'https://picsum.photos/seed/rock14/300/300',
                        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
                      },
                    },
                  },
                  {
                    Canciones: {
                      create: {
                        id: '15',
                        title: 'Neon Lights',
                        artist: 'The Strokes',
                        album: 'Modern Rock',
                        duration: '4:20',
                        coverUrl: 'https://picsum.photos/seed/rock15/300/300',
                        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
                      },
                    },
                  },
                ],
              },
            },
            {
              Nombre: 'Pop Latino',
              description: 'Los hits latinos',
              coverUrl: 'https://picsum.photos/seed/pop1/300/300',
              Playlist_canciones: {
                create: [
                  {
                    Canciones: {
                      create: {
                        id: '16',
                        title: 'Bailando',
                        artist: 'Latino Stars',
                        album: 'Fiesta Total',
                        duration: '3:30',
                        coverUrl: 'https://picsum.photos/seed/pop16/300/300',
                        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
                      },
                    },
                  },
                  {
                    Canciones: {
                      create: {
                        id: '17',
                        title: 'Amor Eterno',
                        artist: 'Corazón Latino',
                        album: 'Ritmo Latino',
                        duration: '4:00',
                        coverUrl: 'https://picsum.photos/seed/pop17/300/300',
                        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
                      },
                    },
                  },
                ],
              },
            },
            {
              Nombre: 'Pop 2024',
              description: 'Lo nuevo del pop',
              coverUrl: 'https://picsum.photos/seed/pop2/300/300',
              Playlist_canciones: {
                create: [
                  {
                    Canciones: {
                      create: {
                        id: '18',
                        title: 'Modern Love',
                        artist: 'Pop Queens',
                        album: 'New Generation',
                        duration: '3:15',
                        coverUrl: 'https://picsum.photos/seed/pop18/300/300',
                        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
                      },
                    },
                  },
                  {
                    Canciones: {
                      create: {
                        id: '19',
                        title: 'Dancing Tonight',
                        artist: 'The Pop Band',
                        album: 'Party Time',
                        duration: '3:45',
                        coverUrl: 'https://picsum.photos/seed/pop19/300/300',
                        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    });

    console.log('Datos migrados exitosamente.');
  } catch (error) {
    console.error('Error al migrar datos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();


