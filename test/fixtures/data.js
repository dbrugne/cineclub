const now = new Date();
function nextDate() {
  now.setMinutes(now.getMinutes() + 1);
  return new Date(now.getTime());
}

module.exports = {
  tmdb: {
    unknown: {
      file: 'Unknown.mkv',
      result: {
        page: 1,
        results: [],
        total_pages: 1,
        total_results: 0,
      },
      done: {
        title: 'Unknown',
      },
    },
    alien: {
      file: 'Alien.1979.720p.BrRip.x264.YIFY.mp4',
      result: {
        page: 1,
        results: [
          {
            adult: false,
            backdrop_path: '/si4PH5RjbpdQZi3BQvV6eiBNjYD.jpg',
            genre_ids: [
              27,
              28,
              53,
              878,
            ],
            id: 348,
            original_language: 'en',
            original_title: 'Alien',
            overview: 'During its return to the earth, commercial spaceship Nostromo intercepts a '
            + 'distress signal from a distant planet. When a three-member team of the crew '
            + 'discovers a chamber containing thousands of eggs on the planet, a creature inside '
            + 'one of the eggs attacks an explorer. The entire crew is unaware of the impending '
            + 'nightmare set to descend upon them when the alien parasite planted inside its '
            + 'unfortunate host is birthed.',
            release_date: '1979-05-25',
            poster_path: '/2h00HrZs89SL3tXB4nbkiM7BKHs.jpg',
            popularity: 5.227939,
            title: 'Alien',
            video: false,
            vote_average: 7.5,
            vote_count: 2201,
          },
          {
            adult: false,
            backdrop_path: '/oVV6z4Tqbklvy2uQAPAKZGokqzS.jpg',
            genre_ids: [
              878,
              28,
              27,
            ],
            id: 8077,
            original_language: 'en',
            original_title: 'Alien³',
            overview: 'After escaping with Newt and Hicks from the alien planet, Ripley crash '
            + 'lands on Fiorina 161, a prison planet and host to a correctional facility. '
            + 'Unfortunately, although Newt and Hicks do not survive the crash, a more unwelcome '
            + 'visitor does. The prison does not allow weapons of any kind, and with aid being a '
            + 'long time away, the prisoners must simply survive in any way they can.',
            release_date: '1992-05-22',
            poster_path: '/vz1vBw17F0x42bhziHdYRJC9uCv.jpg',
            popularity: 3.648815,
            title: 'Alien³',
            video: false,
            vote_average: 6,
            vote_count: 705,
          },
        ],
        total_pages: 1,
        total_results: 2,
      },
      done: {
        category: 'movie',
        year: 1979,
        resolution: '720p',
        quality: 'BrRip',
        codec: 'x264',
        group: 'YIFY',
        adult: false,
        backdrop_path: '/si4PH5RjbpdQZi3BQvV6eiBNjYD.jpg',
        genre_ids: [
          27,
          28,
          53,
          878,
        ],
        id: 348,
        original_language: 'en',
        original_title: 'Alien',
        overview: 'During its return to the earth, commercial spaceship Nostromo intercepts a '
        + 'distress signal from a distant planet. When a three-member team of the crew '
        + 'discovers a chamber containing thousands of eggs on the planet, a creature inside '
        + 'one of the eggs attacks an explorer. The entire crew is unaware of the impending '
        + 'nightmare set to descend upon them when the alien parasite planted inside its '
        + 'unfortunate host is birthed.',
        release_date: '1979-05-25',
        poster_path: '/2h00HrZs89SL3tXB4nbkiM7BKHs.jpg',
        popularity: 5.227939,
        title: 'Alien',
        video: false,
        vote_average: 7.5,
        vote_count: 2201,
      },
    },
    'mad men': {
      file: 'Mad.Men.S07E02.VOSTFR.720p.WEB-DL.DD5.1.H.264-FANATiK.mkv',
      result: {
        page: 1,
        results: [
          {
            backdrop_path: '/c8A5IYqIT1ez15sqA8wX5tCDTmF.jpg',
            first_air_date: '2007-07-19',
            genre_ids: [
              18,
            ],
            id: 1104,
            original_language: 'en',
            original_name: 'Mad Men',
            overview: 'Mad Men is set in the 1960s, initially at the fictional Sterling Cooper '
            + 'advertising agency on Madison Avenue in New York City, and later at the newly '
            + 'created firm, Sterling Cooper Draper Pryce.',
            origin_country: [
              'US',
            ],
            poster_path: '/6R3PCqGzyTh12Lafhop0U0MNJDz.jpg',
            popularity: 5.618832,
            name: 'Mad Men',
            vote_average: 7.6,
            vote_count: 66,
          },
          {
            adult: false,
            backdrop_path: null,
            genre_ids: [
              14,
              18,
              35,
              878,
              10749,
            ],
            id: 112049,
            original_language: 'en',
            original_title: 'Mad About Men',
            overview: 'Flirtatious mermaid Miranda swaps places with a schoolteacher who has gone '
            + 'on holiday. All is well until she falls in love with a human.',
            release_date: '1954-11-16',
            poster_path: '/uOOexiFJsyHsNCXcR5PBt2QLKg1.jpg',
            popularity: 1.000369,
            title: 'Mad About Men',
            video: false,
            vote_average: 5.7,
            vote_count: 3,
          },
        ],
        total_pages: 1,
        total_results: 2,
      },
      done: {
        category: 'tv',
        season: 7,
        episode: 2,
        resolution: '720p',
        quality: 'WEB-DL',
        codec: 'H.264',
        audio: 'DD5.1',
        group: 'FANATiK',
        title: 'Mad Men',
        episodeName: 'VOSTFR',
        backdrop_path: '/c8A5IYqIT1ez15sqA8wX5tCDTmF.jpg',
        first_air_date: '2007-07-19',
        genre_ids: [
          18,
        ],
        id: 1104,
        original_language: 'en',
        original_name: 'Mad Men',
        overview: 'Mad Men is set in the 1960s, initially at the fictional Sterling Cooper '
        + 'advertising agency on Madison Avenue in New York City, and later at the newly '
        + 'created firm, Sterling Cooper Draper Pryce.',
        origin_country: [
          'US',
        ],
        poster_path: '/6R3PCqGzyTh12Lafhop0U0MNJDz.jpg',
        popularity: 5.618832,
        name: 'Mad Men',
        vote_average: 7.6,
        vote_count: 66,
      },
    },
    jfk: {
      file: 'JFK.mkv',
      result: {
        page: 1,
        results: [
          {
            adult: false,
            backdrop_path: '/3vrtpYhLZB9uxpG89Fps1ngANs4.jpg',
            genre_ids: [
              18,
              53,
              36,
            ],
            id: 820,
            original_language: 'en',
            original_title: 'JFK',
            overview: 'New Orleans District Attorney Jim Garrison discovers there\'s more to the '
            + 'Kennedy assassination than the official story.',
            release_date: '1991-12-20',
            poster_path: '/9bmXpKDJv2kdtD4QNexErjGTIOz.jpg',
            popularity: 2.199036,
            title: 'JFK',
            video: false,
            vote_average: 7.1,
            vote_count: 200,
            media_type: 'movie',
          },
        ],
        total_pages: 1,
        total_results: 1,
      },
      done: {
        category: 'movie',
        adult: false,
        backdrop_path: '/3vrtpYhLZB9uxpG89Fps1ngANs4.jpg',
        genre_ids: [
          18,
          53,
          36,
        ],
        id: 820,
        original_language: 'en',
        original_title: 'JFK',
        overview: 'New Orleans District Attorney Jim Garrison discovers there\'s more to the '
        + 'Kennedy assassination than the official story.',
        release_date: '1991-12-20',
        poster_path: '/9bmXpKDJv2kdtD4QNexErjGTIOz.jpg',
        popularity: 2.199036,
        title: 'JFK',
        video: false,
        vote_average: 7.1,
        vote_count: 200,
        media_type: 'movie',
      },
    },
    undecorated: {
      result: {
        page: 1,
        results: [
          {
            title: 'decorated',
            overview: 'overview',
            media_type: 'movie',
          },
        ],
        total_pages: 1,
        total_results: 1,
      },
    },
    unknowncategory: {
      file: 'unknownCategory.mkv',
      result: {
        page: 1,
        results: [
          {
            title: 'john doe',
            media_type: 'person',
          },
        ],
        total_pages: 1,
        total_results: 1,
      },
      done: {
        title: 'john doe',
        media_type: 'person',
      },
    },
  },
  torrent: {
    invalid: {
      file: 'invalid.mkv',
      result: {
        title: 'invalid',
      },
    },
    movie: {
      file: '/dir/sub/Divergente.2.2015.TRUEFRENCH.720p.mHD.AC3.x264-ROMKENT.mkv',
      result: {
        year: 2015,
        resolution: '720p',
        codec: 'x264',
        audio: 'AC3',
        group: 'ROMKENT',
        title: 'Divergente 2',
        excess: [
          'TRUEFRENCH',
          'mHD',
        ],
        parsed: true,
      },
    },
    tv: {
      file: '/dir/sub/The.Big.Bang.Theory.S09E18.FASTSUB.VOSTFR.1080p.HDTV.x264.AAC-GOBO2S.mkv',
      result: {
        season: 9,
        episode: 18,
        resolution: '1080p',
        quality: 'TS',
        codec: 'x264',
        audio: 'AAC',
        group: 'GOBO2S',
        title: 'The Big Bang Theory',
        excess: [
          'FASUB.VOSTFR',
          'HDTV',
        ],
        parsed: true,
      },
    },
    nodot: {
      file: 'Divergente 2 2015 TRUEFRENCH 720p mHD AC3 x264 ROMKENT.mkv',
      result: {
        year: 2015,
        resolution: '720p',
        codec: 'x264',
        audio: 'AC3',
        title: 'Divergente 2',
        group: 'ROMKENT',
        excess: [
          'TRUEFRENCH',
          'mHD',
        ],
        parsed: true,
      },
    },
    parent: {
      file: 'Braquo.S03E08.FiNAL.FRENCH.720p.BluRay.x264-JMT/episode.mkv',
      result: {
        season: 3,
        episode: 8,
        resolution: '720p',
        quality: 'BluRay',
        codec: 'x264',
        group: 'JMT',
        title: 'Braquo',
        episodeName: 'FiNAL FRENCH',
        parsed: true,
      },
    },
  },
  models: {
    purge: {
      cache: [
        {
          key: 'keep',
          created: nextDate(),
          result: {},
        },
        {
          key: 'purge',
          created: new Date(Date.now() - 1000 * 3600 * 24 * 8),
          result: {},
        },
        {
          key: 'purge_other',
          created: new Date(Date.now() - 1000 * 3600 * 24 * 10),
          result: {},
        },
      ],
    },
    media: {
      media: [
        {
          path: '/added.txt',
          created: nextDate(),
          decoration: 'undecorated',
          file: {},
        },
        {
          path: '/old.txt',
          created: new Date(Date.now() - 1000 * 3600 * 24 * 2),
          decoration: 'decorated',
          file: {},
          info: {},
        },
        {
          path: '/removed.txt',
          created: nextDate(),
          removed: nextDate(),
          decoration: 'undecorated',
          file: {},
        },
        {
          path: '/purge.txt',
          created: nextDate(),
          removed: new Date(Date.now() - 1000 * 3600 * 24 * 8),
          decoration: 'undecorated',
          file: {},
        },
        {
          path: '/purge_other.txt',
          created: nextDate(),
          removed: new Date(Date.now() - 1000 * 3600 * 24 * 10),
          decoration: 'decorated',
          file: {},
          info: {},
        },
      ],
    },
    getters: {
      media: [
        {
          path: '/added.txt',
          created: nextDate(),
          file: {},
        },
        {
          path: '/old.txt',
          created: new Date(Date.now() - 1000 * 3600 * 24 * 2),
          file: {},
        },
        {
          path: '/removed.txt',
          created: nextDate(),
          removed: nextDate(),
          file: {},
        },
        {
          path: '/purge.txt',
          created: nextDate(),
          removed: new Date(Date.now() - 1000 * 3600 * 24 * 8),
          file: {},
        },
        {
          path: '/purge_other.txt',
          created: nextDate(),
          removed: new Date(Date.now() - 1000 * 3600 * 24 * 10),
          file: {},
        },
      ],
    },
    retrievers: {
      media: [
        {
          path: '/media1.txt',
          created: nextDate(),
          decoration: 'decorated',
          file: {
            name: 'foo',
          },
          info: {
            category: 'movie',
          },
        },
        {
          path: '/media2.txt',
          created: nextDate(),
          decoration: 'failed',
          file: {},
          info: {
            title: 'foo',
          },
        },
        {
          path: '/media3.txt',
          created: nextDate(),
          decoration: 'decorated',
          file: {},
          info: {
            category: 'tv',
          },
        },
        {
          path: '/media4.txt',
          created: nextDate(),
          decoration: 'undecorated',
          file: {},
        },
        {
          path: '/removed.txt',
          created: nextDate(),
          removed: nextDate(),
          decoration: 'decorated',
          file: {},
          info: {
            category: 'movie',
          },
        },
      ],
    },
    text: {
      media: [
        {
          path: '/media1.txt',
          created: nextDate(),
          file: {
            name: 'foo',
          },
          info: {},
        },
        {
          path: '/media2.txt',
          created: nextDate(),
          file: {},
          info: {
            title: 'this is foo',
            original_title: 'totally foo',
          },
        },
        {
          path: '/media3.txt',
          created: nextDate(),
          file: {},
          info: {
            overview: 'lorem ipsum foo lorem',
          },
        },
        {
          path: '/media4.txt',
          created: nextDate(),
          file: {},
          info: {
            name: 'Foo',
            original_name: 'foo',
          },
        },
        {
          path: '/removed.txt',
          created: nextDate(),
          removed: nextDate(),
          file: {},
        },
      ],
    },
  },
  api: {
    medias: {
      media: [
        {
          path: '/file1.txt',
          created: nextDate(),
          file: {
            name: 'foo',
          },
          info: {
            category: 'movie',
            title: 'name with spaces',
          },
        },
        {
          path: '/file2.txt',
          created: nextDate(),
          file: {},
          info: {
            title: 'foo',
          },
        },
        {
          path: '/undecorated.txt',
          created: nextDate(),
          file: {},
        },
        {
          path: '/file4.txt',
          created: nextDate(),
          file: {},
          info: {
            category: 'series',
          },
        },
        {
          path: '/old.txt',
          created: new Date(Date.now() - (1000 * 3600 * 24 * 2)),
          file: {},
          info: {},
        },
        {
          path: '/removed.txt',
          created: nextDate(),
          removed: nextDate(),
          file: {},
        },
      ],
    },
  },
};
