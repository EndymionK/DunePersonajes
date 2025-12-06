const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = process.env.DYNAMODB_TABLE || 'DunePersonajes';

// Procesa eventos S3 y registra en DynamoDB
exports.handler = async (event) => {
    console.log('S3 Event:', JSON.stringify(event, null, 2));

    try {
        const records = event.Records;

        for (const record of records) {
            const bucket = record.s3.bucket.name;
            const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '));
            const eventName = record.eventName;
            const timestamp = record.eventTime;

            console.log(`Evento: ${eventName}`);
            console.log(`Bucket: ${bucket}`);
            console.log(`Archivo: ${key}`);
            console.log(`Timestamp: ${timestamp}`);

            // Si es una imagen nueva en la carpeta de personajes
            if (key.startsWith('assets/img/') && eventName.includes('ObjectCreated')) {
                // Registrar el evento en DynamoDB
                const logItem = {
                    id: `log-${Date.now()}`,
                    type: 'IMAGE_UPLOAD',
                    bucket,
                    key,
                    timestamp,
                    size: record.s3.object.size
                };

                await dynamoDB.put({
                    TableName: `${TABLE_NAME}-Logs`,
                    Item: logItem
                }).promise();

                console.log('Log guardado en DynamoDB:', logItem);
            }
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ 
                message: 'Eventos S3 procesados exitosamente',
                recordsProcessed: records.length
            })
        };

    } catch (error) {
        console.error('Error procesando eventos S3:', error);
        throw error;
    }
};
