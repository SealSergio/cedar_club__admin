/* eslint-disable no-console */
// импорт стандартных библиотек Node.js
const { existsSync, readFileSync, writeFileSync } = require('fs');
const { createServer } = require('http');

const DB_FILE = process.env.DB_FILE || './db.json';
const PORT = process.env.PORT || 3000;
const URI_PREFIX = '/api/products';

/**
 * Класс ошибки, используется для отправки ответа с определённым кодом и описанием ошибки
 */
class ApiError extends Error {
  constructor(statusCode, data) {
    super();
    this.statusCode = statusCode;
    this.data = data;
  }
}

/**
 * Асинхронно считывает тело запроса и разбирает его как JSON
 * @param {Object} req - Объект HTTP запроса
 * @throws {ApiError} Некорректные данные в аргументе
 * @returns {Object} Объект, созданный из тела запроса
 */
function drainJson(req) {
  return new Promise((resolve) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
    });
    req.on('end', () => {
      resolve(JSON.parse(data));
    });
  });
}

/**
 * Проверяет входные данные и создаёт из них корректный объект клиента
 * @param {Object} data - Объект с входными данными
 * @throws {ApiError} Некорректные данные в аргументе (statusCode 422)
 * @returns {{ id: string, name: string, title: string, details1: string, details2: string, details3: string, imgCounter: string, attribute: string }} Объект клиента
 */
function makeProductFromData(data) {
  const errors = [];

  function asString(v) {
    return v && String(v).trim() || '';
  }

  // составляем объект, где есть только необходимые поля
  const product = {
    id: asString(data.id),
    name: asString(data.name),
    title: asString(data.title),
    details1: asString(data.details1),
    details2: asString(data.details2),
    details3: asString(data.details3),
    imgCounter: asString(data.imgCounter),
    attribute: asString(data.attribute),
  };

  // // проверяем, все ли данные корректные и заполняем объект ошибок, которые нужно отдать клиенту
  // if (!product.name) errors.push({ field: 'name', message: 'Не указано имя' });
  // if (!product.surname) errors.push({ field: 'surname', message: 'Не указана фамилия' });
  // if (product.contacts.some(contact => !contact.type || !contact.value))
  //   errors.push({ field: 'contacts', message: 'Не все добавленные контакты полностью заполнены' });

  // // если есть ошибки, то бросаем объект ошибки с их списком и 422 статусом
  // if (errors.length) throw new ApiError(422, { errors });

  return product;
}

/**
 * Возвращает список клиентов из базы данных
 * @param {{ search: string }} [params] - Поисковая строка
 * @returns {{ id: string, name: string, title: string, details1: string, details2: string, details3: string, imgCounter: string, attribute: string }[]} Массив клиентов
 */
function getProductList(params = {}) {
  const products = JSON.parse(readFileSync(DB_FILE) || '[]');
  if (params.search) {
    const search = params.search.trim().toLowerCase();
    return products.filter(product => [
      product.id,
      product.name,
      product.title,
      product.details1,
      product.details2,
      product.details3,
      product.imgCounter,
      product.attribute,
      ]
        .some(str => str.toLowerCase().includes(search))
    );
  }
  return products;
}

/**
 * Создаёт и сохраняет клиента в базу данных
 * @throws {ApiError} Некорректные данные в аргументе, клиент не создан (statusCode 422)
 * @param {Object} data - Данные из тела запроса
 * @returns {{ id: string, name: string, title: string, details1: string, details2: string, details3: string, imgCounter: string, attribute: string, createdAt: string, updatedAt: string }}
 */
function createProduct(data) {
  const newItem = makeProductFromData(data);
  newItem.createdAt = newItem.updatedAt = new Date().toISOString();
  writeFileSync(DB_FILE, JSON.stringify([...getProductList(), newItem]), { encoding: 'utf8' });
  return newItem;
}

/**
 * Возвращает объект клиента по его ID
 * @param {string} itemId - ID клиента
 * @throws {ApiError} Клиент с таким ID не найден (statusCode 404)
 * @returns {{ id: string, name: string, title: string, details1: string, details2: string, details3: string, imgCounter: string, attribute: string, createdAt: string, updatedAt: string }} Объект клиента
 */
function getProduct(itemId) {
  const product = getProductList().find(({ id }) => id === itemId);
  if (!product) throw new ApiError(404, { message: 'Product Not Found' });
  return product;
}

/**
 * Изменяет клиента с указанным ID и сохраняет изменения в базу данных
 * @param {string} itemId - ID изменяемого клиента
 * @param {{ id?: string, name?: string, title?: string, details1?: string, details2?: string, details3?: string, imgCounter?: string, attribute?: string }} data - Объект с изменяемыми данными
 * @throws {ApiError} Клиент с таким ID не найден (statusCode 404)
 * @throws {ApiError} Некорректные данные в аргументе (statusCode 422)
 * @returns {{ id: string, name: string, title: string, details1: string, details2: string, details3: string, imgCounter: string, attribute: string, createdAt: string, updatedAt: string }} Объект клиента
 */
function updateProduct(itemId, data) {
  const products = getProductList();
  const itemIndex = products.findIndex(({ id }) => id === itemId);
  if (itemIndex === -1) throw new ApiError(404, { message: 'Product Not Found' });
  Object.assign(products[itemIndex], makeProductFromData({ ...products[itemIndex], ...data }));
  products[itemIndex].updatedAt = new Date().toISOString();
  writeFileSync(DB_FILE, JSON.stringify(products), { encoding: 'utf8' });
  return products[itemIndex];
}

/**
 * Удаляет клиента из базы данных
 * @param {string} itemId - ID клиента
 * @returns {{}}
 */
function deleteProduct(itemId) {
  const products = getProductList();
  const itemIndex = products.findIndex(({ id }) => id === itemId);
  if (itemIndex === -1) throw new ApiError(404, { message: 'Product Not Found' });
  products.splice(itemIndex, 1);
  writeFileSync(DB_FILE, JSON.stringify(products), { encoding: 'utf8' });
  return {};
}

// создаём новый файл с базой данных, если он не существует
if (!existsSync(DB_FILE)) writeFileSync(DB_FILE, '[]', { encoding: 'utf8' });

// создаём HTTP сервер, переданная функция будет реагировать на все запросы к нему
module.exports = createServer(async (req, res) => {
  // req - объект с информацией о запросе, res - объект для управления отправляемым ответом

  // этот заголовок ответа указывает, что тело ответа будет в JSON формате
  res.setHeader('Content-Type', 'application/json');

  // CORS заголовки ответа для поддержки кросс-доменных запросов из браузера
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // запрос с методом OPTIONS может отправлять браузер автоматически для проверки CORS заголовков
  // в этом случае достаточно ответить с пустым телом и этими заголовками
  if (req.method === 'OPTIONS') {
    // end = закончить формировать ответ и отправить его клиенту
    res.end();
    return;
  }

  // если URI не начинается с нужного префикса - можем сразу отдать 404
  if (!req.url || !req.url.startsWith(URI_PREFIX)) {
    res.statusCode = 404;
    res.end(JSON.stringify({ message: 'Not Found' }));
    return;
  }

  // убираем из запроса префикс URI, разбиваем его на путь и параметры
  const [uri, query] = req.url.substr(URI_PREFIX.length).split('?');
  const queryParams = {};

  // параметры могут отсутствовать вообще или иметь вид a=b&b=c
  // во втором случае наполняем объект queryParams { a: 'b', b: 'c' }
  if (query) {
    for (const piece of query.split('&')) {
      const [key, value] = piece.split('=');
      queryParams[key] = value ? decodeURIComponent(value) : '';
    }
  }

  try {
    // обрабатываем запрос и формируем тело ответа
    const body = await (async () => {
      if (uri === '' || uri === '/') {
        // /api/products
        if (req.method === 'GET') return getProductList(queryParams);
        if (req.method === 'POST') {
          const createdItem = createProduct(await drainJson(req));
          res.statusCode = 201;
          res.setHeader('Access-Control-Expose-Headers', 'Location');
          res.setHeader('Location', `${URI_PREFIX}/${createdItem.id}`);
          return createdItem;
        }
      } else {
        // /api/products/{id}
        // параметр {id} из URI запроса
        const itemId = uri.substr(1);
        if (req.method === 'GET') return getProduct(itemId);
        if (req.method === 'PATCH') return updateProduct(itemId, await drainJson(req));
        if (req.method === 'DELETE') return deleteProduct(itemId);
      }
      return null;
    })();
    res.end(JSON.stringify(body));
  } catch (err) {
    // обрабатываем сгенерированную нами же ошибку
    if (err instanceof ApiError) {
      res.writeHead(err.statusCode);
      res.end(JSON.stringify(err.data));
    } else {
      // если что-то пошло не так - пишем об этом в консоль и возвращаем 500 ошибку сервера
      res.statusCode = 500;
      res.end(JSON.stringify({ message: 'Server Error' }));
      console.error(err);
    }
  }
})
  .on('listening', () => {
    if (process.env.NODE_ENV !== 'test') {
      console.log(`\nСервер запущен. Вы можете использовать его по адресу http://localhost:${PORT}`);
      console.log('Нажмите CTRL+C, чтобы остановить сервер.\n');
      console.log('Доступные методы:');
      console.log(`GET ${URI_PREFIX}`);
      console.log(`POST ${URI_PREFIX}`);
      console.log(`GET ${URI_PREFIX}/{id}`);
      console.log(`PATCH ${URI_PREFIX}/{id}`);
      console.log(`DELETE ${URI_PREFIX}/{id}\n`);
    }
  })

  .listen(PORT);
