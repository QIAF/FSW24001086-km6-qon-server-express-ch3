const fs = require("fs"); //fs module bawaan node js
const express = require('express') //panggil express assigne ke variabel

const app = express() //panggil package
const PORT = 8000; // panggil port

//untuk membaca json dari request ke body kita
app.use(express.json());

// baca isi file dari dummy.json
const customers = JSON.parse(
    fs.readFileSync(`${__dirname}/data/cars.json`) 
)

//localhost 8000
app.get('/', (req, res, next) => {
    res.send ('<p> Car </p>');

});

// buat nge get data
app.get("/api/v1/customers", (req, res, next) => {
    res.status(200).json({
        status : "success",
        totalData : customers.length,
        data:{
            customers,
        },
    });
});

//api untuk get data by id
app.get("/api/v1/customers/:id", (req, res, next) => {
    const id = req.params.id;

    const customer = customers.find((cust) => cust._id === id);

    res.status(200).json({
        status : "success",
        data:{
            customer,
        },
    });
});

//api untuk update data
app.patch('/api/v1/customers/:id', (req, res) => {
    const id = req.params.id

    const customer = customers.find(cust => cust._id === id);
    const customerIndex = customers.findIndex(cust => cust._id === id);

    if(!customer) {
        return res.status(404).json({ // not found
            status: "fail",
            message: `Customer dengan id : ${id} kosong`,
        });
    }

    customers [customerIndex] = {...customers[customerIndex], ...req.body};
    console.log(customers[customerIndex]);

    fs.writeFile(
        `${__dirname}/data/dummy.json`,
         JSON.stringify(customers),
         (err) => {
            res.status(200).json({
                status: "success",
                message: "berhasil update data",
            });
         }
    );
});

app.delete('/api/v1/customers/:id', (req, res) => {
    const id = req.params.id

    const customer = customers.find(cust => cust._id === id);
    const customerIndex = customers.findIndex(cust => cust._id === id);

    if(!customer) {
        return res.status(404).json({ // not found
            status: "fail",
            message: `Customer dengan id : ${id} kosong`,
        });
    }
    customers.splice(customerIndex, 1);

    fs.writeFile(
        `${__dirname}/data/dummy.json`,
         JSON.stringify(customers),
         (err) => {
            res.status(200).json({
                status: "success",
                message: "berhasil delete data",
            });
         }
    );
});


// api buat ngecreate new data
app.post("/api/v1/customers", (req, res) => {
    console.log(req.body);

    const newCustomer = req.body

   customers.push(newCustomer);

   fs.writeFile(`${__dirname}/data/cars.json`, JSON.stringify(customers), err =>{
    res.status(201).json({
        status : 'success',
        data: {
            customer: newCustomer,
        }
    }) // 201 = created
   })
});

app.listen(PORT,() => {
    console.log(`App Running on Port :${PORT}`)
});
