const express = require('express');
const router = express.Router()
const Sequelize = require('sequelize')
const sequelize = new Sequelize(process.env.CLEARDB_DATABASE_URL)

const help = async function () {
    try{
    let query = `CREATE TABLE owner(
    id INT AUTO_INCREMENT PRIMARY KEY,
    owner VARCHAR(40));`
    await sequelize.query(query)
    query = `CREATE TABLE country (
        id INT AUTO_INCREMENT PRIMARY KEY,
        country VARCHAR(40)
    );`
    await sequelize.query(query)
    query = `CREATE TABLE email_type(
        id INT AUTO_INCREMENT PRIMARY KEY,
        email_type VARCHAR(1)
    );`
    await sequelize.query(query)
    query = `CREATE TABLE client(
        id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
        last VARCHAR(40),
        first VARCHAR(40),
        email VARCHAR(40),
        sold BOOLEAN,
        date VARCHAR(40),
        email_type_id INT,
        owner_id INT,
        country_id INT,
    
        FOREIGN KEY(email_type_id) REFERENCES email_type(id),
        FOREIGN KEY(owner_id) REFERENCES owner(id),
        FOREIGN KEY(country_id) REFERENCES country(id)
    );`
    await sequelize.query(query)

        }catch{

        }

}

help()


router.get('/clients', async (req, res) => {
    try {
        let query = `SELECT client.first, client.last, client.date, client.sold , country.country, owner.owner, client.email_type_id
                      FROM client, country, owner
                      WHERE country.id = client.country_id AND owner.id = client.owner_id 
                     `
        let results = await sequelize.query(query)
        let clients = []
        for (let i = 0; i < results[0].length; i++) {
            if (results[0][i].email_type_id == null) {
                clients.push({ ...results[0][i], email_type: "-" })
            }
            else {
                let query2 = `SELECT email_type FROM email_type WHERE id = ${results[0][i].email_type_id}`
                let results2 = await sequelize.query(query2)
                clients.push({ ...results[0][i], email_type: results2[0][0].email_type })

            }
        }
        res.send(clients)
    } catch (error) {
        res.send(error)
    }
})

const findByID = async (table, name, value) => {
    let query = `SELECT id FROM ${table} WHERE ${name} = "${value}"`
    let results = await sequelize.query(query)
    return results[0][0].id
}

router.post('/client', async (req, res) => {
    const newClient = req.body
    let emailType = newClient.emailType !== null ? await findByID('email_type', 'email_type', newClient.emailType) : null
    let owner = await findByID('owner', 'owner', newClient.owner)
    let country = await findByID('country', 'country', newClient.country)
    let date = new Date().toLocaleDateString()
    try {
        let query = `INSERT INTO client VALUES (null, '${newClient.last}', '${newClient.first}', '${newClient.email}', ${newClient.sold}, '${date}', ${emailType}, ${owner}, ${country})`
        let result = await sequelize.query(query)
        res.send(result[0])
    } catch (error) {
        res.send(error)
    }
})

router.put('/owner/:name/:owner', async (req, res) => {
    let clientName = req.params.name
    let nameSplit = clientName.split(' ')
    let newOwner = req.params.owner
    try {
        let queryID = `SELECT id FROM client WHERE first='${nameSplit[0]}' && last='${nameSplit[1]}'`
        let resultID = await sequelize.query(queryID)
        let query = `SELECT id FROM owner WHERE owner='${newOwner}'`
        let result = await sequelize.query(query)
        let query2 = `UPDATE client SET owner_id = ${result[0][0].id} WHERE id=${resultID[0][0].id}`
        let result2 = await sequelize.query(query2)
        res.send(result2[0])
    } catch (error) {
        res.send(error)
    }
})

router.put('/email/:name/:emailType', async (req, res) => {
    let clientName = req.params.name
    let nameSplit = clientName.split(' ')
    let emailType = req.params.emailType
    try {
        let queryID = `SELECT id FROM client WHERE first='${nameSplit[0]}' && last='${nameSplit[1]}'`
        let resultID = await sequelize.query(queryID)
        let query = `SELECT id FROM email_type WHERE email_type='${emailType}'`
        let result = await sequelize.query(query)
        let query2 = `UPDATE client SET email_type_id = ${result[0][0].id} WHERE id=${resultID[0][0].id}`
        let result2 = await sequelize.query(query2)
        res.send(result2[0])
    } catch (error) {
        res.send(error)
    }


})

router.put('/declare/:name', async (req, res) => {
    let clientName = req.params.name
    let nameSplit = clientName.split(' ')
    try {
        let query = `UPDATE client SET sold = 1 WHERE first='${nameSplit[0]}' && last='${nameSplit[1]}'`
        let result = await sequelize.query(query)
        res.send(result[0])
    } catch (error) {
        res.send(error)
    }
})

router.put('/client/:name', async (req, res) => {
    let { first, last, country } = req.body
    let clientName = req.params.name
    let nameSplit = clientName.split(' ')
    try {
        let queryID = `SELECT id FROM country WHERE country='${country}'`
        let resultID = await sequelize.query(queryID)
        let query = `UPDATE client SET country_id = ${resultID[0][0].id}, first='${nameSplit[0]}', last='${nameSplit[1]}' WHERE first='${first}' && last='${last}'`
        let result = await sequelize.query(query)
        res.send(result[0])
    } catch (error) {
        res.send(error)
    }
})

module.exports = router
