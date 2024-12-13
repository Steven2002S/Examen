const AWS = require("aws-sdk");

exports.updateBook = async (event) => {
  const dynamodb = new AWS.DynamoDB.DocumentClient();

  const { BookID } = event.pathParameters;
  const { title, author, publishedYear, genre } = JSON.parse(event.body);

  try {
    const result = await dynamodb.update({
      TableName: "BookTable",
      Key: { BookID },
      UpdateExpression: "set Title = :title, Author = :author, PublishedYear = :publishedYear, Genre = :genre",
      ExpressionAttributeValues: {
        ":title": title,
        ":author": author,
        ":publishedYear": publishedYear,
        ":genre": genre,
      },
      ReturnValues: "ALL_NEW",
    }).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `La actualización del libro con ID ${BookID} se completó con éxito.`,
        updatedBook: result.Attributes,
      }),
    };
  } catch (error) {
    console.error("Ocurrió un error mientras se actualizaba el libro:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: `Hubo un problema al intentar actualizar el libro con ID ${BookID}.`,
        error: error.message,
      }),
    };
  }
};
