import express from "express";
import {conn, mysql, queryAsync} from "../dbconnect";
import { movie_get } from "../model/movie_get";




export const router = express.Router();

router.get("/",(req,res)=>{
    conn.query('select * from movies',(err,result,fields)=>{
        if(result && result.length > 0){
            res.json(result);
        }
        else{
            res.json({
                success : false,
                Error : "Incorrect Select Movie."
            });
        }
    });
});

router.get("/:moviename",(req,res)=>{
    const moviename = req.params.moviename;
    conn.query('select * from movies where name = ?',[moviename],(err,result,fields)=>{
        if(result && result.length > 0){
            res.json(result);
        }
        else{
            res.json({
                success : false,
                Error : "Incorrect Select Movie."
            });
        }
    });
});

router.post("/insert", (req, res) => {
    let movie: movie_get = req.body;
    let sql =
      "INSERT INTO `movies`(`name`, `picture`, `year`, `Released`, `Runtime`) VALUES (?,?,?,?,?)";
    sql = mysql.format(sql, [
        movie.name,
        movie.picture,
        movie.year,
        movie.Released,
        movie.Runtime
    ]);
    conn.query(sql, (err, result) => {
      if (err) throw err;
      res
        .status(201)
        .json({ affected_row: result.affectedRows, last_idx: result.insertId });
    });
  });

  router.delete("/delete/:movie", async (req, res) => {
    const movie = req.params.movie;
    let movieid : number;
    let sql = mysql.format("select mid from movies where name = ?",[movie])
    let result = await queryAsync(sql);
    const jsonStr =  JSON.stringify(result);
    const jsonobj = JSON.parse(jsonStr);
    const rowData = jsonobj;
    movieid = rowData[0].mid;
    conn.query("delete from movies where mid = ?", [movieid], (err, result) => {
        if (err) throw err;
        res
          .status(200)
          .json({ affected_row: result.affectedRows });
     });
  });

  router.delete("/deletebyid/:id", (req, res) => {
    let id = +req.params.id;
    conn.query("delete from movies where mid = ?", [id], (err, result) => {
       if (err) throw err;
       res
         .status(200)
         .json({ affected_row: result.affectedRows });
    });
  });