import mysql from 'mysql2/promise'

const DEFAULT_CONFIG = {
  host: 'localhost',
  user: 'root',
  port: '3306',
  password: process.env.PASS,
  database: 'moviesdb'
}

const connectionString = process.env.DATABASE_URL ?? DEFAULT_CONFIG

const connection = await mysql.createConnection(connectionString)

export class MovieModel {
  static async getAll ({ genre }) {
    if (genre) {
      const lowerCaseGenre = genre.toLowerCase()

      const [genres] = await connection.query(
        'SELECT id, name FROM genre WHERE LOWER(name) = ?;', [lowerCaseGenre]
      )
      // no genre foun
      if (genres.length === 0) return []
      // get the id from first genre result
      // const [{ id }] = genres

      // get all movies ids from database table
      // la query a movie_genre
      // join
      // y devolver resultados...
      return []
    }
    const [movies] = await connection.query(
      'SELECT title, year, director, poster, rate, duration, BIN_TO_UUID(id) id FROM movie;'
    )
    return movies
  }

  static async getById ({ id }) {
    const [movies] = await connection.query(
      'SELECT title, year, director, poster, rate, duration, BIN_TO_UUID(id) id FROM movie WHERE id = UUID_TO_BIN(?);', [id]
    )
    return movies
  }

  static async create ({ input }) {
    const {
      title,
      year,
      duration,
      director,
      rate,
      poster
    } = input

    const [uuidResult] = await connection.query('SELECT UUID() uuid;')
    const [{ uuid }] = uuidResult

    try {
      await connection.query(
        `INSERT INTO movie (id, title, year, duration, director, poster, rate)
          VALUES (UUID_TO_BIN("${uuid}"), ?, ?, ?, ?, ?, ?);`,
        [title, year, duration, director, poster, rate]
      )
    } catch (error) {
      throw new Error('Error creating movie')
    }
    const [movies] = await connection.query(
      'SELECT title, year, director, poster, rate, duration, BIN_TO_UUID(id) id FROM movie WHERE id = UUID_TO_BIN(?);', [uuid]
    )
    return movies[0]
  }

  static async delete ({ id }) {

  }

  static async update ({ id, input }) {

  }
}
