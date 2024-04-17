// pour lancer app

import express from "express";
import bodyParser from "body-parser";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import mysql from "mysql2/promise";
import Connection from "./connection.js";

const httpServer = createServer();
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        credentials: false,
    },
});

//const val = JSON.parse(JSON.stringify({ 'email': 'soufiane@gmail.com', 'password': '12345678' }))
//console.log(val.password)
(async() => {
    const con = await Connection.build();
    //console.log("connnn", con);

    io.on("connection", (socket) => {
        console.log(socket.id);
        socket.on("newProducer", async(data) => {
            console.log(data);
            const result = await con.save();
            console.log(result);
        });

        socket.on("allProd", async(data, callback) => {
            const allProd = await con.getProducteur();
            if (allProd[0].length === 0) {
                console.log("Introuvable ?");
                callback("false");
            } else {
                console.log(login[0]);
                callback("true");
            }
        });

        socket.on("addProd", async(data, callback) => {

            const rep = JSON.parse(data);
            console.log(rep);

            const addProd = await con.addProducteur(rep.name, rep.cin, rep.tele, rep.adresse);

            /*if (addProd[0].length === 0) {
                console.log("Introuvable ?");
                callback("false");
            } else {
                console.log(addProd[0]);
                callback("true");
            }*/

            let ret = {
                producteurs: [],
                status: "false",
            };
            if (addProd[0].length === 0) {
                console.log("Introuvable ?");
                //callback(ret);
            } else {
                const producteurs = await con.getProducteur();
                ret = {
                    producteurs: producteurs[0],
                    status: "true",
                };

            }
            console.log(ret);
            callback(ret);

        });

        socket.on("deleteProd", async(data, callback) => {

            const rep = JSON.parse(data);

            const deleteProd = await con.deleteByIdProducteur(rep.cin);

            let ret = {
                producteurs: [],
                status: "false",
            };
            if (deleteProd[0].length === 0) {
                console.log("Introuvable ?");
            } else {
                const producteurs = await con.getProducteur();
                ret = {
                    producteurs: producteurs[0],
                    status: "true",
                };

            }
            console.log(ret);
            callback(ret);

        });

        socket.on("updateProd", async(data, callback) => {

            const rep = JSON.parse(data);
            console.log(rep);

            const updateProd = await con.updateByIdProducteur(rep.name, rep.cin, rep.tele, rep.adresse);

            let ret = {
                producteurs: [],
                status: "false",
            };
            if (updateProd[0].length === 0) {
                console.log("Introuvable ?");
                //callback(ret);
            } else {
                const producteurs = await con.getProducteur();
                ret = {
                    producteurs: producteurs[0],
                    status: "true",
                };

            }
            console.log(ret);
            callback(ret);

        });



        // Farms ///////////////////////////////////////////////

        socket.on("getByIdFarm", async(data, callback) => {

            const rep = JSON.parse(data);
            console.log(rep.cin);

            const getByIdFarm = await con.findFarmsByProd(rep.cin);

            let ret = {
                farms: [],
                status: "false",
            };

            if (getByIdFarm[0].length === 0) {
                console.log("Introuvable ?");
                //callback(ret);
            } else {
                const farms = await con.findFarmsByProd(rep.cin);
                ret = {
                    farms: farms[0],
                    status: "true",
                };

            }
            console.log(ret);
            callback(ret);

        });


        socket.on("addFarm", async(data, callback) => {

            const rep = JSON.parse(data);
            console.log("hello ", rep);

            const addFarm = await con.addFarms(rep.name, rep.localisation, rep.producteurs.prod_id);


            let ret = {
                farms: [],
                status: "false",
            };
            if (addFarm[0].length === 0) {
                console.log("Introuvable ?");
            } else {
                const farms = await con.findFarmsByProd(rep.producteurs.cin);
                ret = {
                    farms: farms[0],
                    status: "true",
                };

            }
            console.log(ret);
            callback(ret);

        });

        socket.on("updateFarm", async(data, callback) => {
            console.log("dataaaaaaaaaaaa", data);
            const rep = JSON.parse(data);
            console.log("repppppppppppp", rep);

            const updateFarm = await con.updateByIdFarms(rep.farm_id, rep.name, rep.localisation);

            let ret = {
                farms: [],
                status: "false",
            };
            if (updateFarm[0].length === 0) {
                console.log("Introuvable ?");
            } else {
                const farms = await con.findFarmsByProd(rep.producteurs.cin);
                ret = {
                    farms: farms[0],
                    status: "true",
                };

            }
            console.log(ret);
            callback(ret);

        });

        socket.on("deleteFarm", async(data, callback) => {

            const rep = JSON.parse(data);
            console.log("rep", rep);
            console.log("data", data);

            const deleteFarm = await con.deleteByIdFarms(rep.farm_id);

            let ret = {
                farms: [],
                status: "false",
            };
            if (deleteFarm[0].length === 0) {
                console.log("Introuvable ?");
            } else {
                const farms = await con.findFarmsByProd(rep.producteurs.cin);
                ret = {
                    farms: farms[0],
                    status: "true",
                };

            }
            console.log(ret);
            callback(ret);

        });

        /////////////////////////// Terrain ///////////////////////////////

        socket.on("getByIdTerrain", async(data, callback) => {

            console.log('data terrrrrrrrrr', data);
            const rep = JSON.parse(data);
            console.log('terrrrrrrrrr', rep.farm_id);
            const getByIdTerrain = await con.findTerrainsByFarms(rep.farm_id);

            //const getByIdTerrain = await con.findTerrainsByFarms(rep.farm_id);

            let ret = {
                terrains: [],
                status: "false",
            };

            if (getByIdTerrain[0].length === 0) {
                console.log("Introuvable ?");
                //callback(ret);
            } else {
                const terrains = await con.findTerrainsByFarms(rep.farm_id);
                ret = {
                    terrains: terrains[0],
                    status: "true",
                };

            }
            console.log(ret);
            callback(ret);

        });

        socket.on("deleteTerrain", async(data, callback) => {

            console.log("data", data);
            const rep = JSON.parse(data);


            const deleteTerrain = await con.deleteByIdTerrains(rep.ter_id);

            console.log("ter id ", rep.ter_id);

            console.log("ter id ", rep.farm_id);

            let ret = {
                terrains: [],
                status: "false",
            };
            if (deleteTerrain[0].length === 0) {
                console.log("Introuvable ?");
            } else {
                const terrains = await con.findTerrainsByFarms(rep.farms.farm_id);
                ret = {
                    terrains: terrains[0],
                    status: "true",
                };

            }
            console.log(ret);
            callback(ret);

        });

        socket.on("addTerrain", async(data, callback) => {

            console.log("data yyyyyyyyyyyyyyy", data);
            const rep = JSON.parse(data);
            console.log("hello ", rep.farms.farm_id);

            const addTerrain = await con.addTerrains(rep.type, rep.surphase, rep.quantite, rep.farms.farm_id);


            let ret = {
                terrains: [],
                status: "false",
            };
            if (addTerrain[0].length === 0) {
                console.log("Introuvable ?");
            } else {
                const terrains = await con.findTerrainsByFarms(rep.farms.farm_id);
                ret = {
                    terrains: terrains[0],
                    status: "true",
                };

            }
            console.log(ret);
            callback(ret);

        });

        socket.on("updateTerrain", async(data, callback) => {
            console.log("dataaaaaaaaaaaa", data);
            const rep = JSON.parse(data);
            console.log("repppppppppppp", rep);

            const updateTerrain = await con.updateByIdTerrains(rep.ter_id, rep.type, rep.surphase, rep.quantite);

            let ret = {
                terrains: [],
                terrains: "false",
            };
            if (updateTerrain[0].length === 0) {
                console.log("Introuvable ?");
            } else {
                const terrains = await con.findTerrainsByFarms(rep.farms.farm_id);
                ret = {
                    terrains: terrains[0],
                    status: "true",
                };

            }
            console.log(ret);
            callback(ret);

        });

        ////////////////////////

        // Login && register
        // Login
        socket.on("login", async(data, callback) => {
            const rep = JSON.parse(data);
            const login = await con.login(rep.email, rep.password);
            let ret = {
                producteurs: [],
                status: "false",
            };
            if (login[0].length === 0) {
                console.log("Introuvable ?");
                //callback(ret);
            } else {
                const producteurs = await con.getProducteur();
                ret = {
                    producteurs: producteurs[0],
                    status: "true",
                };

            }
            console.log(ret);
            callback(ret);
        });

        // Register
        socket.on("register", async(data, callback) => {
            const rep = JSON.parse(data);
            console.log(rep);
            const register = await con.register(rep.name, rep.email, rep.password);

            if (register[0].length === 0) {
                console.log("Introuvable ?");
                callback("false");
            } else {
                console.log(register[0]);
                callback("true");
            }

            console.log(register);
        });
    });

    httpServer.listen(3002);
})();