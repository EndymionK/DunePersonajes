const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = process.env.DYNAMODB_TABLE || 'DunePersonajes';

// Headers CORS para permitir peticiones desde el frontend
const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
};

exports.handler = async (event) => {
    console.log('Event:', JSON.stringify(event));

    const method = event.httpMethod;
    const path = event.path;

    try {
        // Manejar preflight CORS
        if (method === 'OPTIONS') {
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ message: 'OK' })
            };
        }

        // GET /personajes - Listar todos los personajes
        if (method === 'GET' && path === '/personajes') {
            const result = await dynamoDB.scan({
                TableName: TABLE_NAME
            }).promise();

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify(result.Items)
            };
        }

        // GET /personajes/{id} - Obtener un personaje específico
        if (method === 'GET' && path.match(/\/personajes\/.+/)) {
            const id = path.split('/')[2];
            
            const result = await dynamoDB.get({
                TableName: TABLE_NAME,
                Key: { id }
            }).promise();

            if (!result.Item) {
                return {
                    statusCode: 404,
                    headers,
                    body: JSON.stringify({ error: 'Personaje no encontrado' })
                };
            }

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify(result.Item)
            };
        }

        // POST /personajes - Crear nuevo personaje
        if (method === 'POST' && path === '/personajes') {
            const body = JSON.parse(event.body);
            const id = Date.now().toString();
            
            const personaje = {
                id,
                nombre: body.nombre,
                planeta: body.planeta,
                afiliacion: body.afiliacion,
                descripcion: body.descripcion,
                imagen: body.imagen || 'assets/img/default.jpg',
                createdAt: new Date().toISOString()
            };

            await dynamoDB.put({
                TableName: TABLE_NAME,
                Item: personaje
            }).promise();

            return {
                statusCode: 201,
                headers,
                body: JSON.stringify(personaje)
            };
        }

        // PUT /personajes/{id} - Actualizar personaje
        if (method === 'PUT' && path.match(/\/personajes\/.+/)) {
            const id = path.split('/')[2];
            const body = JSON.parse(event.body);

            const updateExpression = [];
            const expressionAttributeNames = {};
            const expressionAttributeValues = {};

            Object.keys(body).forEach((key, index) => {
                if (key !== 'id') {
                    updateExpression.push(`#attr${index} = :val${index}`);
                    expressionAttributeNames[`#attr${index}`] = key;
                    expressionAttributeValues[`:val${index}`] = body[key];
                }
            });

            await dynamoDB.update({
                TableName: TABLE_NAME,
                Key: { id },
                UpdateExpression: `SET ${updateExpression.join(', ')}`,
                ExpressionAttributeNames: expressionAttributeNames,
                ExpressionAttributeValues: expressionAttributeValues
            }).promise();

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ id, ...body })
            };
        }

        // DELETE /personajes/{id} - Eliminar personaje
        if (method === 'DELETE' && path.match(/\/personajes\/.+/)) {
            const id = path.split('/')[2];

            await dynamoDB.delete({
                TableName: TABLE_NAME,
                Key: { id }
            }).promise();

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ message: 'Personaje eliminado exitosamente' })
            };
        }

        // Ruta no encontrada
        return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ error: 'Ruta no encontrada' })
        };

    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: 'Error interno del servidor',
                message: error.message 
            })
        };
    }
};
