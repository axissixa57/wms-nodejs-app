import { Shipment } from '../models/Shipment';
import { Product } from '../models/Product';
import { Consignee } from '../models/Consignee';
import { Warehouse } from '../models/Warehouse';
import { ShipmentsToTTN } from '../models/ShipmentsToTTN';
import { TTN } from '../models/TTN';

export function getProducts(req, res) {
  Product.find({}, function (err, products) {
    if (err) return console.log(err);
    res.send(products);
  });
}

export function getCosmeticProducts(req, res) {
  Product.find({ category: 'Косметика и средства личной гигиены' }, function (
    err,
    doc
  ) {
    if (err) return console.log(err);
    res.send(doc);
  });
}

export function getMeatProducts(req, res) {
  Product.find({ category: 'Мясо, колбасы и полуфабрикаты' }, function (
    err,
    doc
  ) {
    if (err) return console.log(err);
    res.send(doc);
  });
}

export function getMarineProducts(req, res) {
  Product.find({ category: 'Рыба и морепродукты' }, function (err, doc) {
    if (err) return console.log(err);
    res.send(doc);
  });
}

export function getProductById(req, res) {
  const id = req.params.id;

  Product.findOne({ _id: id }, function (err, doc) {
    if (err) return console.log(err);
    res.send(doc);
  });
}

export function createProduct(req, res) {
  if (!req.body) return res.sendStatus(400);

  const productId = req.body.id;
  const productCategory = req.body.category;
  const productName = req.body.name;
  const productUnit = req.body.unit;
  const productWeight = req.body.weight;
  const productCost = req.body.cost;

  const product = {
    _id: productId,
    category: productCategory,
    name: productName,
    unit: productUnit,
    weight: productWeight,
    cost: productCost
  };

  Product.find({ _id: productId }, function (err, doc) {
    if (err) return console.log(err);
    if (doc.length > 0) return res.send('Такой объект уже существует');

    Product.create(product, function (err, doc) {
      if (err) return console.log(err);
      console.log('Сохранен объект product', doc);
      res.send(product);
    });
  });
}

export function deleteProduct(req, res) {
  const id = req.params.id;
  Product.findByIdAndDelete(id, function (err, user) {
    if (err) return console.log(err);
    res.send(user);
  });
}

export function editProduct(req, res) {
  if (!req.body) return res.sendStatus(400);

  const productId = req.body.id;
  const productCategory = req.body.category;
  const productName = req.body.name;
  const productUnit = req.body.unit;
  const productWeight = req.body.weight;
  const productCost = req.body.cost;
  const newProduct = {
    category: productCategory,
    name: productName,
    unit: productUnit,
    weight: productWeight,
    cost: productCost
  };

  Product.updateOne({ _id: productId }, { $set: newProduct }, function (
    err,
    product
  ) {
    if (err) return console.log(err);
    console.log(product);
    res.send(product);
  });
}

export function getShipments(req, res) {
  Shipment.find({}, function (err, shipments) {
    if (err) return console.log(err);
    res.send(shipments);
  });
}

export function getShipmentById(req, res) {
  const id = req.params.id;
  Shipment.findOne({ _id: id }, function (err, shipment) {
    if (err) return console.log(err);
    res.send(shipment);
  });
}

export function createShipment(req, res) {
  if (!req.body) return res.sendStatus(400);

  const shipmentId = req.body.shipment_id;
  const date = req.body.date;
  const status = req.body.status;
  const shipmentDate = req.body.shipment_date;
  const warehouseId = req.body.warehouse_id;
  const consigneeId = req.body.consignee_id;
  const products = req.body.products;
  const pallet = req.body.pallet;
  const total_weight = req.body.total_weight;

  const shipment = {
    _id: shipmentId,
    date: new Date(date),
    status: status,
    shipment_date: new Date(shipmentDate),
    id_warehouse: warehouseId,
    id_consignee: consigneeId,
    products: products,
    pallet: parseInt(pallet),
    total_weight: parseFloat(total_weight)
  };

  Shipment.create(shipment, function (err, doc) {
    if (err) return console.log(err);

    console.log('Сохранен объект shipment', doc);
    res.send(doc);
  });
}

export async function getProductsFromShipmentsByCodeCar(req, res) {
  const id = req.params.id;

  try {
    const shipmentsToTtn = await ShipmentsToTTN.findOne({ _id: id });
    // console.log(shipmentsToTtn);
    const shipments = await Shipment.find({
      _id: { $in: shipmentsToTtn.shipments }
    });
    // console.log(shipments);

    const idsProducts = [];
    const quantityProducts = {};

    for (let i = 0; i < shipments.length; i++) {
      for (let j = 0; j < shipments[i].products.length; j++) {
        idsProducts.push(parseInt(shipments[i].products[j].id));

        quantityProducts[shipments[i].products[j].id] = quantityProducts[
          shipments[i].products[j].id
        ]
          ? quantityProducts[shipments[i].products[j].id] +
          parseInt(shipments[i].products[j].quantity)
          : parseInt(shipments[i].products[j].quantity);
      }
    }
    console.log(idsProducts);
    const products = await Product.find({ _id: { $in: idsProducts } });
    res.send({ products, quantityProducts });
  } catch (err) {
    console.log(`Ошибка: ${err}`);
    res.status(500).send('Объект не найден');
  }

  // ============== v2 ==================
  // ShipmentsToTTN.findOne({ _id: id }, function (err, shipmentsToTtn) {
  //     if (err) return console.log(err);
  // }).then((shipmentsToTtn) => {

  //     Shipment.find({ _id: { $in: shipmentsToTtn.shipments } }, function (err, shipments) {
  //         if (err) return console.log(err);
  //     }).then(shipments => {
  //         const idsProducts = [];
  //         const quantityProducts = {};

  //         for (let i = 0; i < shipments.length; i++) {
  //             for (let j = 0; j < shipments[i].products.length; j++) {
  //                 idsProducts.push(shipments[i].products[j].id);

  //                 quantityProducts[shipments[i].products[j].id] = quantityProducts[shipments[i].products[j].id] ?
  //                     quantityProducts[shipments[i].products[j].id] + parseInt(shipments[i].products[j].quantity) :
  //                     parseInt(shipments[i].products[j].quantity);
  //             }
  //         }

  //         Product.find({ _id: { $in: idsProducts } }, function (err, products) {
  //             if (err) return console.log(err);
  //             res.send({ products, quantityProducts });
  //         });
  //     });
  // }).catch(err => res.send('Объект не найден'));
}

export async function getProductsFromShipment(req, res) {
  const id = req.params.id;

  try {
    const shipment = await Shipment.findOne({ _id: id });

    const idsProducts = [];

    for (let i = 0; i < shipment.products.length; i++) {
      idsProducts.push(shipment.products[i].id);
    }

    const products = await Product.find({ _id: { $in: idsProducts } });

    res.send(products);
  } catch (err) {
    console.log(`Ошибка: ${err}`);
    res.status(500).send('Объект не найден');
  }

  // ============== v2 ==================
  /* Shipment.findOne({ _id: id }, function (err, shipment) {

        if (err) return console.log(err);

        return shipment;
    }).then(shipment => {
        const idsProducts = [];
        for (let i = 0; i < shipment.products.length; i++) {
            idsProducts.push(shipment.products[i].id);
        }

        Product.find({ _id: { $in: idsProducts } }, function (err, products) {

            if (err) return console.log(err);
            res.send(products);
        });
    }); */
}

export function updateStatusOfShipments(req, res) {
  if (!req.body) return res.sendStatus(400);
  const ids_shipment = req.body.ids;
  const status = req.body.status;

  Shipment.updateMany(
    { _id: { $in: ids_shipment } },
    { $set: { status: status } },
    function (err, result) {
      console.log(result);
    }
  );
}

export function updateShipmentStatus(req, res) {
  if (!req.body) return res.sendStatus(400);
  const shipmentId = req.body.id;
  const shipmentStatus = req.body.status;

  Shipment.updateOne(
    { _id: shipmentId },
    { $set: { status: shipmentStatus } },
    function (err, result) {
      console.log(result);
      res.send(result);
    }
  );
}

export function deleteShipment(req, res) {
  const id = req.params.id;
  Shipment.findByIdAndDelete(id, function (err, shipment) {
    if (err) return console.log(err);
    console.log('Удалён объект shipment');
    res.send(shipment);
  });
}

export function getConsignees(req, res) {
  Consignee.find({}, function (err, consignees) {
    if (err) return console.log(err);
    res.send(consignees);
  });
}

export function getConsigneeById(req, res) {
  const id = req.params.id;

  Consignee.findOne({ _id: id }, function (err, doc) {
    if (err) return console.log(err);
    res.send(doc);
  });
}

export function createConsignee(req, res) {
  if (!req.body) return res.sendStatus(400);

  const consigneeId = req.body.id;
  const consigneeAddress = req.body.address;
  const consigneePhone = req.body.phone;

  const consignee = {
    _id: consigneeId,
    address: consigneeAddress,
    phone: consigneePhone
  };

  Consignee.find({ _id: consigneeId }, function (err, doc) {
    if (err) return console.log(err);
    if (doc.length > 0) return res.send('Такой объект уже существует');

    Consignee.create(consignee, function (err, doc) {
      if (err) return console.log(err);
      console.log('Сохранен объект consignee', doc);
      res.send(consignee);
    });
  });
}

export function updateConsignee(req, res) {
  if (!req.body) return res.sendStatus(400);

  const consigneeId = req.body.id;
  const consigneeAddress = req.body.address;
  const consigneePhone = req.body.phone;
  const newConsignee = { address: consigneeAddress, phone: consigneePhone };

  Consignee.updateOne({ _id: consigneeId }, { $set: newConsignee }, function (
    err,
    consignee
  ) {
    if (err) return console.log(err);
    console.log(consignee);
    res.send(consignee);
  });
}

export function deleteConsignee(req, res) {
  const id = req.params.id;
  Consignee.findByIdAndDelete(id, function (err, consignee) {
    if (err) return console.log(err);
    console.log('Удалён объект consignee');
    res.send(consignee);
  });
}

export function getWarehouses(req, res) {
  Warehouse.find({}, function (err, warehouses) {
    if (err) return console.log(err);
    res.send(warehouses);
  });
}

export async function getWarehouseProducts(req, res) {
  let isNotEmpty = true;
  const warehouseId = parseInt(req.query.idWarehouse);
  const products =
    typeof req.query.idProduct == 'string'
      ? [req.query.idProduct]
      : req.query.idProduct;

  for (let i = 0; i < products.length; i++) {
    const result = await Warehouse.findOne(
      { _id: warehouseId, 'products.id_product': products[i] },
      { _id: 0, products: { $elemMatch: { id_product: products[i] } } }
    );

    if (!result) {
      res.send({
        message: `Код товара "${products[i]}" не числится на ${warehouseId} складе!`
      });
      isNotEmpty = false;
      break;
    }
  }

  if (isNotEmpty) res.send({ message: 'Success' });
}

export function getWarehouseById(req, res) {
  const id = parseInt(req.params.id);

  Warehouse.findOne({ _id: id }, function (err, doc) {
    if (err) return console.log(err);
    res.send(doc);
  });
}

export function createWarehouse(req, res) {
  if (!req.body) return res.sendStatus(400);

  const warehouseId = req.body.id;
  const warehouseAddress = req.body.address;
  const warehousePhone = req.body.phone;

  const warehouse = {
    _id: warehouseId,
    address: warehouseAddress,
    phone: warehousePhone
  };

  Warehouse.find({ _id: warehouseId }, function (err, doc) {
    if (err) return console.log(err);
    if (doc.length > 0) return res.send('Такой объект уже существует');

    Warehouse.create(warehouse, function (err, doc) {
      if (err) return console.log(err);

      console.log('Сохранен объект warehouse', doc);
      res.send(warehouse);
    });
  });
}

export function addProductsToWarehouse(req, res) {
  if (!req.body) return res.sendStatus(400);

  const warehouseId = req.body.id;
  const sentProducts = req.body.products;

  console.log(warehouseId, sentProducts);

  sentProducts.forEach(async (product, i, arr) => {
    const wh = await Warehouse.findOne(
      { _id: warehouseId, 'products.id_product': product.id },
      { _id: 0, products: { $elemMatch: { id_product: product.id } } }
    );

    if (!wh) {
      const newProduct = {
        id_product: product.id,
        storage_location: '',
        quantity: parseInt(product.quantity)
      };

      await Warehouse.updateOne(
        { _id: warehouseId },
        { $push: { products: newProduct } }
      );

      console.log(
        `Код ${product.id} товара успешно добавлен на складе ${warehouseId}`
      );

      if (i == arr.length - 1) return res.send('Successful added');
    } else {
      const whProductQuantity = wh.products[0].quantity;
      const newQuantity = whProductQuantity + parseInt(product.quantity);

      Warehouse.updateOne(
        { _id: warehouseId, 'products.id_product': product.id },
        { $set: { 'products.$.quantity': newQuantity } },
        function (err, warehouse) {
          if (err) return console.log(err);
          console.log(
            `Код ${product.id} товара успешно обновлён на складе ${warehouseId}`
          );
        }
      );

      if (i == arr.length - 1) return res.send(`'Successful updated'`);
    }
  });
}

export function updateWarehouse(req, res) {
  if (!req.body) return res.sendStatus(400);

  const warehouseId = req.body.id;
  const warehouseAddress = req.body.address;
  const warehousePhone = req.body.phone;
  const newWarehouse = { address: warehouseAddress, phone: warehousePhone };

  Warehouse.updateOne({ _id: warehouseId }, { $set: newWarehouse }, function (
    err,
    warehouse
  ) {
    if (err) return console.log(err);
    console.log(warehouse);
    res.send(warehouse);
  });
}

export async function fromOneWarehouseToAnother(req, res) { 
  if (!req.body) return res.sendStatus(400);

  const warehouseId = parseInt(req.body.id_warehouse);
  const consigneeId = parseInt(req.body.id_consignee);
  const sentProducts = req.body.products;

  // check product on warehouse
  for (let i = 0; i < sentProducts.length; i++) {
    const productFromWarehouse = await Warehouse.findOne(
      { _id: warehouseId, 'products.id_product': sentProducts[i].id },
      { _id: 0, products: { $elemMatch: { id_product: sentProducts[i].id } } }
    );

    if (!productFromWarehouse) {
      return res.send(
        `Код товара "${sentProducts[i].id}" не числится на этом складе!`
      );
    }
  }

  const warehouseAddressee = await Warehouse.findOne({ _id: consigneeId });

  // update quantity 
  for (let i = 0; i < sentProducts.length; i++) {
    const productFromWarehouse = await Warehouse.findOne(
      { _id: warehouseId, 'products.id_product': sentProducts[i].id },
      { _id: 0, products: { $elemMatch: { id_product: sentProducts[i].id } } }
    );

    const quantityFromWarehouse = productFromWarehouse.products[0].quantity;

    const result =
      parseInt(quantityFromWarehouse) - parseInt(sentProducts[i].quantity);

    Warehouse.updateOne(
      { _id: warehouseId, 'products.id_product': sentProducts[i].id },
      { $set: { 'products.$.quantity': result } },
      function (err, warehouse) {
        if (err) return console.log(err);
        console.log(
          `Код ${sentProducts[i].id} списан со склада ${warehouseId}!`
        );
      }
    );

    if (warehouseAddressee) {
      const wh = await Warehouse.findOne(
        { _id: consigneeId, "products.id_product": sentProducts[i].id },
        { _id: 0, products: { $elemMatch: { id_product: sentProducts[i].id } } }
      );

      if (!wh) {
        const newProduct = {
          id_product: sentProducts[i].id,
          storage_location: '',
          quantity: parseInt(sentProducts[i].quantity)
        }

        await Warehouse.updateOne(
          { _id: consigneeId },
          { $push: { products: newProduct } }
        )

        console.log(`Код ${sentProducts[i].id} товара успешно добавлен на складе ${consigneeId}`);
      } else {
        const whProductQuantity = wh.products[0].quantity;
        const newQuantity = whProductQuantity + parseInt(sentProducts[i].quantity);

        Warehouse.updateOne(
          { _id: consigneeId, "products.id_product": sentProducts[i].id },
          { $set: { "products.$.quantity": newQuantity } },
          function (err, warehouse) {
            if (err) return console.log(err);
            console.log(`Код ${sentProducts[i].id} товара успешно обновлён на складе ${consigneeId}`);
          }
        );
      }
    }

    if (i == sentProducts.length - 1) return res.send('Успех');
  }
}

export function addQuantutyOfGoodsToWarehouse(req, res) {
  if (!req.body) return res.sendStatus(400);

  const warehouseId = parseInt(req.body.id_warehouse);
  const products = req.body.products;
  let counter = 0;

  async function updateQuntity(warehouseId, products) {
    for (let i = 0; i < products.length; i++) {
      const warehouseProducts = await Warehouse.findOne(
        { _id: warehouseId, 'products.id_product': products[i].id },
        { 'products.$': 1 }
      );
      const quantityFromWarehouse = warehouseProducts.products[0].quantity;
      const newQuantity =
        parseInt(quantityFromWarehouse) + parseInt(products[i].quantity);
      const updatedQuantity = await Warehouse.updateOne(
        { _id: warehouseId, 'products.id_product': products[i].id },
        { $set: { 'products.$.quantity': newQuantity } },
        function (err, warehouse) {
          if (err) return console.log(err);
          //console.log(`${products[i].id} updated!`);
        }
      );
      counter++;
      if (counter == products.length) return res.send('Successful update');
    }
  }

  updateQuntity(warehouseId, products).catch(err => {
    res.status(500);
    console.log(`Unsuccessful update. Error: ${err}`);
  });
}

export function returnQuantutyOfProductsToWarehouse(req, res) {
  if (!req.body) return res.sendStatus(400);

  const warehouseId = parseInt(req.body.id_warehouse);
  const products = req.body.products;

  for (let i = 0; i < products.length; i++) {
    Warehouse.findOne(
      { _id: warehouseId, 'products.id_product': products[i].id },
      { 'products.$': 1 },
      function (err, doc) {
        if (err) return console.log(err);
        const quantityFromWarehouse = doc.products[0].quantity;
        const result =
          parseInt(quantityFromWarehouse) + parseInt(products[i].quantity);

        Warehouse.updateOne(
          { _id: warehouseId, 'products.id_product': products[i].id },
          { $set: { 'products.$.quantity': result } },
          function (err, warehouse) {
            if (err) return console.log(err);
            console.log(warehouse);
          }
        );

        if (i == products.length - 1) return res.status(200).send('OK');
      }
    );
  }
}

export function deleteWarehouse(req, res) {
  const id = req.params.id;
  Warehouse.findByIdAndDelete(id, function (err, warehouse) {
    if (err) return console.log(err);
    console.log('Удалён объект warehouses');
    res.send(warehouse);
  });
}

export function createShipmentsToTTN(req, res) {
  if (!req.body) return res.sendStatus(400);

  const id = req.body.id;
  const shipments = req.body.shipments;
  const shipmentsToTtn = { _id: id, shipments: shipments };

  ShipmentsToTTN.create(shipmentsToTtn, function (err, doc) {
    if (err) return console.log(err);

    console.log('Сохранен объект shipmentsToTtn', doc);
    res.send(shipmentsToTtn);
  });
}

export function getTTNs(req, res) {
  TTN.find({}, function (err, ttns) {
    if (err) return console.log(err);
    res.send(ttns);
  });
}

export function getTTNwithProducts(req, res) {
  const id = req.params.id;

  TTN.findOne({ _id: id }, function (err, doc) {
    if (err) return console.log(err);

    const idsProducts = [];
    const quantityProducts = {};

    for (let j = 0; j < doc.products.length; j++) {
      idsProducts.push(doc.products[j].id);
      quantityProducts[doc.products[j].id] = doc.products[j].quantity;
    }

    Product.find({ _id: { $in: idsProducts } }, function (err, products) {
      if (err) return console.log(err);
      res.send({ doc, products, quantityProducts });
    });
  });
}

export async function getLastAddedTTN(req, res) {
  try {
    const result = await TTN.find()
      .limit(1)
      .sort({ $natural: -1 });
    res.send(result);
  } catch (err) {
    console.log(err);
  }
}

export function createTTN(req, res) {
  if (!req.body) return res.sendStatus(400);

  const ttnCodeCar = req.body.ttnCodeCar;
  const ttnTotalWeight = req.body.ttnTotalWeight;
  const ttnTotalCost = req.body.ttnTotalCost;
  const ttnStatus = req.body.ttnStatus;

  const ttnId = req.body.ttnId;
  const ttnDate = req.body.ttnDate;
  const ttnWarehouseId = req.body.ttnWarehouseId;
  const ttnConsigneeId = req.body.ttnConsigneeId;
  const ttnComment = req.body.ttnComment;
  const ttnCarTripTicketId = req.body.ttnCarTripTicketId;
  const ttnCarOrganization = req.body.ttnCarOrganization;
  const ttnCarBrand = req.body.ttnCarBrand;
  const ttnCarStateNumber = req.body.ttnCarStateNumber;
  const ttnCarDriverName = req.body.ttnCarDriverName;
  const ttnCarDriverId = req.body.ttnCarDriverId;
  const ttnProducts = req.body.ttnProducts;

  const ttn = {
    id_doc: ttnId,
    date: ttnDate,
    id_warehouse: ttnWarehouseId,
    id_consignee: ttnConsigneeId,
    comment: ttnComment,
    products: ttnProducts,
    car: {
      id_tripTicket: ttnCarTripTicketId,
      brand: ttnCarBrand,
      stateNumber: ttnCarStateNumber,
      id_driver: ttnCarDriverId,
      driver: ttnCarDriverName,
      organization: ttnCarOrganization
    },
    code_car: ttnCodeCar,
    total_weight: ttnTotalWeight,
    total_cost: ttnTotalCost,
    status: ttnStatus
  };

  TTN.create(ttn, function (err, doc) {
    if (err) return console.log(err);

    console.log('Сохранен объект ttn', doc);
    res.send(doc);
  });
}

export function updateTTN(req, res) {
  if (!req.body) return res.sendStatus(400);

  const ttnCodeCar = req.body.ttnCodeCar;
  const ttnTotalWeight = req.body.ttnTotalWeight;
  const ttnTotalCost = req.body.ttnTotalCost;
  const ttnStatus = req.body.ttnStatus;

  const id = req.body.id;
  const ttnId = req.body.ttnId;
  const ttnDate = req.body.ttnDate;
  const ttnWarehouseId = req.body.ttnWarehouseId;
  const ttnConsigneeId = req.body.ttnConsigneeId;
  const ttnComment = req.body.ttnComment;
  const ttnCarTripTicketId = req.body.ttnCarTripTicketId;
  const ttnCarOrganization = req.body.ttnCarOrganization;
  const ttnCarBrand = req.body.ttnCarBrand;
  const ttnCarStateNumber = req.body.ttnCarStateNumber;
  const ttnCarDriverName = req.body.ttnCarDriverName;
  const ttnCarDriverId = req.body.ttnCarDriverId;
  const ttnProducts = req.body.ttnProducts;

  const newTTN = {
    id_doc: ttnId,
    date: ttnDate,
    id_warehouse: ttnWarehouseId,
    id_consignee: ttnConsigneeId,
    comment: ttnComment,
    products: ttnProducts,
    car: {
      id_tripTicket: ttnCarTripTicketId,
      brand: ttnCarBrand,
      stateNumber: ttnCarStateNumber,
      id_driver: ttnCarDriverId,
      driver: ttnCarDriverName,
      organization: ttnCarOrganization
    },
    code_car: ttnCodeCar,
    total_weight: ttnTotalWeight,
    total_cost: ttnTotalCost,
    status: ttnStatus
  };

  TTN.updateOne({ _id: id }, { $set: newTTN }, function (err, ttn) {
    if (err) return console.log(err);
    console.log(ttn);
    res.send(ttn);
  });
}

export function deleteTTN(req, res) {
  const id = req.params.id;

  TTN.findByIdAndDelete(id, function (err, ttn) {
    if (err) return console.log(err);
    console.log('Удалён объект ttn');
    res.send(ttn);
  });
}

export function getRemainders(req, res) {
  Warehouse.find({}, { _id: 1, products: 1 }, function (err, warehouses) {
    if (err) return console.log(err);

    const idsProducts = [];

    for (let i = 0; i < warehouses.length; i++) {
      for (let j = 0; j < warehouses[i].products.length; j++) {
        idsProducts.push(warehouses[i].products[j].id_product);
      }
    }

    Product.find({ _id: { $in: idsProducts } }, function (err, products) {
      if (err) return console.log(err);
      res.send({ warehouses, products });
    });
  });
}
