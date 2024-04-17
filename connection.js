import mysql from "mysql2/promise";

export default class Connection {
    constructor(con) {
        this.con = con;
    }

    static async build() {
        this.con = await mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "",
            database: "agrico_vm",
        });
        //console.log(this.con);
        return new Connection(this.con);
    }

    save() {
        //console.log(this.con)
        const query = this.con.execute("select * from users ");
        //console.log(sql);
        return query;
    }

    // Producteuars
    getProducteur() {
        const query = this.con.execute("select * from producteurs");
        return query;
    }

    addProducteur(name, cin, tele, adresse) {
        const sql = `INSERT INTO producteurs (name, cin, tele, adresse) VALUES ('${name}', '${cin}', '${tele}', '${adresse}')`;
        console.log(sql);
        const query = this.con.execute(sql);

        return query;
    }

    deleteByIdProducteur(cin) {
        const sql = `delete from producteurs where cin = '${cin}';`;
        console.log(sql);
        const query = this.con.execute(sql);
        return query;
    }

    updateByIdProducteur(name, cin, tele, adresse) {
        const sql = `UPDATE producteurs SET name = '${name}', tele = '${tele}', adresse = '${adresse}' WHERE cin = '${cin}';`;
        console.log(sql);
        const query = this.con.execute(sql);
        return query;
    }

    // Farms //////////////////////////////////////////////////////

    addFarms(name, localisation, prod_id) {
        const sql = `INSERT INTO farms (name, localisation, prod_id) VALUES ('${name}', '${localisation}', '${prod_id}' )`;
        console.log(sql);
        const query = this.con.execute(sql);

        return query;
    }

    deleteByIdFarms(farm_id) {
        const sql = `delete from farms where farm_id = ${farm_id};`;
        console.log(sql);
        const query = this.con.execute(sql);
        return query;
    }

    updateByIdFarms(farm_id, name, localisation) {
        const sql = `UPDATE farms SET name = '${name}', localisation = '${localisation}' WHERE farm_id = ${farm_id};`;
        const query = this.con.execute(sql);
        console.log(sql);
        return query;
    }

    findFarmsByProd(cin) {
        const sql = `SELECT f.farm_id, f.name, f.localisation, p.name as pname FROM farms f
        INNER JOIN producteurs p ON f.prod_id = p.prod_id
        WHERE p.cin = '${cin}'`;

        console.log(sql);
        const query = this.con.execute(sql);
        return query;
    }

    //

    // Terrains //////////////////////////////////////////////////////////////////////
    findTerrainsByFarms(farm_id) {
        const sql = `SELECT f.farm_id, t.type, t.surphase, t.quantite, t.ter_id FROM terrains t 
                    INNER JOIN farms f ON t.farm_id = f.farm_id 
                    WHERE f.farm_id = ${farm_id}`
        console.log(sql);
        const query = this.con.execute(sql);
        return query;
    }

    deleteByIdTerrains(ter_id) {
        const sql = `delete from terrains where ter_id = ${ter_id};`;
        console.log(sql);
        const query = this.con.execute(sql);
        return query;
    }

    addTerrains(type, surphase, quantite, farm_id) {
        const sql = `INSERT INTO terrains (type, surphase, quantite, farm_id) VALUES ('${type}', '${surphase}', '${quantite}' ,'${farm_id}' )`;
        console.log(sql);
        const query = this.con.execute(sql);

        return query;
    }

    updateByIdTerrains(ter_id, type, surphase, quantite) {
        const sql = `UPDATE terrains SET type = '${type}', surphase = '${surphase}', quantite = ${quantite} WHERE ter_id = ${ter_id};`;
        console.log(sql);
        const query = this.con.execute(sql);
        return query;
    }

    //

    // Prod by farms by terrains
    findProdByFramsByTerrains(ter_id) {
        const sql = `SELECT p.name, p.cin, p.tele, p.adresse 
                    FROM producteurs p 
                    INNER JOIN farms f ON p.prod_id = f.prod_id
                    INNER JOIN terrains t ON f.farm_id = t.farm_id
                    WHERE t.ter_id = ${ter_id}`;
        console.log(sql);
        const query = this.con.execute(sql);
        return query;
    }

    // login and register :
    register(name, email, password) {
        const sql = `INSERT INTO users (name, email, password) VALUES ('${name}', '${email}', '${password}')`;
        const query = this.con.execute(sql);

        return query;
    }

    login(email, password) {
        const sql = `SELECT * FROM users WHERE email = '${email}' AND password = '${password}';`;
        const query = this.con.execute(sql);
        return query;
    }
}