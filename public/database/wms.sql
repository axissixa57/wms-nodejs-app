-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1:3306
-- Время создания: Июн 24 2019 г., 12:05
-- Версия сервера: 10.3.13-MariaDB
-- Версия PHP: 7.1.22

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `wms`
--

-- --------------------------------------------------------

--
-- Структура таблицы `movements`
--

CREATE TABLE `movements` (
  `id` int(10) UNSIGNED NOT NULL,
  `date` date NOT NULL,
  `id_warehouse` int(10) UNSIGNED NOT NULL,
  `id_destination` int(10) UNSIGNED NOT NULL,
  `id_ttn` varchar(255) NOT NULL,
  `cost` decimal(9,2) UNSIGNED NOT NULL,
  `weight` decimal(9,3) UNSIGNED NOT NULL,
  `status` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `movements`
--

INSERT INTO `movements` (`id`, `date`, `id_warehouse`, `id_destination`, `id_ttn`, `cost`, `weight`, `status`) VALUES
(1, '2019-05-20', 73, 1000452, 'МП 1234567', '101.50', '0.000', 'Заблокирован');

-- --------------------------------------------------------

--
-- Структура таблицы `products`
--

CREATE TABLE `products` (
  `id` int(10) UNSIGNED NOT NULL,
  `category` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `unit` varchar(255) DEFAULT NULL,
  `weight` int(10) UNSIGNED DEFAULT NULL,
  `cost` decimal(9,2) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `products`
--

INSERT INTO `products` (`id`, `category`, `name`, `unit`, `weight`, `cost`) VALUES
(1000001, 'Косметика и средства личной гигиены', 'Салфетки бумажные \"VETA TOPICANA\"', 'шт', 100, '0.85'),
(1000002, 'Косметика и средства личной гигиены', 'Салфетки \"SIPTO\" (белые)', 'шт', 100, '0.85'),
(1000003, 'Косметика и средства личной гигиены', 'Мыло \"LILEA\" (жидкое, aloe vera)', 'л', 5, '6.99'),
(1000004, 'Косметика и средства личной гигиены', 'Гель д/душа \"FA\" (алоэ вера) ', 'мл', 750, '12.29'),
(1000005, 'Косметика и средства личной гигиены', 'Шамп-б/оп.\"HEAD&SHOULDERS\"(ментол)', 'мл', 400, '8.65'),
(1000006, 'Косметика и средства личной гигиены', 'Бальзам \"ELSEVE\" (роскошь,6 масел) ', 'мл', 200, '5.49'),
(1000007, 'Косметика и средства личной гигиены', 'Шампунь \"Schauma\" ухаживающий', 'мл', 750, '7.99'),
(1000008, 'Косметика и средства личной гигиены', 'Лак \"ДЖЕТ\" (объем и стойкость) ', 'мл', 300, '3.99'),
(1000009, 'Косметика и средства личной гигиены', 'Пена д/бритья \"GILLETTE\" (пит,тон)', 'мл', 250, '7.29'),
(1000010, 'Косметика и средства личной гигиены', 'Крем д/рук \"LILEA\" (комплекс уход)', 'г', 80, '1.39'),
(1000011, 'Бытовая химия', 'Мыло \"ХОЗЯЙСТВЕННОЕ\" (тверд,65%,ф/п)', 'г', 200, '0.69');

-- --------------------------------------------------------

--
-- Структура таблицы `products_shipment`
--

CREATE TABLE `products_shipment` (
  `id_shipment` int(10) UNSIGNED NOT NULL,
  `id_product` int(10) UNSIGNED NOT NULL,
  `quantity` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

-- --------------------------------------------------------

--
-- Структура таблицы `shipments`
--

CREATE TABLE `shipments` (
  `id` int(10) UNSIGNED NOT NULL,
  `date` date DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `id_warehouse` int(10) UNSIGNED DEFAULT NULL,
  `date_shipment` date DEFAULT NULL,
  `id_consignee` int(10) UNSIGNED DEFAULT NULL,
  `row_count` int(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

--
-- Дамп данных таблицы `shipments`
--

INSERT INTO `shipments` (`id`, `date`, `status`, `id_warehouse`, `date_shipment`, `id_consignee`, `row_count`) VALUES
(1, '2019-05-23', 'К выполнению', 73, '2019-05-24', 467, NULL),
(2, '2019-05-23', 'К выполнению', 1, '2019-05-24', 1, NULL),
(3, '2019-05-23', 'К выполнению', 1, '2019-05-24', 1, NULL);

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

CREATE TABLE `users` (
  `id` int(10) UNSIGNED NOT NULL,
  `login` varchar(30) NOT NULL,
  `password` varchar(150) NOT NULL,
  `fio` varchar(150) NOT NULL,
  `email` varchar(255) NOT NULL,
  `role` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `users`
--

INSERT INTO `users` (`id`, `login`, `password`, `fio`, `email`, `role`) VALUES
(1, 'admin', 'admin', 'Жмышенко Валерий Альбертович', 'admin@gmail.com', 'admin'),
(5, 'axissixa57', '2020327', 'Аксёнов Е.Г.', 'axissixa@mail.ru', 'economist');

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `movements`
--
ALTER TABLE `movements`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Индексы таблицы `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD KEY `id` (`id`);

--
-- Индексы таблицы `products_shipment`
--
ALTER TABLE `products_shipment`
  ADD PRIMARY KEY (`id_shipment`,`id_product`),
  ADD KEY `id_product` (`id_product`);

--
-- Индексы таблицы `shipments`
--
ALTER TABLE `shipments`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Индексы таблицы `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `movements`
--
ALTER TABLE `movements`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT для таблицы `products`
--
ALTER TABLE `products`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1000012;

--
-- AUTO_INCREMENT для таблицы `shipments`
--
ALTER TABLE `shipments`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT для таблицы `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `products_shipment`
--
ALTER TABLE `products_shipment`
  ADD CONSTRAINT `products_shipment_ibfk_1` FOREIGN KEY (`id_product`) REFERENCES `products` (`id`),
  ADD CONSTRAINT `products_shipment_ibfk_2` FOREIGN KEY (`id_shipment`) REFERENCES `shipments` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
