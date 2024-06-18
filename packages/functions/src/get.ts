import { Table } from "sst/node/table";
import handler from "@notes/core/handler";
import dynamoDb from "@notes/core/dynamodb";

export const main = handler(async (event) => {
    const params = {
        TableName: Table.Notes.tableName,
        // 'Key' defines the partition key and sort key of
        // the item to be retrieved
        Key: {
            userId: event.requestContext.authorizer?.iam.cognitoIdentity.identityId, // The id of the author
            noteId: event?.pathParameters?.id, // The id of the note from the path
        },
    };

    const time_start = Date.now()

    const result = await dynamoDb.get(params);
    const time_end = Date.now()

    console.log(`Execution time: ${time_end - time_start} ms`);
    if (!result.Item) {
        throw new Error("Item not found.");
    }

    // Return the retrieved item
    return JSON.stringify(result.Item);
});