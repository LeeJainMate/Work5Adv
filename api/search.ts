import express from "express";
import {conn, mysql, queryAsync} from "../dbconnect";
export const router = express.Router();

router.get("/", (req, res) => {
    const name = `%${req.query.name}%`;
    const sql = `
    SELECT  movies.mid,
    movies.name AS movie_title,
    movies.picture AS movie_picture,
    movies.year AS movie_year,
    movies.Released AS movie_Released,
    movies.Runtime AS movie_Runtime,

    star.pids AS star_id,
    stars.name AS star_name,
    stars.Born AS star_born,
    stars.bio AS star_bio,

    creator.pidc AS creator_id,
    creators.name AS creator_name,
    creators.Born AS creator_born,
    creators.bio AS creator_bio
    FROM 
        movies , star , person AS stars , creator, person  AS creators 
    WHERE 
        movies.mid = star.mids
        AND star.pids = stars.pid
        AND movies.mid = creator.midc
        AND creator.pidc = creators.pid
        AND movies.name LIKE ?

    `;
    
    conn.query(sql, [name], (err, results: any[], fields) => {
        if (err) throw err;

        
        const moviesMap = new Map<number, any>();

        results.forEach((row: any) => {
            const movieId = row.mid;

            if (!moviesMap.has(movieId)) {
                moviesMap.set(movieId, {
                    movie_id: row.mid,
                    movie_title: row.movie_title,
                    movie_picture : row.movie_picture,
                    movie_year : row.movie_year,
                    movie_Released : row.movie_Released,
                    movie_Runtime : row.movie_Runtime,
                    actors: [],
                    creators: [],
                });
            }

            const movie = moviesMap.get(movieId);

            const star = {
                star_id: row.star_id,
                star_name: row.star_name,
                star_born: row.starr_born,
                star_bio: row.star_bio,
            };

            const creator = {
                creator_id: row.creator_id,
                creator_name: row.creator_name,
                creator_born: row.creator_born,
                creator_bio: row.creator_bio,
            };

            // เพิ่มเช็คว่านักแสดงหรือผู้กำกับซ้ำหรือไม่
            if (!movie.actors.find((a: any) => a.star_id === star.star_id)) {
                movie.actors.push(star);
            }

            if (!movie.creators.find((c: any) => c.creator_id === creator.creator_id)) {
                movie.creators.push(creator);
            }
        });

        const jsonData =  { movie :  Array.from(moviesMap.values())};
        res.json(jsonData);
    });
});