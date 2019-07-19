import express from 'express';
import path from 'path';
import htmlPdf from 'html-pdf';
import ejs from 'ejs';

import { Shipment } from '../models/Shipment';
import { TTN } from '../models/TTN';
import { Product } from '../models/Product';
import { Consignee } from '../models/Consignee';
import { Warehouse } from '../models/Warehouse';

const templateRouter = express.Router();

templateRouter.get("/shipment", (req, res) => {
    res.render('templates/shipments/shipment-to-print.ejs');
});
templateRouter.get("/remainder", (req, res) => {
    res.render('templates/remainder/remainder-to-print.ejs');
});
templateRouter.get("/ttn/:id/ttn.pdf", async (req, res) => {
    const obj = {};
    const idsProducts = [];

    const id = req.params.id;
    const ttn = await TTN.findById(id);
    const warehouseAddress = await Warehouse.find({ _id: ttn.id_warehouse }, { address: 1 });
    const consigneeAddress = await Consignee.find({ _id: ttn.id_consignee }, { address: 1 });

    for (let j = 0; j < ttn.products.length; j++)
        idsProducts.push(ttn.products[j].id);

    const productsInfo = await Product.find({ _id: { $in: idsProducts } });

    obj.ttnInfo = ttn;
    obj.warehouse = warehouseAddress[0];

    if (consigneeAddress[0]) {
        obj.consignee = consigneeAddress[0];
    } else {
        obj.consignee = {
            _id: '',
            address: '',
        }
    }

    for (let i = 0; i < obj.ttnInfo.products.length; i++) {
        for (let j = 0; j < productsInfo.length; j++) {
            if (obj.ttnInfo.products[i].id == productsInfo[j]._id) {
                obj.ttnInfo.products[i].description = productsInfo[j];
            }
        }
    }

    ejs.renderFile(path.join(__dirname, '../views/templates/ttn/template.ejs'), obj, (err, html) => {
        const options = { format: 'A3' };
        const fileName = path.join(__dirname, '../views/templates/ttn/file.pdf');

        htmlPdf.create(html, options).toFile(fileName, (err) => {

            if (err) {
                console.log('Ошибка конвертации', err)
            }

            //res.end(html);
            res.sendFile(path.join(__dirname, '../views/templates/ttn/file.pdf'));
        });
    })
});
templateRouter.get("/shipping-list.pdf", async (req, res) => {
    const idsShipments = typeof req.query.id == 'object' ? req.query.id.map(item => parseInt(item)) : [parseInt(req.query.id)];

    const obj = {};

    const shipments = await Shipment.aggregate([
        { $match: { _id: { $in: idsShipments } } },
        {
            $lookup: {
                from: "consignees",
                localField: "id_consignee",
                foreignField: "_id",
                as: "consignee"
            }
        }
    ])

    obj.shipments = shipments;

    ejs.renderFile(path.join(__dirname, '../views/templates/shipments/template.ejs'), obj, (err, html) => {
        const options = { format: 'A4', orientation: "landscape" };
        const fileName = path.join(__dirname, '../views/templates/shipments/file.pdf');

        htmlPdf.create(html, options).toFile(fileName, (err) => {

            if (err) {
                console.log('Ошибка конвертации', err)
            }

            // res.end(html);
            res.sendFile(path.join(__dirname, '../views/templates/shipments/file.pdf'));
        });
    })
});

export { templateRouter };